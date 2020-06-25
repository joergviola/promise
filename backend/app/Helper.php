<?php

namespace App;

use Illuminate\Support\Facades\DB;

class Helper
{
    public static function updatePlanned($project_id) {
        API::provider('project')
            ->where('id', $project_id)
            ->update([
                'planned' => DB::raw('(SELECT SUM(planned) FROM task WHERE project_id=' . $project_id . ')')
            ]);

        API::provider('position')
            ->where('accounting.project_id', $project_id)
            ->where('accounting.state', 'NEW')
            ->join('accounting', 'accounting.id', '=', 'position.accounting_id')
            ->update([
                'position.planned' => DB::raw('(SELECT SUM(task.planned) FROM task WHERE (task.position_id IS NULL OR task.position_id=position.id) AND task.position=position.name AND task.project_id=accounting.project_id)'),
                'position.price' => DB::raw('(SELECT ROUND(SUM(task.planned)*(1.0+accounting.percentBuffer/100.0)*accounting.pricePerUnit, -accounting.rounding) FROM task WHERE (task.position_id IS NULL OR task.position_id=position.id) AND task.position=position.name AND task.project_id=accounting.project_id)'),
            ]);

        API::provider('accounting')
            ->where('accounting.project_id', $project_id)
            ->update([
                    'accounting.price' => DB::raw('(SELECT SUM(position.price) FROM position WHERE position.accounting_id=accounting.id AND position.accepted)'),
                ]);

    }
}
