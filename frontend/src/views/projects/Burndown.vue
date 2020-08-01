
<script>
import { Scatter } from 'vue-chartjs'
import api from 'gluon-api'

export default {
  name: 'Burndown',
  extends: Scatter,
  props: ['id', 'height'],
  data() {
      return {
          graph: {
            labels: [],
            datasets: []
          },
          options: {
            scales: {
            xAxes: [{
                type: 'time',
                ticks: {source: 'data'},
                bounds: 'ticks'
            }]
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
      this.graph.labels = diffs.map(diff => this.getDate(diff.day).toLocaleDateString() )

      this.graph.datasets = [
        {
          label: 'Burndown',
          backgroundColor: '#00A4FF',
          data: diffs.map(diff => ({x: this.getDate(diff.day), y:diff.planned})),
          lineTension: 0,
          showLine: true,
        },
        {
          label: 'Used',
          backgroundColor: '#f87979',
          data: diffs.map(diff => ({x: this.getDate(diff.day), y:diff.check})),
					lineTension: 0,
          showLine: true,
        },
        {
          label: 'Effort',
          backgroundColor: '#DDDDDD',
          data: diffs.map(diff => ({x: this.getDate(diff.day), y:diff.used})),
          fill: false,
					lineTension: 0,
          showLine: true,
        },
        {
          label: 'Projection',
          backgroundColor: '#44DD88',
          data: diffs.map(diff => ({x: this.getDate(diff.day), y:diff.projection})),
					lineTension: 0,
          showLine: true,
        },
      ]
    },
    calcEffort(days) {
      this.project.tasks.forEach(task => {
        const state = null
        task.actions.forEach(action => {
          if (action.used>0) {
            const day = this.getDay(action.from)
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
        this.lastOfDays(task.log)
          .forEach(log => {
          const content = JSON.parse(log.content)
          if (content.state != null) {
            if (state[content.state]) return
            const day = this.getDay(log.created_at)
            state[content.state] = day
            if (!days[day]) days[day] = {day: day}
            if (!days[day].planned) days[day].planned = 0
            if (!days[day].check) days[day].check = 0
            switch(content.state) {
              case 'NEW': 
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
    lastOfDays(logs) {
      if (logs.length==0) return []
      const result = []
      let last = logs[0]
      let lastDay = this.getDay(last.created_at)
      logs.forEach(log => {
        const day = this.getDay(log.created_at)
        if (day==lastDay) {
        } else {
          result.push(last)
          lastDay = this.getDay(log.created_at)
        }
        last = log
      });
      result.push(logs[logs.length-1])
      return result;
    },
    calcProjection(days) {
      const lastDay = days[days.length-1]
      const today = lastDay.day
      let left = lastDay.check
      lastDay.projection = left
      const allocations = this.project.allocations
        .filter(a => a.role=='Dev')
        .map(a => ({
          from: this.getDay(a.from || this.project.starts_at),
          to: this.getDay(a.to || this.project.ends_at),
          parttime: a.parttime
        }))
      const end = this.getDay(this.project.ends_at)
      let day = this.nextDay(today)
      while (left>0 || day <= end) {
        const cont = allocations
          .filter(a => a.from <= day && a.to >= day)
          .reduce((cont, a) => cont += (a.parttime || 100), 0)
        left -= cont / 100 * 8
        if (left < 0) left = 0
        days.push({
          day: day,
          projection: left
        })
        day = this.nextDay(day)
      }    
    },
    nextDay(day) {
        const date = this.getDate(day)
        date.setDate(date.getDate() + 1);
        return this.getDay(date)
    },
    // 20200520
    getDay(date) {
      if (typeof date == "string") {
        date = new Date(date)
      }
      return date.getDate()
        + 100*(date.getMonth()+1)
        + 10000*date.getFullYear()
    },

    getDate(d) {
        const day = d % 100
        const month = Math.floor(d/100) % 100 - 1
        const year = Math.floor(d/10000)
        return new Date(year, month, day)
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