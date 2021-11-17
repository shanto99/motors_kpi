<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Weight;

class MasterWeight extends Model
{
    use HasFactory;
    protected $table="MasterWeights";

    protected $primaryKey = "MasterWeightID";
    protected $guarded = [];

    public function weights()
    {
        return $this->hasMany(Weight::class, 'MasterWeightID', 'MasterWeightID');
    }
}
