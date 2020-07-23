<template>
    <el-row :gutter="40">
      <el-col :xs="24" :md="12">
        <el-card>
          <div class="components-container">
            <gl-editor 
              :key="reload"
              type="task" 
              :id="tid" 
              :fields="fields" 
              :buttons="buttons" 
              :template="template" 
              @update="update"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <div class="components-container">
          <timeline
            :tid="tid" 
            :history="true" 
            @save="reload++"
          />
        </div>
      </el-col>
    </el-row>
</template>

<script>

import GlEditor from 'gluon-frontend/gl-editor'
import Timeline from '@/components/custom/Timeline'
import api from 'gluon-api'

export default {
  name: 'OfferDetails',
  props: ['id', 'tid'],
  components: { GlEditor, Timeline },
  computed: {
    buttons() {
      const workflow = {
        'NEW': ['Approve'],
        'APPROVED': ['Plan', 'Reset'],
        'PLANNED': ['Start', 'Reset'],
        'STARTED': ['Ready', 'Reset'],
        'IMPLEMENTED': ['Tested', 'Started',  'Reset'],
        'TESTED': ['Closed', 'Reset'],
        'CLOSED': ['Reset'],
      }
      if (!this.item) return []
      const valid = workflow[this.item.state]
      return this.allButtons.filter(b => valid.indexOf(b.label)!=-1)
    },
    team() {
      return _.uniqBy(this.allocations.map(a => a.user), 'id')
    },
    fields() {
      return [
        { name: 'name', label: 'Name' },
        { name: 'description', label: 'Description', type: 'textarea', maxRows: 1000 },
        { name: 'user_id', label: 'Responsible', editable: true, type: 'select', options: this.team, display: 'name', id: 'id', placeholder: 'New member...' },
        { name: 'due_at', label: 'Due', type: 'date' },
        { name: 'planned', label: 'Planned', disabled: true, postfix: "Hours" },
        { name: 'used', type: 'time', disabled: true, postfix: "Hours" },
        { name: 'state', disabled: true, label: 'State' },
      ]
    }
  },
  data() {
    return {
      item: null,
      template: { project_id: this.id, type: 'QUOTE', state: 'NEW', pricePerUnit: 100, percentBuffer: 15, rounding: 10 },
      allButtons: [
        {label: 'Reset', action: item => item.state='NEW', shown: item => item.state === 'NEW', andSave: true },
        {label: 'Approve', action: item => item.state='APPROVED', andSave: true },
        {label: 'Plan', action: item => item.state='PLANNED', andSave: true },
        {label: 'Start', action: item => item.state='STARTED', andSave: true },
        {label: 'Ready', action: item => item.state='IMPLEMENTED', andSave: true },
        {label: 'Tested', action: item => item.state='TESTED', andSave: true },
        {label: 'Closed', action: item => item.state='CLOSED', andSave: true }
      ],
      allocations: [],
      reload: 0,
    }
  },
  watch: {
    item() {
      this.$route.matched[2].meta.title = this.item.name
      this.$emit('update', this.item)
    }
  },
  async mounted() {
    this.allocations = await api.find('allocation', {
      and: { project_id: this.id },
      with: { user: { one: 'users', this: 'user_id' }}
    })
  },
  methods: {
    async update(item) {
      this.item = item
      this.$emit('update', item)
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
