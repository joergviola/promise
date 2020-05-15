<?php

namespace App\Listeners;

use App\API;
use App\Events\ApiAfterCreateEvent;
use App\Events\ApiAfterUpdateEvent;
use App\Helper;
use Illuminate\Support\Facades\DB;

/**
 * Update planned on task, project, position and price on position and accounting
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

        Helper::updatePlanned($estimation->project_id);
    }
}
