<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SettingResource;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        return SettingResource::collection(Setting::paginate(15));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'address' => ['nullable', 'string'],
            'phone_number' => ['nullable', 'string', 'max:255'],
            'email_address' => ['nullable', 'email', 'max:255'],
            'tik_tok_url' => ['nullable', 'url', 'max:255'],
            'facebook_url' => ['nullable', 'url', 'max:255'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'x_url' => ['nullable', 'url', 'max:255'],
            'youtube_url' => ['nullable', 'url', 'max:255'],
        ]);

        $setting = Setting::create($data);

        return new SettingResource($setting);
    }

    public function show(Setting $setting)
    {
        return new SettingResource($setting);
    }

    public function update(Request $request, Setting $setting)
    {
        $data = $request->validate([
            'address' => ['sometimes', 'nullable', 'string'],
            'phone_number' => ['sometimes', 'nullable', 'string', 'max:255'],
            'email_address' => ['sometimes', 'nullable', 'email', 'max:255'],
            'tik_tok_url' => ['sometimes', 'nullable', 'url', 'max:255'],
            'facebook_url' => ['sometimes', 'nullable', 'url', 'max:255'],
            'instagram_url' => ['sometimes', 'nullable', 'url', 'max:255'],
            'x_url' => ['sometimes', 'nullable', 'url', 'max:255'],
            'youtube_url' => ['sometimes', 'nullable', 'url', 'max:255'],
        ]);

        $setting->update($data);

        return new SettingResource($setting);
    }

    public function destroy(Setting $setting)
    {
        $setting->delete();

        return response()->noContent();
    }
}
