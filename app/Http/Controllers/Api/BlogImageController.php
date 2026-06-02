<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BlogImageController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:5120'],
        ]);

        $path = $data['image']->store('blog-images', 'public');

        return response()->json([
            'path' => $path,
            'img_url' => Storage::disk('public')->url($path),
        ], 201);
    }
}
