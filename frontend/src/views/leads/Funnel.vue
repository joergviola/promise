<template>
  <div class="components-container board">
    <Kanban 
      v-for="(state,i) in states"
      :key="i" 
      :list="projects" 
      :state="state" 
      class="kanban" 
      :header-text="$t('ui.kanban.'+state)" 
      @click="onClick" 
    >
      <template slot-scope="{element}">
        <div>
          <span v-if="element.customer" class="customer">{{element.customer.name}}</span>
        </div>
        <div>{{ element.name }}</div>
      </template>

    </Kanban>
  </div>
</template>

<script>
import Kanban from '@/components/kanban'
import api from '@/api'

export default {
  name: 'LeadFunnel',
  components: { Kanban },
  data() {
    return {
      projects: [],
      states: ['NEW', 'LEAD'],
    }
  },
  computed: {
    admin() {
      return api.userCan('project', ['CRUD', 'U'])
    }
  },
  async mounted() {
    this.projects = await api.find('project', {
      and: {template: false},
      with: {
        customer: { one: 'organisation', 'this': 'customer_id' },
        last_offer: {
          one: 'accounting',
          this: 'id',
          that: 'project_id',
          query: {
            and: { type: 'QUOTE' },
            order: { id: 'DESC' }
          }
        },
      }
    })
  },
  methods: {
    projectLink(project) {
      if (project.state=='LEAD') return `/leads/lead/${project.id}/detail`
      else return `/projects/project/${project.id}/detail`
    },
    onClick(project) {
      this.$router.push(this.projectLink(project))
    }
  }
}
</script>

<style scoped>
.customer {
  font-size: 80%;
  color: #CCCCCC;
}
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
