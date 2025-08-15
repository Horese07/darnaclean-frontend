<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Catégories
        $categories = json_decode(File::get(database_path('seeders/data/categories.json')), true);
        foreach ($categories as $cat) {
            DB::table('categories')->insert([
                'name' => json_encode($cat['name']),
                'slug' => $cat['slug'],
                'description' => json_encode($cat['description']),
                'image' => $cat['image'] ?? null,
                'featured' => $cat['featured'] ?? false,
            ]);
        }

        // Produits
        $products = json_decode(File::get(database_path('seeders/data/products.json')), true);
        foreach ($products as $prod) {
            DB::table('products')->insert([
                'name' => json_encode($prod['name']),
                'slug' => $prod['slug'],
                'description' => json_encode($prod['description']),
                'price' => $prod['price'],
                'currency' => $prod['currency'],
                'category' => $prod['category'],
                'subcategory' => $prod['subcategory'] ?? null,
                'brand' => $prod['brand'] ?? null,
                'sku' => $prod['sku'] ?? null,
                'stock' => $prod['stock'] ?? 0,
                'images' => json_encode($prod['images'] ?? []),
                'featured' => $prod['featured'] ?? false,
                'onSale' => $prod['onSale'] ?? false,
                'badges' => json_encode($prod['badges'] ?? []),
                'specifications' => json_encode($prod['specifications'] ?? []),
                'rating' => $prod['rating'] ?? 0,
                'reviewCount' => $prod['reviewCount'] ?? 0,
                'tags' => json_encode($prod['tags'] ?? []),
            ]);
        }

        // Utilisateurs (admin et user)
        $users = json_decode(File::get(database_path('seeders/data/users.json')), true);
        foreach ($users as $user) {
            DB::table('users')->insert([
                'name' => $user['name'],
                'email' => $user['email'],
                'password' => Hash::make($user['password']),
                'is_admin' => $user['is_admin'] ?? false,
            ]);
        }
    }
}
