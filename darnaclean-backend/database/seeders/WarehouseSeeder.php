<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Warehouse;
use App\Models\WarehouseStock;
use App\Models\Product;

class WarehouseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer les entrepôts
        $warehouses = [
            [
                'name' => 'Entrepôt Principal Casablanca',
                'code' => 'WH-CAS-01',
                'address' => 'Zone Industrielle Ain Sebaa, Rue des Industries',
                'city' => 'Casablanca',
                'state' => 'Grand Casablanca',
                'postal_code' => '20250',
                'country' => 'Morocco',
                'phone' => '+212522334455',
                'email' => 'entrepot.casablanca@darnaclean.ma',
                'manager_name' => 'Hassan Benali',
                'is_active' => true,
                'is_default' => true,
            ],
            [
                'name' => 'Entrepôt Rabat',
                'code' => 'WH-RAB-01',
                'address' => 'Zone Industrielle Salé, Avenue des Almohades',
                'city' => 'Salé',
                'state' => 'Rabat-Salé-Kénitra',
                'postal_code' => '11100',
                'country' => 'Morocco',
                'phone' => '+212537556677',
                'email' => 'entrepot.rabat@darnaclean.ma',
                'manager_name' => 'Fatima Alaoui',
                'is_active' => true,
                'is_default' => false,
            ],
            [
                'name' => 'Entrepôt Marrakech',
                'code' => 'WH-MAR-01',
                'address' => 'Zone Industrielle Sidi Ghanem, Lot 45',
                'city' => 'Marrakech',
                'state' => 'Marrakech-Safi',
                'postal_code' => '40000',
                'country' => 'Morocco',
                'phone' => '+212524778899',
                'email' => 'entrepot.marrakech@darnaclean.ma',
                'manager_name' => 'Ahmed Tazi',
                'is_active' => true,
                'is_default' => false,
            ],
        ];

        foreach ($warehouses as $warehouseData) {
            Warehouse::create($warehouseData);
        }

        // Distribuer les stocks dans les entrepôts
        $products = Product::all();
        $warehouses = Warehouse::all();

        foreach ($products as $product) {
            $totalStock = $product->stock;
            
            foreach ($warehouses as $index => $warehouse) {
                // Répartir le stock: 60% à l'entrepôt principal, 25% et 15% aux autres
                if ($warehouse->is_default) {
                    $warehouseStock = (int) ($totalStock * 0.6);
                } elseif ($index === 1) {
                    $warehouseStock = (int) ($totalStock * 0.25);
                } else {
                    $warehouseStock = (int) ($totalStock * 0.15);
                }

                WarehouseStock::create([
                    'warehouse_id' => $warehouse->id,
                    'product_id' => $product->id,
                    'quantity' => $warehouseStock,
                    'reserved_quantity' => 0,
                    'minimum_stock' => max(10, (int) ($warehouseStock * 0.1)),
                    'maximum_stock' => $warehouseStock * 2,
                    'location' => 'A' . str_pad($product->id, 2, '0', STR_PAD_LEFT) . '-' . $warehouse->code,
                ]);
            }
        }

        $this->command->info('Entrepôts et stocks créés avec succès!');
    }
}
