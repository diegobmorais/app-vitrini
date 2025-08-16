<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('availability_rules', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('service_id');
            $table->tinyInteger('day_of_week');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('slot_duration')->default(60);
            $table->date('valid_from')->nullable();
            $table->date('valid_to')->nullable();
            $table->timestamps();

            $table->foreign('service_id')
                ->references('id')->on('services')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('availability_rules');
    }
};
