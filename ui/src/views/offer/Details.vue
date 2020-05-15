<template>
  <div class="components-container">
    <generic-details type="accounting" :id="oid" :fields="fields" :buttons="buttons" :template="template" :image="image" @update="i => item=i" :reload="true"/>
  </div>
</template>

<script>

import GenericDetails from '@/components/Generic/Details'
import image from '@/assets/images/undraw_discount_d4bd.svg'
import api from '@/api'

export default {
  name: 'OfferDetails',
  props: ['id', 'oid'],
  components: { GenericDetails },
  computed: {
    buttons() {
      const workflow = {
        'NEW': ['Send', 'Copy'],
        'SENT': ['Accepted', 'Rejected', 'Reset', 'Copy'],
        'ACCEPTED': ['Reset', 'Copy'],
        'REJECTED': ['Reset', 'Copy'],
      }
      if (!this.item) return []
      const valid = workflow[this.item.state]
      return this.allButtons.filter(b => valid.indexOf(b.label)!=-1)
    }
  },
  data() {
    return {
      item: null,
      image: image,
      template: { project_id: this.id, name: 'Quote of ' + (new Date().toLocaleDateString()), type: 'QUOTE', state: 'NEW', pricePerUnit: 100, percentBuffer: 15, rounding: 0 },
      fields: [
        { name: 'name', label: 'Name' },
        { name: 'price', disabled: true, label: 'Price', postfix: 'EUR' },
        { name: 'pricePerUnit', label: 'Rate', postfix: '/ h' },
        { name: 'percentBuffer', label: 'Buffer', postfix: '%' },
        { name: 'rounding', label: 'Rounding', type: 'select', options: ['0','1','2','3','-1', '-2' ] },
        { name: 'state', disabled: true, label: 'State' },
      ],
      allButtons: [
        {label: 'Reset', action: item => item.state='NEW', shown: item => item.state === 'NEW', andSave: true },
        {label: 'Send', action: item => item.state='SENT', andSave: true },
        {label: 'Accepted', action: item => item.state='ACCEPTED', andSave: true },
        {label: 'Rejected', action: item => item.state='REJECTED', andSave: true },
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
      const copy = this.clone(orig, {
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
    clone(orig, options) {
      const copy = Object.assign({}, orig, options.mask || {})
      delete copy.id
      if (orig._meta) {
        copy._meta = Object.assign({}, orig._meta)
      }
      if (options.refs) {
        for (const ref in options.refs) {
          const meta = copy._meta[ref]
          meta.ignore = false
          if (meta.many) {
            copy[ref] = orig[ref].map(o => this.clone(o, options.refs[ref]))
          }
          if (meta.one) {
            copy[ref] = this.clone(orig[ref], options.refs[ref])
          }
        }
      }
      return copy
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
