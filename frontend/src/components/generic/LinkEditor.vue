<template>
  <div>
    <el-input 
      v-if="linksEdit" 
      :value="value" 
      @input="value=>$emit('input', value)"
      type="textarea" 
      :autosize="{ minRows: 2, maxRows: 4}" 
      :disabled="disabled" 
      placeholder="One Title@URL per line"
    />
    <i v-if="linksEdit" class="el-icon-lock" @click="linksEdit=false" />
    <div v-if="!linksEdit">
      <span v-for="(link,i) in links" :key="link.url" >
        <a :href="link.url" target="_blank">{{link.label}}</a>
        -
      </span>
      <i v-if="!linksEdit" class="el-icon-unlock" @click="linksEdit=true" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LinkEditor',
  props: ['value', 'disabled'],
    data() {
      return {
        linksEdit: false,
      }
  },
  computed: {
    links() {
      if (!this.value) return []
      return this.value.split("\n").map(line => {
        const comp = line.split("@")
        if (comp.length==2) return {label:comp[0], url:url(comp[1])}
        else return {label:line, url:url(line)}
      })
      function url(s) {
        if (s.startsWith('http')) return s
        return 'https://' + s
      }
    }
  },
}
</script>