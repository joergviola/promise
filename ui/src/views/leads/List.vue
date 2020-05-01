<template>
  <div class="app-container">
    <div class="filter-container">
      <el-col :span="24" type="flex" align="right">
        <el-button class="filter-item pull-right" style="margin-right: 10px;" type="primary" icon="el-icon-edit" @click="$router.push('/leads/lead/new')">
          Add
        </el-button>
      </el-col>
    </div>

    <el-table v-loading="loading" :data="list">

      <el-table-column label="Title">
        <template slot-scope="{row}">
          <el-input class="no-border" v-model="row.name" @blur="save(row, 'name')"/>
        </template>
      </el-table-column>

      <el-table-column label="Customer" prop="customer.name"/>

      <el-table-column label="State" prop="state" />

      <el-table-column align="right" label="Actions" fixed="right">
        <template slot-scope="{row}">
          <el-button class="filter-item pull-right" type="primary" icon="el-icon-edit" @click="$router.push('/leads/lead/'+row.id)">
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import list from '@/mixins/list'

export default {
  name: 'LeadList',
  mixins: [list]
}
</script>

<style scoped type="sass">
</style>
