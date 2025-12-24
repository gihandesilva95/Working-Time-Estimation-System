<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model {

    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'engineer_id',
        'time_estimate',
        'start_time',
        'end_time'
    ];

    public function engineer() {
        return $this->belongsTo(User::class, 'engineer_id');
    }
}
