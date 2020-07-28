import GlTable from 'gluon-frontend/gl-table'
import ProjectTabs from '@/components/custom/ProjectTabs'
import states from '@/util/states'

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
          task: { one: 'task', query: {
            with: { 
              project: {one: 'project', query: {
                with: { 
                  customer: {one: 'organisation', this: 'customer_id'}
                }
              }}
            }
          }},
        },
        join: {
          'task': {this: 'task_id', that: 'id'},
          'project': {from: 'task', this: 'project_id', that: 'id'},
        },
        columns: [
          { name: 'user.name', label: 'User', width: 100 },
          { name: 'task.name', label: 'Task', width: 200 },
          { name: 'task.project.name', width: 200 },
          { name: 'task.project.customer.name', width: 200 },
          { name: 'from', label: 'Started', type: 'datetime', editable: true, width: 180 },
          { name: 'used', label: 'Duration', editable: true },
          { name: 'comment', label: 'Comment', editable: true, width: 200 },
        ],
        createBy: "row",
        allowDelete: true,
        filter: {
          search: [
            {name: 'project.customer_id', type: 'to-one', ref:'organisation', id:'id', display:'name'},
            {name: 'project.id', type: 'to-one', ref:'project', id:'id', display:'name'},
            {name: 'action.user_id', type: 'to-one', ref:'users', id:'id', display:'name'},
            {name: 'from', to:'to', type: 'daterange'},
            {name: 'task.state', type: 'select', options: states.task.map(s => s.state)},
          ],
          group: [
            {
              name: 'project.customer_id', 
              columns: [
                { name: 'customer.name', width: 200 },
              ],
              with: {
                customer: {one: 'organisation', this: 'customer_id'}
              }
            },
            {
              name: 'task.project_id', 
              columns: [
                { name: 'project.name', width: 200 },
              ],
              with: {
                project: {one: 'project'}
              }
            },
            // {name: 'from', select: {sum: 'used'}},
            // {name: 'project.id', select: ['project.name', {used: 'sum'}]},
            // {name: 'action.user_id'},
            // {name: 'task.state'},
          ],
          reducedColumns: [
            {name: 'used', select: {sum: 'action.used'}},
          ]
        },
    }),
      name: 'Hours',
      meta: {
        roles: ['Admin'],
        icon: 'el-icon-office-building',
      },    
    },
  ]
}
