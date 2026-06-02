<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Models\MainCategory;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::query();

        if ($request->has('main_category_id')) {
            $query->where('main_category_id', $request->main_category_id);
        }

        return CategoryResource::collection($query->paginate(15));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'main_category_id' => ['required', 'exists:main_categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price_normal' => ['required', 'numeric', 'min:0'],
            'price_medium' => ['required', 'numeric', 'min:0'],
            'price_large' => ['required', 'numeric', 'min:0'],
        ]);

        $category = Category::create($data);

        return new CategoryResource($category);
    }

    public function show(Category $category)
    {
        return new CategoryResource($category);
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'main_category_id' => ['sometimes', 'required', 'exists:main_categories,id'],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price_normal' => ['sometimes', 'required', 'numeric', 'min:0'],
            'price_medium' => ['sometimes', 'required', 'numeric', 'min:0'],
            'price_large' => ['sometimes', 'required', 'numeric', 'min:0'],
        ]);

        $category->update($data);

        return new CategoryResource($category);
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return response()->noContent();
    }
}
