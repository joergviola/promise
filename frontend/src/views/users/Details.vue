<template>
  <div class="components-container">
    <gl-editor 
      type="users" 
      :id="$route.params.id" 
      :fields="fields" 
      :with="w" 
      :image="image" 
      @update="onUpdate"
    />
  </div>
</template>

<script>

import GlEditor from 'gluon-frontend/gl-editor'
import image from '@/assets/img/undraw_people_tax5.svg'
import api from 'gluon-api'
import Vue from 'vue'

export default {
  name: 'UserForm',
  components: { GlEditor },
  data() {
    return {
      image: image,
      w: {
        avatar: { many: 'document' },
        //   many: 'document',
        //   that: 'item_id',
        //   query: {
        //     and: {
        //       type: 'users',
        //     },
        //   }
        // }
      },
      fields: [
        { name: 'name', label: 'Name' },
        { name: 'email', label: 'E-Mail' },
        { name: 'phone', label: 'Phone' },
        { name: 'lang', type: 'select', options: ['de', 'en']},
        { name: 'password', label: 'Password', type: 'password' },
        { name: 'role_id', label: 'Role', type: 'to-one', ref: 'role', display: 'name'},
        { name: 'organisation_id', label: 'Organsisation', type: 'to-one', ref: 'organisation', display: 'name' },
        { name: 'avatar', type: 'doc'},
      ],
    }
  },
  methods: {
    onUpdate(user) {
      this.$emit('update', user)
      if (user.id === api.user().id) {
        this.$root.$i18n.locale = user.lang
        const u = api.user()
        u.lang = user.lang
        api.user(u)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
