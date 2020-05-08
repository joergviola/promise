<template>
  <div class="components-container board">
    <Kanban :key="0" :list="tasks" state="NEW" :group="group" class="kanban" header-text="Unapproved" />
    <Kanban :key="1" :list="tasks" state="APPROVED" :group="group" class="kanban" header-text="Backlog" />
    <Kanban :key="2" :list="tasks" state="PLANNED" :group="group" class="kanban" header-text="Sprint" />
    <Kanban :key="3" :list="tasks" state="STARTED" :group="group" class="kanban" header-text="Today" />
    <Kanban :key="4" :list="tasks" state="IMPLEMENTED" :group="group" class="kanban" header-text="Ready" />
    <Kanban :key="5" :list="tasks" state="TESTED" :group="group" class="kanban" header-text="Tested" />
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
      tasks: [],
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
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ]),
    backlog() {return this.tasks.filter(t => t.state == 'APPROVED')}
  },
  async created() {
    this.reload()
  },
  methods: {
    async reload() {
      this.tasks = await api.find('task', {
        and: {
          project_id: this.id,
          type: 'DEV'
        },
        with: {
          user: { one: 'users', this: 'user_id' }
        },
        order: {
          finished_at: 'DESC'
        }
      })
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

