<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Weights extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('Weights', function (Blueprint $table) {
            $table->id('WeightID');
            $table->unsignedBigInteger('MasterWeightID');
            $table->unsignedBigInteger('CriteriaID');
            $table->unsignedBigInteger('SubCriteriaID')->nullable();
            $table->unsignedBigInteger('SubSubCriteriaID')->nullable();
            $table->double('Weight');
            $table->double('Target')->nullable();
            $table->double('Actual')->nullable();
            $table->string('Remarks')->nullable();
            $table->foreign('MasterWeightID')->references('MasterWeightID')->on('MasterWeights');
            $table->foreign('CriteriaID')->references('CriteriaID')->on('Criterias');
            $table->foreign('SubCriteriaID')->references('SubCriteriaID')->on('SubCriterias');
            $table->foreign('SubSubCriteriaID')->references('SubSubCriteriaID')->on('SubSubCriterias');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
