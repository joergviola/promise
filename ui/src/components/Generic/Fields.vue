<template>
  <div>
    <el-form-item v-for="(field,i) in fields" :key="i" :label="field.label">
      <el-input v-if="!field.type" :disabled="field.disabled" v-model="item[field.name]" type="text" >
        <template v-if="field.postfix" slot="append">{{field.postfix}}</template>
      </el-input>
      <el-input v-if="field.type=='textarea'" v-model="item[field.name]" :rows="1" type="textarea" autosize :placeholder="field.placeholder" />
      <el-select v-if="field.type=='select'" v-model="item[field.name]">
        <el-option v-for="(o, i) in field.options" :key="i" :label="o" :value="o" />
      </el-select>
      <el-date-picker
        v-if="field.type=='date'"
        v-model="item[field.name]"
        :type="field.type"
        value-format="yyyy-MM-dd"
      />
      <to-one
        v-if="field.type=='to-one'"
        v-model="item[field.name]"
        :type="field.ref"
        :display="field.display"
        :link="field.link"
        :query="field.query"
        @input="id => field.input ? field.input(id) : null"
      />

    </el-form-item>
  </div>
</template>

<script>

import ToOne from './ToOne'

export default {
  name: 'GenericDetails',
  components: { ToOne },
  props: ['item', 'fields'],
}
</script>

<style lang="scss" scoped>
</style>
