<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KpiApprovalComment extends Model
{
    use HasFactory;
    protected $table = "KpiApprovalComments";
    protected $primaryKey = "KpiApprovalCommentID";

    protected $guarded = [];
}
