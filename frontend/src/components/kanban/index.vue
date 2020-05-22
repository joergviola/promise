<template>
  <div class="board-column">
    <div class="board-column-header">
      {{ headerText }}
    </div>
    <draggable
      :list="items"
      v-bind="$attrs"
      class="board-column-content"
      :set-data="setData"
      @change="onChange"
    >
      <div v-for="element in items" :key="element.id" class="board-item" @click="$emit('click', element)">
        {{ element.name }}
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import api from '@/api'

export default {
  name: 'DragKanbanDemo',
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
    }
  },
  computed: {
    items() {return this.list.filter(t => t.state === this.state)}
  },
  methods: {
    setData(dataTransfer) {
      // to avoid Firefox bug
      // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      dataTransfer.setData('Text', '')
    },
    onChange(event) {
      if (!event.added) return
      console.log('XXX', event)
      const task = event.added.element
      task.state = this.state
      api.update('task', task.id, { state: task.state })
    }
  }
}
</script>
<style lang="scss" scoped>
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

