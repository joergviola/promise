

export default {
  path: '/planning',
  component: () => import('@/views/planning/Gantt'),
  name: 'Planning',
  meta: {
    icon: 'el-icon-date',
    roles: ['Admin']
  },
}
