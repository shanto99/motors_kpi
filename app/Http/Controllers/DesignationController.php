<?php

namespace App\Http\Controllers;

use App\Models\Designation;
use Illuminate\Http\Request;

class DesignationController extends Controller
{
    public function createDesignation(Request $request)
    {
        $request->validate([
            'Designation' => 'required'
        ]);

        $designation = Designation::create([
            'Designation' => $request->Designation
        ]);

        return response()->json([
            'designation' => $designation,
            'status' => 200
        ]);
    }

    public function getAllDesignations()
    {
        $designations = Designation::all();
        return response()->json([
            'designations' => $designations,
            'status' => 200
        ], 200);
    }
}
