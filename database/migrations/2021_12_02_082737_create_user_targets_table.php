<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserTargetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('UserTargets', function (Blueprint $table) {
            $table->id('UserTargetID');
            $table->string('UserID');
            $table->unsignedBigInteger('CriteriaID');
            $table->unsignedBigInteger('SubCriteriaID')->nullable();
            $table->unsignedBigInteger('SubSubCriteriaID')->nullable();
            $table->integer('Weight');
            $table->integer('Target');
            $table->integer('Actual')->nullable();
            $table->timestamps();

            $table->foreign('UserID')->references('UserID')->on('UserManager');
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
        Schema::dropIfExists('user_targets');
    }
}
