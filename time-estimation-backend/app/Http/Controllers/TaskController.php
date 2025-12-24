<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use App\Services\TimeEstimationService;
use Carbon\Carbon;

class TaskController extends Controller {

    public function listTasks(Request $request) {
        $user = $request->user();

        if ($user->role === 'PM') {
            return Task::with('engineer')->get(); 
        }

        return Task::where('engineer_id', $user->id)->with('engineer')->get();
    }

    public function assignTask(Request $request) {

        $request->validate([
            'title' => 'required',
            'engineer_id' => 'required|exists:users,id'
        ]);

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'engineer_id' => $request->engineer_id
        ]);

        return response()->json($task);
    }

    public function submitEstimate(Request $request, $id) {

        $request->validate([
            'time_estimate' => 'required|numeric'
        ]);

        $task = Task::findOrFail($id);

        if ($task->engineer_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $task->update([
            'time_estimate' => $request->time_estimate
        ]);

        return response()->json($task);
    }

    public function calculateEndTime(Request $request, $id, TimeEstimationService $service) {

        $request->validate([
            'start_time' => 'required|date'
        ]);

        $task = Task::findOrFail($id);

        if (!$task->time_estimate) {
            return response()->json(['message' => 'Estimate missing'], 400);
        }

        $endTime = $service->calculate(
            $request->start_time,
            $task->time_estimate
        );

        $task->update([
            'start_time' => Carbon::parse($request->start_time)->format('Y-m-d H:i:s'),
            'end_time' => Carbon::parse($endTime)->format('Y-m-d H:i:s')
        ]);

        return response()->json([
            'end_time' => $endTime
        ]);
    }
}
