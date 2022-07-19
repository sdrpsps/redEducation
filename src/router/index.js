import Vue from 'vue'
import VueRouter from 'vue-router'
import News from '../views/News/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'News',
    component: News
  },
  {
    path: '/mine',
    name: 'Mine',
    component: () => import('../views/Mine/index.vue')
  },
  {
    path: '/knowledge',
    name: 'Knowledge',
    component: () => import('../views/Knowledge/index.vue')
  },
  {
    path: '/detail',
    name: 'Detail',
    component: () => import('../views/News/detail.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Mine/register.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Mine/setting.vue')
  },
  {
    path: '/password',
    name: 'Password',
    component: () => import('../views/Mine/password.vue')
  },
  {
    path: '/list',
    name: 'List',
    component: () => import('../views/Knowledge/list.vue')
  },
  {
    path: '/exam',
    name: 'Exam',
    component: () => import('../views/Knowledge/exam.vue')
  },
  {
    path: '/show/myexams',
    name: 'Myexams',
    component: () => import('../views/show/myexams.vue')
  },
  {
    path: '/show/collects',
    name: 'Collects',
    component: () => import('../views/show/collects.vue')
  },
  {
    path: '/show/comments',
    name: 'Comments',
    component: () => import('../views/show/comments.vue')
  },
  {
    path: '/show/examinfo',
    name: 'Examinfo',
    component: () => import('../views/show/examinfo.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
