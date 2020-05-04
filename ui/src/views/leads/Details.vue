<template>
  <el-row :gutter="40">
    <el-col :xs="24" :md="8">
      <el-form ref="postForm" v-loading="loading" :model="item" label-position="left" label-width="120px" >
        <el-form-item label="Name:">
          <el-input v-model="item.name" type="text" />
        </el-form-item>
        <el-form-item label="Summary:">
          <el-input v-model="item.description" :rows="1" type="textarea" autosize placeholder="Please enter the content" />
        </el-form-item>
        <el-form-item label="Source:">
          <el-select v-model="item.source" >
            <el-option key="web" label="Web" value="web" />
            <el-option key="phone" label="Phone" value="phone" />
            <el-option key="chat" label="Chat" value="chat" />
            <el-option key="unknown" label="???" value="unknown" />
          </el-select>
        </el-form-item>
        <el-form-item label="Effort unit:">
          <el-select v-model="item.effort_unit" >
            <el-option key="hour" label="Hour" value="hour" />
            <el-option key="points" label="Points" value="points" />
            <el-option key="euro" label="Euro" value="euro" />
          </el-select>
        </el-form-item>
        <el-form-item label="Lost reason:">
          <el-input v-model="item.lost_reason" type="text" />
        </el-form-item>
        <el-form-item label="Customer:">
          <to-one v-model="item.customer_id" type="customer" display="name" @input="id => contactQuery={customer_id: id}" link="/customer" />
        </el-form-item>
        <el-form-item label="Contact:">
          <to-one v-model="item.contact_id" type="users" display="name" :query="contactQuery"  link="/contact" />
        </el-form-item>
        <el-button v-loading="loading" type="success" @click="save('ACCEPTED')">
          Accepted
        </el-button>
        <el-button v-loading="loading" type="danger" @click="save('REJECTED')">
          Rejected
        </el-button>
        <el-button v-loading="loading" type="secondary" @click="save()">
          Save
        </el-button>
      </el-form>
    </el-col>
    <el-col :xs="24" :md="16">
      <img class="hidden" :src="errGif">
    </el-col>
  </el-row>
</template>

<script>

import ToOne from '@/components/Generic/ToOne'
import errGif from '@/assets/401_images/401.gif'
import api from '@/api'

export default {
  name: 'LeadDetails',
  components: { ToOne },
  props: {},
  data() {
    return {
      item: {
        state: 'LEAD',
        template: false,
      },
      loading: false,
      contactQuery: {},
      errGif: errGif,
    }
  },
  async created() {
    const id = this.$route.params.id
    if (id != 'new') {
      this.loading = true
      const items = await api.find('project', {
        and: [{ id: this.$route.params.id }],
        with: {
          customer: {one: 'customer', 'this': 'customer_id'},
          contact: {one: 'users', 'this': 'contact_id'}
        }
      })
      this.item = items[0]
      this.contactQuery = {customer_id: this.item.customer_id}
      this.loading = false
    }
  },
  methods: {
    async save(state = null) {
      if (state) {
        this.item.state = state
        this.item.approved_at = api.datetime()
      }
      console.log('Saving', this.item)
      this.loading = true
      try {
        if (typeof this.item.customer_id === 'string') {
          const { id } = await api.create('customer', { name: this.item.customer_id })
          this.item.customer_id = id
        }
        if (typeof this.item.contact_id === 'string') {
          const { id } = await api.create('users', { name: this.item.contact_id })
          this.item.contact_id = id
        }
        this.item.id
          ? await api.update('project', this.item.id, this.item)
          : await api.create('project', this.item)
      } catch (error) {
        console.log(error)
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
          duration: 5000
        })
      }
      this.loading = false
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
