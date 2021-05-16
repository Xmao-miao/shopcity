<template>
<div class="users">
<!-- 面包屑导航区域 -->
<el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图 -->
<el-card>
  <!-- 搜索与添加区域 -->
  <el-row :gutter="20">
    <el-col :span="8">
      <el-input placeholder="请输入内容" 
      v-model="queryInfo.query" clearable @clear="getUserList">
    
       <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
      </el-input>
    </el-col>
    <el-col :span="4">

<el-button type='primary' @click="addDialogVisible=true">添加用户</el-button>

    </el-col>
  </el-row>
  <!-- 用户列表区 -->
  <el-table :data="userlist" border stripe>
    <!-- 一个标签画一列,注意用法，很奇妙 -->
    <el-table-column type="index" ></el-table-column>
    <el-table-column label="姓名" prop="username"></el-table-column>
    <el-table-column label="邮箱" prop="email"></el-table-column>
    <el-table-column label="电话" prop="mobile"></el-table-column>
    <el-table-column label="角色" prop="role_name"></el-table-column>
    <el-table-column label="状态">
      <!-- 作用域插槽 -->
      <template v-slot:default="scope">
        <!-- 以下可以查看所有状态信息，可以调用里面的属性 -->
      <!-- {{scope.row}} -->
      <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
     </el-switch>
    </template>
    </el-table-column>
    
    <el-table-column label="操作">

      <template v-slot:default="scope">
<!-- 修改按钮 -->
        <el-button type='primary' icon="el-icon-edit" size="mini" 
        @click="showEditDialog(scope.row.id)"></el-button>
<!-- 删除按钮 -->
         <el-button type='danger' icon="el-icon-delete" 
         size="mini" @click="removeUserById(scope.row.id)"></el-button>
<!-- 分配角色 -->
         
         <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
           <el-button type='warning' icon="el-icon-setting" size="mini"></el-button>
         </el-tooltip>
      </template>
    </el-table-column>
    

  </el-table>

 <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

</el-card>

<!-- 添加用户对话框 -->
<el-dialog
  title="添加用户"
  :visible.sync="addDialogVisible"
  width="30%" @close="addDialogClosed"
 >
<!-- 内容区域 -->
 <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
 </el-form>

  <!-- 底部区域 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>



<!-- 修改用户的对话框 -->
<el-dialog
  title="修改用户"
  :visible.sync="editDialogVisible"
  width="30%" @close="editDialogClosed">

  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" 
  label-width="70px">
  <el-form-item label="用户名">
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editForm.email" ></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible= false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
</el-dialog>


</div>

</template>

<script>
    export default {
      data(){
        // 验证邮箱规则
        var checkEmail=(rule,value,cb)=>{
         const regEmaile= /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
          if(regEmaile.test(value)){
            return cb()
          }
          cb(new Error('请输入合法邮箱'))
        }
        // 验证手机号规则

         var checkMobile=(rule,value,cb)=>{
            const regMobile= /^(1[3|5-9])\d{9}$/
          if(regMobile.test(value)){
            return cb()
          }
          cb(new Error('请输入合法手机号'))
        }
        




        return{
          queryInfo:{
            query:'',
            // 当前页数
            pagenum:1,
            // 每页显示多少条
            pagesize:2
          },
          userlist:[],
          total:0,
          addDialogVisible:false,
          // 添加用户的表单
          addForm:{
            username:'',
            password:'',
            email:'',
            mobile:''
          },
          // 添加表单的验证规则对象
          addFormRules:{
            username:[ 
              { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }

            ],
            password:[ 
              { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }

            ],
            email:[ 
              { required: true, message: '请输入用户邮箱', trigger: 'blur' },
            // { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur"]},
            {validator:checkEmail,trigger:'blur'}

            ],
            mobile:[ 
              { required: true, message: '请输入用户手机', trigger: 'blur' },
            {validator:checkMobile,trigger:'blur'}

            ],
            
          },
          editDialogVisible:false,
          // 查询到的用户信息对象
          editForm:'',

          editFormRules:{
              email:[ 
              { required: true, message: '请输入用户邮箱', trigger: 'blur' },
            // { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur"]},
            {validator:checkEmail,trigger:'blur'}

            ],
            mobile:[ 
              { required: true, message: '请输入用户手机', trigger: 'blur' },
            {validator:checkMobile,trigger:'blur'}

            ]

          }
        }
      },
      created(){
        this.getUserList()

      },
      methods:{
        // 请求
      async  getUserList(){
        const {data:res}= await this.$http.get('users',{params:this.queryInfo})
    
      if(res.meta.status !==200) {
        return this.$message.console.error('获取用户列表失败');
        
      }
  
      
      this.userlist=res.data.users
      this.total=res.data.total
      console.log(this.userlist)
      
      

       
       },
      //  监听pagesize改变的事件
       handleSizeChange(newSize){
         
          this.queryInfo.pagesize=newSize
         this.getUserList()
         

       },
      //  页码切换事件
       handleCurrentChange(newPage){
        
         this.queryInfo.pagenum=newPage
         this.getUserList()
        
         

       },
      async userStateChanged(userinfo){

           const {data:res}= await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      //  console.log(res);
        if(res.meta.status !==200) {
        userinfo.mg_state=!userinfo.mg_state
        return this.$message.error('更新用户列表失败');
        
      }
      this.$message.success('更新用户状态成功')


       },
       addDialogClosed(){
         this.$refs.addFormRef.resetFields()

       },
       addUser(){
         this.$refs.addFormRef.validate( async valid=>{
          //  console.log(valid);
           if(!valid) return

          //  发起添加用户的网络请求
        const {data:res}= await this.$http.post('users',this.addForm)
      //  console.log(res);
        if(res.meta.status !==201) {
        
        return this.$message.error('添加用户列表失败');
        
      }
      this.$message.success('添加用户成功')
      // 隐藏添加用户对话框
      this.addDialogVisible=false
      // 重新获取用户列表数据
      this.getUserList()
         })

       },

      //  修改按钮获取用户信息
     async showEditDialog(id){
      const {data:res}= await this.$http.get('users/'+id)
      if(res.meta.status!==200){
        return this.$message.error('查询用户信息失败')
      }

      this.editForm=res.data
         this.editDialogVisible=true

       },
       // 重置修改表单弹框
       editDialogClosed(){
         this.$refs.editFormRef.resetFields()
       },




       editUserInfo(){
        //  先预校验
         this.$refs.editFormRef.validate( async valid=>{
          //  console.log(valid);
           if(!valid) return

          //  发起修改用户的网络请求
        const {data:res}= await this.$http.put('users/'+this.editForm.id,{
          email:this.editForm.email,
          mobile:this.editForm.mobile
        })
      //  console.log(res);
        if(res.meta.status !==200) {
        
        return this.$message.error('修改用户列表失败');
        
      }
      // 隐藏添加用户对话框
      this.editDialogVisible=false
      // 重新获取用户列表数据
      this.getUserList()
      this.$message.success('修改用户成功')
      
      
         })
       },


      //  删除数据事件
      async removeUserById(id){
     const confirmResult=   await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        // 如果用户确认删除，则返回值为字符串confirm
        // 如果用户取消，则返回值为cancel
        
        if(confirmResult!=='confirm'){
          return this.$message.info('已取消删除')
        }
       const{data:res}= await this.$http.delete('users/'+id)
       if(res.meta.status !==200){
         return this.$message.error('删除用户失败')
       }
       this.$message.success('删除用户成功')
       this.getUserList()


       }

      }
        
    }
  
</script>

<style lang="less" scoped>

</style>