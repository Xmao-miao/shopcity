import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'

// 以下可以写成一行
import { Button, Breadcrumb, MessageBox } from 'element-ui'
import { Form, FormItem } from 'element-ui'
import { Input, Container, Header, Aside, Main } from 'element-ui'
// 消息提示
import {
    Message,
    Menu,
    Submenu,
    MenuItemGroup,
    MenuItem,
    Card,

    BreadcrumbItem,
    Option,
    Select,
    Col,
    Row,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    Tag,
    Tree



} from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Option)
Vue.use(Select)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)




// 这个需要全局挂载，$message是自定义属性，可以随意命名
// 把Message挂在了vue的原型上
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm