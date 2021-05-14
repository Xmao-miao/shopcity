<template>
    <div id="login_container">
      <div class="login_box">
          <!-- 头像区域 -->
          <div class="login_logo">
              <img src="../assets/img/login/logo.svg" alt="">
          </div>
          <!-- 登录区域 -->
          <el-form :model="loginForm" ref="loginFormRef" :rules="loginFormRules" label-width="0px" class="login_form">
              <!-- 用户名 -->
              <!-- prop用来指定输入框校验，注意不是在input中，而是在上面的表单上 -->
               <el-form-item prop="username">
                   <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
               </el-form-item>
               <!-- 密码 -->
               <el-form-item prop="password">
                   <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
               </el-form-item>
               <!-- 按钮区域 -->
                <el-form-item class="login_btn">            
                   <el-button type="primary" @click="login">登录</el-button>
                   <el-button type="info" @click="reseLoginForm">重置</el-button>
               </el-form-item>
    
          </el-form>
      </div>
    </div>
</template>

<script>

    export default {
        
 
          data() {
            return{
                // 这里是登录表单的数据绑定对象
                loginForm:{
                    username:'admin',
                    password:'123456'

                    },
                loginFormRules:{
                        // 分别是必填项，提示消息，触发时机（失去焦点，触发）
                    username:[ 
                        { required: true, message: '请输入登录名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
                                //    最少3，最多5
                    password:[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }]
                    

                }

            }           
        },
        methods:{
            // 点击重置按钮
            reseLoginForm(){
                // console.log(this);
                this.$refs.loginFormRef.resetFields();
                

            },
            login(){
                // 这个是表单的预验证，得到的结果valid是布尔值
                this.$refs.loginFormRef.validate(async valid=>{
                    // console.log(valid);
                    if (!valid) return
                    // 使用await来称为异步的，注意要用async来修饰前面的方法
                   const {data:res}=await this.$http.post("login",this.loginForm);
                   if (res.meta.status!==200) return this.$message.error('登录失败')
                   this.$message.success('登录成功')

                   window.sessionStorage.setItem("token",res.data.token);

                   this.$router.push("/home")
                    

                })
            }

        }

    }
    
    
</script>

<style lang="less" scoped>


#login_container{
    background-color: #2b4b6b;
    height: 100%;

}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #ffffff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);


    .login_logo{
    height: 130px;
    width: 130px;
    border:1px solid #eeeeee;
     border-radius: 50%;
     padding: 10px;
     box-shadow: 0 0 10px #ddd;
     position: absolute;
     left: 50%;
     transform: translate(-50%,-50%);
     background-color: #ffffff;
    

     img{

        width: 100%;
        height: 100%;
         border-radius: 50%;
         background-color: #eeeeee;
       
    }

}

}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
   
}
  .login_btn{
      display: flex;
      justify-content: flex-end;
    
}
   



</style>