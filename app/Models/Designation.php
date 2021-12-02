<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Designation extends Model
{
    use HasFactory;
    protected $table = "Designations";
    protected $primaryKey = "DesignationID";

    protected $fillable = ['Designation'];

    public function weights()
    {
        return $this->hasMany(DesignationWeight::class, 'DesignationID', 'DesignationID');
    }
}
