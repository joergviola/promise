
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
            labels: [],
            datasets: []
          },
          options: {
            scales: {
            }
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
      const data = this.sortAndSum(days)
      this.calcProjection(data)
      this.calcPlanned(data)
    },
    sortAndSum(data) {
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
      return diffs
    },
    calcPlanned(diffs) {
      this.graph.labels = diffs.map(diff => {
        const day = diff.day % 100
        const month = Math.floor(diff.day/100) % 100
        const year = Math.floor(diff.day/10000)
        const date = new Date(year, month, day)
        return date.toLocaleDateString()
      })
      this.graph.datasets = [
        {
          label: 'Burndown',
          backgroundColor: '#00A4FF',
          data: diffs.map(diff => diff.planned),
					lineTension: 0,
        },
        {
          label: 'Used',
          backgroundColor: '#f87979',
          data: diffs.map(diff => diff.check),
					lineTension: 0,
        },
        {
          label: 'Effort',
          backgroundColor: '#DDDDDD',
          data: diffs.map(diff => diff.used),
          fill: false,
					lineTension: 0,
        },
        {
          label: 'Projection',
          backgroundColor: '#44DD88',
          data: diffs.map(diff => diff.projection),
					lineTension: 0,
        },
      ]
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
        const state = {}
        task.log.forEach(log => {
          const content = JSON.parse(log.content)
          if (content.state != null) {
            if (state[content.state]) return
            const day = this.getDate(log.created_at)
            state[content.state] = day
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
                /*
                1. Originaly planned effort is marked as done
                2. Originaly planned effort is substituted by the used effort
                */
                days[day].check += -2*task.planned + task.used
                break;
            }
          }
        })
      })
    },
    calcProjection(days) {
      const lastDay = days[days.length-1]
      const today = lastDay.day
      let left = lastDay.planned
      lastDay.projection = left
      const allocations = this.project.allocations
        .filter(a => a.role=='Dev')
        .map(a => ({
          from: this.getDate(a.from || this.project.starts_at),
          to: this.getDate(a.to || this.project.ends_at),
          parttime: a.parttime
        }))
      const end = Math.max(... allocations.map(a => a.to))
      for (let day = today+1; day <= end; day++) {
        const cont = allocations
          .filter(a => a.from <= day && a.to >= day)
          .reduce((cont, a) => cont += (a.parttime || 100), 0)
        left -= cont / 100 * 8
        if (left < 0) left = 0
        days.push({
          day: day,
          projection: left
        })
      }    },
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
          }},
          allocations: {many: 'allocation'}
        }
      })
      this.project = projects[0]
    }
  },
  async mounted () {
    await this.prepareData()
    this.renderChart(this.graph, this.options)
  }
}
</script>

<style>
</style>