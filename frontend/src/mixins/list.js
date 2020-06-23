
import api from '@/api'
import Sortable from 'sortablejs'

export default {
  data() {
    return {
      list: [],
      loading: true,
    }
  },
  computed: {
    meta() {
      const result = Object.assign({}, this.with)
      for (var key in result) {
        result[key].ignore = true
      }
      return result
    },
    rights() {
      return api.user().role.rights
        .filter(right => right.tables=='*' || right.tables.search(this.type)!=-1)
    },
    readonly() {
      return !this.userCan('U')
    }
  },
  watch: {
    query() {
      this.getList()
    },
    template() {
      this.getList()
    },
  },
  created() {
    this.getList()
  },
  methods: {
    addNew(pos = null) {
      if (this.createBy == 'row' || this.createBy==null) {
        const item = Object.assign({}, this.template)
        item._meta = this.meta
        if (this.sort) {
          item[this.sort] = this.list.length+1
        }
        if (pos==null) {
          this.list.push(item)
        } else {
          this.list.splice(pos, 0, item)
        }
      }
    },
    async getList() {
      this.loading = true
      const query =  {
        and: this.query || this.template,
        with: this.with
      }
      if (this.with) query.with = this.with
      if (this.order) query.order = this.order
      if (this.sort) {
        query.order = {}
        query.order[this.sort] = 'ASC'
      }
      try {
        this.list = await api.find(this.type, query)
        this.addNew()
        if (this.sort) {
          this.$nextTick(() => {
            this.setSort()
          })
        }
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
          duration: 15000
        })
      }
      this.loading = false
    },
    setSort() {
      const el = this.$refs.theTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: async evt => {
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, targetRow)
          await this.updateSort()
        }
      })
    },
    async updateSort() {
      const data = {}
      this.list.forEach((item, i) => {
        if (item.id) {
          data[item.id] = {}
          data[item.id][this.sort] = i+1
          item[this.sort] = i+1
        }
      })
      api.updateBulk(this.type, data)
    },
    async save(row, attr) {
      if (!row.id) {
        await this.create(row, false)
      } else {
        try {
          const data = {}
          data[attr] = row[attr]
          await api.update(this.type, row.id, data)
        } catch (error) {
          this.$notify({
            title: 'Error',
            message: error.message,
            type: 'error',
            duration: 15000
          })
        }
        }
    },
    async create(row, showError=true) {
      try {
        const result = await api.create(this.type, row)
        row.id = result.id
        await this.updateSort()
        //this.addNew()
      } catch (error) {
        if (showError) {
          this.$notify({
            title: 'Error',
            message: error.message,
            type: 'error',
            duration: 15000
          })
        }
      }
    },
    async remove(row, ask=true) {
      try {
        if (ask) {
          try {
            await this.$confirm('Are you sure?', 'Warning', {
              confirmButtonText: 'OK',
              cancelButtonText: 'Cancel',
              type: 'warning'
            })
          } catch (cancel) {
            return
          }
        }
        await api.delete(this.type, row.id)
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
        //this.getList()
      } catch (error) {
        this.$notify({
          title: 'Error',
          message: error.message,
          type: 'error',
          duration: 15000
        })
      }
    },
    async onEnter(row, column, index) {
      if (!row.id) {
        await this.create(row)
        return
      } else {
        this.addNew(index+1)
      }
      this.$nextTick(() => {
        const key = `field-${index+1}-${0}`
        let ref = this.$refs[key]
        if (Array.isArray(ref)) ref = ref[0]
          ref.focus()
      })
    },
    async onDelete(event, row, column, index, value) {
      if (value || column!=0) return
      if (!row.id) {
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      } else {
        this.remove(row)
      }
      this.$nextTick(() => {
        const key = `field-${index-1}-${column}`
        let ref = this.$refs[key]
        if (Array.isArray(ref)) ref = ref[0]
          ref.focus()
      })
      event.preventDefault()
    },
    onArrow(column, index, dir) {
      if (0 <= index + dir && index + dir < this.list.length) {
        const key = `field-${index + dir}-${column}`
        let ref = this.$refs[key]
        if (Array.isArray(ref)) ref = ref[0]
        this.$nextTick(() => {
          ref.focus()
        })
      }
    },
    userCan(action) {
      const rights = this.rights.filter(right => right.actions.indexOf(action)!=-1)
      return rights.length!=0
    },
    exportCSV(name, columns) {
      const data = []
      data.push(columns.join(','))
      this.list.forEach(row => {
        if (!row.id) return
        const line = columns.map(col => encode(_.get(row, col)))
        data.push(line.join(','))
      });

      const csv = data.join('\r\n')
   
      let anchor = document.createElement('a');
      anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
      anchor.target = '_blank';
      anchor.download = name;
      anchor.click();      

      function encode(s) {
        if (!s) return ""
        s = ""+s
        return s
        .replace(',', ' ')
        .replace('\r', '\\r')
        .replace('\n', '\\n')
      }
    },
    // async importCSV(file) {
    //   const self = this
    //   const reader = new FileReader();
    //   reader.onload = async function(e) {
    //     const data = parse(e.target.result)
    //     const json = toData(data)
    //     const update = toUpdate(json)
    //     const create = toCreate(json)
    //     console.log(json)
    //     await api.updateBulk(self.type, update)
    //     await api.create(self.type, create)
    //     self.getList()
    //   };
    //   reader.readAsText(file.raw)

    //   function parse(text) {
    //     const data = []
    //     text.split("\n").forEach((line,i) => {
    //       if (line=="") return
    //       const item = line.split(',')
    //       data.push(line.split(','))
    //     })
    //     return data
    //   }

    //   function toData(data) {


    //     const columns = data[0]
    //     const json = []
    //     data.forEach((line,i) =>{
    //       if (i==0) return
    //       const item = Object.assign({}, self.template)
    //       columns.forEach((col,j) => {
    //         const path = col.split('.')
    //         let o = item
    //         let type = self.type
    //         path.forEach((name, n) => {
    //           if (n<path.length-1) {
    //             if (!o._meta) o._meta = {}
    //             if (!o[name]) {
    //               o[name] = { }
    //             } else {
    //               o[name] = Object.assign({}, o[name])
    //             }
    //             o._meta[name] = {
    //               one: name,
    //               that: type+"_id",
    //               ignore: false
    //             }
    //             type = name
    //             o = o[name]
    //           } else {
    //             o[name] = line[j]
    //           }
    //           console.log(i, name, item, o, line[j])
    //         })
    //       })
    //       if (item.id=="") item[self.sort] = self.list.length+i
    //       json.push(item)
    //     })
    //     return json
    //   }

    //   function toUpdate(json) {
    //     const data = {}
    //     json.forEach(row => {
    //       if (!row.id) return
    //       data[row.id] = row
    //     })
    //     return data
    //   }

    //   function toCreate(json) {
    //     return json.filter(row => !row.id)
    //   }
    // }
  },
}
