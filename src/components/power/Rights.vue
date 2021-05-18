<template>
    <div>
      <!-- 面包屑导航区域 -->
<el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
    <el-table :data="rightsList" border stripe>
    <!-- 一个标签画一列,注意用法，很奇妙 -->
    <el-table-column type="index" ></el-table-column>
    <el-table-column label="权限名称" prop="authName"></el-table-column>
    <el-table-column label="路径" prop="path"></el-table-column>
   
    <el-table-column label="权限等级" prop="level">
      <!-- 作用域插槽 -->
      <template v-slot:default="scope">
        <!-- 以下可以查看所有状态信息，可以调用里面的属性 -->
      <!-- {{scope.row}} -->
    <el-tag v-if="scope.row.level==='0'">一级</el-tag>
     <el-tag type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
      <el-tag type="warning" v-else>三级</el-tag>
    </template>
    </el-table-column>
    
    </el-table>
</el-card>

    </div>
</template>

<script>
    export default {
        data(){
            return{
                rightsList:[]
            }
        },
        created(){
            this.getRightsList()
        },
        methods:{
            // 发送请求
           async getRightsList(){
            const {data:res}= await  this.$http.get('rights/list')
            if(res.meta.status!==200){
                return this.$message.console.error('获取用户列表失败');
                
            }
            this.rightsList=res.data
            // console.log( this.rightsList);
            

            }
        }
        
    }
</script>

<style lang="less" scoped>

</style>