<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductTier extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'min_quantity',
        'price',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
