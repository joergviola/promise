import GlTable from 'gluon-frontend/gl-table'
import ProjectTabs from '@/components/custom/ProjectTabs'


export default {
  path: '/backoffice',
  component: ProjectTabs,
  props: true,
  name: 'Backoffice',
  redirect: '/backoffice/hours',
  meta: {
    roles: ['Admin'],
    icon: 'el-icon-office-building',
  },    
  children: [
    {
      path: 'hours',
      component: GlTable,
      props: route => ({
        type: 'action',
        template: {  },
        query: { project_id: route.params.id },
        with: { 
          user: { one: 'users', this: 'user_id'},
          task: { one: 'task'},
        },
        columns: [
          { name: 'user.name', label: 'User' },
          { name: 'task.name', label: 'Task', width: 200 },
          { name: 'from', label: 'Started', type: 'datetime', editable: true, width: 180 },
          { name: 'used', label: 'Duration', editable: true },
          { name: 'comment', label: 'Comment', editable: true, width: 200 },
        ],
        createBy: "row",
        allowDelete: true,
      }),
      name: 'Hours',
      meta: {
        roles: ['Admin'],
        icon: 'el-icon-office-building',
      },    
    },
  ]
}
