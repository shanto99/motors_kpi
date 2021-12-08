<?php

namespace App\Http\Controllers;

use App\Models\User;
use Dotenv\Repository\RepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function create_user(Request $request)
    {
        $inputData = $request->only('UserID', 'UserName', 'Designation', 'Email');
        if (isset($request->Password) && $request->Password) $inputData['Password'] = Hash::make($request->Password);

        DB::beginTransaction();
        try {
            $user = User::find($inputData['UserID']);

            if ($request->hasFile('Signature')) {
                $signature = $request->Signature;
                $filename = $request->UserID . '.' . $signature->extension();
                $signature->move(public_path('signatures'), $filename);
                $signPath = 'public/signatures/' . $filename;
                $inputData['Signature'] = $signPath;
            }
            if ($user) {
                $user->update($inputData);
                $user->supervisors()->delete();
            } else {
                $user = User::create($inputData);
            }

            if ($request->has('Supervisor')) {
                DB::table('Supervisors')->insert([
                    'UserID' => $request->UserID,
                    'SupervisorID' => $request->Supervisor
                ]);
            }

            DB::commit();;
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Something went wrong',
                'status' => 500
            ], 500);
        }

        return response()->json([
            'user' => $user,
            'status' => 200
        ], 200);
    }

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

    public function logout()
    {
        Auth::logout();
        return response()->json([
            'status' => 200
        ]);
    }

    public function get_all_users()
    {
        $users = User::with('supervisors.supervisor')->get();
        return response()->json([
            'users' => $users,
            'status' => 200
        ], 200);
    }

    public function users_with_pagination($currentPage, $pagination, $searchKey = "")
    {
        $offset = ($currentPage - 1) * $pagination;
        //        if(Auth::user()->Designation) {
        //            $query = DB::table('UserManager')
        //                ->where('UserID', 'like', '%' . $searchKey . '%')
        //                ->orWhere('UserName', 'like', '%' . $searchKey . '%')->get()->toArray();
        //        } else {
        //            $query = Auth::user()->subordinatesWithCondition($searchKey)->toArray();
        //        }

        $query = DB::table('UserManager')
            ->where('UserID', 'like', '%' . $searchKey . '%')
            ->orWhere('UserName', 'like', '%' . $searchKey . '%')->get()->toArray();

        $totalCount = count($query);
        $users = array_slice($query, $offset, $pagination);

        $totalPage = ceil($totalCount / $pagination);

        return response()->json([
            'current_page' => (int)$currentPage,
            'total_count' => $totalCount,
            'total_page' => $totalPage,
            'data' => $users
        ]);
    }

    public function get_user_criteria($userId = null)
    {
        if ($userId) {
            $user = User::find($userId);
        } else {
            $user = Auth::user();
        }

        $user = User::with('designation.weights.criteria', 'designation.weights.subCriteria', 'designation.weights.subSubCriteria')->where('UserID', $user->UserID)->first();


        return response()->json([
            'criteria' => $user->designation->weights,
            'status' => 200
        ], 200);
    }
}
