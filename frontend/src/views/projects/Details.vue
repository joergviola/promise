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
      template: { state: 'ACCEPTED' },
      fields: [
        { name: 'name', label: 'Name' },
        { name: 'description', type: 'textarea', label: 'Description' },
        { name: 'links', type: 'links', label: 'Links' },
        { name: 'starts_at', type: 'date', label: 'Starts' },
        { name: 'ends_at', type: 'date', label: 'Ends' },
        { name: 'planned', label: 'Planned', disabled: true, postfix: this.item?this.item.effort_unit:'' },
        { name: 'used', label: 'Used', disabled: true, postfix: this.item?this.item.effort_unit:'' },
        { name: 'state', disabled: true, label: 'State' },
      ],
      buttons: [
        {label: 'Maintenance', show: item=>item.state==='ACCEPTED', action: item => item.state='MAINTENANCE', andSave: true },
        {label: 'Closed', show: item=>item.state==='ACCEPTED' || item.state==='MAINTENANCE', action: item => item.state='CLOSED', andSave: true },
        {label: 'Reopen', show: item=>item.state==='CLOSE' || item.state==='MAINTENANCE', action: item => item.state='ACCEPT', andSave: true },
      ]
    }
  },
  watch: {
    item() {
      this.$route.matched[1].meta.title = this.item.name
      this.$emit('update', this.item)
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
