<?php

namespace App\Listeners;

use App\API;
use App\Events\ApiAfterUpdateEvent;
use App\Events\ApiBeforeUpdateEvent;
use App\Helper;
use DateTime;
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
                $this->deleteInvoices($event->id);
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
                $invoicing = @$event->item['invoicing'] ?: $old->invoicing;
                $this->createInvoices($old, $invoicing);
                API::update('project', $old->project_id, ['state' => 'ACCEPTED']);
                break;

        }
    }

    private function deleteInvoices($accounting_id) {
        API::provider('accounting')
            ->where('reference_id', $accounting_id)
            ->where('state', 'NEW')
            ->delete();
    }

    private function createInvoices($accounting, $invoicing) {
        $project = API::read('project', $accounting->project_id);
        switch($invoicing) {
            case 'NONE':
                break;
            case 'ONE':
                $this->createInvoice($accounting, 0, $this->getDate($project->ends_at), 100, $accounting->price);
                break;
            case '30-40-30':
                $this->createInvoice($accounting, 0, $this->getDate($project->starts_at), 30, 0.3*$accounting->price);
                $this->createInvoice($accounting, 1, $this->getDate($project->ends_at), 40, 0.4*$accounting->price);
                $this->createInvoice($accounting, 2, $this->getDate($project->ends_at, 14), 30, 0.3*$accounting->price);
                break;
        }
    }

    private function getDate($s, $offset=0) {
        $date = new DateTime($s);
        if ($offset!=0) $date->modify("+$offset days");
        return $date;
    }

    private function createInvoice($accounting, $seq, $date, $part, $price) {
        \Log::info('Creating invoice', [$accounting, $seq, $date, $part, $price]);
        $old = API::query('accounting', [
            'and' => [
                'type' => 'INVOICE',
                'reference_id' => $accounting->id,
                'seq' => $seq,
            ]
        ]);
        if (count($old)==0) {
            API::create('accounting', [
                'type' => 'INVOICE',
                'state' => 'NEW',
                'name' => "Invoice #$seq",
                'price' => $price,
                'pricePerUnit' => $accounting->pricePerUnit,
                'percentBuffer' => $accounting->percentBuffer,
                'rounding' => $accounting->rounding,
                'part' => $part,
                'approved_at' => $date,
                'project_id' => $accounting->project_id,
                'reference_id' => $accounting->id,
                'seq' => $seq,
            ]);
        } else {
            $current = $old[0];
            if ($current->state=='NEW') {
                API::update('accounting', $current->id, [
                    'price' => $price,
                    'part' => $part,
                    'approved_at' => $date,
                ]);
            }
        }
    }

    public function handleAfterUpdate(ApiAfterUpdateEvent $event) {
        if ($event->type!='accounting') return;
        $old = API::read('accounting', $event->id);
        if ($old->type !== 'QUOTE') return;

        Helper::updatePlanned($old->project_id);
    }
}
