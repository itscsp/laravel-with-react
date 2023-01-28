<?php

namespace Database\Seeders;

use App\Models\Expense;
use Faker\Generator as Faker;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExpensesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(Faker $faker)
    {
        for ($i = 0; $i < 5; $i++) {
            Expense::create([
                'user_id' => 4,
                'expense_date' => $faker->date(),
                'description' => $faker->sentence,
                'amount' => $faker->randomFloat(2, 100, 10000),
            ]);
        }
    }
}
