<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TargetController extends Controller
{
    public function find_criteria($criteriaId, $subCriteriaId, $subSubCriteriaId, $weights)
    {
        $filteredWeights = array_filter($weights, function ($weight) use ($criteriaId, $subCriteriaId, $subSubCriteriaId) {
            if ($subSubCriteriaId) {
                return $weight['SubSubCriteriaID'] == $subSubCriteriaId;
            } else if ($subCriteriaId) {
                return $weight['SubCriteriaID'] == $subCriteriaId;
            } else {
                return $weight['CriteriaID'] == $criteriaId;
            }
        });

        return isset($filteredWeights[0]) ? $filteredWeights[0] : null;
    }
    public function post_targets(Request $request)
    {
        $targets = $request->targets;
        $user = Auth::user();

        $weights = $user->designation->weights->toArray();

        foreach ($targets as $target) {
            $criteriaId = $target['criteriaId'];
            $subCriteriaId = $target['subCriteriaId'];
            $subSubCriteriaId = $target['subSubCriteriaId'];

            $criteria = $this->find_criteria($criteriaId, $subCriteriaId, $subSubCriteriaId, $weights);

            if (!$criteria) return $target;

            if (!isset($criteria) || !$criteria) return $criteria;

            $user->targets()->create([
                'CriteriaID' => $criteriaId,
                'SubCriteriaID' => $subCriteriaId,
                'SubSubCriteriaID' => $subSubCriteriaId,
                'Weight' => $criteria['Weight'],
                'Target' => $target['target']
            ]);
        }

        return response()->json([
            'message' => 'Targets set successfully',
            'status' => 200
        ], 200);
    }
}
