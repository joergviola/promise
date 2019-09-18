<template>
  <div class="app-container">
    <div class="filter-container">
      <el-col :span="12" type="flex" align="left">
        <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          Search
        </el-button>
      </el-col>
      <el-col :span="12" type="flex" align="right">
        <el-button class="filter-item pull-right" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="$router.push('/leads/lead/new')">
          Add
        </el-button>
      </el-col>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="Title">
        <template slot-scope="{row}">
          <template v-if="row.edit">
              <el-input v-model="row.name" class="edit-input" size="small" />
              <div v-if="row.edit" class="cancel-btn">
                  <i class="el-icon-close" @click="cancelEdit(row)"></i>
                  <i class="el-icon-check" @click="confirmEdit(row)"></i>
              </div>
          </template>
          <span v-else @click="row.edit=!row.edit">{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="Customer">
        <template slot-scope="scope">
          <span>{{ scope.row.customer.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="80" fixed="right">
        <template slot-scope="{row}">
            <i class="el-icon-more-outline" @click="$router.push('/leads/lead/'+row.id)"></i>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import api from '../../api'

export default {
  name: 'InlineEditTable',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const items = await api.find('project', {
        and: [{ state: 'LEAD' }],
        with: {customer: {one:'customer', 'this': 'customer_id'}}
      })
      this.list = items.map(v => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalName = v.name //  will be used when user click the cancel botton
        return v
      })
      this.listLoading = false
    },
    cancelEdit(row) {
      row.name = row.originalName
      row.edit = false
      this.$message({
        message: 'The name has been restored to the original value',
        type: 'warning'
      })
    },
    async confirmEdit(row) {
      row.edit = false
      row.originalName = row.name
      await api.update('project', row.id, {name: row.name})
      this.$message({
        message: 'The title has been edited',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped type="sass">
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
i {
    cursor: pointer;
}
i:hover {
    background-color: #4e555b;
    color: white;
}
</style>
