<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Liste des produits avec filtres et pagination
     */
    public function index(Request $request)
    {
        // Set app locale from ?lang= param if present
        if ($request->has('lang')) {
            app()->setLocale($request->query('lang'));
        }
        try {
            $query = Product::with(['category', 'subcategory'])
                ->active()
                ->orderBy('featured', 'desc');

            // Filtres
            if ($request->category) {
                if (is_numeric($request->category)) {
                    $query->where('category_id', $request->category);
                } else {
                    $category = Category::where('slug', $request->category)->first();
                    if ($category) {
                        $query->where('category_id', $category->id);
                    }
                }
            }

            if ($request->subcategory) {
                if (is_numeric($request->subcategory)) {
                    $query->where('subcategory_id', $request->subcategory);
                } else {
                    $subcategory = SubCategory::where('slug', $request->subcategory)->first();
                    if ($subcategory) {
                        $query->where('subcategory_id', $subcategory->id);
                    }
                }
            }

            if ($request->brand) {
                $query->where('brand', $request->brand);
            }

            if ($request->on_sale) {
                $query->where('on_sale', true);
            }

            if ($request->in_stock) {
                $query->where('stock', '>', 0);
            }

            if ($request->featured) {
                $query->where('featured', true);
            }

            if ($request->price_min || $request->price_max) {
                $priceMin = $request->price_min ?? 0;
                $priceMax = $request->price_max ?? 999999;
                $query->whereBetween('price', [$priceMin, $priceMax]);
            }

            if ($request->search) {
                $query->search($request->search);
            }

            // Tri
            if ($request->sort_by) {
                switch ($request->sort_by) {
                    case 'price_asc':
                        $query->orderBy('price', 'asc');
                        break;
                    case 'price_desc':
                        $query->orderBy('price', 'desc');
                        break;
                    case 'name':
                        $lang = app()->getLocale();
                        $query->orderBy("name_$lang", 'asc');
                        break;
                    case 'rating':
                        $query->orderBy('rating', 'desc');
                        break;
                    case 'newest':
                    default:
                        $query->orderBy('created_at', 'desc');
                        break;
                }
            }

            $perPage = min($request->per_page ?? 20, 50);
            $products = $query->paginate($perPage);

            // Formater les données
            $formattedProducts = $products->getCollection()->map(function ($product) {
                return $this->formatProduct($product);
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'products' => $formattedProducts,
                    'pagination' => [
                        'current_page' => $products->currentPage(),
                        'per_page' => $products->perPage(),
                        'total' => $products->total(),
                        'last_page' => $products->lastPage(),
                        'from' => $products->firstItem(),
                        'to' => $products->lastItem(),
                    ],
                    'filters' => [
                        'brands' => Product::active()->distinct('brand')->pluck('brand')->filter()->values(),
                        'price_range' => [
                            'min' => Product::active()->min('price'),
                            'max' => Product::active()->max('price'),
                        ],
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des produits',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Détail d'un produit
     */
    public function show($slug)
    {
        try {
            $product = Product::with(['category', 'subcategory', 'reviews.user'])
                ->where('slug', $slug)
                ->active()
                ->first();

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Produit non trouvé'
                ], 404);
            }

            $relatedProducts = Product::with(['category'])
                ->where('category_id', $product->category_id)
                ->where('id', '!=', $product->id)
                ->active()
                ->featured()
                ->limit(4)
                ->get()
                ->map(function ($product) {
                    return $this->formatProduct($product);
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'product' => $this->formatProductDetail($product),
                    'related_products' => $relatedProducts,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du produit',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Produits vedettes
     */
    public function featured(Request $request)
    {
        try {
            $limit = min($request->limit ?? 8, 20);

            $products = Product::with(['category'])
                ->active()
                ->featured()
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get()
                ->map(function ($product) {
                    return $this->formatProduct($product);
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'products' => $products
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des produits vedettes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Produits en promotion
     */
    public function onSale(Request $request)
    {
        try {
            $limit = min($request->limit ?? 8, 20);

            $products = Product::with(['category'])
                ->active()
                ->onSale()
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get()
                ->map(function ($product) {
                    return $this->formatProduct($product);
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'products' => $products
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des produits en promotion',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Recherche de produits
     */
    public function search(Request $request)
    {
        try {
            $query = $request->q;

            if (empty($query) || strlen($query) < 2) {
                return response()->json([
                    'success' => false,
                    'message' => 'Le terme de recherche doit contenir au moins 2 caractères'
                ], 400);
            }

            $products = Product::with(['category'])
                ->active()
                ->search($query)
                ->orderBy('featured', 'desc')
                ->orderBy('rating', 'desc')
                ->limit(20)
                ->get()
                ->map(function ($product) {
                    return $this->formatProduct($product);
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'products' => $products,
                    'query' => $query,
                    'total' => $products->count(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la recherche',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Formater un produit pour l'API
     */
    private function formatProduct($product)
    {
        $locale = app()->getLocale();

        return [
            'id' => $product->id,
            'name' => $product->getLocalizedName($locale),
            'slug' => $product->slug,
            'description' => $product->getLocalizedDescription($locale),
            'price' => $product->price,
            'original_price' => $product->original_price,
            'currency' => $product->currency,
            'category' => $product->category ? [
                'id' => $product->category->id,
                'name' => $product->category->getLocalizedName($locale),
                'slug' => $product->category->slug,
            ] : null,
            'subcategory' => $product->subcategory ? [
                'id' => $product->subcategory->id,
                'name' => $product->subcategory->getLocalizedName($locale),
                'slug' => $product->subcategory->slug,
            ] : null,
            'brand' => $product->brand,
            'sku' => $product->sku,
            'stock' => $product->stock,
            'images' => $product->images,
            'main_image' => $product->main_image,
            'featured' => $product->featured,
            'on_sale' => $product->on_sale,
            'badges' => $product->badges,
            'rating' => $product->rating,
            'review_count' => $product->review_count,
            'tags' => $product->tags,
            'discount_percentage' => $product->discount_percentage,
            'is_in_stock' => $product->is_in_stock,
        ];
    }

    /**
     * Formater un produit avec détails complets
     */
    private function formatProductDetail($product)
    {
        $locale = app()->getLocale();
        $productData = $this->formatProduct($product);

        // Ajouter les détails supplémentaires
        $productData['specifications'] = $product->specifications;
        $productData['weight'] = $product->weight;
        $productData['dimensions'] = $product->dimensions;
        $productData['meta_title'] = $product->meta_title;
        $productData['meta_description'] = $product->meta_description;

        // Ajouter les avis
        $productData['reviews'] = $product->reviews->where('is_approved', true)->map(function ($review) {
            return [
                'id' => $review->id,
                'rating' => $review->rating,
                'title' => $review->title,
                'comment' => $review->comment,
                'user_display_name' => $review->user_display_name,
                'is_verified_purchase' => $review->is_verified_purchase,
                'helpful_count' => $review->helpful_count,
                'created_at' => $review->created_at,
            ];
        })->values();

        return $productData;
    }
}
