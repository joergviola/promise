<template>
  <div class="createPost-container">
    <el-form ref="postForm" v-loading="loading" :rules="rules" :model="item" label-position="top" class="form-container">

      <sticky :z-index="10" class-name="sub-navbar draft">
        <el-col :span="12" type="flex" align="left">
          <el-button type="default" @click="$router.push('/leads/all')">
            Back
          </el-button>
        </el-col>
        <el-col :span="12" type="flex" align="right">
          <el-button v-loading="loading" type="primary" @click="save">
            Save
          </el-button>
        </el-col>
      </sticky>

      <div class="createPost-main-container">

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Name:">
              <el-input v-model="item.name" label="Name:" type="text" />
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
          </el-col>
          <el-col :span="8">
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
          </el-col>
          <el-col :span="8">
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
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>

import Sticky from '@/components/Sticky' // 粘性header组件
import api from '../../api'

export default {
  name: 'LeadForm',
  components: { Sticky },
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
    getRemoteUserList(query) {
      api.find('client', { and: [{ name: { 'LIKE': query + '%' }}] })
        .then(items => {
          this.userListOptions = items
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
