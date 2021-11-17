<?php

namespace App\Http\Controllers;

use App\Models\MasterWeight;
use App\Models\User;
use App\Models\Weight;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class WeightController extends Controller
{
    public function assign_weights(Request $request)
    {
        $weights = $request->weights;
        $userId = $request->userId;

        DB::beginTransaction();
        try {
            $date = Carbon::today();

            $startOfMonth = $date->copy()->startOfMonth();
            $endOfMonth = $date->copy()->endOfMonth();

            $masterWeight = MasterWeight::where('UserID', $userId)->whereBetween('created_at', [
                $startOfMonth, $endOfMonth
            ])->first();

            if($masterWeight) {
                $masterWeight->weights()->delete();
                $masterWeight->delete();
            }

            $masterWeight = MasterWeight::create([
                'UserID' => $userId,
                'AssignedBy' => Auth::user()->UserID
            ]);
            foreach ($weights as $weight) {
                $masterWeight->weights()->create([
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
             ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
               'error' => 'Something went wrong',
               'status' => 500
            ], 500);
        }
    }

    public function get_weights($userId)
    {
        $today = Carbon::today();
        $startOfMonth = $today->copy()->startOfMonth();
        $endOfMonth = $today->copy()->endOfMonth();

        $masterWeight = MasterWeight::with('weights')->where('UserID', $userId)->whereBetween('created_at', [$startOfMonth, $endOfMonth])->first();

        return response()->json([
           'weight' => $masterWeight,
           'status' => 200
        ]);
    }
}
