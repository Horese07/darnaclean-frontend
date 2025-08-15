<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Liste des catégories
     */
    public function index(Request $request)
    {
        try {
            $query = Category::with(['subcategories' => function ($query) {
                $query->active()->ordered();
            }])->active();

            if ($request->featured) {
                $query->featured();
            }

            $categories = $query->ordered()->get();

            $formattedCategories = $categories->map(function ($category) {
                return $this->formatCategory($category);
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'categories' => $formattedCategories
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des catégories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Détail d'une catégorie
     */
    public function show($slug)
    {
        try {
            $category = Category::with(['subcategories' => function ($query) {
                $query->active()->ordered();
            }])->where('slug', $slug)->active()->first();

            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Catégorie non trouvée'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'category' => $this->formatCategory($category)
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de la catégorie',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Catégories vedettes
     */
    public function featured(Request $request)
    {
        try {
            $limit = min($request->limit ?? 6, 20);
            
            $categories = Category::with(['subcategories' => function ($query) {
                $query->active()->ordered();
            }])
                ->active()
                ->featured()
                ->ordered()
                ->limit($limit)
                ->get();

            $formattedCategories = $categories->map(function ($category) {
                return $this->formatCategory($category);
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'categories' => $formattedCategories
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des catégories vedettes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Sous-catégories d'une catégorie
     */
    public function subcategories($categorySlug)
    {
        try {
            $category = Category::where('slug', $categorySlug)->active()->first();

            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Catégorie non trouvée'
                ], 404);
            }

            $subcategories = SubCategory::where('category_id', $category->id)
                ->active()
                ->ordered()
                ->get();

            $formattedSubcategories = $subcategories->map(function ($subcategory) {
                return $this->formatSubcategory($subcategory);
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'category' => $this->formatCategory($category, false),
                    'subcategories' => $formattedSubcategories
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des sous-catégories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Détail d'une sous-catégorie
     */
    public function showSubcategory($categorySlug, $subcategorySlug)
    {
        try {
            $category = Category::where('slug', $categorySlug)->active()->first();

            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Catégorie non trouvée'
                ], 404);
            }

            $subcategory = SubCategory::where('slug', $subcategorySlug)
                ->where('category_id', $category->id)
                ->active()
                ->first();

            if (!$subcategory) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sous-catégorie non trouvée'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'category' => $this->formatCategory($category, false),
                    'subcategory' => $this->formatSubcategory($subcategory)
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de la sous-catégorie',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Navigation breadcrumb
     */
    public function breadcrumb($categorySlug, $subcategorySlug = null)
    {
        try {
            $category = Category::where('slug', $categorySlug)->active()->first();

            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Catégorie non trouvée'
                ], 404);
            }

            $breadcrumb = [
                [
                    'name' => 'Accueil',
                    'slug' => '',
                    'url' => '/',
                ],
                [
                    'name' => $category->getLocalizedName(),
                    'slug' => $category->slug,
                    'url' => "/products/{$category->slug}",
                ]
            ];

            if ($subcategorySlug) {
                $subcategory = SubCategory::where('slug', $subcategorySlug)
                    ->where('category_id', $category->id)
                    ->active()
                    ->first();

                if ($subcategory) {
                    $breadcrumb[] = [
                        'name' => $subcategory->getLocalizedName(),
                        'slug' => $subcategory->slug,
                        'url' => "/products/{$category->slug}/{$subcategory->slug}",
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'breadcrumb' => $breadcrumb
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la génération du breadcrumb',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Formater une catégorie pour l'API
     */
    private function formatCategory($category, $includeSubcategories = true)
    {
        $locale = app()->getLocale();
        
        $data = [
            'id' => $category->id,
            'name' => $category->getLocalizedName($locale),
            'slug' => $category->slug,
            'description' => $category->getLocalizedDescription($locale),
            'image' => $category->image,
            'icon' => $category->icon,
            'featured' => $category->featured,
            'products_count' => $category->products_count,
        ];

        if ($includeSubcategories && $category->subcategories) {
            $data['subcategories'] = $category->subcategories->map(function ($subcategory) {
                return $this->formatSubcategory($subcategory);
            });
        }

        return $data;
    }

    /**
     * Formater une sous-catégorie pour l'API
     */
    private function formatSubcategory($subcategory)
    {
        $locale = app()->getLocale();
        
        return [
            'id' => $subcategory->id,
            'name' => $subcategory->getLocalizedName($locale),
            'slug' => $subcategory->slug,
            'description' => $subcategory->getLocalizedDescription($locale),
            'image' => $subcategory->image,
            'icon' => $subcategory->icon,
            'products_count' => $subcategory->products_count,
        ];
    }
}
