<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubCriteria extends Model
{
    use HasFactory;
    protected $table = "SubCriterias";
    protected $primaryKey = "SubCriteriaID";

    protected $fillable = ['Name', 'CriteriaID'];

    public function criteria()
    {
        return $this->belongsTo(Criteria::class, 'CriteriaID', 'CriteriaID');
    }

    public function sub_sub_criterias()
    {
        return $this->hasMany(SubSubCriteria::class, 'SubCriteriaID', 'SubCriteriaID');
    }
}
