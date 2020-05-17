<template>
  <div class="components-container">
    <generic-details type="project" :id="id" :fields="fields" :buttons="buttons" :template="template" :image="image" @update="i => item=i"/>
  </div>
</template>

<script>

import GenericDetails from '@/components/generic/Details'
import image from '@/assets/img/undraw_maker_launch_crhe.svg'

export default {
  name: 'ProjectDetails',
  components: { GenericDetails },
  props: ['id'],
  data() {
    return {
      item: null,
      image: image,
      template: { project_id: this.id,  },
      fields: [
        { name: 'name', label: 'Name' },
        { name: 'description', type: 'textarea', label: 'Description' },
        { name: 'starts_at', type: 'date', label: 'Starts' },
        { name: 'ends_at', type: 'date', label: 'Ends' },
        { name: 'planned', label: 'Planned', disabled: true, postfix: this.item?this.item.effort_unit:'' },
        { name: 'used', label: 'Used', disabled: true, postfix: this.item?this.item.effort_unit:'' },
        { name: 'state', disabled: true, label: 'State' },
      ],
      allButtons: [
        {label: 'start', action: item => item.state='STARTED', shown: item => item.state === 'ACCEPTED', andSave: true },
        {label: 'Send', action: item => item.state='SENT', andSave: true },
        {label: 'Accepted', action: item => item.state='ACCEPTED', andSave: true },
        {label: 'Rejected', action: item => item.state='REJECTED', andSave: true }
      ]
    }
  },
  watch: {
    item() {
      this.$route.matched[1].meta.title = this.item.name
      this.$emit('update', this.item)
    }
  },
  computed: {
    buttons() {
      const workflow = {
        'NEW': ['Send'],
        'SENT': ['Accepted', 'Rejected', 'Reset'],
        'ACCEPTED': ['Reset'],
        'REJECTED': ['Reset'],
      }
      if (!this.item) return []
      const valid = workflow[this.item.state]
      return this.allButtons.filter(b => valid.indexOf(b.label)!=-1)
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
