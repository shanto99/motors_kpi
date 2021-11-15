<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWeightsTable extends Migration
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
            $table->string('UserID');
            $table->unsignedBigInteger('CriteriaID');
            $table->unsignedBigInteger('SubCriteriaID');
            $table->unsignedBigInteger('SubSubCriteriaID');
            $table->integer('Weight');
            $table->foreign('UserID')->references('UserID')->on('UserManager');
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
        Schema::dropIfExists('weights');
    }
}
