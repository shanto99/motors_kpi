<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Weight;
use Supervisors;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = "UserManager";

    protected $primaryKey = "UserID";

    public $keyType = "string";

    public $incrementing = false;

    protected $fillable = [
        'UserID',
        'UserName',
        'Password',
        'Designation',
        'Phone',
        'Portfolio',
        'Location',
        'Email',
        'Active',
        'Signature',
        'IsAdmin'
    ];

    protected $hidden = [
        'Password',
        'remember_token',
    ];

    public function supervisors()
    {
        return $this->hasMany(Supervisor::class, 'UserID', 'UserID');
    }

    public function designation()
    {
        return $this->belongsTo(Designation::class, 'Designation', 'DesignationID');
    }

    public function weights()
    {
        return $this->hasMany(Weight::class, 'UserID', 'UserID');
    }

    public function plans()
    {
        return $this->hasMany(MonthPlan::class, 'UserID', 'UserID');
    }

    public function subordinates()
    {
        return $this->hasMany(Supervisor::class, 'SupervisorID', 'UserID');
    }
}
