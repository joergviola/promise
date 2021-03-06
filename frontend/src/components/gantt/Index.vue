<template>
    <div>
        <div style="float: left">
            <div class="title-legend">{{$t('ui.gantt.date')}}</div>
            <div v-for="(p,i) in rows" :key="i" class="row-legend">{{p}}</div>
        </div>
        <div ref="gantt"  style="overflow: hidden">
            <svg id="gantt"></svg>
        </div>
    </div>
</template>


<script>
import Gantt from './gantt'

export default {
    name: 'Gantt',
    props: {
        tasks: { type: Array, default: [] },
        rows: { type: Array, default: [] },
        view_mode: { type: String, default: 'Week' },
    },
    data() {
        const self = this
        return {
            options: {
                header_height: 50,
                column_width: 30,
                step: 24,
                rows: this.rows.length,
                view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
                bar_height: 20,
                bar_corner_radius: 3,
                arrow_curve: 5,
                padding: 18,
                view_mode: this.view_mode,   
                date_format: 'YYYY-MM-DD',
                language: 'de',
                custom_popup_html: "",
                on_click_back: function (event) {
                    self.$emit('clickBackground', event);
                },
                on_click: function (task) {
                    self.$emit('click', task);
                },
                on_date_change: function(task, start, end) {
                    self.$emit('update', task, start, end);
                },
                on_progress_change: function(task, progress) {
                    self.$emit('progress', task, progress);
                },
                on_view_change: function(mode) {
                    self.$emit('view', mode);
                }

            },
            gantt: null
        }
    },
    watch: {
        tasks() { this.gantt.refresh(this.tasks) },
        rows() { this.options.rows = this.rows.length; this.gantt.refresh(this.tasks) },
        view_mode() {
            this.gantt.change_view_mode(this.view_mode)
        }
    },
    methods: {
        reload() {
            if (this.gantt) {
                this.gantt.clear()
                delete this.gantt
            }
            this.$refs.gantt.innerHTML = '<svg id="gantt"></svg>';
            this.gantt = new Gantt('#gantt', this.tasks, this.options)
            this.gantt.change_view_mode(this.view_mode)
        }
    },
    mounted() {
        this.reload()
    }

}
</script>

<style scoped>
.title-legend {
    border:1px solid #eeeeee; 
    padding: 5px; 
    font-size: 12px;
    padding-top: 36px;
}

.row-legend {
    border:1px solid #eeeeee; 
    padding: 9px 5px; 
    height: 18px;
    font-size: 12px;
}

</style>