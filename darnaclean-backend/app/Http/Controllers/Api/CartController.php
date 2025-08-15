<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    /**
     * Récupérer le contenu du panier
     */
    public function index(Request $request)
    {
        try {
            $cartItems = [];
            
            if ($request->user()) {
                $cartItems = CartItem::getCartForUser($request->user()->id);
            } elseif ($request->session_id) {
                $cartItems = CartItem::getCartForSession($request->session_id);
            }

            $formattedItems = $cartItems->map(function ($item) {
                return $this->formatCartItem($item);
            });

            $totals = $this->calculateCartTotals($cartItems);

            return response()->json([
                'success' => true,
                'data' => [
                    'items' => $formattedItems,
                    'totals' => $totals,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du panier',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ajouter un produit au panier
     */
    public function add(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
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
            $product = Product::find($request->product_id);

            if (!$product->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce produit n\'est plus disponible'
                ], 400);
            }

            if ($product->stock < $request->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stock insuffisant. Stock disponible: ' . $product->stock
                ], 400);
            }

            $userId = $request->user() ? $request->user()->id : null;
            $sessionId = $request->session_id;

            $cartItem = CartItem::addOrUpdateItem(
                $userId,
                $request->product_id,
                $request->quantity,
                $sessionId
            );

            $formattedItem = $this->formatCartItem($cartItem);

            // Récupérer le total du panier
            if ($userId) {
                $cartItems = CartItem::getCartForUser($userId);
            } else {
                $cartItems = CartItem::getCartForSession($sessionId);
            }

            $totals = $this->calculateCartTotals($cartItems);

            return response()->json([
                'success' => true,
                'message' => 'Produit ajouté au panier',
                'data' => [
                    'item' => $formattedItem,
                    'totals' => $totals,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'ajout au panier',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour la quantité d'un produit dans le panier
     */
    public function update(Request $request, $itemId)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $query = CartItem::where('id', $itemId);
            
            if ($request->user()) {
                $query->where('user_id', $request->user()->id);
            } else {
                $query->where('session_id', $request->session_id);
            }

            $cartItem = $query->first();

            if (!$cartItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Article non trouvé dans le panier'
                ], 404);
            }

            if ($request->quantity === 0) {
                $cartItem->delete();
                
                return response()->json([
                    'success' => true,
                    'message' => 'Article supprimé du panier'
                ]);
            }

            if ($cartItem->product->stock < $request->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stock insuffisant. Stock disponible: ' . $cartItem->product->stock
                ], 400);
            }

            $cartItem->updateQuantity($request->quantity);

            $formattedItem = $this->formatCartItem($cartItem);

            // Récupérer le total du panier
            if ($request->user()) {
                $cartItems = CartItem::getCartForUser($request->user()->id);
            } else {
                $cartItems = CartItem::getCartForSession($request->session_id);
            }

            $totals = $this->calculateCartTotals($cartItems);

            return response()->json([
                'success' => true,
                'message' => 'Quantité mise à jour',
                'data' => [
                    'item' => $formattedItem,
                    'totals' => $totals,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un produit du panier
     */
    public function remove(Request $request, $itemId)
    {
        try {
            $query = CartItem::where('id', $itemId);
            
            if ($request->user()) {
                $query->where('user_id', $request->user()->id);
            } else {
                $query->where('session_id', $request->session_id);
            }

            $cartItem = $query->first();

            if (!$cartItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Article non trouvé dans le panier'
                ], 404);
            }

            $cartItem->delete();

            // Récupérer le total du panier
            if ($request->user()) {
                $cartItems = CartItem::getCartForUser($request->user()->id);
            } else {
                $cartItems = CartItem::getCartForSession($request->session_id);
            }

            $totals = $this->calculateCartTotals($cartItems);

            return response()->json([
                'success' => true,
                'message' => 'Article supprimé du panier',
                'data' => [
                    'totals' => $totals,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Vider le panier
     */
    public function clear(Request $request)
    {
        try {
            if ($request->user()) {
                CartItem::clearCartForUser($request->user()->id);
            } elseif ($request->session_id) {
                CartItem::clearCartForSession($request->session_id);
            }

            return response()->json([
                'success' => true,
                'message' => 'Panier vidé',
                'data' => [
                    'totals' => [
                        'subtotal' => 0,
                        'tax_amount' => 0,
                        'shipping_amount' => 0,
                        'discount_amount' => 0,
                        'total' => 0,
                        'items_count' => 0,
                        'free_shipping_threshold' => 200,
                        'remaining_for_free_shipping' => 200,
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du vidage du panier',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Migrer le panier de session vers l'utilisateur connecté
     */
    public function migrate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'session_id' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'ID de session requis',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            if (!$request->user()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non connecté'
                ], 401);
            }

            CartItem::migrateSessionToUser($request->session_id, $request->user()->id);

            $cartItems = CartItem::getCartForUser($request->user()->id);
            $formattedItems = $cartItems->map(function ($item) {
                return $this->formatCartItem($item);
            });

            $totals = $this->calculateCartTotals($cartItems);

            return response()->json([
                'success' => true,
                'message' => 'Panier migré avec succès',
                'data' => [
                    'items' => $formattedItems,
                    'totals' => $totals,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la migration du panier',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Formater un article du panier pour l'API
     */
    private function formatCartItem($cartItem)
    {
        $locale = app()->getLocale();
        
        return [
            'id' => $cartItem->id,
            'quantity' => $cartItem->quantity,
            'total' => $cartItem->total,
            'product' => [
                'id' => $cartItem->product->id,
                'name' => $cartItem->product->getLocalizedName($locale),
                'slug' => $cartItem->product->slug,
                'price' => $cartItem->product->price,
                'original_price' => $cartItem->product->original_price,
                'currency' => $cartItem->product->currency,
                'brand' => $cartItem->product->brand,
                'sku' => $cartItem->product->sku,
                'stock' => $cartItem->product->stock,
                'main_image' => $cartItem->product->main_image,
                'on_sale' => $cartItem->product->on_sale,
                'discount_percentage' => $cartItem->product->discount_percentage,
                'is_in_stock' => $cartItem->product->is_in_stock,
            ]
        ];
    }

    /**
     * Calculer les totaux du panier
     */
    private function calculateCartTotals($cartItems)
    {
        $subtotal = $cartItems->sum('total');
        $taxAmount = $subtotal * 0.20; // TVA 20%
        $shippingAmount = $subtotal >= 200 ? 0 : 30; // Livraison gratuite dès 200 MAD
        $discountAmount = 0; // À implémenter avec les codes promo
        $total = $subtotal + $taxAmount + $shippingAmount - $discountAmount;
        $itemsCount = $cartItems->sum('quantity');
        
        $freeShippingThreshold = 200;
        $remainingForFreeShipping = max(0, $freeShippingThreshold - $subtotal);

        return [
            'subtotal' => round($subtotal, 2),
            'tax_amount' => round($taxAmount, 2),
            'shipping_amount' => round($shippingAmount, 2),
            'discount_amount' => round($discountAmount, 2),
            'total' => round($total, 2),
            'items_count' => $itemsCount,
            'free_shipping_threshold' => $freeShippingThreshold,
            'remaining_for_free_shipping' => round($remainingForFreeShipping, 2),
        ];
    }
}
