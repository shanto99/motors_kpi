<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMasterWeightsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('MasterWeights', function (Blueprint $table) {
            $table->id('MasterWeightID');
            $table->string('AssignedBy');
            $table->string('UserID');
            $table->foreign('UserID')->references('UserID')->on('UserManager');
            $table->foreign('AssignedBy')->references('UserID')->on('UserManager');
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
        Schema::dropIfExists('master_weights');
    }
}
