import Home from '@/views/Home.vue'
import Parent from '@/router/view.vue'
import Tabs from 'gluon-frontend/gl-tabs.vue'
import GlTable from 'gluon-frontend/gl-table'
import GlEditor from 'gluon-frontend/gl-editor'
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
      component: GlTable,
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
      component: GlEditor,
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
      component: GlTable,
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
      component: GlEditor,
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
