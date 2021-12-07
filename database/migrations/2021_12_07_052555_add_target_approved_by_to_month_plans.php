<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTargetApprovedByToMonthPlans extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('MonthPlans', function (Blueprint $table) {
            $table->string('TargetApprovedBy')->nullable();
            $table->string('ApprovedBy')->nullable();
            $table->foreign('TargetApprovedBy')->references('UserID')->on('UserManager');
            $table->foreign('ApprovedBy')->references('UserID')->on('UserManager');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('month_plans', function (Blueprint $table) {
            //
        });
    }
}
