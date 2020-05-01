<template>
  <div class="components-container">
    <generic-details type="users" :id="$route.params.id" :fields="fields" :image="image"/>
  </div>
</template>

<script>

import GenericDetails from '@/components/Generic/Details'
import image from '@/assets/images/undraw_people_tax5.svg'

export default {
  name: 'LeadForm',
  components: { GenericDetails },
  data() {
    return {
      image: image,
      fields: [
        { name: 'name', label: 'Name' },
        { name: 'email', label: 'E-Mail' },
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
