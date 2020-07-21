<template>
  <div>
    <gl-table
      type="position"
      :columns="columns"
      :with="w"
      :template="template"
      createBy="row"
      :allowDelete="true"
      sort="no"
      @loaded="data => list = data"
    />
    <el-row type="flex" >
      <el-col :span="24" class="text-right">
        <el-button type="secondary" @click="showExport=true">
          Export
        </el-button>
      </el-col>
    </el-row>
    <el-dialog
      :title="$t('ui.leads.offer.export')"
      :visible.sync="showExport"
      width="70%"
      :before-close="()=>showExport=false">
      <table class="export" width="100%">
        <tr class="header">
          <td>{{$t('type.position.no')}}</td>
          <td>{{$t('type.position.name')}}</td>
          <td>{{$t('type.position.optional')}}</td>
          <td>{{$t('type.position.accepted')}}</td>
          <td align="right">{{$t('type.position.price')}}</td>
        </tr>
        <tr v-for="(pos,i) in positions" :key="pos.id">
          <td>{{pos.no}}</td>
          <td>
              <b>{{pos.name}}</b><br>
              {{pos.comment}}
          </td>
          <td>
            <span v-if="pos.optional">&#x2713;</span>
          </td>
          <td>
            <span v-if="pos.optional">&#x25A2;</span>
          </td>
          <td align="right"> {{pos.price | currency }} </td>
        </tr>
        <tr class="footer">
          <td colspan="4">{{$t('ui.leads.offer.total')}}</td>
          <td align="right">{{total  | currency}}</td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showExport = false">{{$t('ui.leads.offer.close')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import GlTable from 'gluon-frontend/gl-table'
import api from '@/api'

export default {
  name: 'OfferPositionList',
  components: { GlTable },
  props: ['id', 'oid'],
  computed: {
    positions() {
      return this.list
    },
    total() {
      return this.list.reduce((sum, current) => sum + current.price, 0)
    }
  },
  data() {
    return {
      showExport: false,
      template: { accounting_id: this.oid  },
      w: { },
      type: 'position',
      columns: [
        { name: 'no', label: 'No', width: 40, placeholder: "New Position..."},
        { name: 'name', label: 'Name', editable: true },
        { name: 'comment', type: 'textarea', label: 'Comment', editable: true, width: 200 },
        { name: 'planned', label: 'Effort', editable: false, align: "right" },
        { name: 'price', label: 'Price', editable: false, align: "right" },
        { name: 'optional', type: 'checkbox', label: 'Optional', editable: true },
        { name: 'accepted', type: 'checkbox', label: 'Accepted', editable: row => row.optional },
      ],
      planned: {},
      list: [],
    }
  }
}
</script>

<style scoped type="sass">
.export {
  border-collapse: collapse;
}
.export td {
  border: 1px solid #444444;
  padding: 10px;
}
.export .header, .export .footer {
  background-color: #00A4FF;
  color: #FFFFFF;
}

</style>
