<?php

namespace App\Http\Controllers;

use App\Models\Criteria;
use App\Models\MonthPlan;
use App\Models\User;
use Carbon\Carbon;
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
            'user',
            'actualRemarks'
        )->where('UserID', Auth::user()->UserID)->where('Period', $period)->first();
        $targets = $plan->targets->toArray();
        $criterias = Criteria::with('sub_criterias.sub_sub_criterias')->get();
        $criterias = json_decode(json_encode($criterias), true);
        $employee = $plan->user;
        $remarks = $plan->actualRemarks;

        $approvals = $plan->approvals;

        return response()->json([
            'employee' => $employee,
            'approvals' => $approvals,
            'criterias' => $criterias,
            'targets' => $targets,
            'remarks' => $remarks,
            'status' => 200
        ], 200);
    }

    public function getKpiById($kpiId)
    {
        $plan = MonthPlan::with('approvals.user.designation, actualRemarks')->where('MonthPlanID', $kpiId)->first();
        $targets = $plan->targets->toArray();
        $criterias = Criteria::with('sub_criterias.sub_sub_criterias')->get();
        $criterias = json_decode(json_encode($criterias), true);
        $approvals = $plan->approvals;
        $employee = $plan->user;
        $remarks = $plan->actualRemarks;

        return response()->json([
            'employee' => $employee,
            'approvals' => $approvals,
            'criterias' => $criterias,
            'targets' => $targets,
            'remarks' => $remarks,
            'status' => 200
        ], 200);
    }

    public function getUserKpiByPeriod($userId, $period)
    {
        $plan = MonthPlan::with(
            'targets.criteria',
            'targets.subCriteria',
            'targets.subSubCriteria',
            'approvals.user.designation',
            'user',
            'actualRemarks'
        )->where('UserID', $userId)->where('Period', $period)->first();
        if (!$plan) return response()->json([
            'kpi' => null,
            'status' => 200
        ], 200);
        $targets = $plan->targets->toArray();
        $criterias = Criteria::with('sub_criterias.sub_sub_criterias')->get();
        $criterias = json_decode(json_encode($criterias), true);
        $approvals = $plan->approvals;
        $employee = $plan->user;
        $remarks = $plan->actualRemarks;

        return response()->json([
            'employee' => $employee,
            'approvals' => $approvals,
            'criterias' => $criterias,
            'targets' => $targets,
            'remarks' => $remarks,
            'status' => 200
        ], 200);
    }

    public function getPendingKpi()
    {
        if (Auth::user()->IsApprover == "1") {
            $plans = MonthPlan::with('user', 'approvals.user')->where('PendingApproval', '!=', null)->get();
        } else {
            $plans = MonthPlan::with('user', 'approvals.user')->where('PendingApproval', Auth::user()->UserID)->get();
        }

        return response()->json([
            'plans' => $plans,
            'status' => 200
        ], 200);
    }

    public function approveKpi(Request $request)
    {
        $planId = $request->kpiId;
        $comment = $request->comment;

        $plan = MonthPlan::find($planId);
        $approvingUserId = $plan->PendingApproval;

        $approvingUser = Auth::user();

        if (!($approvingUser->UserID == $approvingUserId || $approvingUser->IsApprover == "1")) {
            return response()->json([
                'error' => 'Something went wrong',
                'status' => 400
            ], 400);
        }

        $approvingUserId = $approvingUser->UserID;

        $plan->comments()->create([
            'UserID' => $approvingUserId,
            'Comment' => $comment
        ]);

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

    public function report($userId, $from, $to)
    {
        $reports = [];
        $from = Carbon::createFromFormat('Y-m-d', $from);
        $to = Carbon::createFromFormat('Y-m-d', $to);

        $plans = MonthPlan::with('targets')->where('UserID', $userId)->where('PendingApproval', null)->whereBetween('PeriodDate', [$from, $to])->get();

        foreach ($plans as $plan) {
            $report = [];
            $report['period'] = $plan->Period;
            $totalScore = 0;
            foreach ($plan->targets as $t) {
                $actual = (float)$t->Actual;
                $target = (float)$t->Target;
                $weight = (float)$t->Weight;

                $score = ($actual / $target) * $weight;
                $totalScore += $score;
            }

            $report['score'] = round($totalScore, 2);
            array_push($reports, $report);
        }

        return response()->json([
            'periods' => $reports,
            'status' => 200
        ], 200);
    }
}
