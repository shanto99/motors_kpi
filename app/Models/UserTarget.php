<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserTarget extends Model
{
    use HasFactory;

    protected $table = "UserTargets";
    protected $primaryKey = "UserTargetID";

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class, 'UserID', 'UserID');
    }

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
