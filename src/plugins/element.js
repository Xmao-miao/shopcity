import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'

// 以下可以写成一行
import { Button } from 'element-ui'
import { Form, FormItem } from 'element-ui'
import { Input } from 'element-ui'
// 消息提示
import { Message } from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

// 这个需要全局挂载，$message是自定义属性，可以随意命名
// 把Message挂在了vue的原型上
Vue.prototype.$message = Message