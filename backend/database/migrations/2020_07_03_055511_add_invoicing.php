<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddInvoicing extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('accounting', function (Blueprint $table) {
            $table->string('invoicing')->nullable()->comment('Invoicing rule: NONE, ONE, 30-40-30');
            $table->string('no')->nullable()->comment('Document Number');
            $table->integer('seq')->nullable()->comment('Document Sequence');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('accounting', function (Blueprint $table) {
            $table->dropColumn('invoicing');
            $table->dropColumn('no');
            $table->dropColumn('seq');
        });
    }
}
