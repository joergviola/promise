<?php

namespace App\Listeners;

use App\API;
use App\Events\ApiAfterCreateEvent;
use App\Events\ApiAfterUpdateEvent;
use App\Events\ApiBeforeCreateEvent;
use App\Events\ApiBeforeUpdateEvent;
use Illuminate\Support\Facades\DB;

/**
 * Update used on task and project
 */
class ActionEventSubscriber
{

    public function handleUpdate(ApiAfterUpdateEvent $event) {
        if ($event->type!='action') return;

        $this->updateUsed($event->item);
    }

    public function handleCreate(ApiAfterCreateEvent $event) {
        if ($event->type!='action') return;

        $this->updateUsed($event->item);
    }

    private function updateUsed($action) {
        if (empty($action['used'])) return;

        API::provider('task')
            ->where('id', $action['task_id'])
            ->update([
                'used' => DB::raw('(SELECT SUM(used) FROM action where task_id=' . $action['task_id'] . ')')
            ]);

        API::provider('project')
        ->where('id', $action['project_id'])
        ->update([
            'used' => DB::raw('(SELECT SUM(used) FROM task where project_id=' . $action['project_id'] . ')')
        ]);
    }
}
