<template>
  <div>
    <div class="filter-container">
      <el-col :span="24" type="flex" align="right">
        <slot name="header"></slot>
        <el-button v-if="groupBy" type="default" @click="addGroup()">
            {{$t('ui.list.addGroup')}}
        </el-button>
        <el-button v-if="createBy=='button'" class="filter-item pull-right" style="margin-right: 10px;" type="primary" icon="el-icon-edit" @click="$router.push(detail + '/new/detail')">
          {{$t('ui.list.add')}}
        </el-button>
      </el-col>
    </div>
    <div ref="groupedTable">
      <div v-for="(group,groupIndex) in lists" :key="group.key" class="group"   :data-list="group.group">
        <div v-if="groupBy && group.header" class="grouped-header">
          <svg class="group-handle grab" focusable="false" viewBox="0 0 32 32"><path fill="#CCCCCC" d="M14,5.5c0,1.7-1.3,3-3,3s-3-1.3-3-3s1.3-3,3-3S14,3.8,14,5.5z M21,8.5c1.7,0,3-1.3,3-3s-1.3-3-3-3s-3,1.3-3,3S19.3,8.5,21,8.5z M11,12.5c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S12.7,12.5,11,12.5z M21,12.5c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S22.7,12.5,21,12.5z M11,22.5c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S12.7,22.5,11,22.5z M21,22.5c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S22.7,22.5,21,22.5z"></path></svg>
          <i v-if="group.show" class="el-icon-caret-bottom"  @click="group.show = !group.show"/>
          <i v-if="!group.show" class="el-icon-caret-right"  @click="group.show = !group.show"/>
          <el-input v-if="!groupBy.type || groupBy.type=='text'" v-model="group.group" class="no-border heading" @change="groupChanged(group)"/>
          <el-select v-else-if="groupBy.type=='select'" v-model="group.group" class="no-border heading" @change="groupChanged(group)">
            <el-option 
              v-for="(o, i) in groupBy.options" 
              :key="i" 
              :label="groupBy.display ? _.get(o, groupBy.display) : $t('type.'+type+'.'+groupBy.field+'-options.'+o)" 
              :value="groupBy.id ? _.get(o, groupBy.id) :o" />
          </el-select>

        </div>
        <el-table 
          v-if="group.show" 
          ref="theTable" 
          v-loading="loading" 
          :show-header="groupIndex==0" 
          :data="group.list" 
          row-key="id" 
          fit
          border
          @row-click="row => !hasEditable && detailClicked(row)"
          @header-dragend="columnChanged">
          <el-table-column v-if="sort" label="" width="25">
            <template slot-scope="{row, $index}">
              <svg class="handle grab" focusable="false" viewBox="0 0 32 32"><path fill="#CCCCCC" d="M14,5.5c0,1.7-1.3,3-3,3s-3-1.3-3-3s1.3-3,3-3S14,3.8,14,5.5z M21,8.5c1.7,0,3-1.3,3-3s-1.3-3-3-3s-3,1.3-3,3S19.3,8.5,21,8.5z M11,12.5c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S12.7,12.5,11,12.5z M21,12.5c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S22.7,12.5,21,12.5z M11,22.5c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S12.7,22.5,11,22.5z M21,22.5c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S22.7,22.5,21,22.5z"></path></svg>
            </template>
          </el-table-column>
          <el-table-column v-for="(col,i) in columns" :key="i" :label="$t('type.'+type+'.'+ col.name)" :prop="col.name" :align="col.align" :minWidth="col.width" sortable :data-column="i">
            <template slot-scope="{row, $index}">
              <el-input
                v-if="editable(row, col) && (!col.type || col.type=='text')"
                class="no-border"
                v-model="row[col.name]"
                :disabled="!editable(row, col) || readonly"
                @change="save(row, col.name)"
                :placeholder="col.placeholder"
                :ref="`field-${groupIndex}-${$index}-${i}`"
                :data-r="`field-${groupIndex}-${$index}-${i}`"
                @keydown.enter.native="onEnter(row, groupIndex, i, $index)"
                @keydown.up.native="onArrow(groupIndex, i, $index, -1)"
                @keydown.down.native="onArrow(groupIndex, i, $index, +1)"
                @keydown.delete.native="event=>onDelete(event, row, groupIndex, i, $index)"
              />
              <el-input
                v-if="col.type=='textarea'"
                class="no-border"
                v-model="row[col.name]"
                type="textarea"
                :rows="1" 
                autosize 
                :disabled="!editable(row, col) || readonly"
                @change="save(row, col.name)"
                :placeholder="col.placeholder"
                :ref="`field-${groupIndex}-${$index}-${i}`"
                :data-r="`field-${groupIndex}-${$index}-${i}`"
                @keydown.up.native="onArrow(groupIndex, i, $index, -1)"
                @keydown.down.native="onArrow(groupIndex, i, $index, +1)"
                @keydown.delete.native="event=>onDelete(event, row, groupIndex, i, $index)"
              />
              <el-checkbox
                v-if="col.type=='checkbox'"
                class="no-border"
                :value="!!row[col.name]"
                @input="value => row[col.name] = value"
                :disabled="!editable(row, col) || readonly"
                @change="save(row, col.name)"
                :placeholder="col.placeholder"
                :ref="`field-${groupIndex}-${$index}-${i}`"
                :data-r="`field-${groupIndex}-${$index}-${i}`"
                @keydown.up.native="onArrow(groupIndex, i, $index, -1)"
                @keydown.down.native="onArrow(groupIndex, i, $index, +1)"
                @keydown.delete.native="event=>onDelete(event, row, groupIndex, i, $index)"
              />
              <span 
                v-if="!editable(row, col) && !col.type" 
                class="input-disabled"
              >
                {{typeof col.name === 'string' ? _.get(row, col.name) : col.name(row) }}
              </span>
              <el-select v-if="col.type=='select'" class="no-border" v-model="row[col.name]" @change="save(row, col.name)" :disabled="!editable(row, col) || readonly" :placeholder="col.placeholder">
                <el-option v-for="(o, i) in col.options" :key="i" :label="col.display ? _.get(o, col.display) : $t('type.'+type+'.'+col.name+'-options.'+o)" :value="col.id ? _.get(o, col.id) : o" />
              </el-select>
              <el-date-picker
                :placeholder="col.placeholder"
                class="no-border"
                v-if="col.type=='date' || col.type=='datetime'"
                v-model="row[col.name]"
                :type="col.type"
                :disabled="!editable(row, col) || readonly"
                :format="dateFormat(col.type)"
                :value-format="dateFormat(col.type)"
                @change="save(row, col.name)"
              />
              <progress-bar
                v-if="col.type=='progress'"
                :used="row[col.name]"
                :planned="row[col.budget]"
              />
            </template>
          </el-table-column>

          <el-table-column align="right" :label="$t('ui.list.actions')" >
            <template slot-scope="{row}">
              <i v-if="row.id && allowDelete" class="action el-icon-remove-outline" @click="remove(groupIndex, row)" :title="$t('ui.list.delete')"/> 
              <i v-if="row.id && detail" class="action el-icon-arrow-right" @click="detailClicked(row)"  :title="$t('ui.list.edit')"/> 
              <i v-if="!row.id" class="action el-icon-circle-plus-outline" @click="create(row)"  :title="$t('ui.list.create')"/> 
            </template>
          </el-table-column>
        </el-table>

        <el-button v-if="showAddButton" class="filter-item pull-right" style="margin-right: 10px;" type="default" icon="el-icon-circle-plus-outline" @click="addNew(0)">
          {{$t('ui.list.add')}}
        </el-button>

      </div>
    </div>
  </div>
</template>

<script>
import list from '@/mixins/list'
import ProgressBar from './Progress'

export default {
  name: 'GenericList',
  mixins: [list],
  components: {ProgressBar},
  props: ['type', 'detail', 'columns', 'with', 'query', 'order', 'template', 'createBy', 'allowDelete', 'sort', 'groupBy'],
  computed: {
    showAddButton() {
      if (this.createBy=='button' || this.groupBy) return false
      if (this.lists[0].list.some(row => row.id==null)) return false
      return true
    },
    hasEditable() {
      return this.columns.some(c => c.editable)
    }
  },
  methods: {
    editable(row, col) {
      if (this.readonly) return false
      if (typeof col.editable == 'function') return col.editable(row)
      else return col.editable
    },
    detailClicked(row) {
      if (typeof this.detail == 'string') {
        this.$router.push(`${this.detail}/${row.id}/detail`)
      } else {
        this.detail(row)
      }
    },
    dateFormat(type) {
      if (type=='date') return 'yyyy-MM-dd'
      else return 'yyyy-MM-dd hh:mm'
    },
  },
}
</script>

<style>
.input-disabled {
  padding: 0 15px;
}
i.action {
  color: #AAAAAA;
  cursor: pointer;
  font-size: 150%;
  margin-top: 10px;
  margin-left: 10px;
}
i.grab {
  color: #EEEEEE;
  cursor: grab;
  font-size: 17px;
  vertical-align: -3px;
}
svg.grab {
  cursor: grab;
  height: 14px;
  width: 14px;
  vertical-align: -3px;
}
.group {
  margin-top: 10px;
}
.group-handle {
  margin-left: 10px;
  margin-right: 8px;
}
.heading {
  display: inline!important;
  margin-left: 12px;
}
.heading.el-select>.el-input {
  display: inline!important;
}
.heading input {
  font-size: 120%;
  font-weight: bold;
  width: 30%;
}
.grouped-header .handle {
  padding-left: 10px;
  padding-right: 5px;
}
.el-table .cell {
  text-overflow: clip;
}

.el-table--border {
  border: none!important;
}
.el-table--border::after {
  background-color: transparent!important;
}
.el-table--border td, .el-table--border th:not(:hover) {
  border-left: none!important;
  border-right: none!important;
}
</style>
