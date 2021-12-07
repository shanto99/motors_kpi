<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanTarget extends Model
{
    use HasFactory;

    protected $table = "PlanTargets";
    protected $primaryKey = "PlanTargetID";

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
