import Parent from '@/router/view.vue'
import ProjectTabs from '@/components/custom/ProjectTabs'
import GlTabs from 'gluon-frontend/gl-tabs'
import GlTable from 'gluon-frontend/gl-table'

export default   {
  path: '/leads',
  component: Parent,
  name: 'Sales',
  meta: {
    icon: 'el-icon-shopping-cart-2'
  },
  redirect: '/leads/all',
  children: [
    {
      path: 'all',
      component: GlTabs,
      name: 'Leads',
      props: true,
      redirect: 'all/list',
      children: [
        {
          path: 'list',
          component: () => import('@/views/leads/List'),
          name: 'List',
        },
        {
          path: 'funnel',
          component: () => import('@/views/leads/Funnel'),
          name: 'Funnel',
        },
      ]
    },
    {
      path: 'lead/:id',
      component: ProjectTabs,
      name: 'Lead',
      props: true,
      redirect: 'detail',
      children: [
        {
          path: 'detail',
          component: () => import('@/views/leads/Details'),
          props: true,
          name: 'Lead-Detail',
          meta: {
            title: 'Detail'
          },
        },
        {
          path: 'timeline',
          component: () => import('@/views/leads/Timeline'),
          props: true,
          name: 'Lead-Timeline',
          meta: {
            title: 'Timeline',
            roles: ['Admin']
          },
        },
        {
          path: 'tasks',
          component: () => import('@/views/leads/Tasks'),
          props: true,
          name: 'Lead-Tasks',
          meta: {
            title: 'Tasks'
          },
        },
        {
          path: 'offers',
          component: GlTable,
          props: route => ({
            type: 'accounting',
            template: { project_id: route.params.id, type: 'QUOTE', state: 'NEW', pricePerUnit: 100, percentBuffer: 15, rounding: "10" },
            query: { project_id: route.params.id, type: 'QUOTE' },
            with: { },
            type: 'accounting',
            columns: [
              { name: 'name', editable: true, placeholder: "New Offer..." },
              { name: 'price', editable: false },
              { name: 'state', editable: false, type: 'select', options: ['NEW', 'SENT', 'ACCEPTED', 'REJECTED' ] },
              { name: 'approved_at', editable: false },
            ],
            createBy: "button",
            detail: 'offer',
            allowDelete: true,
          }),
          name: 'Offers',
          meta: {
            roles: ['Admin']
          },
        },
        {
          path: 'offer/:oid/detail',
          component: () => import('@/views/offer/Details'),
          props: true,
          name: 'Offer',
        },
        {
          path: 'offer/:oid/positions',
          component: () => import('@/views/offer/Positions'),
          props: true,
          name: 'Positions',
        },
        {
          path: 'invoices',
          component: GlTable,
          props: route => ({
            type: 'accounting',
            template: { project_id: route.params.id, type: 'INVOICE', state: 'NEW' },
            query: { project_id: route.params.id, type: 'INVOICE' },
            with: { reference: {one: 'accounting', this: 'reference_id'} },
            type: 'accounting',
            columns: [
              { name: 'name', editable: true },
              { name: 'reference.name', editable: false },
              { name: 'price', editable: true },
              { name: 'state', editable: false, type: 'select', options: ['NEW', 'SENT', 'PAYED' ] },
              { name: 'approved_at', type: "date", editable: true },
            ],
            createBy: "button",
            allowDelete: true,
          }),
          name: 'Invoices',
          meta: {
            roles: ['Admin']
          },
        },
      ]
    },
  ]
}
