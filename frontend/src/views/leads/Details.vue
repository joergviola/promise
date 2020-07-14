<template>
  <div class="components-container" v-loading="loading">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form label-position="left" label-width="120px" >
          <el-form-item :label="$t('type.project.name')">
            <el-input v-model="item.name" type="text" :disabled="readonly"/>
          </el-form-item>
          <el-form-item :label="$t('type.project.description')">
            <el-input v-model="item.description" type="textarea" :rows="2" :autosize="{ minRows: 2, maxRows: 4}" :disabled="readonly" />
          </el-form-item>
          <el-form-item :label="$t('type.project.links')">
            <link-editor v-model="item.links" :disabled="readonly"/>
          </el-form-item>
          <el-form-item :label="$t('type.project.source')">
            <el-select v-model="item.source" :disabled="readonly">
              <el-option v-for="(o, i) in sources" :key="i" :label="o" :value="o" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('type.project.effort_unit')">
            <el-select v-model="item.effort_unit" :disabled="readonly">
              <el-option v-for="(o, i) in units" :key="i" :label="o" :value="o" />
            </el-select>
            <span v-if="item.planned>0">({{$t('ui.leads.planned')}}: {{item.planned}})</span>
          </el-form-item>
          <el-form-item v-if="item.state=='REJECTED'" :label="$t('type.project.lost_reason')">
            <el-input v-model="item.lost_reason" type="text" :disabled="readonly" />
          </el-form-item>
          <el-form-item :label="$t('type.project.customer_id')">
            <el-select v-model="item.customer_id" @change="customerChanged" placeholder="New ..." :disabled="readonly">
              <el-option key="new" :label="$t('ui.list.add')" :value="null" />
              <el-option v-for="(o, i) in customers" :key="i" :label="o.name" :value="o.id" />
            </el-select>
            <el-button class="default" @click="showCustomer=!showCustomer">
              {{$t('ui.detail.details')}}
              <i v-show="!showCustomer" class="el-icon-arrow-right"></i>
              <i v-show="showCustomer" class="el-icon-arrow-down"></i>
            </el-button>
          </el-form-item>
          <el-collapse-transition>
            <el-card v-show="showCustomer">
              <el-form-item :label="$t('type.organisation.name')">
                <el-input v-model="item.customer.name" type="text"  :disabled="readonly"/>
              </el-form-item>
              <el-form-item :label="$t('type.organisation.email')">
                <el-input v-model="item.customer.email" type="text"  :disabled="readonly"/>
              </el-form-item>
              <el-form-item :label="$t('type.organisation.phone')">
                <el-input v-model="item.customer.phone" type="text"  :disabled="readonly"/>
              </el-form-item>
              <el-form-item :label="$t('type.organisation.website')">
                <el-input v-model="item.customer.website" type="text"  :disabled="readonly"/>
              </el-form-item>
            </el-card>
          </el-collapse-transition>
          <el-form-item :label="$t('type.project.contact')">
            <el-select v-model="item.contact.user_id" @change="contactChanged" placeholder="New ..." :disabled="readonly">
              <el-option key="new" :label="$t('ui.list.add')" :value="null" />
              <el-option v-for="(o, i) in contacts" :key="i" :label="o.name" :value="o.id" />
            </el-select>
            <el-button class="default" @click="showContact=!showContact">
              {{$t('ui.detail.details')}}
              <i v-show="!showContact" class="el-icon-arrow-right"></i>
              <i v-show="showContact" class="el-icon-arrow-down"></i>
            </el-button>
          </el-form-item>
          <el-collapse-transition>
            <el-card v-show="showContact">
              <el-form-item :label="$t('type.users.name')">
                <el-input v-model="item.contact.user.name" type="text" :disabled="readonly"/>
              </el-form-item>
              <el-form-item :label="$t('type.users.email')">
                <el-input v-model="item.contact.user.email" type="text" :disabled="readonly" />
              </el-form-item>
              <el-form-item :label="$t('type.users.phone')">
                <el-input v-model="item.contact.user.phone" type="text" :disabled="readonly" />
              </el-form-item>
              <el-form-item :label="$t('type.users.mobile')">
                <el-input v-model="item.contact.user.mobile" type="text" :disabled="readonly" />
              </el-form-item>
              <el-form-item :label="$t('type.users.comment')">
                <el-input v-model="item.contact.user.comment" type="textarea" :autosize="{minRows:2}" :disabled="readonly" />
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
        <el-button v-if="!readonly" type="primary" @click="save()">{{$t('ui.detail.save')}}</el-button>
        <el-button v-if="!item.template && !readonly" type="secondary" @click="saveAsTemplate(true)">{{$t('ui.leads.istemplate')}}</el-button>
        <el-button v-if="item.template && !readonly" type="secondary" @click="saveAsTemplate(false)">{{$t('ui.leads.notemplate')}}</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LinkEditor from 'gluon-ui/gl-linkEditor'
import image from '@/assets/img/undraw_unboxing_pbmf.svg'
import api from '@/api'

export default {
  name: 'LeadDetails',
  props: {},
  components: {LinkEditor},
  data() {
    return {
      item: { customer: {}, contact: { user: {} } },
      sources: ['Web', 'Phone', 'Chat', 'E-Mail', '???'],
      units: ['Hour', 'Point', 'Euro', ''],
      showCustomer: false,
      customers: [],
      showContact: false,
      contacts: [],
      image: image,
      loading: false,
    }
  },
  computed: {
    readonly() {
      const rights = api.user().role.rights
        .filter(right => right.tables=='*' || right.tables.search('project')!=-1)
        .filter(right => right.actions.indexOf('U')!=-1)
      return rights.length==0
    },
  },
  methods: {
    async customerChanged() {
      if (!this.item.customer_id) {
        this.contacts = []
        this.item.customer = {}
        this.item.contact = { type: 'PROJECT', role: 'Customer', user: {},  _meta: { user: { ignore: true }, } }
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
      this.loading = true
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
      this.loading = false
    }
  },
  async mounted() {
    this.loading = true
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
    this.loading = false
  }

}
</script>

<style lang="scss" scoped>
</style>
