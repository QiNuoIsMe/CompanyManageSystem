<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate"><!--添加角色按钮-->
        <el-button size="mini" type="primary">添加角色</el-button>
      </div>
      <!-- 放置table组件 -->
      <el-table>
        <el-table-column align="center" width="200px" label="角色" />
        <el-table-column align="center" width="200px" label="启用" />
        <el-table-column align="center" label="描述" />
        <el-table-column align="center" label="操作" />
      </el-table>
      <!-- <el-row>：定义一行。它可以包含多个 <el-col> 子元素 -->
      <el-row type="flex" style="height:60px" align="middle" justify="end">
        <!-- 放置分页组件  -->
        <el-pagination layout="prev,pager,next"></el-pagination>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Role'
}
</script>

<style scoped>
.role-operate{
  padding: 10px;
}
</style>
