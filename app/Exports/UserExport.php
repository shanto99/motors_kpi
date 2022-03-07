<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class UserExport implements FromArray, WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function array(): array
    {
        $mappedUsers = [];
        $users = User::with('supervisors', 'designation')->get();
        foreach ($users as $user) {
            array_push($mappedUsers, [
                'UserID' => $user->UserID,
                'UserName' => $user->UserName,
                'Designation' => $user->designation->Designation,
                'Supervisor' => $user->supervisors ? (isset($user->supervisors[0]) ? $user->supervisors[0]->SupervisorID : 'N/A') : 'N/A',
                'Email' => $user->Email,
                'Phone' => $user->Phone,
                'Portfolio' => $user->Portfolio,
                'Location' => $user->Location,
                'Active' => $user->Active
            ]);
        }

        return $mappedUsers;
    }

    public function headings(): array
    {
        return ["UserID", "UserName", "Designation", "Supervisor", "Email", "Phone", "Portfolio", "Location", "Active"];
    }
}
