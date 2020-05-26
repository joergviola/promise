
<script>
import { Line } from 'vue-chartjs'
import api from '@/api'

export default {
  name: 'Burndown',
  extends: Line,
  props: ['id', 'height'],
  data() {
      return {
          graph: {
            labels: ['January', 'February'],
            datasets: [
                {
                label: 'Burndown',
                backgroundColor: '#00A4FF',
                data: [40, 20]
                },
                {
                label: 'Used',
                backgroundColor: '#f87979',
                data: [10, 20]
                },
                {
                label: 'Effort',
                backgroundColor: '#DDDDDD',
                data: [10, 20]
                },
            ]
          },
          project: null,
      }
  },
  methods: {
    async prepareData() {
      await this.loadProject()
      const days = {}
      this.calcPlannedDiff(days)
      this.calcEffort(days)
      this.calcPlanned(days)
    },
    calcPlanned(data) {
      const days = Object.keys(data)
      const diffs = days
        .sort()
        .map(day => data[day])
      let planned = 0
      let check = 0
      let used = 0
      let total = 0
      diffs.forEach(diff => {
        if (diff.planned) {
          planned += diff.planned
        }
        diff.planned = planned
        if (diff.check) {
          check += diff.check
        }
        diff.check = check
        total = Math.max(total, planned)
        if (!diff.used) {
          diff.used = 0
        }
      })
      this.graph.labels = diffs.map(diff => diff.day)
      this.graph.datasets[0].data = diffs.map(diff => diff.planned)
      this.graph.datasets[1].data = diffs.map(diff => diff.check)
      this.graph.datasets[2].data = diffs.map(diff => diff.used)
      console.log(diffs)
    },
    calcEffort(days) {
      this.project.tasks.forEach(task => {
        const state = null
        task.actions.forEach(action => {
          if (action.used>0) {
            const day = this.getDate(action.from)
            if (!days[day]) days[day] = {day: day}
            if (!days[day].used) days[day].used = 0
            days[day].used += action.used
          }
        })
      })
    },
    calcPlannedDiff(days) {
      this.project.tasks.forEach(task => {
        const state = null
        task.log.forEach(log => {
          const content = JSON.parse(log.content)
          if (content.state != state) {
            const day = this.getDate(log.created_at)
            if (!days[day]) days[day] = {day: day}
            if (!days[day].planned) days[day].planned = 0
            if (!days[day].check) days[day].check = 0
            switch(content.state) {
              case 'APPROVED': 
                days[day].planned += task.planned; 
                days[day].check += task.planned
                break;
              case 'IMPLEMENTED': 
                days[day].planned += -task.planned; 
                days[day].check += -2*task.planned + task.used
                break;
            }
          }
        })
      })
    },
    // 20200520
    getDate(s) {
      const date = new Date(s)
      return date.getDate()
        + 100*date.getMonth()
        + 10000*date.getFullYear()
    },
    async loadProject() {
      const projects = await api.find('project', {
        and: {id: this.id},
        with: {
          tasks: {many: 'task', query: {
            with: {
              actions: {many: 'action'},
              log: {many: 'log', that: 'item_id', query: {
                and: {type: 'task'},
                order: {created_at: 'ASC'}
              }}
            }
          }}
        }
      })
      this.project = projects[0]
    }
  },
  async mounted () {
    this.prepareData()
    this.renderChart(this.graph, {})
  }
}
</script>

<style>
</style>