<?php

namespace App\Http\Controllers;

use App\Models\Criteria;
use App\Models\DesignationWeight;
use App\Models\SubCriteria;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CriteriaController extends Controller
{
    public function get_criterias()
    {
        $criterias = Criteria::with('sub_criterias', 'sub_criterias.sub_sub_criterias')->get();
        return response()->json([
            'criterias' => $criterias,
            'status' => 200
        ], 200);
    }

    public function create_criteria(Request $request)
    {
        try {
            if ($request->has('SubCriteriaID') && $request->SubCriteriaID !== null) {

                $subCriteriaWeight = DesignationWeight::where('SubCriteriaID', $request->SubCriteriaID)->where('SubSubCriteriaID', null)->first();
                if ($subCriteriaWeight) {
                    throw new Exception("Could not create criteria");
                }

                $subCriteria = SubCriteria::find($request->SubCriteriaID);
                $criteria = $subCriteria->sub_sub_criterias()->create([
                    'Name' => $request->Name,
                    'Remarks' => $request->Remarks
                ]);
            } else if ($request->has('CriteriaID') && $request->CriteriaID !== null) {
                $mainCriteriaWeight = DesignationWeight::where('CriteriaID', $request->SubCriteriaID)->where('SubCriteriaID', null)->first();
                if ($mainCriteriaWeight) {
                    throw new Exception("Could not create criteria");
                }
                $mainCriteria = Criteria::find($request->CriteriaID);
                $criteria = $mainCriteria->sub_criterias()->create([
                    'Name' => $request->Name,
                    'Remarks' => $request->Remarks
                ]);
            } else {
                $criteria = Criteria::create([
                    'Name' => $request->Name,
                    'Remarks' => $request->Remarks
                ]);
            }
        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'status' => 400
            ], 400);
        }

        return response()->json([
            'criteria' => $criteria,
            'status' => 200
        ], 200);
    }

    public function get_submitted_criteria_details()
    {
        $query = "select A.*,C.Name AS Criteria,B.Name AS SubCriteria,D.Name AS SubSubCriteria from AssignKPI A
                INNER JOIN SubCriterias B ON A.KPIID = B.SubCriteriaID
                INNER JOIN Criterias C ON C.CriteriaID = B.CriteriaID
                LEFT JOIN SubSubCriterias D ON D.SubCriteriaID = B.SubCriteriaID
                where A.UserID = '24221'";

        $result = DB::select(DB::raw($query));

        $detailCollection = collect($result);

        $groupedResult = $detailCollection->groupBy(['Criteria', 'SubCriteria', 'SubSubCriteria']);

        return response()->json([
            'result' => $groupedResult,
            'status' => 200
        ], 200);
    }
}
