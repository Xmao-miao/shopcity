<template>

    
  <el-container class="home-container">
    <!-- 头部 -->
      <el-header>
      <div>
        <img src="../assets/img/login/pass.svg" alt="">
        <span>电商后台管理系统</span>

      </div>
        <el-button type="info" @click="logout">退出</el-button></el-header>
     
     <!-- 页面主体 -->
      <el-container>
        <!-- 左边 -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
        
          <!-- 侧边栏菜单区 -->
           <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" 
           :unique-opened="true" :collapse='isCollapse' :collapse-transition="false"
           router :default-active='$route.path'>
           <!-- 不如用，以上这个acrivepath有问题 -->
            <!-- :unique-opened="true"也可以写成unique-opened，这个的作用可以看element文档，是只允许一个导航栏打开 -->
            <!-- :collapse-transition="false"未来保证是不二值，所以要动态绑定 -->

            <!-- 一级菜单 -->
              <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
                <!-- 一级菜单模板区域              -->
                <template slot="title">
                  <!-- 图标 -->
                  <i :class="iconsObj[item.id]"></i>
                  <!-- 文本 -->
                  <span>{{item.authName}}</span>
               </template>
               <!-- 二级菜单 -->
                <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children " :key="subItem.id"
                @click="saveNavState('/'+subItem.path)">
                 
                   <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span> {{subItem.authName}}</span>
                  
               </el-menu-item>
           
           <!-- 一级菜单放到一级菜单里，会变成二级菜单，并且一定会有三级菜单 -->
                   <!-- <el-submenu index="1-4">
                      <template slot="title">选项4</template>
                   </el-submenu> -->
               
              </el-submenu>
            </el-menu>
        </el-aside>
        <!-- 主体 -->

        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
     </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
    return{
      // 左侧菜单数据
      menulist:[],

      // 导航图标列表
      iconsObj:{
        '125':'el-icon-user-solid',
        '103':'el-icon-s-management',
        '101':'el-icon-s-goods',
        '102':'el-icon-s-order',
        '145':'el-icon-s-data'
      },
      isCollapse:false,

      // 点击颜色高亮
      activePath:''
    }

  },
  created(){
    this.getMenuList()
    this.activePth=window.sessionStorage.removeItem('activePath')


  },
  methods: {
    logout() {
      // 实现退出，先清空token，然后重定向到登录界面
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 切换菜单栏折叠
      toggleCollapse(){
         this.isCollapse=!this.isCollapse

      },
      // 点击高亮,这时一个方法，也可以$route.path
      saveNavState(activePath){
       window.sessionStorage.setItem('activePath',activePath)
       this.activePth=activePath
      },
    

    // 请求左侧的数据
    async getMenuList() {
      const {data:res}=await this.$http.get('menus')
      //  console.log(res)
      if (res.meta.status!==200) return this.$message.error(res.meta.msg)
      
      // 请求过来的数据在函数执行完后就被销毁，所以要把他存起来
      this.menulist=res.data
      // console.log(res)
      
     
    }
  } 
}
</script>

<style lang="less" scoped>

// element组件都是一个类名
.home-container{
    height: 100%;
}

.el-header{
    background-color: #373d4e;
    display: flex;
    justify-content: space-between;
    padding-left: 0px;
    align-items: center;
    color: #ffffff;
    font-size: 20px;
    // 表示下级节点
    >div{
      display: flex;
      align-items: center;
      img{
        width: 80px;
        height: 80px;
      }
      span{
        margin-left: 15px;
      }
    }

}
.el-aside{
    background-color: #333744;
    // 去掉边框就可以对齐了
    .el-menu{
      border-right: none;
    }
}
.el-main{
    background-color: #EAEDF1;
}
.toggle-button{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}


</style>