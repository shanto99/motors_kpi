<?php

namespace App\Http\Controllers;

use App\Models\MonthPlan;
use App\Models\PlanTarget;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TargetController extends Controller
{
    public function find_criteria($criteriaId, $subCriteriaId, $subSubCriteriaId, $weights)
    {
        $filteredWeights = [];
        for ($i = 0; $i < count($weights); $i++) {
            $weight = $weights[$i];
            if (
                $weight['CriteriaID'] == $criteriaId &&
                $weight['SubCriteriaID'] == $subCriteriaId &&
                $weight['SubSubCriteriaID'] == $subSubCriteriaId
            ) {
                array_push($filteredWeights, $weight);
            }
        }

        return isset($filteredWeights[0]) ? $filteredWeights[0] : null;
    }
    public function post_targets(Request $request)
    {
        $targets = $request->targets;
        $user = Auth::user();

        $period = $request->period;

        $existingPlan = MonthPlan::where('UserID', $user->UserID)->where('Period', $period)->first();
        if ($existingPlan) {
            $existingPlan->delete();
        }

        $plan = $user->plans()->create([
            'Period' => $period
        ]);


        $weights = $user->designation->weights->toArray();

        foreach ($targets as $target) {
            $criteriaId = $target['CriteriaID'];
            $subCriteriaId = $target['SubCriteriaID'];
            $subSubCriteriaId = $target['SubSubCriteriaID'];

            $criteria = $this->find_criteria($criteriaId, $subCriteriaId, $subSubCriteriaId, $weights);

            $plan->targets()->create([
                'CriteriaID' => $criteriaId,
                'SubCriteriaID' => $subCriteriaId,
                'SubSubCriteriaID' => $subSubCriteriaId,
                'Weight' => $criteria['Weight'],
                'Target' => $target['Target']
            ]);
        }

        return response()->json([
            'message' => 'Targets set successfully',
            'status' => 200
        ], 200);
    }


    public function getTargets($period)
    {
        $userId = Auth::user()->UserID;
        $userPlan = MonthPlan::with('targets', 'approvals')->where('UserID', $userId)->where('Period', $period)->first();

        return response()->json([
            'plan' => $userPlan,
            'status' => 200
        ], 200);
    }

    public function postActuals(Request $request)
    {
        $planId = $request->planId;
        $actuals = $request->actuals;

        DB::beginTransaction();

        try {
            $supervisors = Auth::user()->supervisors;

            if ($supervisors && count($supervisors) > 0) {
                $supervisor = $supervisors[0]->SupervisorID;
            }

            $monthPlan = MonthPlan::find($planId);

            if (!$monthPlan->TargetApprovedBy) {
                return response()->json([
                    'error' => 'Targets are not approved yet',
                    'status' => 400
                ], 400);
            }

            $monthPlan->update([
                'PendingApproval' => $supervisor
            ]);

            foreach ($actuals as $actual) {
                $target = PlanTarget::find($actual['PlanTargetID']);
                $target->update([
                    'Actual' => $actual['Actual']
                ]);
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Could not submit actual',
                'status' => 500
            ], 500);
        }



        return response()->json([
            'message' => 'Actuals submitted successfully',
            'status' => 200
        ], 200);
    }

    public function getPendingTargets()
    {
        $subrodinates = Auth::user()->subordinates->pluck('UserID');
        $plans = MonthPlan::with('user')->where('TargetApprovedBy', null)->whereIn('UserID', $subrodinates)->get();
        return response()->json([
            'plans' => $plans
        ]);
    }

    public function getTargetDetails($planId)
    {
        $plan = MonthPlan::with('targets')->where('MonthPlanID', $planId)->first();
        return response()->json([
            'plan' => $plan,
            'status' => 200
        ], 200);
    }

    public function approveTargets(Request $request)
    {
        $planId = $request->planId;
        $targets = $request->targets;

        $monthPlan = MonthPlan::find($planId);
        DB::beginTransaction();
        try {
            $monthPlan->update([
                'TargetApprovedBy' => Auth::user()->UserID
            ]);
            $monthPlan->targets()->delete();
            foreach ($targets as $target) {
                $monthPlan->targets()->create([
                    'CriteriaID' => $target['CriteriaID'],
                    'SubCriteriaID' => $target['SubCriteriaID'],
                    'SubSubCriteriaID' => $target['SubSubCriteriaID'],
                    'Weight' => $target['Weight'],
                    'Target' => $target['Target']
                ]);
            }
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Could not approve targets',
                'status' => 500
            ], 500);
        }

        return response()->json([
            'message' => 'Targets approved successfully',
            'status' => 200
        ], 200);
    }
}