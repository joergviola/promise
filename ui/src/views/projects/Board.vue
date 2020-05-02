<template>
  <div class="components-container board">
    <Kanban :key="1" :list="list1" :group="group" class="kanban" header-text="Todo" />
    <Kanban :key="2" :list="list2" :group="group" class="kanban" header-text="Working" />
    <Kanban :key="3" :list="list3" :group="group" class="kanban" header-text="Done" />
  </div>
</template>

<script>
import api from '@/api'
import { mapGetters } from 'vuex'
import Kanban from '@/components/Kanban'

export default {
  name: 'ProjectBoard',
  props: ['id'],
  components: { Kanban },
  data() {
    return {
      group: 'mission',
      list1: [
        { name: 'Mission', id: 1 },
        { name: 'Mission', id: 2 },
        { name: 'Mission', id: 3 },
        { name: 'Mission', id: 4 }
      ],
      list2: [
        { name: 'Mission', id: 5 },
        { name: 'Mission', id: 6 },
        { name: 'Mission', id: 7 }
      ],
      list3: [
        { name: 'Mission', id: 8 },
        { name: 'Mission', id: 9 },
        { name: 'Mission', id: 10 }
      ],

      template: {project_id: this.id, type: 'SALES', state: 'APPROVED', supplier: 'S'},
      open: [],
      closed: [],
      loading: null
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  async created() {
    this.reload()
  },
  methods: {
    async reload() {
      const tasks = await api.find('task', {
        and: {
          project_id: this.id,
          type: 'SALES'
        },
        with: {
          finished: { one: 'users', this: 'finished_by' }
        },
        order: {
          finished_at: 'DESC'
        }
      })
      this.closed = tasks.filter(t => t.state === 'CLOSED')
      this.open = tasks.filter(t => t.state !== 'CLOSED')
      if (this.open.length === 0) {
        this.open.push(this.template)
      }
    },
    close(task) {
      task.state = 'CLOSED'
      task.finished_at = api.datetime(new Date())
      task.finished_by = this.user.id
      this.save(task)
    },
    async save(task) {
      console.log('Saving', task)
      this.loading = true
      try {
        if (task.id) {
          await api.update('task', task.id, task)
        } else {
          const result = await api.create('task', task)
          task.id = result.id
        }
        this.reload()
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
          duration: 5000
        })
      }
      this.loading = false
    },
  }

}
</script>

<style lang="scss">
.board {
  width: 80%;
  margin-left: 20px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
  overflow-x: scroll;
}
.board-column.kanban {
  margin-left: 10px;
  margin-right: 10px;
  width: 500px;
  min-width: 150px;
  max-width: 500px;

  .board-column-header {
    background: #00A4FF;
  }
}
</style>

