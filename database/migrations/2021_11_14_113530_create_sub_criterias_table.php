<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubCriteriasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('SubCriterias', function (Blueprint $table) {
            $table->id('SubCriteriaID');
            $table->unsignedBigInteger('CriteriaID');
            $table->string('Name');
            $table->foreign('CriteriaID')->references('CriteriaID')->on('Criterias');
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
        Schema::dropIfExists('sub_criterias');
    }
}
