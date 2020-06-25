<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Feedback200624 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('task', function (Blueprint $table) {
            $table->string('category')->nullable()->comment('Structure for estimation');
            $table->boolean('percent')->default(false)->comment('Planned estimate in percent');
        });

        Schema::table('position', function (Blueprint $table) {
            $table->boolean('optional')->default(false)->comment('Customer is not required to accept this position');
            $table->boolean('accepted')->default(true)->comment('Customer has accepted this position (if optional=true)');
        });
        Schema::table('users', function (Blueprint $table) {
            $table->string('mobile')->nullable();
            $table->text('comment')->nullable();
        });
        Schema::table('project', function (Blueprint $table) {
            $table->text('links')->nullable()->comment('Working area, Teams, OneDrive etc, one on each line');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('task', function (Blueprint $table) {
            $table->dropColumn('category');
            $table->dropColumn('percent');
        });

        Schema::table('position', function (Blueprint $table) {
            $table->dropColumn('optional');
            $table->dropColumn('accepted');
        });
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('mobile');
            $table->dropColumn('comment');
        });
        Schema::table('project', function (Blueprint $table) {
            $table->dropColumn('links');
        });
    }
}
