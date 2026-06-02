<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BlogResource;
use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index()
    {
        return BlogResource::collection(
            Blog::latest()->paginate(15)
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'img_url' => ['nullable', 'url', 'max:255'],
        ]);

        $blog = Blog::create($data);

        return new BlogResource($blog);
    }

    public function show(Blog $blog)
    {
        return new BlogResource($blog);
    }

    public function update(Request $request, Blog $blog)
    {
        $data = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'body' => ['sometimes', 'required', 'string'],
            'img_url' => ['sometimes', 'nullable', 'url', 'max:255'],
        ]);

        $blog->update($data);

        return new BlogResource($blog);
    }

    public function destroy(Blog $blog)
    {
        $blog->delete();

        return response()->noContent();
    }
}
