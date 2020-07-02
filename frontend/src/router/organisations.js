import Home from '@/views/Home.vue'
import Parent from '@/router/view.vue'
import Tabs from '@/components/layout/Tabs.vue'
import List from '@/components/generic/List.vue'
import Details from '@/components/generic/Details.vue'
import ProjectTabs from '@/components/custom/ProjectTabs'

export default {
  path: '/org',
  component: Tabs,
  name: 'Organisations',
  meta: {
    icon: 'el-icon-s-custom',
    roles: ['Admin']
  },
  redirect: '/org/all',
  children: [
    {
      path: 'all',
      component: List,
      props: route => ({
        type: 'organisation',
        template: {  },
        query: {  },
        with: { },
        columns: [
          { name: 'name', editable: true, placeholder: "New Offer..." },
        ],
        createBy: "button",
        detail: '.'
      }),
      name: 'Organisations',
      meta: {
        roles: ['Admin']
      },
    },
    {
      path: ':id/detail',
      component: Details,
      name: 'Organisation',
      props: route => ({
        type: 'organisation',
        id: route.params.id,
        fields: [
          {name: 'name'},
          {name: 'email'},
          {name: 'website'},
          {name: 'phone'},
        ]
      })
    },
    {
      path: ':id/users',
      component: List,
      props: route => ({
        type: 'users',
        template: {  },
        query: { organisation_id: route.params.id },
        with: { role: {one: 'role'} },
        columns: [
          { name: 'name', editable: true },
          { name: 'role.name' },
        ],
        createBy: "button",
        detail: '.'
      }),
      name: 'Users',
      meta: {
        roles: ['Admin']
      },
    },
    {
      path: ':id/:uid/detail',
      component: Details,
      name: 'User',
      props: route => ({
        type: 'users',
        id: route.params.uid,
        fields: [
          {name: 'name'},
          {name: 'email'},
          {name: 'phone'},
          {name: 'mobile'},
          {name: 'comment', type: 'textarea'},
          { name: 'password', label: 'Password', type: 'password' },
          { name: 'role_id', label: 'Role', type: 'to-one', ref: 'role', display: 'name'},
          { name: 'organisation_id', label: 'Organsisation', type: 'to-one', ref: 'organisation', display: 'name' },
          ]
      })
    },
  ]
}
