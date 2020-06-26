<template>
  <div class="components-container">
    <h2>gluon timeline</h2>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <div slot="header" class="clearfix">
            New in current release
          </div>
          23.06.20
          <ul>
            <li>Everything ;-)</li>
          </ul>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div slot="header" class="clearfix">
            Next tasks
          </div>
          <ul>
            <li>Letzte Angebots-/Schätzposition übernehmen</li>
            <li>Cursor dragged on selection</li>
            <li>Task: Name eingeben - select blitzt auf</li>
          </ul>
          Done
          <ul>
            <li>Schätzposition</li>
            <li>Aufgaben mit %-Aufwand</li>
            <li>Beschreibung von Angebotspositionen</li>
            <li>Angebotspositionen optional/beauftragt</li>
            <li>Darstellung Angebot als HTML-Tabelle</li>
          </ul>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div slot="header" class="clearfix">
            History
          </div>
          <ul>
            <li>hmmm</li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
