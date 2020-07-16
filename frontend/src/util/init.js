
import api from 'gluon-api'
import store from '@/util/Store.js'


async function getRunningAction() {
  const actions = await api.find('action', {
    and: {
      from: {'<>': null},
      to: null,
    } 
  })
  if (actions.length>1) {
    alert('More than one running action.')
  }
  if (actions.length>0) {
    return actions[0]
  } else {
    return null
  }
}

export default async function init() {
  if (!api.user()) return;

  const action = await getRunningAction()
  if (action) store.action = action
}