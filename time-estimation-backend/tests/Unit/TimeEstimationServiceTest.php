<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\TimeEstimationService;
use App\Models\Setting;
use App\Models\Holiday;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TimeEstimationServiceTest extends TestCase
{
    use RefreshDatabase;

    protected TimeEstimationService $service;

    protected function setUp(): void
    {
        parent::setUp();

        // Company working hours: 08:00 - 16:00 (8 hours)
        Setting::create([
            'work_start' => '08:00:00',
            'work_end'   => '16:00:00',
        ]);

        // Recurring holiday: every 17 May
        Holiday::create([
            'date' => '2000-05-17',
            'recurring' => 1,
        ]);

        // One-time holiday: 27 May 2004
        Holiday::create([
            'date' => '2004-05-27',
            'recurring' => 0,
        ]);

        $this->service = app(TimeEstimationService::class);
    }

    /** @test */
    public function scenario_1_negative_5_point_5_days()
    {
        $result = $this->service->calculate(
            '2004-05-24 18:05',
            -5.5
        );

        $this->assertEquals('14-05-2004 12:00', $result);
    }

    /** @test */
    public function scenario_2_large_positive_fraction()
    {
        $result = $this->service->calculate(
            '2004-05-24 19:03',
            44.723656
        );

        $this->assertEquals('27-07-2004 13:47', $result);
    }

    /** @test */
    public function scenario_3_negative_fractional_days()
    {
        $result = $this->service->calculate(
            '2004-05-24 18:03',
            -6.7470217
        );

        $this->assertEquals('13-05-2004 10:01', $result);
    }

    /** @test */
    public function scenario_4_positive_fractional_days()
    {
        $result = $this->service->calculate(
            '2004-05-24 08:03',
            12.782709
        );

        $this->assertEquals('10-06-2004 14:18', $result);
    }

    /** @test */
    public function scenario_5_start_before_working_hours()
    {
        $result = $this->service->calculate(
            '2004-05-24 07:03',
            8.276628
        );

        $this->assertEquals('04-06-2004 10:12', $result);
    }
}
