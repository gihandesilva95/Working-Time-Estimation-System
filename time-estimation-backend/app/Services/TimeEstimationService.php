<?php

namespace App\Services;

use App\Models\Setting;
use App\Models\Holiday;
use Carbon\Carbon;

class TimeEstimationService
{
    public function calculate(string $startDateTime, float $estimateDays): string
    {
        $setting = Setting::firstOrFail();
        $holidays = Holiday::all();

        $workStart = Carbon::createFromFormat('H:i:s', $setting->work_start);
        $workEnd   = Carbon::createFromFormat('H:i:s', $setting->work_end);

        $secondsPerDay = $workEnd->diffInSeconds($workStart);
        $remainingSeconds = round(abs($estimateDays) * $secondsPerDay);

        $direction = $estimateDays >= 0 ? 1 : -1;
        $current = Carbon::parse($startDateTime);

        $dayStart = $current->copy()->setTimeFrom($workStart);
        $dayEnd   = $current->copy()->setTimeFrom($workEnd);


        if ($direction < 0) {
            // Backward calculation
            if ($current->gte($dayEnd)) {
                // AFTER working hours → SAME DAY end
                $current->setTimeFrom($workEnd);

            } elseif ($current->lte($dayStart)) {
                // BEFORE working hours → PREVIOUS day end
                $current->subDay()->setTimeFrom($workEnd);
            }
        } else {
            // Forward calculation
            if ($current->lte($dayStart)) {
                $current->setTimeFrom($workStart);

            } elseif ($current->gte($dayEnd)) {
                $current->addDay()->setTimeFrom($workStart);
            }
        }

        /**
         * BUSINESS TIME LOOP
         */
        while ($remainingSeconds > 0) {

            if ($this->isNonWorkingDay($current, $holidays)) {
                $current
                    ->addDay($direction)
                    ->setTimeFrom($direction > 0 ? $workStart : $workEnd);
                continue;
            }

            if ($direction > 0) {
                $availableSeconds = $current->diffInSeconds(
                    $current->copy()->setTimeFrom($workEnd)
                );
            } else {
                $availableSeconds = $current->diffInSeconds(
                    $current->copy()->setTimeFrom($workStart)
                );
            }

            if ($availableSeconds >= $remainingSeconds) {
                $current->addSeconds($remainingSeconds * $direction);
                break;
            }

            $remainingSeconds -= $availableSeconds;

            $current
                ->addDay($direction)
                ->setTimeFrom($direction > 0 ? $workStart : $workEnd);
        }

        return $current->format('d-m-Y H:i');
    }


    private function isNonWorkingDay(Carbon $date, $holidays): bool
    {
        // Weekends
        if ($date->isWeekend()) {
            return true;
        }

        foreach ($holidays as $holiday) {

            // One-time holiday (full date match)
            if (!$holiday->recurring && $date->format('Y-m-d') === $holiday->date) {
                return true;
            }

            // Recurring holiday (month-day match)
            if (
                $holiday->recurring &&
                $date->format('m-d') === Carbon::parse($holiday->date)->format('m-d')
            ) {
                return true;
            }
        }

        return false;
    }

}
