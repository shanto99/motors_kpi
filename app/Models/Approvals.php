<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Approvals extends Model
{
    use HasFactory;

    protected $table = "Approvals";
    protected $primaryKey = "ApprovalID";

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class, 'UserID', 'UserID');
    }
}
