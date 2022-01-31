<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Criteria extends Model
{
    use HasFactory;
    protected $table = "Criterias";
    protected $primaryKey = "CriteriaID";

    protected $fillable = ['Name', 'Weight', 'Remarks', 'Unit'];

    public function sub_criterias()
    {
        return $this->hasMany(SubCriteria::class, 'CriteriaID', 'CriteriaID');
    }
}
