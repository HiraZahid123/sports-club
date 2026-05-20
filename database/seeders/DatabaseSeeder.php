<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);

        // Create a test Club
        $club = \App\Models\Club::create([
            'name' => 'Elite Taekwondo Academy',
            'slug' => 'elite-tkd',
            'email' => 'info@elitetkd.com',
            'phone' => '+1 234 567 890',
            'address' => '123 Martial Arts Way, Seoul',
        ]);

        // Create a test Manager
        $manager = User::factory()->create([
            'name' => 'John Manager',
            'email' => 'manager@example.com',
            'password' => bcrypt('password'),
            'club_id' => $club->id,
        ]);
        $manager->assignRole('Manager');

        // Create a test Coach
        $coach = User::factory()->create([
            'name' => 'Coach Carter',
            'email' => 'coach@example.com',
            'password' => bcrypt('password'),
            'club_id' => $club->id,
        ]);
        $coach->assignRole('Coach');

        // Create a test Parent
        $parent = User::factory()->create([
            'name' => 'Parent Smith',
            'email' => 'parent@example.com',
            'password' => bcrypt('password'),
            'club_id' => $club->id,
        ]);
        $parent->assignRole('Parent');


        // Create Training Groups
        $groupA = \App\Models\TrainingGroup::create([
            'club_id' => $club->id,
            'name' => 'Beginners Group',
            'monthly_price' => 50,
            'skill_level' => 'Beginner',
            'capacity' => 30,
        ]);

        $groupB = \App\Models\TrainingGroup::create([
            'club_id' => $club->id,
            'name' => 'Elite Sparring',
            'monthly_price' => 120,
            'skill_level' => 'Advanced',
            'capacity' => 15,
        ]);

        // Assign Coach to groups
        $coach->trainingGroups()->attach([$groupA->id, $groupB->id], ['role_in_group' => 'Coach']);

        // Create some Athletes and Subscriptions
        for ($i = 1; $i <= 10; $i++) {
            $athlete = User::factory()->create([
                'name' => "Athlete $i",
                'email' => "athlete$i@example.com",
                'club_id' => $club->id,
            ]);
            $athlete->assignRole('Athlete');
            $athlete->trainingGroups()->attach($groupA->id);

            // Link Athlete 1 to the Parent
            if ($i === 1) {
                $athlete->parents()->attach($parent->id, ['relationship' => 'Father']);
            }

            $sub = \App\Models\Subscription::create([
                'user_id' => $athlete->id,
                'club_id' => $club->id,
                'training_group_id' => $groupA->id,
                'plan_name' => 'Standard Monthly',
                'amount' => 50,
                'status' => ($i % 4 === 0) ? 'overdue' : 'active',
                'starts_at' => now()->subMonths(2),
                'next_payment_at' => ($i % 4 === 0) ? now()->subDays(5) : now()->addDays(25),
            ]);

            if ($sub->status === 'active') {
                \App\Models\Payment::create([
                    'subscription_id' => $sub->id,
                    'amount' => 50,
                    'payment_date' => now()->subDays(5),
                ]);
            }
        }
    }
}
