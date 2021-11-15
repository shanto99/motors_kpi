<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Supervisors extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('Supervisors', function (Blueprint $table) {
            $table->id();
            $table->string('UserID');
            $table->string('SupervisorID');
            $table->foreign('UserID')->references('UserID')->on('UserManager');
            $table->foreign('SupervisorID')->references('UserID')->on('UserManager');
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
