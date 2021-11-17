<?php

namespace App\Http\Controllers;

use App\Models\Criteria;
use App\Models\SubCriteria;
use Illuminate\Http\Request;

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
        if($request->has('SubCriteriaID') && $request->SubCriteriaID !== null) {
            $subCriteria = SubCriteria::find($request->SubCriteriaID);
            $criteria = $subCriteria->sub_sub_criterias()->create([
               'Name' => $request->Name
            ]);
        } else if($request->has('CriteriaID') && $request->CriteriaID !== null) {
            $mainCriteria = Criteria::find($request->CriteriaID);
            $criteria = $mainCriteria->sub_criterias()->create([
               'Name' => $request->Name
            ]);
        } else {
            $criteria = Criteria::create([
               'Name' => $request->Name
            ]);
        }

        return response()->json([
            'criteria' => $criteria,
            'status' => 200
        ], 200);
    }
}
