<template>
  <div class="components-container">
    <generic-details type="accounting" :id="id" :fields="fields" :buttons="buttons" :image="image" @update="i => item=i"/>
  </div>
</template>

<script>

import GenericDetails from '@/components/Generic/Details'
import image from '@/assets/images/undraw_discount_d4bd.svg'

export default {
  name: 'OfferDetails',
  props: ['id'],
  components: { GenericDetails },
  computed: {
    buttons() {
      const workflow = {
        'NEW': ['Send'],
        'SENT': ['Accepted', 'Rejected', 'Reset'],
        'ACCEPTED': ['Reset'],
        'REJECTED': ['Reset'],
      }
      if (!this.item) return []
      const valid = workflow[this.item.state]
      console.log(valid)
      return this.allButtons.filter(b => valid.indexOf(b.label)!=-1)
    }
  },
  data() {
    return {
      item: null,
      image: image,
      fields: [
        { name: 'name', label: 'Name' },
        { name: 'price', disabled: true, label: 'Price', postfix: 'EUR' },
        { name: 'pricePerUnit', label: 'Rate', postfix: '/ h' },
        { name: 'percentBuffer', label: 'Buffer', postfix: '%' },
        { name: 'rounding', label: 'Rounding', type: 'select', options: ['0','1','10','100','1000' ] },
        { name: 'state', disabled: true, label: 'State' },
      ],
      allButtons: [
        {label: 'Reset', action: item => item.state='NEW', shown: item => item.state === 'NEW', andSave: true },
        {label: 'Send', action: item => item.state='SENT', andSave: true },
        {label: 'Accepted', action: item => item.state='ACCEPTED', andSave: true },
        {label: 'Rejected', action: item => item.state='REJECTED', andSave: true }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
