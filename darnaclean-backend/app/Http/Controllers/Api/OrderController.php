<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\DeliveryZone;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Liste des commandes de l'utilisateur
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            $query = Order::with(['items.product'])
                ->where('user_id', $user->id)
                ->orderBy('created_at', 'desc');

            // Filtres
            if ($request->status) {
                $query->where('status', $request->status);
            }

            if ($request->payment_status) {
                $query->where('payment_status', $request->payment_status);
            }

            $perPage = min($request->per_page ?? 10, 50);
            $orders = $query->paginate($perPage);

            $formattedOrders = $orders->getCollection()->map(function ($order) {
                return $this->formatOrder($order);
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'orders' => $formattedOrders,
                    'pagination' => [
                        'current_page' => $orders->currentPage(),
                        'per_page' => $orders->perPage(),
                        'total' => $orders->total(),
                        'last_page' => $orders->lastPage(),
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des commandes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Détail d'une commande
     */
    public function show(Request $request, $id)
    {
        try {
            $user = $request->user();
            
            $order = Order::with(['items.product', 'payments'])
                ->where('id', $id)
                ->where('user_id', $user->id)
                ->first();

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Commande non trouvée'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'order' => $this->formatOrderDetail($order)
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de la commande',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Créer une nouvelle commande
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'shipping_address' => 'required|array',
            'shipping_address.first_name' => 'required|string|max:255',
            'shipping_address.last_name' => 'required|string|max:255',
            'shipping_address.address_line_1' => 'required|string|max:255',
            'shipping_address.city' => 'required|string|max:255',
            'shipping_address.postal_code' => 'nullable|string|max:20',
            'shipping_address.country' => 'required|string|max:100',
            'shipping_address.phone' => 'required|string|max:20',
            'billing_address' => 'nullable|array',
            'payment_method' => 'required|in:card,paypal,cash_on_delivery',
            'notes' => 'nullable|string|max:500',
            'session_id' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            return DB::transaction(function () use ($request) {
                $user = $request->user();
                
                // Récupérer les articles du panier
                if ($user) {
                    $cartItems = CartItem::getCartForUser($user->id);
                } else {
                    if (!$request->session_id) {
                        throw new \Exception('Session ID requis pour les utilisateurs non connectés');
                    }
                    $cartItems = CartItem::getCartForSession($request->session_id);
                }

                if ($cartItems->isEmpty()) {
                    throw new \Exception('Le panier est vide');
                }

                // Vérifier la disponibilité des produits
                foreach ($cartItems as $item) {
                    if (!$item->product->is_active) {
                        throw new \Exception("Le produit {$item->product->name} n'est plus disponible");
                    }
                    
                    if ($item->product->stock < $item->quantity) {
                        throw new \Exception("Stock insuffisant pour {$item->product->name}. Stock disponible: {$item->product->stock}");
                    }
                }

                // Déterminer la zone de livraison
                $deliveryZone = DeliveryZone::findByCity($request->shipping_address['city']);

                // Créer la commande
                $order = Order::create([
                    'user_id' => $user ? $user->id : null,
                    'status' => Order::STATUS_PENDING,
                    'payment_status' => Order::PAYMENT_PENDING,
                    'payment_method' => $request->payment_method,
                    'currency' => 'MAD',
                    'shipping_address' => $request->shipping_address,
                    'billing_address' => $request->billing_address ?? $request->shipping_address,
                    'delivery_zone_id' => $deliveryZone ? $deliveryZone->id : null,
                    'notes' => $request->notes,
                ]);

                // Générer le numéro de commande
                $order->generateOrderNumber();

                // Créer les éléments de commande
                foreach ($cartItems as $cartItem) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $cartItem->product_id,
                        'quantity' => $cartItem->quantity,
                        'price' => $cartItem->product->price,
                        'product_snapshot' => [
                            'name_fr' => $cartItem->product->name_fr,
                            'name_ar' => $cartItem->product->name_ar,
                            'name_en' => $cartItem->product->name_en,
                            'image' => $cartItem->product->main_image,
                            'sku' => $cartItem->product->sku,
                            'brand' => $cartItem->product->brand,
                        ]
                    ]);

                    // Réserver le stock
                    $cartItem->product->decreaseStock($cartItem->quantity);
                }

                // Calculer les totaux
                $order->calculateTotals();

                // Créer le paiement
                $payment = Payment::create([
                    'order_id' => $order->id,
                    'user_id' => $user ? $user->id : null,
                    'payment_method' => $request->payment_method,
                    'status' => Payment::STATUS_PENDING,
                    'amount' => $order->total_amount,
                    'currency' => $order->currency,
                ]);

                // Vider le panier
                if ($user) {
                    CartItem::clearCartForUser($user->id);
                } else {
                    CartItem::clearCartForSession($request->session_id);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Commande créée avec succès',
                    'data' => [
                        'order' => $this->formatOrderDetail($order->load(['items.product', 'payments'])),
                        'payment' => [
                            'id' => $payment->id,
                            'status' => $payment->status,
                            'method' => $payment->payment_method,
                            'amount' => $payment->amount,
                        ]
                    ]
                ], 201);
            });

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la commande',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Annuler une commande
     */
    public function cancel(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'reason' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = $request->user();
            
            $order = Order::where('id', $id)
                ->where('user_id', $user->id)
                ->first();

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Commande non trouvée'
                ], 404);
            }

            if (!$order->can_be_cancelled) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cette commande ne peut plus être annulée'
                ], 400);
            }

            $success = $order->cancel($request->reason);

            if ($success) {
                return response()->json([
                    'success' => true,
                    'message' => 'Commande annulée avec succès',
                    'data' => [
                        'order' => $this->formatOrder($order)
                    ]
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible d\'annuler cette commande'
                ], 400);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'annulation de la commande',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Suivi de commande (sans authentification pour les utilisateurs invités)
     */
    public function track(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_number' => 'required|string',
            'email' => 'nullable|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $query = Order::with(['items.product'])
                ->where('order_number', $request->order_number);

            if ($request->email) {
                $query->whereHas('user', function ($q) use ($request) {
                    $q->where('email', $request->email);
                });
            }

            $order = $query->first();

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Commande non trouvée'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'order' => [
                        'order_number' => $order->order_number,
                        'status' => $order->status,
                        'status_text' => $order->status_text,
                        'payment_status' => $order->payment_status,
                        'total_amount' => $order->total_amount,
                        'currency' => $order->currency,
                        'created_at' => $order->created_at,
                        'shipped_at' => $order->shipped_at,
                        'delivered_at' => $order->delivered_at,
                        'tracking_number' => $order->tracking_number,
                        'items_count' => $order->items_count,
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du suivi de la commande',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Formater une commande pour l'API
     */
    private function formatOrder($order)
    {
        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $order->status,
            'status_text' => $order->status_text,
            'payment_status' => $order->payment_status,
            'payment_status_text' => $order->payment_status_text,
            'payment_method' => $order->payment_method,
            'total_amount' => $order->total_amount,
            'currency' => $order->currency,
            'items_count' => $order->items_count,
            'created_at' => $order->created_at,
            'shipped_at' => $order->shipped_at,
            'delivered_at' => $order->delivered_at,
            'can_be_cancelled' => $order->can_be_cancelled,
        ];
    }

    /**
     * Formater une commande avec détails complets
     */
    private function formatOrderDetail($order)
    {
        $locale = app()->getLocale();
        
        $orderData = $this->formatOrder($order);
        
        // Ajouter les détails supplémentaires
        $orderData['subtotal'] = $order->subtotal;
        $orderData['tax_amount'] = $order->tax_amount;
        $orderData['shipping_amount'] = $order->shipping_amount;
        $orderData['discount_amount'] = $order->discount_amount;
        $orderData['shipping_address'] = $order->shipping_address;
        $orderData['billing_address'] = $order->billing_address;
        $orderData['notes'] = $order->notes;
        $orderData['tracking_number'] = $order->tracking_number;

        // Ajouter les articles
        $orderData['items'] = $order->items->map(function ($item) use ($locale) {
            return [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'price' => $item->price,
                'total' => $item->total,
                'product_name' => $item->getProductName($locale),
                'product_image' => $item->getProductImage(),
                'product' => $item->product ? [
                    'id' => $item->product->id,
                    'name' => $item->product->getLocalizedName($locale),
                    'slug' => $item->product->slug,
                    'main_image' => $item->product->main_image,
                ] : null,
            ];
        });

        // Ajouter les paiements
        if ($order->payments) {
            $orderData['payments'] = $order->payments->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'status' => $payment->status,
                    'method' => $payment->payment_method,
                    'amount' => $payment->amount,
                    'processed_at' => $payment->processed_at,
                ];
            });
        }

        return $orderData;
    }
}
