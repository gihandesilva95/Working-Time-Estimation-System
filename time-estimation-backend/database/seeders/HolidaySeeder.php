<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Holiday;

class HolidaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Recurring holiday: 17 May
        Holiday::create([
            'date' => '2025-05-17',
            'recurring' => 1,
        ]);

        // One-time holiday: 27 May 2004
        Holiday::create([
            'date' => '2004-05-27'
        ]);
    }
}
