<template>
  <div class="app-container">
    <div v-if="createBy=='button'" class="filter-container">
      <el-col :span="24" type="flex" align="right">
        <el-button class="filter-item pull-right" style="margin-right: 10px;" type="primary" icon="el-icon-edit" @click="$router.push(detail + '/new')">
          Add
        </el-button>
      </el-col>
    </div>

    <el-table v-loading="loading" :data="list">

      <el-table-column v-for="(col,i) in columns" :key="i" :label="col.label">
        <template slot-scope="{row}">
          <el-input v-if="col.editable && !col.type" class="no-border" v-model="row[col.name]" @blur="save(row, col.name)" :placeholder="col.placeholder" />
          <span v-if="!col.editable">{{_.get(row, col.name)}}</span>
          <el-select v-if="col.type=='select'" class="no-border" v-model="row[col.name]" @blur="save(row, col.name)"  :placeholder="col.placeholder">
            <el-option v-for="(o, i) in col.options" :key="i" :label="col.display ? _.get(o, col.display) : o" :value="col.id ? _.get(o, col.id) : o" />
          </el-select>
          <el-date-picker
            :placeholder="col.placeholder"
            class="no-border"
            v-if="col.type=='date'"
            v-model="row[col.name]"
            :type="col.type"
            value-format="yyyy-MM-dd"
            @blur="save(row, col.name)"
          />

        </template>
      </el-table-column>

      <el-table-column align="right" label="Actions" fixed="right">
        <template slot-scope="{row}">
          <el-button v-if="row.id && detail" class="filter-item pull-right" type="primary" icon="el-icon-edit" @click="$router.push(detail+'/'+row.id)">
          </el-button>
          <el-button v-if="row.id" class="filter-item pull-right" type="danger" icon="el-icon-remove" @click="remove(row)">
          </el-button>
          <el-button v-if="!row.id" class="filter-item pull-right" type="primary" icon="el-icon-plus" @click="create(row)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import list from '@/mixins/list'

export default {
  name: 'GenericList',
  mixins: [list],
  props: ['type', 'detail', 'columns', 'with', 'template', 'createBy'],
  data() {
    return {
    }
  }

}
</script>

<style scoped type="sass">
</style>
