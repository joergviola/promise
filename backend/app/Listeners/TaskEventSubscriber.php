<?php

namespace App\Listeners;

use App\API;
use App\Events\ApiAfterCreateEvent;
use App\Events\ApiAfterUpdateEvent;
use App\Helper;
use Illuminate\Support\Facades\DB;

/**
 * Update planned
 */
class TaskEventSubscriber
{

    public function handleUpdate(ApiAfterUpdateEvent $event) {
        if ($event->type!='task') return;

        $task = API::read('task', $event->id);

        Helper::updatePlanned($task->project_id);
    }
}
