
import api from '@/api'
import Sortable from 'sortablejs'

export default {
  data() {
    return {
      lists: [],
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
    },
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
    addNew(groupIndex, pos = null) {
      if (this.createBy == 'row' || this.createBy==null) {
        const item = Object.assign({}, this.template)
        item._meta = this.meta
        const list = this.lists[groupIndex].list
        if (this.sort) {
          item[this.sort] = list.length+1
        }
        if (this.groupBy) {
          item[this.groupBy.field] = this.lists[groupIndex].group
        }
        if (pos==null) {
          list.push(item)
        } else {
          list.splice(pos, 0, item)
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
        const list = await api.find(this.type, query)
        //this.addNew()
        this.lists = this.doGroupBy(list)
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
    doGroupBy(list) {
      if (this.groupBy) {
        const result = []
        const cache = {}
        list.forEach(item => {
          const value = item[this.groupBy.field] || "None"
          if (cache[value]) {
            cache[value].push(item)
          } else {
            cache[value] = [item]
            result.push({group:value, list: cache[value], show: true, header: true})
          }
        })
        return result
      } else {
        return [{group:'default', list: list, show: true, header: false}]
      }
    },
    setSort() {
      const tables = this.$refs.theTable
      if (tables.length==1) tables = [tables]
      tables.forEach(table => {
        const group = table.$el.dataset.group
        const el = table.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
        el.dataset.group = group
        this.sortable = Sortable.create(el, {
          dataGroup: group,
          group: "group",
          ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
          setData: function(dataTransfer) {
            // to avoid Firefox bug
            // Detail see : https://github.com/RubaXa/Sortable/issues/1012
            dataTransfer.setData('Text', '')
          },
          onEnd: async evt => {
            const from = this.lists.find(l => l.group == evt.from.dataset.group)
            const to = this.lists.find(l => l.group == evt.to.dataset.group)
            const row = from.list.splice(evt.oldIndex, 1)[0]
            row[this.groupBy.field] = to.group
            to.list.splice(evt.newIndex, 0, row)
            await this.updateSort()
          }
        })
      })
      const el = this.$refs.groupedTable
      Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: async evt => {
          const group = this.lists.splice(evt.oldIndex, 1)[0]
          this.lists.splice(evt.newIndex, 0, group)
          await this.updateSort()
        }
      })
    },
    async updateSort() {
      const data = {}
      let i=1
      this.lists.forEach(list => {
        list.list.forEach(item => {
          if (item.id) {
            data[item.id] = {}
            data[item.id][this.sort] = i
            if (this.groupBy) {
              data[item.id][this.groupBy.field] = item[this.groupBy.field]
            }
            item[this.sort] = i
            i++
          }
        })
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
    async remove(groupIndex, row, ask=true) {
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
        const list = this.lists[groupIndex].list
        const index = list.indexOf(row)
        list.splice(index, 1)
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
    async onEnter(row, groupIndex, column, index) {
      if (!row.id) {
        await this.create(row)
        return
      } else {
        this.addNew(groupIndex, index+1)
      }
      this.$nextTick(() => {
        const key = `field-${groupIndex}-${index+1}-${0}`
        let ref = this.$refs[key]
        if (Array.isArray(ref)) ref = ref[0]
          ref.focus()
      })
    },
    async onDelete(event, row, groupIndex, column, index, value) {
      if (value || column!=0) return
      if (!row.id) {
        const list = this.lists[groupIndex].list
        const index = list.indexOf(row)
        list.splice(index, 1)
      } else {
        this.remove(row)
      }
      this.$nextTick(() => {
        const key = `field-${groupIndex}-${index-1}-${column}`
        let ref = this.$refs[key]
        if (Array.isArray(ref)) ref = ref[0]
          ref.focus()
      })
      event.preventDefault()
    },
    onArrow(groupIndex, column, index, dir) {
      const list = this.lists[groupIndex].list
      if (index + dir < 0 && groupIndex>0) {
        index = this.lists[groupIndex-1].list.length
        this.onArrow(groupIndex-1, column, index, dir)
      } else if(index + dir >= list.length && groupIndex < this.lists.length-1) {
        index = -1
        this.onArrow(groupIndex+1, column, index, dir)
      } else {
        if (0 <= index + dir && index + dir < list.length) {
          const key = `field-${groupIndex}-${index + dir}-${column}`
          let ref = this.$refs[key]
          if (Array.isArray(ref)) ref = ref[0]
          this.$nextTick(() => {
            ref.focus()
          })
        }
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
