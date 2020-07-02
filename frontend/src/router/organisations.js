import Home from '@/views/Home.vue'
import Parent from '@/router/view.vue'
import Tabs from '@/components/layout/Tabs.vue'
import List from '@/components/generic/List.vue'
import Details from '@/components/generic/Details.vue'
import ProjectTabs from '@/components/custom/ProjectTabs'

export default {
  path: '/org',
  component: Parent,
  name: 'Organisations',
  meta: {
    icon: 'el-icon-s-custom',
    roles: ['Admin']
  },
  redirect: '/org/all',
  children: [
    {
      path: 'offers',
      component: List,
      props: route => ({
        type: 'accounting',
        template: { project_id: route.params.id, type: 'QUOTE', state: 'NEW', pricePerUnit: 100, percentBuffer: 15, rounding: "10" },
        query: { project_id: route.params.id, type: 'QUOTE' },
        with: { },
        type: 'accounting',
        columns: [
          { name: 'name', editable: true, placeholder: "New Offer..." },
          { name: 'price', editable: false },
          { name: 'state', editable: false },
          { name: 'approved_at', editable: false },
        ],
        createBy: "button",
        detail: 'offer'
      }),
      name: 'Offers',
      meta: {
        roles: ['Admin']
      },
},
    {
      path: ':id/detail',
      component: () => import('@/views/users/Form'),
      name: 'User',
    },
  ]
}
