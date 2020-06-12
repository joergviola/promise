<template>
  <div class="components-container board">
    <Kanban 
      v-for="(col,i) in columns"
      :key="i" 
      :list="tasks" 
      :state="col.state" 
      :group="group" 
      class="kanban" 
      :header-text="col.label" 
      @click="onClick" 
    />
  </div>
</template>

<script>
import api from '@/api'
import Kanban from '@/components/kanban'

export default {
  name: 'ProjectBoard',
  props: ['id'],
  components: { Kanban },
  data() {
    return {
      columns: [
        { state: 'NEW', label: 'Unapproved' },
        { state: 'APPROVED', label: 'Backlog' },
        { state: 'PLANNED', label: 'Sprint' },
        { state: 'STARTED', label: 'Today' },
        { state: 'IMPLEMENTED', label: 'Ready' },
        { state: 'TESTED', label: 'Tested' },
        { state: 'DEPLOYED', label: 'Deployed' },
      ],
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
          user: { 
            one: 'users', 
            this: 'user_id',
            query: {
              with: {
                documents: {
                  many: 'document',
                  that: 'item_id',
                  query: {
                    and: {
                      type: 'users',
                    },
                  }
                }
              }
            }
          }
        },
        order: {
          finished_at: 'DESC'
        }
      })
    },
    close(task) {
      task.state = 'CLOSED'
      task.finished_at = api.datetime(new Date())
      task.finished_by = api.user().id
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
    onClick(task) {
      this.$router.push(`task/${task.id}/detail`)
    }
  }

}
</script>

<style lang="scss">
.board {
  width: 100%;
  margin-left: 0px;
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
  font-size: 14px;

  .board-column-header {
  }
}
</style>

