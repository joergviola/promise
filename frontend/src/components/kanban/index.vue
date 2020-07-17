<template>
  <div class="board-column">
    <div class="board-column-header">
      {{ headerText }}
    </div>
    <div v-if="nodrag" class="board-column-content">
      <div v-for="element in items" :key="element.id" class="board-item" @click="$emit('click', element)">
        <slot :element="element"></slot>
      </div>
    </div>
    <draggable
      v-else
      :list="items"
      v-bind="$attrs"
      class="board-column-content"
      :set-data="setData"
      @change="onChange"
    >
      <div v-for="element in items" :key="element.id" class="board-item" @click="$emit('click', element)">
        <slot :element="element"></slot>
      </div>
    </draggable>
    <span class="sum pull-right" v-if="sum">{{sumResult}}</span>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import api from '@/api'

export default {
  name: 'KanbanColumn',
  components: {
    draggable
  },
  props: {
    headerText: {
      type: String,
      default: 'Header'
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    list: {
      type: Array,
      default() {
        return []
      }
    },
    state: {
      type: String,
      default: null
    },
    sum: {
      type: String,
      default: null
    },
    nodrag: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    items() {return this.list.filter(t => t.state === this.state)},
    sumResult() { 
      const sum = this.sum.split(':')
      return this.items.reduce((result, element) => {
        const value = _.get(element, sum[0])
        if (typeof value=='number')
          return result+value
          else return result
      }, 0) 
      + (sum.length>1 ? ' ' + sum[1] : '')
    },
  },
  methods: {
    setData(dataTransfer) {
      // to avoid Firefox bug
      // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      dataTransfer.setData('Text', '')
    },
    onChange(event) {
      if (!event.added) return
      const element = event.added.element
      this.$emit('change', element, this.state)
    }
  }
}
</script>
<style lang="scss" scoped>
.sum {
  color: #BBBBBB;
  font-size: 80%;
  padding-right: 10px;
  margin-top: -10px;
  margin-bottom: 5px;
}

.board {
  width: 100%;
  margin-left: 0px;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: flex-start;
  overflow-x: scroll;
}
.board-column.kanban {
  margin-left: 10px;
  margin-right: 10px;
  width: 500px;
  min-width: 150px;
  max-width: 500px;
  font-size: 14px;

  .board-column-header {
  }
}

.board-column {
  min-width: 300px;
  min-height: 100px;
  height: auto;
  overflow: hidden;
  border-radius: 3px;
  background-color: #EEEEEE;

  .board-column-header {
    overflow: hidden;
    margin-top: 10px;
    padding: 0px 10px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 3px 3px 0 0;
  }

  .board-column-content {
    height: auto;
    overflow: hidden;
    border: 10px solid transparent;
    min-height: 60px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;

    .board-item {
      cursor: pointer;
      width: 100%;
      margin: 5px 0;
      background-color: #fff;
      text-align: left;
      padding: 10px 10px;
      box-sizing: border-box;
      box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
    }
  }
}
</style>

