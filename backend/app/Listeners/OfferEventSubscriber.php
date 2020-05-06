<?php

namespace App\Listeners;

use App\API;
use App\Events\ApiBeforeUpdateEvent;

/**
 * If ACCEPTED, accept project also
 */
class OfferEventSubscriber
{

    public function handleUpdate(ApiBeforeUpdateEvent $event) {
        if ($event->type!='accounting') return;

        if (!isset($event->item['state'])) return;
        if ($event->item['state'] !== 'ACCEPTED') return;

        $old = API::read('accounting', $event->id);

        if ($old->type !== 'QUOTE') return;
        if ($old->state == $event->item['state']) return;

        API::update('project', $old->project_id, ['state' => 'ACCEPTED']);
    }
}
