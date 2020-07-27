<?php

namespace App\Listeners;

use App\API;
use App\Events\ApiAfterCreateEvent;
use App\Events\ApiAfterReadEvent;
use App\Events\ApiAfterUpdateEvent;
use App\Events\ApiBeforeCreateEvent;
use App\Events\ApiBeforeUpdateEvent;
use App\Right;
use Illuminate\Support\Facades\DB;

/**
 * Update used on task and project
 * Delete booked time of others for non-admins
 */
class ActionEventSubscriber
{

    public function handleUpdate(ApiAfterUpdateEvent $event) {
        if ($event->type!='action') return;
        $old = API::read('action', $event->id);
        $this->updateUsed(get_object_vars($old));
    }

    public function handleCreate(ApiAfterCreateEvent $event) {
        if ($event->type!='action') return;

        $this->updateUsed($event->item);
    }

    public function handleQuery(ApiAfterReadEvent $event) {
        if ($event->type!='action') return;

        if (Right::canUser($event->user, 'action', 'ALL_TIMES')) return;

        foreach ($event->items as &$item) {
            if (!isset($item->user_id) || $item->user_id!=$event->user->id) {
                $item->used = null;
            }
        }
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
