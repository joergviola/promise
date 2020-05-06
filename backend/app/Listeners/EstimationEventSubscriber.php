<?php

namespace App\Listeners;

use App\API;
use App\Events\ApiAfterCreateEvent;
use App\Events\ApiAfterUpdateEvent;
use Illuminate\Support\Facades\DB;

/**
 * Update used on task and project
 */
class EstimationEventSubscriber
{

    public function handleUpdate(ApiAfterUpdateEvent $event) {
        if ($event->type!='estimation') return;

        $this->updatePlanned($event->id);
    }

    public function handleCreate(ApiAfterCreateEvent $event) {
        if ($event->type!='estimation') return;

        $this->updatePlanned($event->id);
    }

    private function updatePlanned($id) {
        $estimation = API::read('estimation', $id);

        API::provider('task')
            ->where('id', $estimation->task_id)
            ->update([
                'planned' => DB::raw('(SELECT AVG(planned) FROM estimation WHERE task_id=' . $estimation->task_id . ')')
            ]);

        API::provider('project')
            ->where('id', $estimation->project_id)
            ->update([
                'planned' => DB::raw('(SELECT SUM(planned) FROM task WHERE project_id=' . $estimation->project_id . ')')
            ]);

        API::provider('position')
            ->where('accounting.project_id', $estimation->project_id)
            ->where('accounting.state', 'NEW')
            ->join('accounting', 'accounting.id', '=', 'position.accounting_id')
            ->update([
                'position.planned' => DB::raw('(SELECT SUM(task.planned) FROM task WHERE task.position=position.name)'),
                'position.price' => DB::raw('(SELECT ROUND(SUM(task.planned)*(1.0+accounting.percentBuffer/100.0)*accounting.pricePerUnit, -accounting.rounding) FROM task WHERE task.position=position.name)'),
            ]);

        API::provider('accounting')
            ->update([
                'accounting.price' => DB::raw('(SELECT SUM(position.price) FROM position WHERE position.accounting_id=accounting.id)'),
            ]);

    }
}
