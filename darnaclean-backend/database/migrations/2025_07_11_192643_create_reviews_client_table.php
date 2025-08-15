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
        Schema::create('reviews_Client', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('city');
            $table->text('text_fr');
            $table->text('text_en');
            $table->text('text_ar');
            $table->unsignedTinyInteger('rating')->default(5);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews_client');
    }
};
