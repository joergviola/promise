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
                'planned' => DB::raw('(SELECT SUM(planned) FROM estimation where task_id=' . $estimation->task_id . ')')
            ]);

        API::provider('project')
        ->where('id', $estimation->project_id)
        ->update([
            'planned' => DB::raw('(SELECT SUM(planned) FROM task where project_id=' . $estimation->project_id . ')')
        ]);
    }
}
