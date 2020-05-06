<template>
  <div class="components-container">
    <generic-details type="project" :id="$route.params.id" :fields="fields" :buttons="buttons" :template="template" :image="image" @update="i => item=i"/>
  </div>
</template>

<script>

import GenericDetails from '@/components/Generic/Details'
import ToOne from '@/components/Generic/ToOne'
import image from '@/assets/images/undraw_unboxing_pbmf.svg'
import api from '@/api'

export default {
  name: 'LeadDetails',
  components: { GenericDetails, ToOne },
  props: {},
  data() {
    return {
      item: {},
      template: {
        state: 'LEAD',
        effort_unit: 'Hours',
        template: false,
      },
      image: image,
      buttons: [
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
    fields() {
      return [
        { name: 'name', label: 'Name' },
        { name: 'description', label: 'Description' },
        { name: 'source', label: 'Source', type: 'select', options: ['Web', 'Phone', 'Chat', '???' ] },
        { name: 'effort_unit', label: 'Effort unit', type: 'select', options: ['Hours', 'Points', 'Euro', '' ] },
        { name: 'lost_reason', label: 'Lost reason' },
        { name: 'customer_id', label: 'Customer', type: 'to-one', ref: 'customer', display: 'name', input: id => this.contactQuery = {customer_id: id}, link: '/customer' },
        { name: 'contact_id', label: 'Contact', type: 'to-one', ref: 'users', display: 'name', query: this.contactQuery, link: '/customer' },
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
