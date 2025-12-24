<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;
use App\Models\Holiday;

class SettingController extends Controller
{
    /**
     * Get working hours and holidays
     */
    public function getSettings()
    {
        $setting = Setting::first();

        return response()->json([
            'work_start' => $setting?->work_start,
            'work_end'   => $setting?->work_end,
            'holidays'   => Holiday::all(),
        ]);
    }

    /**
     * Update working hours
     */
    public function updateSettings(Request $request)
    {
        $request->validate([
            'work_start' => 'required',
            'work_end'   => 'required',
        ]);

        Setting::updateOrCreate(
            ['id' => 1],
            [
                'work_start' => $request->work_start,
                'work_end'   => $request->work_end,
            ]
        );

        return response()->json(['message' => 'Working hours updated']);
    }

    /**
     * Add holiday
     */
    public function addHoliday(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'recurring' => 'required|boolean',
        ]);

        Holiday::create([
            'date' => $request->date,
            'recurring' => $request->recurring,
        ]);

        return response()->json(['message' => 'Holiday added']);
    }

    /**
     * Delete holiday (optional but recommended)
     */
    public function deleteHoliday($id)
    {
        Holiday::findOrFail($id)->delete();
        return response()->json(['message' => 'Holiday removed']);
    }
}
