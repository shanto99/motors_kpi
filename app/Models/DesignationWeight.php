<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DesignationWeight extends Model
{
    use HasFactory;
    protected $table = 'DesignationWeights';
    protected $guarded = [];

    public function criteria()
    {
        return $this->belongsTo(Criteria::class, 'CriteriaID', 'CriteriaID');
    }

    public function subCriteria()
    {
        return $this->belongsTo(SubCriteria::class, 'SubCriteriaID', 'SubCriteriaID');
    }

    public function subSubCriteria()
    {
        return $this->belongsTo(SubSubCriteria::class, 'SubSubCriteriaID', 'SubSubCriteriaID');
    }
}
