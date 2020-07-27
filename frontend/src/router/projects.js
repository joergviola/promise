import Parent from '@/router/view.vue'
import ProjectTabs from '@/components/custom/ProjectTabs'
import GlTable from 'gluon-frontend/gl-table'


export default   {
  path: '/projects',
  component: Parent,
  name: 'Projects',
  meta: {
    icon: 'el-icon-folder',
  },
  redirect: '/projects/all',
  children: [
    {
      path: 'all',
      component: () => import('@/views/projects/List'),
      name: 'All',
    },
    {
      path: 'project/:id',
      component: ProjectTabs,
      props: true,
      name: 'Project',
      redirect: 'detail',
      children: [
        {
          path: 'detail',
          component: () => import('@/views/projects/Details'),
          props: true,
          name: 'Project-Detail',
          meta: {
            title: 'Detail'
          },
        },
        {
          path: 'tasks',
          component: () => import('@/views/projects/Tasks'),
          props: true,
          name: 'Project-Tasks',
          meta: {
            title: 'Tasks',
            show: params => params.id!='new'
          },
        },
        {
          path: 'board',
          component: () => import('@/views/projects/Board'),
          props: true,
          name: 'Board',
          meta: {
            show: params => params.id!='new'
          },
        },
        {
          path: 'task/:tid/detail',
          component: () => import('@/views/task/Details'),
          props: true,
          name: 'Task',
        },
        {
          path: 'team',
          component: () => import('@/views/projects/Team'),
          props: true,
          name: 'Team',
          meta: {
            show: params => params.id!='new'
          },
        },
        {
          path: 'state',
          component: () => import('@/views/projects/Burndown'),
          props: true,
          name: 'State',
          meta: {
            show: params => params.id!='new'
          },
        },
      ]
    }
  ]
}
