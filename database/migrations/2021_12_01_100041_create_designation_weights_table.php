<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDesignationWeightsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('DesignationWeights', function (Blueprint $table) {
            $table->id('DesignationWeightID');
            $table->unsignedBigInteger('DesignationID');
            $table->unsignedBigInteger('CriteriaID');
            $table->unsignedBigInteger('SubCriteriaID')->nullable();
            $table->unsignedBigInteger('SubSubCriteriaID')->nullable();
            $table->integer('Weight');
            $table->timestamps();

            $table->foreign('DesignationID')->references('DesignationID')->on('Designations');
            $table->foreign('CriteriaID')->references('CriteriaID')->on('Criterias');
            $table->foreign('SubCriteriaID')->references('SubCriteriaID')->on('SubCriterias');
            $table->foreign('SubSubCriteriaID')->references('SubSubCriteriaID')->on('SubSubCriterias');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('designation_weights');
    }
}
