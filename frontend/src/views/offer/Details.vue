<template>
  <div class="components-container">
    <gl-editor 
      type="accounting" 
      :id="oid" 
      :fields="fields" 
      :buttons="buttons" 
      :with="w" 
      :template="template" 
      :image="image" 
      @update="i => item=i" 
      :reload="true"
    />
  </div>
</template>

<script>
import GlEditor from 'gluon-frontend/gl-editor'
import image from '@/assets/img/undraw_discount_d4bd.svg'
import api from 'gluon-api'

export default {
  name: 'OfferDetails',
  props: ['id', 'oid'],
  components: { GlEditor },
  computed: {
    buttons() {
      const workflow = {
        'NEW': ['Send', 'Copy'],
        'SENT': ['Accept', 'Reject', 'Reset', 'Copy'],
        'ACCEPTED': ['Reset', 'Copy'],
        'REJECTED': ['Reset', 'Copy'],
      }
      if (!this.item) return []
      const valid = workflow[this.item.state]
      return this.allButtons.filter(b => valid.indexOf(b.label)!=-1)
    },
    fields() {
      return [
        { name: 'name', label: 'Name' },
        { name: 'price', disabled: true, label: 'Price', postfix: 'EUR' },
        { name: 'pricePerUnit', label: 'Rate', postfix: this.item ? '/ ' + this.item.project.effort_unit : ''},
        { name: 'percentBuffer', label: 'Buffer', postfix: '%' },
        { name: 'rounding', label: 'Rounding', type: 'select', options: ['0','1','2','3','-1', '-2' ] },
        { name: 'invoicing', type: 'select', options: ['30-40-30','ONE','NONE' ] },
        { name: 'state', disabled: true, label: 'State' },
      ]
    },

  },
  data() {
    return {
      item: null,
      image: image,
      template: { project_id: this.id, name: 'Quote of ' + (new Date().toLocaleDateString()), type: 'QUOTE', state: 'NEW', pricePerUnit: 100, percentBuffer: 15, rounding: 0 },
      w: { project: {one: 'project'} },
      allButtons: [
        {label: 'Reset', action: item => item.state='NEW', shown: item => item.state === 'NEW', andSave: true },
        {label: 'Send', action: item => item.state='SENT', andSave: true },
        {label: 'Accept', action: item => item.state='ACCEPTED', andSave: true },
        {label: 'Reject', action: item => item.state='REJECTED', andSave: true },
        {label: 'Copy', action: this.copy, andSave: false }
      ]
    }
  },
  methods: {
    async copy(item) {
      const items = await api.find('accounting', {
        and: {id: item.id},
        with: {
          positions: { many: 'position' }
        }
      })
      const orig = items[0]
      console.log('orig', orig)
      const copy = api.clone(orig, {
        mask: {
          name: orig.name + ' (Copy)',
          state: 'NEW',
          price: null,
          approved_at: null,
          accepted_at: null
        },
        refs: {
          positions: {
            mask: {
              planned: null,
              price: null
            }
          }
        }
      })
      console.log('copy', copy)
      const { id } = await api.create('accounting', copy)
      this.$router.push(`../${id}/detail`)
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
