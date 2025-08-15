<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name_fr');
            $table->string('name_ar');
            $table->string('name_en');
            $table->string('slug')->unique();
            $table->text('description_fr')->nullable();
            $table->text('description_ar')->nullable();
            $table->text('description_en')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->string('currency', 3)->default('MAD');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignId('subcategory_id')->nullable()->constrained('sub_categories')->onDelete('set null');
            $table->string('brand')->nullable();
            $table->string('sku')->unique();
            $table->integer('stock')->default(0);
            $table->json('images')->nullable();
            $table->boolean('featured')->default(false);
            $table->boolean('on_sale')->default(false);
            $table->json('badges')->nullable();
            $table->json('specifications')->nullable();
            $table->decimal('rating', 3, 1)->default(0);
            $table->integer('review_count')->default(0);
            $table->json('tags')->nullable();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->decimal('weight', 8, 2)->nullable();
            $table->json('dimensions')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['slug', 'is_active']);
            $table->index(['category_id', 'is_active']);
            $table->index(['subcategory_id', 'is_active']);
            $table->index(['brand', 'is_active']);
            $table->index(['featured', 'is_active']);
            $table->index(['on_sale', 'is_active']);
            $table->index(['price', 'is_active']);
            $table->index(['stock', 'is_active']);
            $table->index(['rating', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
