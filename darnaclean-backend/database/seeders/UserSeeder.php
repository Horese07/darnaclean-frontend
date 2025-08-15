<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\ShippingAddress;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin utilisateur
        $admin = User::create([
            'first_name' => 'Admin',
            'last_name' => 'DarnaClean',
            'email' => 'admin@darnaclean.ma',
            'phone' => '+212600000000',
            'password' => 'password123',
            'is_admin' => true,
            'email_verified_at' => now(),
            'preferred_language' => 'fr',
        ]);

        // Utilisateurs clients de test
        $users = [
            [
                'first_name' => 'Ahmed',
                'last_name' => 'Bennani',
                'email' => 'ahmed.bennani@email.com',
                'phone' => '+212661234567',
                'password' => 'password123',
                'preferred_language' => 'fr',
                'city' => 'Casablanca',
            ],
            [
                'first_name' => 'Fatima',
                'last_name' => 'Alaoui',
                'email' => 'fatima.alaoui@email.com',
                'phone' => '+212662345678',
                'password' => 'password123',
                'preferred_language' => 'ar',
                'city' => 'Rabat',
            ],
            [
                'first_name' => 'Mohammed',
                'last_name' => 'Tazi',
                'email' => 'mohammed.tazi@email.com',
                'phone' => '+212663456789',
                'password' => 'password123',
                'preferred_language' => 'fr',
                'city' => 'Marrakech',
            ],
            [
                'first_name' => 'Aicha',
                'last_name' => 'Idrissi',
                'email' => 'aicha.idrissi@email.com',
                'phone' => '+212664567890',
                'password' => 'password123',
                'preferred_language' => 'ar',
                'city' => 'Fès',
            ],
            [
                'first_name' => 'Youssef',
                'last_name' => 'El Amrani',
                'email' => 'youssef.elamrani@email.com',
                'phone' => '+212665678901',
                'password' => 'password123',
                'preferred_language' => 'en',
                'city' => 'Tanger',
            ],
        ];

        foreach ($users as $userData) {
            $user = User::create([
                'first_name' => $userData['first_name'],
                'last_name' => $userData['last_name'],
                'email' => $userData['email'],
                'phone' => $userData['phone'],
                'password' => $userData['password'],
                'preferred_language' => $userData['preferred_language'],
                'email_verified_at' => now(),
            ]);

            // Créer une adresse de livraison pour chaque utilisateur
            ShippingAddress::create([
                'user_id' => $user->id,
                'type' => 'shipping',
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'address_line_1' => 'Rue ' . fake()->randomNumber(2) . ', Quartier ' . fake()->word(),
                'city' => $userData['city'],
                'postal_code' => fake()->randomNumber(5, true),
                'country' => 'Morocco',
                'phone' => $user->phone,
                'is_default' => true,
            ]);
        }

        $this->command->info('Utilisateurs créés avec succès!');
    }
}
