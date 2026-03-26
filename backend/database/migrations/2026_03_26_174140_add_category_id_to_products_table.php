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
       Schema::table('products', function (Blueprint $table) {
            // 1. Primero creamos la columna y le decimos EXPLÍCITAMENTE que acepta nulos
            $table->unsignedBigInteger('category_id')->nullable();
            
            // 2. Después le decimos que esa columna es una llave foránea
            $table->foreign('category_id')
                  ->references('id')
                  ->on('categories')
                  ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {

            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
        });
    }
};
