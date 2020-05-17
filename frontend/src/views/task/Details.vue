<template>
  <div class="components-container">
    <generic-details type="task" :id="tid" :fields="fields" :buttons="buttons" :template="template" :image="image" @update="update"/>
  </div>
</template>

<script>

import GenericDetails from '@/components/generic/Details'
import image from '@/assets/img/undraw_task_31wc.svg'

export default {
  name: 'OfferDetails',
  props: ['id', 'tid'],
  components: { GenericDetails },
  computed: {
    buttons() {
      const workflow = {
        'NEW': ['Approve'],
        'APPROVED': ['Plan', 'Reset'],
        'PLANNED': ['Start', 'Reset'],
        'STARTED': ['Ready', 'Reset'],
        'IMPLEMENTED': ['Tested', 'Started',  'Reset'],
        'TESTED': ['Closed', 'Reset'],
        'CLOSEDD': ['Reset'],
      }
      if (!this.item) return []
      const valid = workflow[this.item.state]
      return this.allButtons.filter(b => valid.indexOf(b.label)!=-1)
    }
  },
  data() {
    return {
      item: null,
      image: image,
      template: { project_id: this.id, type: 'QUOTE', state: 'NEW', pricePerUnit: 100, percentBuffer: 15, rounding: 10 },
      fields: [
        { name: 'name', label: 'Name' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'planned', label: 'Planned', disabled: true, postfix: "Hours" },
        { name: 'used', label: 'Used', disabled: true, postfix: "Hours" },
        { name: 'state', disabled: true, label: 'State' },
      ],
      allButtons: [
        {label: 'Reset', action: item => item.state='NEW', shown: item => item.state === 'NEW', andSave: true },
        {label: 'Approve', action: item => item.state='APPROVED', andSave: true },
        {label: 'Plan', action: item => item.state='PLANNED', andSave: true },
        {label: 'Start', action: item => item.state='STARTED', andSave: true },
        {label: 'Ready', action: item => item.state='IMPLEMENTED', andSave: true },
        {label: 'Tested', action: item => item.state='TESTED', andSave: true },
        {label: 'Closed', action: item => item.state='CLOSED', andSave: true }
      ]
    }
  },
  watch: {
    item() {
      this.$route.matched[2].meta.title = this.item.name
      this.$emit('update', this.item)
    }
  },
  methods: {
    update(item) {
      this.item = item
      this.$emit('update', item)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
