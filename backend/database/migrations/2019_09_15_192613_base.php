<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

include_once "StandardTable.php";

class Base extends Migration
{

    public function up()
    {
        StandardTable::create('organisation', 'Organisation', function (Blueprint $table) {
            $table->string('name');
            $table->text('address')->nullable();
            $table->string('website')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
        });

        StandardTable::create('project', 'Project.', function (Blueprint $table) {
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('state'); // LEAD, REJECTED, ACCEPTED, CLOSED
            $table->string('source')->nullable();
            $table->string('lost_reason')->nullable();
            $table->string('effort_unit')->nullable();
            $table->date('created_at')->nullable();
            $table->date('approved_at')->nullable(); // REJECTED OR ACCEPTED
            $table->date('starts_at')->nullable();
            $table->date('ends_at')->nullable();
            $table->integer('customer_id')->unsigned();
            $table->decimal('planned')->nullable();
            $table->decimal('used')->nullable();
            $table->boolean('template')->default(false);

            $table->foreign('customer_id')->references('id')->on('organisation');
        });

        StandardTable::create('accounting', 'Project quote or invoice.', function (Blueprint $table) {
            $table->string('type'); // QUOTE, INVOICE, PURCHASE
            $table->string('state'); // OPEN, APPROVED, ACCEPTED, REJECTED, PAYED
            $table->string('name');
            $table->decimal('pricePerUnit');
            $table->unsignedInteger('percentBuffer');
            $table->unsignedInteger('rounding'); // 0, 1, 10, 100
            $table->decimal('price')->nullable();
            $table->integer('project_id')->unsigned()->nullable();
            $table->decimal('part')->nullable(); // Rechnung: Teil des Angebotes 30%, 40%, 30%
            $table->date('approved_at')->nullable();
            $table->date('accepted_at')->nullable();
            $table->integer('reference_id')->unsigned()->nullable(); // Bei Rechnung ggf. welches Angebot?

            $table->foreign('project_id')->references('id')->on('project');
            $table->foreign('reference_id')->references('id')->on('accounting');
        });

        StandardTable::create('position', 'Project quote or invoice position.', function (Blueprint $table) {
            $table->integer('no')->unsigned()->nullable();
            $table->text('name')->nullable(); // String reference
            $table->text('comment')->nullable();
            $table->integer('accounting_id')->unsigned();
            $table->decimal('planned')->nullable();
            $table->decimal('price')->nullable();

            $table->foreign('accounting_id')->references('id')->on('accounting');
        });

        StandardTable::create('Payment', 'Customer payment.', function (Blueprint $table) {
            $table->integer('accounting_id')->unsigned();
            $table->decimal('payed')->nullable();
            $table->date('payed_at')->nullable();
            $table->text('comment')->nullable();

            $table->foreign('accounting_id')->references('id')->on('accounting');
        });

        StandardTable::create('task', 'Project task.', function (Blueprint $table) {
            $table->string('name');
            $table->string('type'); // SALES, DEV, BACKOFFICE
            $table->string('state'); // NEW, APPROVED, PLANNED, STARTED, IMPLEMENTED, TESTED, CLOSED
            $table->text('description')->nullable();
            $table->date('approved_at')->nullable(); // ab hier zählt es fpür den burndown
            $table->integer('approved_by')->unsigned()->nullable();
            $table->date('starts_at')->nullable();
            $table->date('due_at')->nullable();
            $table->date('finished_at')->nullable()->nullable(); // bis hier zählt es für den burndown
            $table->integer('finished_by')->unsigned()->nullable();
            $table->integer('project_id')->unsigned()->nullable();
            $table->integer('user_id')->unsigned()->nullable();
            $table->integer('parent_id')->unsigned()->nullable();
            $table->integer('sort_project')->unsigned()->nullable();
            $table->integer('sort_user')->unsigned()->nullable();
            $table->decimal('planned')->nullable();
            $table->decimal('used')->nullable();
            $table->boolean('purchased')->default(false);
            $table->decimal('price')->nullable();
            $table->string('supplier')->nullable();
            $table->string('position')->nullable(); // String reference to offer position
            $table->integer('position_id')->unsigned()->nullable(); // Accounting position that has been ACCEPTED

            $table->foreign('project_id')->references('id')->on('project');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('approved_by')->references('id')->on('users');
            $table->foreign('finished_by')->references('id')->on('users');
            $table->foreign('position_id')->references('id')->on('position');
            $table->foreign('parent_id')->references('id')->on('task');
        });

        StandardTable::create('estimation', 'Task estimation.', function (Blueprint $table) {
            $table->integer('project_id')->unsigned();
            $table->integer('task_id')->unsigned();
            $table->integer('user_id')->unsigned();
            $table->decimal('planned')->nullable();
            $table->decimal('risk')->nullable();
            $table->text('comment')->nullable();

            $table->foreign('project_id')->references('id')->on('project');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('task_id')->references('id')->on('task');
        });

        StandardTable::create('action', 'Project action.', function (Blueprint $table) {
            $table->text('comment')->nullable();
            $table->dateTime('from')->nullable();
            $table->dateTime('to')->nullable(); // from NOT NULL und to NULL: Timer läuft
            $table->integer('user_id')->unsigned();
            $table->decimal('used')->nullable();
            $table->integer('project_id')->unsigned();
            $table->integer('task_id')->unsigned()->nullable();
            $table->integer('position_id')->unsigned()->nullable(); // Rechnungsposition, wenn abgerechnet

            $table->foreign('project_id')->references('id')->on('project');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('task_id')->references('id')->on('task');
            $table->foreign('position_id')->references('id')->on('position');
        });

        StandardTable::create('allocation', 'Project allocation.', function (Blueprint $table) {
            $table->text('comment')->nullable();
            $table->dateTime('from')->nullable();
            $table->dateTime('to')->nullable();
            $table->string('type'); // PROJECT, HOLIDAY, ILL, CONTRACT
            $table->string('role')->nullable(); // SALES, PL, DEV, CUSTOMER
            $table->integer('parttime')->unsigned()->nullable(); // in %
            $table->integer('project_id')->unsigned()->nullable();
            $table->integer('user_id')->unsigned();
            $table->decimal('salary')->nullable();

            $table->foreign('project_id')->references('id')->on('project');
            $table->foreign('user_id')->references('id')->on('users');
        });
        Schema::table('users', function (Blueprint $table) {
            $table->integer('organisation_id')->unsigned()->nullable();
            $table->text('address')->nullable();
            $table->string('phone')->nullable();
            $table->integer('parttime')->unsigned()->nullable(); // in %

            $table->foreign('organisation_id')->references('id')->on('organisation');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign('users_organisation_id_foreign');
            $table->dropColumn('organisation_id');
            $table->dropColumn('address');
            $table->dropColumn('phone');
        });
        Schema::dropIfExists('allocation');
        Schema::dropIfExists('action');
        Schema::dropIfExists('estimation');
        Schema::dropIfExists('task');
        Schema::dropIfExists('position');
        Schema::dropIfExists('payment');
        Schema::dropIfExists('accounting');
        Schema::dropIfExists('project');
        Schema::dropIfExists('organisation');
    }
}
