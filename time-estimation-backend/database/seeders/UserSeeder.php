<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder {

    public function run(): void {

        User::create([
            'name' => 'Project Manager',
            'email' => 'pm@example.com',
            'password' => Hash::make('pm@123'),
            'role' => 'PM'
        ]);

        User::create([
            'name' => 'Engineer One',
            'email' => 'eng1@example.com',
            'password' => Hash::make('eng1@123'),
            'role' => 'Engineer'
        ]);

        User::create([
            'name' => 'Engineer Two',
            'email' => 'eng2@example.com',
            'password' => Hash::make('eng2@123'),
            'role' => 'Engineer'
        ]);
    }
}
