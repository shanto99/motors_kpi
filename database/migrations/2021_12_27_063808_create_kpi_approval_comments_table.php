<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateKpiApprovalCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('KpiApprovalComments', function (Blueprint $table) {
            $table->id('KpiApprovalCommentID');
            $table->unsignedBigInteger('MonthPlanID');
            $table->string('UserID');
            $table->text('Comment');
            $table->timestamps();

            $table->foreign('UserID')->references('UserID')->on('UserManager');
            $table->foreign('MonthPlanID')->references('MonthPlanID')->on('MonthPlans');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('kpi_approval_comments');
    }
}
