<template>
  <div class="components-container">
    <generic-list
      type="project"
      detail="/leads/lead"
      :query="query"
      :columns="columns"
      :with="w"
      :template="template"
      createBy="none"
      :allow-delete=false
    >
      <span slot="header">
          <el-select v-if="admin" v-model="show" placeholder="Show..." @change="updateShow">
            <el-option value="OPEN" label="Open" />
            <el-option value="ACC" label="Accepted" />
            <el-option value="REJ" label="Rejected" />
            <el-option value="TMPL" label="Templates" />
          </el-select>
          <el-dropdown  v-if="admin" @command="createFromTmpl">
            <el-button type="primary">
              Create<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="t in templates" :key="t.id" :command="t.id">{{t.name}}</el-dropdown-item>
              <el-dropdown-item key="empty" command="empty">Empty</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
      </span>
    </generic-list>
  </div>
</template>

<script>
import GenericList from '@/components/generic/List'
import api from '@/api'

export default {
  name: 'LeadList',
  components: { GenericList },
  data() {
    return {
      show: 'OPEN',
      templates: [],
      template: { state: 'LEAD' },
      w: {
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
      },
      query: {state: 'LEAD', template: false},
      type: 'project',
      columns: [
        { name: 'name', label: 'Name', editable: true },
        { name: 'customer.name', label: 'Customer', editable: false },
        { name: 'last_offer.price', label: 'Last Offer', editable: false },
      ]
    }
  },
  computed: {
    admin() {
      return api.userCan('project', ['CRUD', 'U'])
    }
  },
  async mounted() {
    this.templates = await api.find('project', {and: {template: true}})
  },
  methods: {
    updateShow() {
      switch (this.show) {
        case 'OPEN':
          this.query = {state: 'LEAD', template: false};
          break;
        case 'ACC':
          this.query = {state: 'ACCEPTED', template: false};
          break;
        case 'REJ':
          this.query = {state: 'REJECTED', template: false};
          break;
        case 'TMPL':
          this.query = {template: true};
          break;
      }
    },
    async createFromTmpl(tmplId) {
      if (tmplId=='empty') {
        this.$router.push(`lead/new/detail`)
        return
      }

      try {
        const [tmpl] = await api.find('project', {
          and: {id: tmplId},
          with: {
            tasks: {many: 'task'},
            offers: {many: 'accounting', query: {
              with: {
                positions: {many: 'position'} 
              }
            }},
          }
        })
        console.log('tmpl', tmpl)
        const copy = api.clone(tmpl, {
          mask: {
            name: tmpl.name + ' (Copy)',
            template: false,
//            customer_id: null
          },
          refs: {
            tasks: {
              mask: {
                state: 'NEW',
                planned: null,
                used: null,
                price: null,
                approved_at: null,
                approved_by: null
              },
            },
            offers: {
              mask: {
                name: 'Quote of ' + (new Date().toLocaleDateString()),
                state: 'NEW',
                price: null,
                approved_at: null,
                accepted_at: null
              },
              refs: {
                positions: {
                  mask: {
                    planned: null,
                    price: null
                  }
                }
              }
            }
          }
        })
        console.log('copy', copy)
        const { id } = await api.create('project', copy)
        this.$router.push(`lead/${id}/detail`)
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message || error,
          type: 'error',
          duration: 10000
        })

      }

    }
  }

}
</script>

<style scoped type="sass">
</style>
