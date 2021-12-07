<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class MonthPlan extends Model
{
    use HasFactory;
    protected $table = "MonthPlans";

    protected $primaryKey = "MonthPlanID";

    protected $guarded = [];

    public function targets()
    {
        return $this->hasMany(PlanTarget::class, 'MonthPlanID', 'MonthPlanID');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'UserID', 'UserID');
    }

    public function delete()
    {
        DB::transaction(function () {
            $this->targets()->delete();
            parent::delete();
        });
    }
}
