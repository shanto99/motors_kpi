<?php

namespace App\Http\Controllers;

use App\Models\Criteria;
use App\Models\MonthPlan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KpiController extends Controller
{

    public function get_kpi($period)
    {
        $plan = MonthPlan::with(
            'targets.criteria',
            'targets.subCriteria',
            'targets.subSubCriteria',
            'approvals.user.designation',
            'user'
        )->where('UserID', Auth::user()->UserID)->where('Period', $period)->first();
        $targets = $plan->targets->toArray();
        $criterias = Criteria::with('sub_criterias.sub_sub_criterias')->get();
        $criterias = json_decode(json_encode($criterias), true);
        $employee = $plan->user;

        $approvals = $plan->approvals;

        return response()->json([
            'employee' => $employee,
            'approvals' => $approvals,
            'criterias' => $criterias,
            'targets' => $targets,
            'status' => 200
        ], 200);
    }

    public function getKpiById($kpiId)
    {
        $plan = MonthPlan::with('approvals.user.designation')->where('MonthPlanID', $kpiId)->first();
        $targets = $plan->targets->toArray();
        $criterias = Criteria::with('sub_criterias.sub_sub_criterias')->get();
        $criterias = json_decode(json_encode($criterias), true);
        $approvals = $plan->approvals;
        $employee = $plan->user;

        return response()->json([
            'employee' => $employee,
            'approvals' => $approvals,
            'criterias' => $criterias,
            'targets' => $targets,
            'status' => 200
        ], 200);
    }

    public function getPendingKpi()
    {
        $plans = MonthPlan::with('user', 'approvals.user')->where('PendingApproval', Auth::user()->UserID)->get();
        return response()->json([
            'plans' => $plans,
            'status' => 200
        ], 200);
    }

    public function approveKpi($planId)
    {
        $plan = MonthPlan::find($planId);
        $approvingUserId = $plan->PendingApproval;

        $approvingUser = User::find($approvingUserId);

        $plan->approvals()->create([
            'UserID' => $approvingUserId
        ]);

        $supervisors = Auth::user()->supervisors;

        $supervisorId = ($supervisors && count($supervisors) > 0) ? $supervisors[0]->SupervisorID : null;

        $plan->update([
            'PendingApproval' => $supervisorId
        ]);

        return response()->json([
            'message' => 'KPI approved successfully',
            'status' => 200
        ], 200);
    }
}
