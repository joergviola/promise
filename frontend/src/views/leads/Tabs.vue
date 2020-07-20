<template>
  <div>
    <div class="pull-right">
      <el-dropdown  v-if="admin" @command="createFromTmpl">
        <el-button type="primary">
          {{$t('ui.list.add')}} <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="t in templates" :key="t.id" :command="t.id">{{t.name}}</el-dropdown-item>
          <el-dropdown-item key="empty" command="empty">Empty</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="pull-clear"></div>
    <gl-tabs component="LeadTabs" :attrs="$attrs"/>
  </div>
</template>

<script>

import api from '@/api'
import GlTabs from 'gluon-frontend/gl-tabs'
import store from '@/util/Store.js'

export default {
  name: 'LeadTabs',
  components: {GlTabs},
  props: {},
  data() {
    return {
      templates: [],
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
        this.$router.push(`../lead/${id}/detail`)
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