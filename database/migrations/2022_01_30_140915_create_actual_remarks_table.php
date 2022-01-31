<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateActualRemarksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ActualRemarks', function (Blueprint $table) {
            $table->id('ActualRemarkID');
            $table->unsignedBigInteger('MonthPlanID');
            $table->text('Remarks');
            $table->timestamps();
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
        Schema::dropIfExists('actual_remarks');
    }
}
