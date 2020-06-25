<?php

namespace App\Listeners;

use App\API;
use App\Events\ApiAfterUpdateEvent;
use App\Helper;

/**
 * Update planned on task, project, position and price on position and accounting
 */
class PositionEventSubscriber
{

    public function handleUpdate(ApiAfterUpdateEvent $event) {
        if ($event->type!='position') return;

        $this->updatePlanned($event->id);
    }

    private function updatePlanned($id) {
        $position = API::read('position', $id);
        $accounting = API::read('accounting', $position->accounting_id);

        Helper::updatePlanned($accounting->project_id);
    }
}
