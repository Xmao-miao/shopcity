import Vue from 'vue'
import Router from 'vue-router'


const Login = () =>
    import ('./components/Login.vue')

const Home = () =>
    import ('./components/Home.vue')
const Welcome = () =>
    import ('./components/Welcome.vue')
const Users = () =>
    import ('./components/user/Users.vue')

const Rights = () =>
    import ('./components/power/Rights.vue')
const Roles = () =>
    import ('./components/power/Roles.vue')


Vue.use(Router)

const routes = [{
        path: '/',
        redirect: '/login'

    },
    {
        path: '/login',
        component: Login

    },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [{
                path: '/welcome',
                component: Welcome
            },
            {
                path: '/users',
                component: Users
            },
            {
                path: '/rights',
                component: Rights
            },
            { path: '/roles', component: Roles }
        ]

    }
]
const router = new Router({
    routes,
    mode: 'history'

})

// 挂在路由导航守卫
router.beforeEach((to, from, next) => {

    // to是将要访问的路径
    // from是代表从哪个路径跳转来
    // next是一个函数，表示放行
    // next（） 放行  next('/login')强制跳转
    if (to.path === '/login') return next()
        // 获取token

    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('login')
    next()


})

export default router