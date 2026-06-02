<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MainCategoryResource;
use App\Models\MainCategory;
use Illuminate\Http\Request;

class MainCategoryController extends Controller
{
    public function index()
    {
        return MainCategoryResource::collection(MainCategory::with('categories')->paginate(15));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $mainCategory = MainCategory::create($data);

        return new MainCategoryResource($mainCategory);
    }

    public function show(MainCategory $mainCategory)
    {
        return new MainCategoryResource($mainCategory->load('categories'));
    }

    public function update(Request $request, MainCategory $mainCategory)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $mainCategory->update($data);

        return new MainCategoryResource($mainCategory);
    }

    public function destroy(MainCategory $mainCategory)
    {
        $mainCategory->delete();

        return response()->noContent();
    }
}
