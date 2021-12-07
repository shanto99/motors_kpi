<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMonthPlansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('MonthPlans', function (Blueprint $table) {
            $table->id('MonthPlanID');
            $table->string('UserID');
            $table->string('Period');
            $table->timestamps();
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
        Schema::dropIfExists('month_plans');
    }
}
