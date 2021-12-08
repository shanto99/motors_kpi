<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApprovalsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('Approvals', function (Blueprint $table) {
            $table->id('ApprovalID');
            $table->unsignedBigInteger('MonthPlanID');
            $table->string('UserID');
            $table->timestamps();

            $table->foreign('MonthPlanID')->references('MonthPlanID')->on('MonthPlans');
            $table->foreign('UserID')->references('UserID')->on('UserManager');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('approvals');
    }
}
