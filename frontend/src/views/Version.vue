<template>
  <div class="components-container">
    <h2>gluon timeline</h2>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <div slot="header" class="clearfix">
            New in current release
          </div>
          <h4> 29.06.20</h4>
          Release for ressource planning.
          <small>
          <ul>
            <li>New project fixed</li>
            <li>Planning of unterminated projects</li>
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
            <li>German translation</li>
            <li>Nicer drag handle and group layout</li>
          </ul>
          </small>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div slot="header" class="clearfix">
            History
          </div>

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
