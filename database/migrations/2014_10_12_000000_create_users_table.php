<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('UserManager', function (Blueprint $table) {
            $table->id();
            $table->string('UserID')->unique();
            $table->string('UserName');
            $table->string('Designation');
            $table->string('Email');
            $table->string('Phone');
            $table->string('Portfolio');
            $table->string('Location');
            $table->string('Active')->default('Y');
            $table->boolean('IsAdmin')->default(false);
            $table->boolean('IsApprover')->default(false);
            $table->string('Password');
            $table->rememberToken();
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
        Schema::dropIfExists('users');
    }
}
