<template>
  <div class="components-container">
    <generic-details type="users" :id="$route.params.id" :fields="fields" :with="w" :image="image" @update="u => $emit('update', u)"/>
  </div>
</template>

<script>

import GenericDetails from '@/components/generic/Details'
import image from '@/assets/img/undraw_people_tax5.svg'
import api from '@/api'

export default {
  name: 'UserForm',
  components: { GenericDetails },
  data() {
    return {
      image: image,
      w: {
        documents: {
          many: 'document',
          that: 'item_id',
          query: {
            and: {
              type: 'users',
            },
          }
        }
      },
      fields: [
        { name: 'name', label: 'Name' },
        { name: 'email', label: 'E-Mail' },
        { name: 'phone', label: 'Phone' },
        { name: 'password', label: 'Password', type: 'password' },
        { name: 'role_id', label: 'Role', type: 'to-one', ref: 'role', display: 'name'},
        { name: 'organisation_id', label: 'Organsisation', type: 'to-one', ref: 'organisation', display: 'name' },
        { name: 'avatar', label: 'Avatar', type: 'doc'},
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
