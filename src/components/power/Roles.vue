<template>
    <div>
<!-- 面包屑导航区域 -->
<el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
    <!-- 添加角色按钮区域 -->
    <el-row>
        <el-col>
            <el-button type="primary">添加角色</el-button>
        </el-col>
    </el-row>

<el-table :data="roleslist" border stripe>
    <!-- 展开列 -->
    <el-table-column type="expand">
        <template v-slot:default="scope">
             <el-row :class="['bdbottom',i1===0 ? 'bdtop' : '','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                 <el-col :span="5">
                    
                        <el-tag> {{item1.authName}}</el-tag>
                         <i class="el-icon-caret-right"></i>
                    
                 </el-col>
                  <el-col :span="19">
                      <el-row :class="[i2===0 ? '' : 'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                          <el-col :span="6">
                            <el-tag type="success"> {{item2.authName}}</el-tag>
                           <i class="el-icon-caret-right"></i>

                          </el-col>
                          <el-col :span="18">
                              <el-tag v-for="(item3,i3) in item2.children" :key="item3.id" type="warning" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>

                          </el-col>

                      </el-row>

                  </el-col>
             </el-row>





            <!-- res拿到的是所有列表，而scope.row拿到的是本行的所有数据 -->
            <!-- 相当于是res数组中的一个元素 -->
            <!-- 所以scope.row就是res数组中的一个对象元素，因为res中是数组
            里面存放一个个对象，每一个对象中都有一个children对象，里面又嵌套其他对象 -->
            <!-- <pre>{{scope.row}}</pre> -->

        </template>
    </el-table-column>




    <!-- 一个标签画一列,注意用法，很奇妙 -->
    <el-table-column type="index" ></el-table-column>
    <el-table-column label="角色名称" prop="roleName"></el-table-column>
    <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
   
    <el-table-column label="操作" width="300px">
      <!-- 作用域插槽 -->
      <template v-slot:default="scope">
       <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
         <el-button size="mini" type="warning" icon="el-icon-setting" @click="showDialog(scope.row)">分配权限</el-button>
    </template>
    </el-table-column>
    
    </el-table>


</el-card>

<el-dialog
  title="分配权限"
  :visible.sync="rightVisible"
  width="30%" @close="rightsClosed">


<el-tree :data="rightlist" :props="treeProps"  show-checkbox node-key="id" 
default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>

  <span slot="footer" class="dialog-footer">
    <el-button @click="rightVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>




    </div>
</template>

<script>
    export default {
         data(){
            return{
                roleslist:[],
                // 控制分配权限对话框的显示与隐藏
                rightVisible:false,
                rightlist:[],
                treeProps:{
                    label:'authName',
                    children:'children'
                },
                defKeys:[],
                // 分配权限的那个角色的id
                roleId:''
            }
        },
        created(){
            this.getRolesList()
        },
        methods:{
            // 发送请求
           async getRolesList(){
            const {data:res}= await  this.$http.get('roles')
            //  console.log(res.data);
            if(res.meta.status!==200){
                return this.$message.error('获取用户列表失败');
                
            }
            this.roleslist=res.data
            // console.log( this.roleslist);
            

            },





            // 根据id删除对应权限
            async removeRightById(role,rightId){
             const confirmResult= await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err )

        if(confirmResult!=='confirm'){
            return this.$message.info('取消了删除')

        }
        // console.log('确认了删除');
        const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if(res.meta.status!==200){
            return this.$message.error('删除权限失败')
        }
        role.children=res.data
        
        },





       async showDialog(role){
           this.roleId=role.id

              const {data:res} = await this.$http.get('rights/tree')
        if(res.meta.status!==200){
            return this.$message.error('获取权限数据失败')
        }

       this.rightlist=res.data
    //    console.log( this.rightlist);
       this. getLeafKeys(role,this.defKeys)
       
        
      this.rightVisible=true

        },

        // 通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
        getLeafKeys(node,arr){
            // 如果当前node节点不包含children属性，则是三级节点
            if(!node.children){
                return arr.push(node.id)
            }
            node.children.forEach(item=>this.getLeafKeys(item,arr))
        },
        rightsClosed(){
            this.defKeys=[]

        },


// 点击确定
       async allotRights(){
            const keys=[
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            // console.log(keys);
            
            const idStr=keys.join(',')
            const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids:idStr })
            if (res.meta.status !== 200) {
            return this.$message.error('分配权限失败！')
                }
            this.$message.success('分配权限成功！')
            this.getRolesList()
            this.rightVisible=false

          }
        }
    }
</script>

<style lang="less" scoped>
.el-tag{
    margin: 7px;
}
.bdbottom{
    border-bottom: 1px solid #eeeeee;
}
.bdtop{
    border-top: 1px solid #eeeeee;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>