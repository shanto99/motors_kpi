<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubSubCriteria extends Model
{
    use HasFactory;
    protected $table = "SubSubCriterias";
    protected $primaryKey = "SubSubCriteriaID";

    protected $fillable = ['SubCriteriaID', 'Name', 'Remarks', 'Unit'];
}
