<template>
  <div class="components-container board">
    <Kanban 
      v-for="(col,i) in columns"
      :key="i" 
      :list="tasks" 
      :state="col.state" 
      sum="planned:h"
      group="group" 
      class="kanban" 
      :header-text="$t('ui.kanban.'+col.state)" 
      @click="onClick" 
      @change="save"
    >
      <template slot-scope="{element}">
        <div>
          <avatar :user="element.user" :size="25"/>
          <span class="due">{{element.due_at | dateHuman}}</span>
        </div>
        <div>{{ element.name }}</div>
      </template>
    </Kanban>
  </div>
</template>

<script>
import api from '@/api'
import Kanban from '@/components/kanban'
import Avatar from 'gluon-ui/gl-avatar'

export default {
  name: 'ProjectBoard',
  props: ['id'],
  components: { Kanban, Avatar },
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
    save(task, state) {
      task.state = state
      api.update('task', task.id, { state: state })
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

