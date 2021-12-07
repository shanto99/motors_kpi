<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supervisor extends Model
{
    use HasFactory;
    protected $table = "Supervisors";

    public function subordinate()
    {
        return $this->belongsTo(User::class, 'UserID', 'UserID');
    }

    public function supervisor()
    {
        return $this->belongsTo(User::class, 'SupervisorID', 'UserID');
    }
}
