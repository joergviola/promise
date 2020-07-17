<template>
  <div class="components-container board">
    <Kanban 
      v-for="(state,i) in states"
      :key="i" 
      :list="projects" 
      :state="state" 
      group="group" 
      sum="last_offer.price:€"
      class="kanban" 
      :header-text="$t('type.project.state-options.'+state)" 
      @click="onClick" 
      @change="save"
    >
      <template slot-scope="{element}">
        <div>
          <span v-if="element.customer" class="customer">{{element.customer.name}}</span>
          <span v-if="element.last_offer.price" class="customer pull-right">{{element.last_offer.price}} €</span>
        </div>
        <div>{{ element.name }}</div>
      </template>

    </Kanban>
  </div>
</template>

<script>
import Kanban from '@/components/kanban'
import states from '@/util/states'
import api from '@/api'

export default {
  name: 'LeadFunnel',
  components: { Kanban },
  data() {
    return {
      projects: [],
      states: states.project.filter(s=>s.lead).map(s=>s.state),
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
      const state = states.project.find(s => s.state==project.state)
      if (state.lead) return `/leads/lead/${project.id}/detail`
      else return `/projects/project/${project.id}/detail`
    },
    onClick(project) {
      this.$router.push(this.projectLink(project))
    },
    save(project, state) {
      project.state = state
      api.update('project', project.id, { state: state })
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
