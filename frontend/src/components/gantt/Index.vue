<template>
    <div>
        <div style="float: left">
            <div class="title-legend">Date</div>
            <div v-for="(p,i) in rows" :key="i" class="row-legend">{{p}}</div>
        </div>
        <div style="overflow: hidden">
            <svg id="gantt"></svg>
        </div>
    </div>
</template>


<script>
import Gantt from './gantt'

export default {
    name: 'Gantt',
    data() {
        return {
            rows: [
                'Projects', 'Test länger'
            ],
            tasks: [
                {
                    id: 'Task 1',
                    row: 0,
                    name: 'Redesign website',
                    start: '2020-06-28',
                    end: '2020-07-03',
                    custom_class: 'gantt-red'
                },
                {
                    id: 'Task 2',
                    row: 0,
                    name: 'Start website',
                    start: '2020-007-04',
                    end: '2020-07-10',
                },
                {
                    id: 'Task 2',
                    row: 0,
                    name: 'Start website',
                    start: '2020-007-04',
                    end: '2020-07-10',
                },
                {
                    id: 'Task 2',
                    row: 0,
                    name: 'Start website',
                    start: '2020-007-04',
                    end: '2020-07-10',
                },
                {
                    id: 'Task 3',
                    row: 1,
                    name: '3D Modelling',
                    start: '2020-007-01',
                    end: '2020-07-10',
                },
            ],
            options: {
                header_height: 50,
                column_width: 30,
                step: 24,
                view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
                bar_height: 20,
                bar_corner_radius: 3,
                arrow_curve: 5,
                padding: 18,
                view_mode: 'Day',   
                date_format: 'YYYY-MM-DD',
                custom_popup_html: null
            },
            gantt: null
        }
    },
    mounted() {
        this.gantt = new Gantt('#gantt', this.tasks, this.options)
    }
}
</script>

<style scoped>
.title-legend {
    border:1px solid #eeeeee; 
    padding: 5px; 
    font-size: 12px;
    padding-top: 37px;
}

.row-legend {
    border:1px solid #eeeeee; 
    padding: 9px 5px; 
    height: 18px;
    font-size: 12px;
}

</style>