<?php

namespace App\Listeners;

use App\API;
use App\Events\ApiAfterUpdateEvent;
use App\Events\ApiBeforeUpdateEvent;
use App\Helper;
use Illuminate\Support\Facades\DB;

/**
 * If SENT, assign tasks to positions
 * If NEW or REJECTED de-assign tasks
 * If ACCEPTED, accept project also and APPROVE tasks
 * Always update positions and projekt
 */
class OfferEventSubscriber
{

    public function handleUpdate(ApiBeforeUpdateEvent $event) {
        if ($event->type!='accounting') return;

        if (!isset($event->item['state'])) return;

        $old = API::read('accounting', $event->id);

        if ($old->type !== 'QUOTE') return;
        if ($old->state == $event->item['state']) return;

        switch ($event->item['state']) {
            case 'SENT':
                API::provider('task')
                    ->where('task.project_id', $old->project_id)
                    ->where('position.accounting_id', $old->id)
                    ->whereNull('task.position_id')
                    ->join('position', 'position.name', '=', 'task.position')
                    ->update([
                        'task.position_id' => DB::raw('position.id')
                    ]);
                Helper::updatePlanned($old->project_id);
                break;

            case 'NEW':
            case 'REJECTED':
                API::provider('task')
                    ->where('task.project_id', $old->project_id)
                    ->where('position.accounting_id', $old->id)
                    ->join('position', 'position.id', '=', 'task.position_id')
                    ->update([
                        'task.position_id' => null
                    ]);
                Helper::updatePlanned($old->project_id);
                break;

            case 'ACCEPTED':
                API::provider('task')
                    ->where('task.project_id', $old->project_id)
                    ->where('position.accounting_id', $old->id)
                    ->join('position', 'position.id', '=', 'task.position_id')
                    ->update([
                        'task.state' => 'APPROVED'
                    ]);
                API::update('project', $old->project_id, ['state' => 'ACCEPTED']);
                break;

        }
    }

    public function handleAfterUpdate(ApiAfterUpdateEvent $event) {
        if ($event->type!='accounting') return;
        $old = API::read('accounting', $event->id);
        if ($old->type !== 'QUOTE') return;

        Helper::updatePlanned($old->project_id);
    }
}
