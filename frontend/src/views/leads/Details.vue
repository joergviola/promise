<template>
  <div class="components-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form label-position="left" label-width="120px" >
          <el-form-item label="Name">
            <el-input v-model="item.name" type="text" :disabled="readonly"/>
          </el-form-item>
          <el-form-item label="Description">
            <el-input v-model="item.description" type="textarea" :rows="2" :autosize="{ minRows: 2, maxRows: 4}" :disabled="readonly" />
          </el-form-item>
          <el-form-item label="Source">
            <el-select v-model="item.source" :disabled="readonly">
              <el-option v-for="(o, i) in sources" :key="i" :label="o" :value="o" />
            </el-select>
          </el-form-item>
          <el-form-item label="Effort unit">
            <el-select v-model="item.effort_unit" :disabled="readonly">
              <el-option v-for="(o, i) in units" :key="i" :label="o" :value="o" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="item.state=='REJECTED'" label="Lost reason">
            <el-input v-model="item.lost_reason" type="text" :disabled="readonly" />
          </el-form-item>
          <el-form-item label="Customer">
            <el-select v-model="item.customer_id" @change="customerChanged" placeholder="New ..." :disabled="readonly">
              <el-option v-for="(o, i) in customers" :key="i" :label="o.name" :value="o.id" />
              <el-option key="new" label="New..." :value="null" />
            </el-select>
            <el-button class="default" @click="showCustomer=!showCustomer">
              Details
              <i v-show="!showCustomer" class="el-icon-arrow-right"></i>
              <i v-show="showCustomer" class="el-icon-arrow-down"></i>
            </el-button>
          </el-form-item>
          <el-collapse-transition>
            <el-card v-show="showCustomer">
              <el-form-item label="Name">
                <el-input v-model="item.customer.name" type="text"  :disabled="readonly"/>
              </el-form-item>
              <el-form-item label="E-Mail">
                <el-input v-model="item.customer.email" type="text"  :disabled="readonly"/>
              </el-form-item>
              <el-form-item label="Phone">
                <el-input v-model="item.customer.phone" type="text"  :disabled="readonly"/>
              </el-form-item>
              <el-form-item label="Website">
                <el-input v-model="item.customer.website" type="text"  :disabled="readonly"/>
              </el-form-item>
            </el-card>
          </el-collapse-transition>
          <el-form-item label="Contact">
            <el-select v-model="item.contact.user_id" @change="contactChanged" placeholder="New ..." :disabled="readonly">
              <el-option v-for="(o, i) in contacts" :key="i" :label="o.name" :value="o.id" />
              <el-option key="new" label="New..." :value="null" />
            </el-select>
            <el-button class="default" @click="showContact=!showContact">
              Details
              <i v-show="!showContact" class="el-icon-arrow-right"></i>
              <i v-show="showContact" class="el-icon-arrow-down"></i>
            </el-button>
          </el-form-item>
          <el-collapse-transition>
            <el-card v-show="showContact">
              <el-form-item label="Name">
                <el-input v-model="item.contact.user.name" type="text" :disabled="readonly"/>
              </el-form-item>
              <el-form-item label="E-Mail">
                <el-input v-model="item.contact.user.email" type="text" :disabled="readonly" />
              </el-form-item>
              <el-form-item label="Phone">
                <el-input v-model="item.contact.user.phone" type="text" :disabled="readonly" />
              </el-form-item>
            </el-card>
          </el-collapse-transition>
        </el-form>
      </el-col>
      <el-col :span=12>
        <img width="100%" :src="image">
      </el-col>
    </el-row>
    <el-row type="flex">
      <el-col :span="24">
        <el-button v-if="item.state=='LEAD' && !readonly" type="success" @click="save('ACCEPTED')">Accepted</el-button>
        <el-button v-if="item.state=='LEAD' && !readonly" type="danger" @click="save('REJECTED')">Rejected</el-button>
        <el-button v-if="!readonly" type="primary" @click="save()">Save</el-button>
        <el-button v-if="item.state!='LEAD' && !readonly" type="primary" @click="save('LEAD')">Reset</el-button>
        <el-button v-if="!item.template && !readonly" type="secondary" @click="saveAsTemplate(true)">Save as template</el-button>
        <el-button v-if="item.template && !readonly" type="secondary" @click="saveAsTemplate(false)">No template</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import image from '@/assets/img/undraw_unboxing_pbmf.svg'
import api from '@/api'

export default {
  name: 'LeadDetails',
  props: {},
  data() {
    return {
      item: { customer: {}, contact: { user: {} } },
      sources: ['Web', 'Phone', 'Chat', 'E-Mail', '???'],
      units: ['Hour', 'Point', 'Euro', ''],
      showCustomer: false,
      customers: [],
      showContact: false,
      contacts: [],
      image: image
    }
  },
  computed: {
    readonly() {
      const actions = ['CRUD', 'U']
      const rights = api.user().role.rights
        .filter(right => right.tables=='*' || right.tables.search(this.type)!=-1)
        .filter(right => actions.indexOf(right.actions)!=-1)
      return rights.length==0
    }
  },
  watch: {
    item() {
      this.$route.matched[1].meta.title = this.item.name
      this.$emit('update', this.item)
    }
  },
  methods: {
    async customerChanged() {
      if (!this.item.customer_id) {
        this.contacts = []
        this.item.customer = {}
        this.item.contact = { type: 'PROJECT', role: 'Customer', user: {},  _meta: { user: { ignore: true }, }
 }
        this.showCustomer = true
        this.showContact = true

        return
      }
      this.item.customer = this.customers.find(c => c.id == this.item.customer_id)
      this.contacts = await api.find('users', {
        and: { organisation_id: this.item.customer_id }
      })
      if (this.contacts.length > 0) {
        this.item.contact.user = this.contacts[0]
        this.item.contact.user_id = this.contacts[0].id
      } else {
        this.item.contact.user = {}
        this.item.contact.user_id = null
      }
    },
    async contactChanged() {
      this.item.contact = this.contacts.find(c => c.id == this.item.contact.user_id)
    },
    saveAsTemplate(tmpl) {
      this.item.template = tmpl
      this.save()
    },
    async save(state = null) {
      if (state) {
        this.item.state = state
      }

      const newLead = !this.item.id

      await api.createOrUpdate('organisation', this.item.customer)
      this.item.customer_id = this.item.customer.id
      this.item.contact.user.organisation_id = this.item.customer.id

      await api.createOrUpdate('project', this.item)
      this.item.contact.project_id = this.item.id

      await api.createOrUpdate('users', this.item.contact.user)
      this.item.contact.user_id = this.item.contact.user.id

      await api.createOrUpdate('allocation', this.item.contact)

      if (newLead) {
        await api.createOrUpdate('allocation', {
          project_id: this.item.id,
          type: 'PROJECT',
          role: 'Sales',
          user_id: api.user().id
        })

        await api.createOrUpdate('accounting', {
          project_id: this.item.id,
          name: 'Quote of ' + (new Date().toLocaleDateString()),
          type: 'QUOTE',
          state: 'NEW',
          pricePerUnit: 100,
          percentBuffer: 15,
          rounding: 0
        })

        this.showCustomer = false
        this.showContact = false
      }

      this.customers = await api.find('organisation', {})
      this.customerChanged()
    }
  },
  async mounted() {
    const id = this.$route.params.id
    this.customers = await api.find('organisation', {})
    if (id === 'new') {
      this.item = {
        state: 'LEAD',
        effort_unit: 'Hours',
        template: false,
        customer: {},
        contact: {
          type: 'PROJECT',
          role: 'Customer',
          user: {},
          _meta: {
            user: { ignore: true },
          }
        },
        _meta: {
          customer: { ignore: true },
          contact: { ignore: true },
        }
      }
      this.showCustomer = true
      this.showContact = true

    } else {
      this.item = await api.findFirst('project', {
        and: { id: id },
        with: {
          customer: { one: 'organisation', this: 'customer_id' },
          contact: {
            one: 'allocation',
            this: 'id',
            that: 'project_id',
            query: {
              and: { role: 'Customer' },
              with: {
                user: { one: 'users', this: 'user_id' }
              }
            },
          }
        }
      })
      if (!this.item.contact) this.item.contact = {
        type: 'PROJECT',
        role: 'Customer',
        user: {},
        _meta: { user: { ignore: true } }
      }
      this.customerChanged()
    }
  }

}
</script>

<style lang="scss" scoped>
</style>
