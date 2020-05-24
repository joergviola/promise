
<script>
import { Line } from 'vue-chartjs'

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
                backgroundColor: '#f87979',
                data: [40, 20]
                }
            ]
          }
      }
  },
  mounted () {
    this.renderChart(this.graph, {})
  }
}
</script>

<style>
</style>