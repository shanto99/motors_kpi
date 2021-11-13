<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'UserID' => 'required',
            'Password' => 'required'
        ]);

        $user = User::where('UserID', $request->UserID)->first();
        if ($user && Hash::check($request->Password, $user->Password)) {
            Auth::login($user, true);
            return response()->json([
                'message' => 'User logged in successfully'
            ], 200);
        } else {
            return response()->json([
                'error' => 'Invalid credentials',
                'status' => 400
            ], 400);
        }
    }

    public function get_user()
    {
        return response()->json([
            'user' => Auth::user(),
            'status' => 200
        ], 200);
    }
}
