<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OpeningHourResource;
use App\Models\OpeningHour;
use Illuminate\Http\Request;

class OpeningHourController extends Controller
{
    public function index()
    {
        return OpeningHourResource::collection(OpeningHour::paginate(15));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'setting_id' => ['required', 'exists:settings,id'],
            'day' => ['required', 'string', 'max:50'],
            'open_at' => ['nullable', 'date_format:H:i'],
            'close_at' => ['nullable', 'date_format:H:i'],
        ]);

        $openingHour = OpeningHour::create($data);

        return new OpeningHourResource($openingHour);
    }

    public function show(OpeningHour $openingHour)
    {
        return new OpeningHourResource($openingHour);
    }

    public function update(Request $request, OpeningHour $openingHour)
    {
        $data = $request->validate([
            'setting_id' => ['sometimes', 'required', 'exists:settings,id'],
            'day' => ['sometimes', 'required', 'string', 'max:50'],
            'open_at' => ['nullable', 'date_format:H:i'],
            'close_at' => ['nullable', 'date_format:H:i'],
        ]);

        $openingHour->update($data);

        return new OpeningHourResource($openingHour);
    }

    public function destroy(OpeningHour $openingHour)
    {
        $openingHour->delete();

        return response()->noContent();
    }
}
