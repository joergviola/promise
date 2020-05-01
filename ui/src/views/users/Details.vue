<template>
    <el-row :gutter="40">
      <el-col :xs="24" :md="8">
        <el-form ref="postForm" v-loading="loading" :rules="rules" :model="item" label-position="left" label-width="120px" >
          <el-form-item label="Name:">
            <el-input v-model="item.name" type="text" />
          </el-form-item>
          <el-form-item label="Summary:">
            <el-input v-model="item.description" :rows="1" type="textarea" autosize placeholder="Please enter the content" />
          </el-form-item>
          <el-form-item label="Price:">
            <el-input v-model="item.pricePerHour" type="number">
              <template slot="append">€ / hour</template>
            </el-input>
          </el-form-item>
          <el-form-item label="Buffer:">
            <el-input v-model="item.percentBuffer" type="number">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="Customer:">
            <el-select v-model="customer" value-key="id" filterable default-first-option remote placeholder="Search customer">
              <el-option key="create" label="Create..." :value="{}" />
              <el-option v-for="o in customers" :key="o.id" :label="o.name" :value="o" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="!customer.id" label="New Customer Name:">
            <el-input v-model="customer.name" type="text" />
          </el-form-item>
          <el-form-item v-if="!customer.id" label="E-Mail:">
            <el-input v-model="customer.email" type="email" />
          </el-form-item>
          <el-form-item v-if="!customer.id" label="Phone:">
            <el-input v-model="customer.phone" type="phone" />
          </el-form-item>
          <el-form-item v-if="!customer.id" label="Address:">
            <el-input v-model="customer.address" :rows="1" type="textarea" autosize/>
          </el-form-item>
          <el-form-item label="Contact:">
            <el-select v-model="contact" value-key="id" filterable default-first-option remote placeholder="Search contact">
              <el-option key="create" label="Create..." :value="{}" />
              <el-option v-for="o in contacts" :key="o.id" :label="o.name" :value="o" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="!contact.id" label="New Contact Name:">
            <el-input v-model="contact.name" type="text" />
          </el-form-item>
          <el-form-item v-if="!contact.id" label="E-Mail:">
            <el-input v-model="contact.email" type="email" />
          </el-form-item>
          <el-form-item v-if="!contact.id" label="Phone:">
            <el-input v-model="contact.phone" type="phone" />
          </el-form-item>
          <el-form-item v-if="!contact.id" label="Address:">
            <el-input v-model="contact.address" :rows="1" type="textarea" autosize/>
          </el-form-item>
          <el-button v-loading="loading" type="primary" @click="save">
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

import errGif from '@/assets/401_images/401.gif'
import api from '../../api'

export default {
  name: 'LeadDetails',
  props: {},
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      item: {
        state: 'LEAD',
        template: false,
        pricePerHour: 790 / 8,
        percentBuffer: 15
      },
      customer: {name:''},
      customers: [],
      contact: {name:'', password:'none'},
      contacts: [],
      loading: false,
      userListOptions: [],
      errGif: errGif,
      rules: {
        name: [{ validator: validateRequire }],
        pricePerHour: [{ validator: validateRequire }],
        percentBuffer: [{ validator: validateRequire }]
      }
    }
  },
  watch: {
    async customer() {
      this.item.customer_id = this.customer.id
      this.contacts = await api.find('users', {and:{customer_id:this.customer.id}})
    },
    contact() {
      this.item.contact_id = this.contact.id
    },
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
      this.customer = this.item.customer
      delete this.item.customer
      this.contact = this.item.contact
      delete this.item.contact
      this.loading = false
    }
    this.customers = await api.find('customer', {and:{}})
    this.contacts = await api.find('users', {and:{customer_id:this.customer.id}})
  },
  methods: {
    save() {
      console.log('Saving', this.item)
      this.$refs.postForm.validate(async valid => {
        if (valid) {
          this.loading = true
          try {
            if (!this.customer.id) {
              const {id} = await api.create('customer', this.customer)
              this.customer.id = id
              this.item.customer_id = id
            }
            this.contact.customer_id = this.customer.id
            if (!this.contact.id) {
              const {id} = await api.create('users', this.contact)
              this.contact.id = id
              this.item.contact_id = id
            }
            const item = this.item.id
                    ? await api.update('project', this.item.id, this.item)
                    : await api.create('project', this.item)
            this.$notify({
              title: 'Success',
              message: 'Lead has been saved',
              type: 'success',
              duration: 2000
            })
          } catch (error) {
            this.$notify({
              title: 'Error',
              message: error.message,
              type: 'error',
              duration: 5000
            })
          }
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
