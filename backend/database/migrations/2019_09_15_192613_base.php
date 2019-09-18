<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

include_once "StandardTable.php";

class Base extends Migration
{

    public function up()
    {
        StandardTable::create('customer', 'Customer', function (Blueprint $table) {
            $table->string('name');
            $table->text('address')->nullable();
            $table->string('website')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
        });

        StandardTable::create('project', 'Project.', function (Blueprint $table) {
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('state'); // NEW, ESTIMATED, QUOTED, REJECTED, ACCEPTED, STARTED, IMPLEMENTED, TESTED, PAYED
            $table->date('starts_at')->nullable();
            $table->date('ends_at')->nullable();
            $table->decimal('pricePerHour');
            $table->unsignedInteger('percentBuffer');
            $table->integer('customer_id')->unsigned();
            $table->integer('planned')->unsigned()->nullable();
            $table->integer('used')->unsigned()->nullable();
            $table->boolean('template')->default(false);

            $table->foreign('customer_id')->references('id')->on('customer');
        });

        StandardTable::create('accounting', 'Project quote or invoice.', function (Blueprint $table) {
            $table->string('type'); // QUOTE, INVOICE
            $table->string('state'); // OPEN, CLOSED, ACCEPTED, PAYED
            $table->string('name');
            $table->decimal('plannedPrice');
            $table->integer('project_id')->unsigned();

            $table->foreign('project_id')->references('id')->on('project');
        });

        StandardTable::create('position', 'Project quote or invoice position.', function (Blueprint $table) {
            $table->text('comment')->nullable();
            $table->integer('accounting_id')->unsigned();
            $table->integer('planned')->unsigned()->nullable();
            $table->decimal('plannedPrice');

            $table->foreign('accounting_id')->references('id')->on('accounting');
        });

        StandardTable::create('task', 'Project task.', function (Blueprint $table) {
            $table->string('name');
            $table->string('state'); // NEW, STARTED, IMPLEMENTED, TESTED, CLOSED
            $table->text('description')->nullable();
            $table->date('starts_at')->nullable();
            $table->date('due_at')->nullable();
            $table->date('finished_at')->nullable()->nullable();
            $table->integer('project_id')->unsigned()->nullable();
            $table->integer('user_id')->unsigned()->nullable();
            $table->integer('parent_id')->unsigned()->nullable();
            $table->integer('pos_project')->unsigned()->nullable();
            $table->integer('pos_user')->unsigned()->nullable();
            $table->integer('position_id')->unsigned()->nullable();
            $table->integer('planned')->unsigned()->nullable();
            $table->integer('risk')->unsigned()->nullable();
            $table->integer('used')->unsigned()->nullable();

            $table->foreign('project_id')->references('id')->on('project');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('position_id')->references('id')->on('position');
            $table->foreign('parent_id')->references('id')->on('task');
        });

        StandardTable::create('action', 'Project action.', function (Blueprint $table) {
            $table->text('comment')->nullable();
            $table->dateTime('from')->nullable();
            $table->dateTime('to')->nullable();
            $table->integer('user_id')->unsigned();
            $table->unsignedInteger('used')->nullable();
            $table->integer('project_id')->unsigned();
            $table->integer('task_id')->unsigned()->nullable();

            $table->foreign('project_id')->references('id')->on('project');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('task_id')->references('id')->on('task');
        });

        StandardTable::create('allocation', 'Project allocation.', function (Blueprint $table) {
            $table->text('comment')->nullable();
            $table->dateTime('from')->nullable();
            $table->dateTime('to')->nullable();
            $table->string('type'); // PROJECT, HOLIDAY, ILL
            $table->integer('percent')->unsigned()->nullable();
            $table->integer('project_id')->unsigned()->nullable();
            $table->integer('user_id')->unsigned();

            $table->foreign('project_id')->references('id')->on('project');
            $table->foreign('user_id')->references('id')->on('users');
        });
        Schema::table('users', function (Blueprint $table) {
            $table->integer('customer_id')->unsigned()->nullable();

            $table->foreign('customer_id')->references('id')->on('customer');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign('users_customer_id_foreign');
            $table->dropColumn('customer_id');
        });
        Schema::dropIfExists('allocation');
        Schema::dropIfExists('action');
        Schema::dropIfExists('task');
        Schema::dropIfExists('position');
        Schema::dropIfExists('accounting');
        Schema::dropIfExists('project');
        Schema::dropIfExists('customer');
    }
}
