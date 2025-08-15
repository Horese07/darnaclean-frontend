<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\SubCategory;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name_fr' => 'Nettoyage Maison',
                'name_ar' => 'تنظيف المنزل',
                'name_en' => 'Home Cleaning',
                'slug' => 'nettoyage-maison',
                'description_fr' => 'Produits pour nettoyer et entretenir votre maison',
                'description_ar' => 'منتجات لتنظيف وصيانة منزلك',
                'description_en' => 'Products to clean and maintain your home',
                'image' => '/images/categories/home-cleaning.jpg',
                'icon' => 'home',
                'featured' => true,
                'subcategories' => [
                    [
                        'name_fr' => 'Cuisine',
                        'name_ar' => 'المطبخ',
                        'name_en' => 'Kitchen',
                        'slug' => 'cuisine',
                    ],
                    [
                        'name_fr' => 'Salle de bain',
                        'name_ar' => 'الحمام',
                        'name_en' => 'Bathroom',
                        'slug' => 'salle-de-bain',
                    ],
                    [
                        'name_fr' => 'Sols',
                        'name_ar' => 'الأرضيات',
                        'name_en' => 'Floors',
                        'slug' => 'sols',
                    ],
                ],
            ],
            [
                'name_fr' => 'Lessive & Textile',
                'name_ar' => 'الغسيل والنسيج',
                'name_en' => 'Laundry & Textile',
                'slug' => 'lessive-textile',
                'description_fr' => 'Produits de lessive et soins des textiles',
                'description_ar' => 'منتجات الغسيل وعناية المنسوجات',
                'description_en' => 'Laundry products and textile care',
                'image' => '/images/categories/laundry.jpg',
                'icon' => 'shirt',
                'featured' => true,
                'subcategories' => [
                    [
                        'name_fr' => 'Lessive liquide',
                        'name_ar' => 'مسحوق الغسيل السائل',
                        'name_en' => 'Liquid detergent',
                        'slug' => 'lessive-liquide',
                    ],
                    [
                        'name_fr' => 'Lessive en poudre',
                        'name_ar' => 'مسحوق الغسيل',
                        'name_en' => 'Powder detergent',
                        'slug' => 'lessive-poudre',
                    ],
                    [
                        'name_fr' => 'Adoucissants',
                        'name_ar' => 'منعم الأقمشة',
                        'name_en' => 'Fabric softeners',
                        'slug' => 'adoucissants',
                    ],
                ],
            ],
            [
                'name_fr' => 'Hygiène Personnelle',
                'name_ar' => 'النظافة الشخصية',
                'name_en' => 'Personal Hygiene',
                'slug' => 'hygiene-personnelle',
                'description_fr' => 'Produits d\'hygiène et de soins personnels',
                'description_ar' => 'منتجات النظافة والعناية الشخصية',
                'description_en' => 'Personal hygiene and care products',
                'image' => '/images/categories/personal-hygiene.jpg',
                'icon' => 'user',
                'featured' => true,
                'subcategories' => [
                    [
                        'name_fr' => 'Savons',
                        'name_ar' => 'الصابون',
                        'name_en' => 'Soaps',
                        'slug' => 'savons',
                    ],
                    [
                        'name_fr' => 'Shampoings',
                        'name_ar' => 'الشامبو',
                        'name_en' => 'Shampoos',
                        'slug' => 'shampoings',
                    ],
                    [
                        'name_fr' => 'Gels douche',
                        'name_ar' => 'جل الاستحمام',
                        'name_en' => 'Shower gels',
                        'slug' => 'gels-douche',
                    ],
                ],
            ],
            [
                'name_fr' => 'Désinfectants',
                'name_ar' => 'المطهرات',
                'name_en' => 'Disinfectants',
                'slug' => 'desinfectants',
                'description_fr' => 'Produits désinfectants et antibactériens',
                'description_ar' => 'منتجات التطهير ومضادات البكتيريا',
                'description_en' => 'Disinfectant and antibacterial products',
                'image' => '/images/categories/disinfectants.jpg',
                'icon' => 'shield',
                'featured' => false,
                'subcategories' => [
                    [
                        'name_fr' => 'Sprays désinfectants',
                        'name_ar' => 'بخاخات التطهير',
                        'name_en' => 'Disinfectant sprays',
                        'slug' => 'sprays-desinfectants',
                    ],
                    [
                        'name_fr' => 'Lingettes',
                        'name_ar' => 'المناديل المبللة',
                        'name_en' => 'Wipes',
                        'slug' => 'lingettes',
                    ],
                ],
            ],
            [
                'name_fr' => 'Accessoires',
                'name_ar' => 'الاكسسوارات',
                'name_en' => 'Accessories',
                'slug' => 'accessoires',
                'description_fr' => 'Accessoires et outils de nettoyage',
                'description_ar' => 'أدوات ومعدات التنظيف',
                'description_en' => 'Cleaning tools and accessories',
                'image' => '/images/categories/accessories.jpg',
                'icon' => 'wrench',
                'featured' => false,
                'subcategories' => [
                    [
                        'name_fr' => 'Éponges',
                        'name_ar' => 'الاسفنج',
                        'name_en' => 'Sponges',
                        'slug' => 'eponges',
                    ],
                    [
                        'name_fr' => 'Balais',
                        'name_ar' => 'المكانس',
                        'name_en' => 'Brooms',
                        'slug' => 'balais',
                    ],
                ],
            ],
        ];

        foreach ($categories as $index => $categoryData) {
            $subcategoriesData = $categoryData['subcategories'];
            unset($categoryData['subcategories']);
            
            $categoryData['sort_order'] = $index + 1;
            
            $category = Category::create($categoryData);

            foreach ($subcategoriesData as $subIndex => $subcategoryData) {
                $subcategoryData['category_id'] = $category->id;
                $subcategoryData['sort_order'] = $subIndex + 1;
                $subcategoryData['description_fr'] = $subcategoryData['description_fr'] ?? '';
                $subcategoryData['description_ar'] = $subcategoryData['description_ar'] ?? '';
                $subcategoryData['description_en'] = $subcategoryData['description_en'] ?? '';
                
                SubCategory::create($subcategoryData);
            }
        }

        $this->command->info('Catégories et sous-catégories créées avec succès!');
    }
}
