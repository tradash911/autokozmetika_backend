<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\MainCategory;
use App\Models\Category;
use App\Models\Setting;
use App\Models\OpeningHour;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create the one admin user for API management.
        $admin = User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@example.com')],
            [
                'name' => env('ADMIN_NAME', 'Admin'),
                'password' => Hash::make(env('ADMIN_PASSWORD', 'password')),
            ]
        );

        // Seed a sample main category and a category for testing
        $main = MainCategory::firstOrCreate(
            ['name' => 'Cars'],
            ['description' => 'Main category for car sizes']
        );

        Category::firstOrCreate(
            ['main_category_id' => $main->id, 'name' => 'Sedan'],
            [
                'description' => 'Standard sedan size',
                'price_normal' => 100.00,
                'price_medium' => 150.00,
                'price_large' => 200.00,
            ]
        );

        $setting = Setting::updateOrCreate(
            ['id' => 1],
            [
                'address' => '123 Main Street, City',
                'phone_number' => '+1234567890',
                'email_address' => 'info@example.com',
                'tik_tok_url' => 'https://www.tiktok.com/@example',
                'facebook_url' => 'https://www.facebook.com/example',
                'instagram_url' => 'https://www.instagram.com/example',
                'x_url' => 'https://x.com/example',
                'youtube_url' => 'https://www.youtube.com/channel/example',
            ]
        );

        $hours = [
            'monday' => ['open_at' => '09:00', 'close_at' => '18:00'],
            'tuesday' => ['open_at' => '09:00', 'close_at' => '18:00'],
            'wednesday' => ['open_at' => '09:00', 'close_at' => '18:00'],
            'thursday' => ['open_at' => '09:00', 'close_at' => '18:00'],
            'friday' => ['open_at' => '09:00', 'close_at' => '18:00'],
            'saturday' => ['open_at' => '10:00', 'close_at' => '16:00'],
            'sunday' => ['open_at' => null, 'close_at' => null],
        ];

        foreach ($hours as $day => $times) {
            OpeningHour::updateOrCreate(
                ['setting_id' => $setting->id, 'day' => $day],
                [
                    'open_at' => $times['open_at'],
                    'close_at' => $times['close_at'],
                ]
            );
        }
    }
}
