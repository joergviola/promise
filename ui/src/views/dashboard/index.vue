<template>
  <div class="components-container">
    <h2>Welcome, {{user.name}}</h2>
    <generic-list
      type="task"
      :columns="columns"
      :with="w"
      :query="query"
      create-by="row"
    />
<button @click="test">Test</button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GenericList from '@/components/Generic/List'

export default {
  name: 'Dashboard',
  components: { GenericList },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  data() {
    console.log('XXX', 'data', this.user)
    return {
      query: { user_id: 1, state: 'APPROVED' },
      w: {
        project: { one: 'project' }
      },
      type: 'task',
      columns: [
        { name: 'name', label: 'Name', editable: true, placeholder: "New Task..." },
        { name: 'project.name', label: 'Project' },
        { name: 'planned', label: 'Planned' },
        { name: 'used', label: 'Used' },
      ]
    }
  },
  methods: {
    test() {
      console.log('XXX', this.user)
    }
  }
}
</script>
