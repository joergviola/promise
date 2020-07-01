import Vue from 'vue'
import moment from 'moment'

Vue.filter('dateHuman', function (value) {
  if (!value) return ''

  if (!(value instanceof Date) )
    value = new Date(value);
  return moment(value).fromNow();
})

Vue.filter('date', function (value) {
  if (!value) return ''

  if (!(value instanceof Date) )
    value = new Date(value);
  return moment(value).format('L')
})

Vue.filter('datetime', function (value) {
  if (!value) return ''
  if (!(value instanceof Date) )
    value = new Date(value);

 // return value.toLocaleString()
  return formatDateTime(value);
})

Vue.filter('currency', (value, currency = 'EUR', currencyDisplay = 'code') => {
  let v = 0
  try {
    if (typeof value === 'string') {
      v = parseInt(value)
    }
    v = value
  } catch (error) {
    v = 0
  }

  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currencyDisplay,
    currency,
  }).format(v)
})

Vue.filter('number', (value) => {
  let v = 0
  if (value === null) {
    return ''
  }

  try {
    if (typeof value === 'string') {
      v = parseInt(value)
    }

    v = value
  } catch (error) {
    v = 0
  }

  return v.toLocaleString('de-DE', { style: 'decimal' })
})
