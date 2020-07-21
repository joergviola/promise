<template>
  <div class="components-container">
    <h2>gluon timeline</h2>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <div slot="header" class="clearfix">
            New in current release
          </div>
          <h4> 21.07.20</h4>
          Task management and time tracking.
          <small>
          <ul>
            <li>Sales: Sales funnel visualisation</li>
            <li>Home: Time booking on home, Timer, other tasks</li>
            <li>Planning: Enhanced dialogs and project overview</li>
            <li>UI: Enhanced grouping, changeable column width, language fixes</li>
          </ul>
          </small>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div slot="header" class="clearfix">
            Next tasks
          </div>
          <h4>Planned</h4>
          <small>
          <ul>
            <li>Manage supplier organisations</li>
            <li>Task: Position select looses focus after create</li>
          </ul>
          </small>
          <h4>Done</h4>
          <small>
          <ul>
          </ul>
          </small>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div slot="header" class="clearfix">
            History
          </div>

          <h4> 08.07.20</h4>
          Maintenance release.
          <small>
          <ul>
            <li>Project team selection</li>
            <li>Project task grouping</li>
            <li>Table column resize</li>
            <li>Language selection de/en</li>
          </ul>
          </small>

          <h4> 02.07.20</h4>
          Maintenance release.
          <small>
          <ul>
            <li>German translation</li>
            <li>Nicer drag handle and group layout</li>
            <li>Stabilized drag/drop</li>
          </ul>
          </small>

          <h4> 29.06.20</h4>
          Release for ressource planning.
          <small>
          <ul>
            <li>New project fixed</li>
            <li>Planning of unterminated projects</li>
          </ul>
          </small>

          <h4> 28.06.20</h4>
          This release focusses around tasks and offers, trying to make input 
          of many tasks a breeze.
          <small>
          <ul>
            <li>Task categories, group on them and drag/drop</li>
            <li>Task effort in %</li>
            <li>Comment on offer positions more prominent</li>
            <li>Optional and if so, accepted offer positions</li>
            <li>Export offer positions as HTML table</li>
            <li>Link to MS Team etc</li>
            <li>Mobile & comment for contact</li>
            <li>Take offer position from current task when creating a new one with enter</li>
            <li>Line dragged on input selection, drag handles</li>
          </ul>
          </small>

          <h4>23.06.20</h4>
          <small>
          <ul>
            <li>Everything ;-)</li>
          </ul>
          </small>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
