<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use App\Models\SubCategory;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \DB::beginTransaction();
        try {
            $categories = Category::with('subcategories')->get();
            $products = [
            // Nettoyage Maison - Cuisine
            [
                'name_fr' => 'Liquide vaisselle Palmolive Original',
                'name_ar' => 'سائل الأطباق بالموليف الأصلي',
                'name_en' => 'Palmolive Original Dish Soap',
                'slug' => 'liquide-vaisselle-palmolive-original',
                'description_fr' => 'Liquide vaisselle concentré pour un dégraissage efficace. Formula enrichie en glycérine pour protéger vos mains.',
                'description_ar' => 'سائل أطباق مركز لإزالة الدهون بفعالية. تركيبة مدعمة بالجليسرين لحماية يديك.',
                'description_en' => 'Concentrated dish soap for effective degreasing. Formula enriched with glycerin to protect your hands.',
                'price' => 25.50,
                'original_price' => 30.00,
                'brand' => 'Palmolive',
                'sku' => 'PLM-001',
                'stock' => 150,
                'images' => ['/images/products/palmolive-dish-soap.jpg'],
                'featured' => true,
                'on_sale' => true,
                'badges' => ['Promo', 'Bestseller'],
                'specifications' => [
                    'volume' => '500ml',
                    'type' => 'Concentré',
                    'parfum' => 'Original'
                ],
                'rating' => 4.5,
                'review_count' => 89,
                'tags' => ['vaisselle', 'dégraissant', 'cuisine'],
                'category_slug' => 'nettoyage-maison',
                'subcategory_slug' => 'cuisine',
            ],
            [
                'name_fr' => 'Nettoyant multi-surfaces Dettol',
                'name_ar' => 'منظف متعدد الأسطح ديتول',
                'name_en' => 'Dettol Multi-Surface Cleaner',
                'slug' => 'nettoyant-multi-surfaces-dettol',
                'description_fr' => 'Nettoyant et désinfectant pour toutes les surfaces de la cuisine. Élimine 99,9% des bactéries.',
                'description_ar' => 'منظف ومطهر لجميع أسطح المطبخ. يقضي على 99.9% من البكتيريا.',
                'description_en' => 'Cleaner and disinfectant for all kitchen surfaces. Eliminates 99.9% of bacteria.',
                'price' => 35.00,
                'brand' => 'Dettol',
                'sku' => 'DTL-002',
                'stock' => 120,
                'images' => ['/images/products/dettol-multi-surface.jpg'],
                'featured' => false,
                'on_sale' => false,
                'badges' => ['Antibactérien'],
                'specifications' => [
                    'volume' => '750ml',
                    'type' => 'Spray',
                    'action' => 'Désinfectant'
                ],
                'rating' => 4.3,
                'review_count' => 67,
                'tags' => ['désinfectant', 'multi-surfaces', 'antibactérien'],
                'category_slug' => 'nettoyage-maison',
                'subcategory_slug' => 'cuisine',
            ],

            // Nettoyage Maison - Salle de bain
            [
                'name_fr' => 'Nettoyant WC Harpic Power Plus',
                'name_ar' => 'منظف المراحيض هاربيك باور بلاس',
                'name_en' => 'Harpic Power Plus Toilet Cleaner',
                'slug' => 'nettoyant-wc-harpic-power-plus',
                'description_fr' => 'Gel nettoyant WC extra fort qui élimine le calcaire et désinfecte en profondeur.',
                'description_ar' => 'جل تنظيف المراحيض فائق القوة يزيل الجير وينظف بعمق.',
                'description_en' => 'Extra strong toilet cleaning gel that removes lime scale and disinfects thoroughly.',
                'price' => 42.00,
                'brand' => 'Harpic',
                'sku' => 'HRP-003',
                'stock' => 85,
                'images' => ['/images/products/harpic-toilet-cleaner.jpg'],
                'featured' => true,
                'on_sale' => false,
                'badges' => ['Power Plus', 'Anti-calcaire'],
                'specifications' => [
                    'volume' => '1L',
                    'type' => 'Gel',
                    'action' => 'Anti-calcaire + Désinfectant'
                ],
                'rating' => 4.7,
                'review_count' => 156,
                'tags' => ['WC', 'calcaire', 'désinfectant'],
                'category_slug' => 'nettoyage-maison',
                'subcategory_slug' => 'salle-de-bain',
            ],

            // Lessive & Textile
            [
                'name_fr' => 'Lessive liquide Persil Gel',
                'name_ar' => 'مسحوق الغسيل السائل بيرسيل جل',
                'name_en' => 'Persil Liquid Detergent Gel',
                'slug' => 'lessive-liquide-persil-gel',
                'description_fr' => 'Lessive liquide concentrée pour tous types de tissus. Formule anti-taches efficace dès 20°C.',
                'description_ar' => 'مسحوق غسيل سائل مركز لجميع أنواع الأقمشة. تركيبة مضادة للبقع فعالة من 20 درجة مئوية.',
                'description_en' => 'Concentrated liquid detergent for all fabric types. Effective stain-fighting formula from 20°C.',
                'price' => 89.00,
                'original_price' => 95.00,
                'brand' => 'Persil',
                'sku' => 'PRS-004',
                'stock' => 200,
                'images' => ['/images/products/persil-liquid-gel.jpg'],
                'featured' => true,
                'on_sale' => true,
                'badges' => ['Promo', 'Concentré', 'Anti-taches'],
                'specifications' => [
                    'volume' => '2L',
                    'doses' => '40 lavages',
                    'température' => 'Dès 20°C'
                ],
                'rating' => 4.6,
                'review_count' => 234,
                'tags' => ['lessive', 'anti-taches', 'concentré'],
                'category_slug' => 'lessive-textile',
                'subcategory_slug' => 'lessive-liquide',
            ],
            [
                'name_fr' => 'Adoucissant Lenor Spring',
                'name_ar' => 'منعم الأقمشة لينور سبرينغ',
                'name_en' => 'Lenor Spring Fabric Softener',
                'slug' => 'adoucissant-lenor-spring',
                'description_fr' => 'Adoucissant qui apporte douceur et fraîcheur à votre linge. Parfum longue durée.',
                'description_ar' => 'منعم يجلب النعومة والانتعاش لغسيلك. عطر طويل المدى.',
                'description_en' => 'Fabric softener that brings softness and freshness to your laundry. Long-lasting fragrance.',
                'price' => 32.00,
                'brand' => 'Lenor',
                'sku' => 'LNR-005',
                'stock' => 180,
                'images' => ['/images/products/lenor-spring.jpg'],
                'featured' => false,
                'on_sale' => false,
                'badges' => ['Fraîcheur longue durée'],
                'specifications' => [
                    'volume' => '1.5L',
                    'parfum' => 'Spring',
                    'action' => 'Adoucit + Parfume'
                ],
                'rating' => 4.4,
                'review_count' => 123,
                'tags' => ['adoucissant', 'parfum', 'douceur'],
                'category_slug' => 'lessive-textile',
                'subcategory_slug' => 'adoucissants',
            ],

            // Hygiène Personnelle
            [
                'name_fr' => 'Savon Dove Beauty Bar',
                'name_ar' => 'صابون دوف بار الجمال',
                'name_en' => 'Dove Beauty Bar Soap',
                'slug' => 'savon-dove-beauty-bar',
                'description_fr' => 'Pain de savon hydratant enrichi en crème nourrissante. Nettoie en douceur sans dessécher.',
                'description_ar' => 'قطعة صابون مرطبة مدعمة بكريم مغذي. ينظف بلطف دون أن يجفف.',
                'description_en' => 'Moisturizing soap bar enriched with nourishing cream. Gently cleanses without drying.',
                'price' => 18.50,
                'brand' => 'Dove',
                'sku' => 'DV-006',
                'stock' => 300,
                'images' => ['/images/products/dove-beauty-bar.jpg'],
                'featured' => true,
                'on_sale' => false,
                'badges' => ['Hydratant', 'Bestseller'],
                'specifications' => [
                    'poids' => '100g',
                    'type' => 'Pain de savon',
                    'action' => 'Hydratant'
                ],
                'rating' => 4.8,
                'review_count' => 342,
                'tags' => ['savon', 'hydratant', 'doux'],
                'category_slug' => 'hygiene-personnelle',
                'subcategory_slug' => 'savons',
            ],
            [
                'name_fr' => 'Shampoing L\'Oréal Elsève',
                'name_ar' => 'شامبو لوريال إلسيف',
                'name_en' => 'L\'Oréal Elsève Shampoo',
                'slug' => 'shampoing-loreal-elseve',
                'description_fr' => 'Shampoing réparateur pour cheveux abîmés. Formule enrichie en kératine et huiles essentielles.',
                'description_ar' => 'شامبو مصلح للشعر التالف. تركيبة مدعمة بالكيراتين والزيوت الأساسية.',
                'description_en' => 'Repairing shampoo for damaged hair. Formula enriched with keratin and essential oils.',
                'price' => 45.00,
                'brand' => 'L\'Oréal',
                'sku' => 'LOR-007',
                'stock' => 160,
                'images' => ['/images/products/loreal-elseve.jpg'],
                'featured' => false,
                'on_sale' => false,
                'badges' => ['Réparateur', 'Kératine'],
                'specifications' => [
                    'volume' => '400ml',
                    'type' => 'Cheveux abîmés',
                    'actifs' => 'Kératine + Huiles'
                ],
                'rating' => 4.2,
                'review_count' => 98,
                'tags' => ['shampoing', 'réparateur', 'kératine'],
                'category_slug' => 'hygiene-personnelle',
                'subcategory_slug' => 'shampoings',
            ],

            // Désinfectants
            [
                'name_fr' => 'Spray désinfectant Sanytol',
                'name_ar' => 'بخاخ التطهير سانيتول',
                'name_en' => 'Sanytol Disinfectant Spray',
                'slug' => 'spray-desinfectant-sanytol',
                'description_fr' => 'Spray désinfectant multi-usages. Élimine virus, bactéries et champignons.',
                'description_ar' => 'بخاخ التطهير متعدد الاستخدامات. يقضي على الفيروسات والبكتيريا والفطريات.',
                'description_en' => 'Multi-purpose disinfectant spray. Eliminates viruses, bacteria and fungi.',
                'price' => 28.00,
                'brand' => 'Sanytol',
                'sku' => 'SNT-008',
                'stock' => 95,
                'images' => ['/images/products/sanytol-spray.jpg'],
                'featured' => false,
                'on_sale' => false,
                'badges' => ['Anti-virus', 'Multi-usages'],
                'specifications' => [
                    'volume' => '500ml',
                    'type' => 'Spray',
                    'action' => 'Désinfectant complet'
                ],
                'rating' => 4.5,
                'review_count' => 145,
                'tags' => ['désinfectant', 'spray', 'anti-virus'],
                'category_slug' => 'desinfectants',
                'subcategory_slug' => 'sprays-desinfectants',
            ],

            // Accessoires
            [
                'name_fr' => 'Éponges Scotch-Brite (Pack de 6)',
                'name_ar' => 'اسفنجات سكوتش برايت (عبوة 6 قطع)',
                'name_en' => 'Scotch-Brite Sponges (Pack of 6)',
                'slug' => 'eponges-scotch-brite-pack-6',
                'description_fr' => 'Pack de 6 éponges abrasives double face. Côté vert récurant et côté jaune absorbant.',
                'description_ar' => 'عبوة من 6 إسفنجات كاشطة ذات وجهين. الجانب الأخضر كاشط والجانب الأصفر ماص.',
                'description_en' => 'Pack of 6 double-sided abrasive sponges. Green scouring side and yellow absorbent side.',
                'price' => 22.00,
                'original_price' => 25.00,
                'brand' => 'Scotch-Brite',
                'sku' => 'SB-009',
                'stock' => 250,
                'images' => ['/images/products/scotch-brite-sponges.jpg'],
                'featured' => false,
                'on_sale' => true,
                'badges' => ['Pack économique', 'Promo'],
                'specifications' => [
                    'quantité' => '6 éponges',
                    'dimensions' => '11 x 7 cm',
                    'type' => 'Double face'
                ],
                'rating' => 4.3,
                'review_count' => 78,
                'tags' => ['éponges', 'récurant', 'pack'],
                'category_slug' => 'accessoires',
                'subcategory_slug' => 'eponges',
            ],
            [
                'name_fr' => 'Javel Lacroix Concentrée',
                'name_ar' => 'جافيل لاكروا مركز',
                'name_en' => 'Lacroix Concentrated Bleach',
                'slug' => 'javel-lacroix-concentree',
                'description_fr' => 'Eau de javel concentrée pour blanchir et désinfecter. Formule anti-taches efficace.',
                'description_ar' => 'ماء جافيل مركز للتبييض والتطهير. تركيبة مضادة للبقع فعالة.',
                'description_en' => 'Concentrated bleach for whitening and disinfecting. Effective stain-fighting formula.',
                'price' => 15.00,
                'brand' => 'Lacroix',
                'sku' => 'LCX-010',
                'stock' => 120,
                'images' => ['/images/products/lacroix-bleach.jpg'],
                'featured' => true,
                'on_sale' => false,
                'badges' => ['Concentré', 'Blanchissant'],
                'specifications' => [
                    'volume' => '1L',
                    'concentration' => '12°',
                    'type' => 'Eau de javel'
                ],
                'rating' => 4.1,
                'review_count' => 167,
                'tags' => ['javel', 'blanchissant', 'désinfectant'],
                'category_slug' => 'desinfectants',
                'subcategory_slug' => 'sprays-desinfectants',
            ],
        ];

        foreach ($products as $productData) {
            $category = $categories->where('slug', $productData['category_slug'])->first();
            if (!$category) {
                $this->command->error("Catégorie non trouvée: " . $productData['category_slug']);
                continue;
            }
            $subcategory = null;
            if (isset($productData['subcategory_slug'])) {
                $subcategory = $category->subcategories->where('slug', $productData['subcategory_slug'])->first();
                if (!$subcategory) {
                    $this->command->warn("Sous-catégorie non trouvée: " . $productData['subcategory_slug']);
                }
            }
            unset($productData['category_slug'], $productData['subcategory_slug']);
            $productData['category_id'] = $category->id;
            $productData['subcategory_id'] = $subcategory ? $subcategory->id : null;
            Product::create($productData);
            $this->command->info("Produit créé: " . ($productData['name_fr'] ?? $productData['name_en'] ?? $productData['slug']));
        }
            \DB::commit();
            $this->command->info('Tous les produits ont été créés avec succès!');
        } catch (\Exception $e) {
            \DB::rollBack();
            $this->command->error('Erreur lors de la création des produits: ' . $e->getMessage());
        }
    }
}
