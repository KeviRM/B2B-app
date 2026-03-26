<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{

    use HasFactory;

    protected $fillable = [
        'category_id',
        'sku',
        'name',
        'description',
        'price',
        'stock',
        'image_url',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'price' => 'decimal:2',
    ];


    public function tiers()
    {
        return $this->hasMany(ProductTier::class)->orderBy('min_quantity', 'asc');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
