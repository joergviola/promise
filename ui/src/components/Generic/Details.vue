<template>
  <div>
    <el-row type="flex" justify="space-around" :gutter="40">
      <el-col :xs="24" :md="12">
        <el-form ref="postForm" v-loading="loading" :model="item" label-position="left" label-width="120px" >
          <el-form-item v-for="(field,i) in fields" :key="i" :label="field.label">
            <el-input v-if="!field.type" :disabled="field.disabled" v-model="item[field.name]" type="text" >
              <template v-if="field.postfix" slot="append">{{field.postfix}}</template>
            </el-input>
            <el-input v-if="field.type=='textarea'" v-model="item[field.name]" :rows="1" type="textarea" autosize :placeholder="field.placeholder" />
            <el-select v-if="field.type=='select'" v-model="item[field.name]" >
              <el-option v-for="(o, i) in field.options" :key="i" :label="o" :value="o" />
            </el-select>
            <el-date-picker
              v-if="field.type=='date'"
              v-model="item[field.name]"
              :type="field.type"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>

        </el-form>
      </el-col>
      <el-col v-if="image" :xs="24" :md="12">
        <img width="100%" :src="image">
      </el-col>
    </el-row>
    <el-row type="flex" >
      <el-col :span="24">
        <el-button type="secondary" @click="$router.go(-1)">
          Cancel
        </el-button>
        <el-button v-for="(button, i) in buttons" :key="i" v-loading="loading" type="danger" @click="click(button)">
          {{button.label}}
        </el-button>
        <el-button v-loading="loading" type="primary" @click="save">
          Save
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import api from '../../api'

export default {
  name: 'GenericDetails',
  props: ['type', 'id', 'fields', 'buttons', 'with', 'template', 'image'],
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
      this.$emit('update', Object.assign({}, this.item))
    }
  },
  methods: {
    async click(button) {
      button.action(this.item)
      if (button.andSave) this.save()
    },
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
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
          duration: 5000
        })
      }
      this.loading = false
      this.$emit('update', Object.assign({}, this.item))
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
