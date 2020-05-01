<template>
  <el-row type="flex" justify="space-around"  :gutter="40">
    <el-col :xs="24" :md="8">
      <el-form ref="postForm" v-loading="loading" :rules="rules" :model="item" label-position="left" label-width="120px" >
        <el-form-item v-for="(field,i) in fields" :key="i" :label="field.label">
          <el-input v-model="item[field.name]" type="text" />
        </el-form-item>
        <el-button v-loading="loading" type="primary" @click="save">
          Save
        </el-button>
      </el-form>
    </el-col>
    <el-col v-if="image" :xs="24" :md="16">
      <img width="50%" :src="image">
    </el-col>
  </el-row>
</template>

<script>

import api from '../../api'

export default {
  name: 'GenericDetails',
  props: ['type', 'id', 'fields', 'with', 'template', 'image'],
  data() {
    return {
      item: this.template || {},
      loading: false
    }
  },
  async created() {
    if (this.id !== 'new') {
      this.loading = true
      const items = await api.find(this.type, {
        and: [{ id: this.id }],
        with: this.with
      })
      this.item = items[0]
      this.loading = false
    }
  },
  methods: {
    async save() {
      console.log('Saving', this.item)
      this.loading = true
      try {
        if (this.item.id) {
          await api.update(this.type, this.item.id, this.item)
        } else {
          const result = await api.create(this.type, this.item)
          this.item.id = result.id
        }
        this.$notify({
          title: 'Success',
          message: 'Data has been saved',
          type: 'success',
          duration: 2000
        })
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
          duration: 5000
        })
      }
      this.loading = false
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
