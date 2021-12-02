<?php

namespace App\Http\Controllers;

use App\Models\Designation;
use App\Models\DesignationWeight;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WeightController extends Controller
{
    public function assign_weights(Request $request)
    {
        $weights = $request->weights;
        $designationId = $request->designationId;

        DB::beginTransaction();
        try {
            DesignationWeight::where('DesignationID', $designationId)->delete();
            $designation = Designation::find($designationId);
            foreach ($weights as $weight) {
                $designation->weights()->create([
                    'CriteriaID' => $weight['CriteriaID'],
                    'SubCriteriaID' => $weight['SubCriteriaID'],
                    'SubSubCriteriaID' => $weight['SubSubCriteriaID'],
                    'Weight' => $weight['Weight']
                ]);
            }
            DB::commit();
            return response()->json([
                'message' => 'Weights assigned successfully',
                'status' => 200
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Could not assign weights',
                'status' => 500
            ], 500);
        }
    }

    public function get_weights($designationId)
    {

        $designation = Designation::find($designationId);

        return response()->json([
            'weights' => $designation->weights,
            'status' => 200
        ]);
    }
}
