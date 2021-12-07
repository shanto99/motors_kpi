<?php

namespace App\Http\Controllers;

use App\Models\Criteria;
use App\Models\MonthPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KpiController extends Controller
{

    public function get_kpi($period)
    {
        $plan = MonthPlan::with('targets.criteria', 'targets.subCriteria', 'targets.subSubCriteria')->where('UserID', Auth::user()->UserID)->where('Period', $period)->first();
        $targets = $plan->targets->toArray();
        $criterias = Criteria::with('sub_criterias.sub_sub_criterias')->get();
        $criterias = json_decode(json_encode($criterias), true);

        return response()->json([
            'criterias' => $criterias,
            'targets' => $targets,
            'status' => 200
        ], 200);
    }
}
