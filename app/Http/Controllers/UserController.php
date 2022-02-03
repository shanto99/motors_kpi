<?php

namespace App\Http\Controllers;

use App\Exports\UserExport;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use \Excel;

class UserController extends Controller
{

    public function create_user(Request $request)
    {
        $inputData = $request->only('UserID', 'UserName', 'Designation', 'Email', 'Phone', 'Portfolio', 'Location');

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

            if ($request->has('Supervisor') && $request->Supervisor !== "null") {
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
        if (!$user) {
            return response()->json([
                'error' => 'Not Registered User',
                'status' => 400
            ], 400);
        }
        if ($user && Hash::check($request->Password, $user->Password)) {
            Auth::login($user, true);
            return response()->json([
                'user' => $user,
                'message' => 'User logged in successfully'
            ], 200);
        } else {
            return response()->json([
                'error' => 'Wrong password',
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

    public function subordinateUsers($userId)
    {
        $user = User::with('subordinates.subordinate')->where('UserID', $userId)->first();
        $subordinates = $user->subordinates;

        $subordianteUsers = [];

        if (isset($subordinates) && $subordinates) {
            foreach ($subordinates as $subordinate) {
                array_push($subordianteUsers, $subordinate->subordinate);
            }
        }

        return $subordianteUsers;
    }

    function getSubordinateForUser($user, $result = [])
    {
        $subordinates = $this->subordinateUsers($user->UserID);
        if (count($result) < 1) {
            foreach ($subordinates as $subordinate) {
                $subordinate->IsDirectSubordinate = true;
                array_push($result, $subordinate);
            }
        }

        if (count($subordinates) > 0) {
            for ($i = 0; $i < count($subordinates); $i++) {
                $result = $this->getSubordinateForUser($subordinates[$i], $result);
            }
        }

        $willAdd = true;
        for ($i = 0; $i < count($result); $i++) {
            if ($result[$i]->UserID == $user->UserID) $willAdd = false;
        }

        if ($willAdd) array_push($result, $user);

        return $result;
    }

    public function getSubordinates()
    {
        if (Auth::user()->IsAdmin == "1" || Auth::user()->IsApprover == "1") $allSubordinates = User::all()->toArray();
        else {
            $allSubordinates = $this->getSubordinateForUser(Auth::user());
        }

        return response()->json([
            'subordinates' => $allSubordinates,
            'status' => 200
        ], 200);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'password' => 'required'
        ]);

        $user = Auth::user();
        $user->update([
            'Password' => bcrypt($request->password)
        ]);

        return response()->json([
            'message' => 'Password updated successfully',
            'status' => 200
        ]);
    }

    public function exportUsers()
    {
        return Excel::download(new UserExport, 'users.xlsx');
    }
}
