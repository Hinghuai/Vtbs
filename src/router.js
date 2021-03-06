import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Rank from './views/Rank.vue'
import About from './views/About.vue'
import List from './views/List.vue'
import DD from './views/DD.vue'
import API from './views/API.vue'
// import Macro from './views/Macro.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '/',
    name: 'home',
    component: Home,
  }, {
    path: '/video',
    alias: ['/live', '/rise'],
    name: 'rank',
    component: Rank,
  }, {
    path: '/macro',
    name: 'macro',
    // component: Macro
    component: () =>
      import(/* webpackChunkName: "macro" */ './views/Macro.vue'),
  }, {
    path: '/dd/',
    name: 'dd',
    component: DD,
  }, {
    path: '/detail/',
    name: 'detail',
    component: List,
  }, {
    path: '/detail/:mid',
    component: () =>
      import(/* webpackChunkName: "detail" */ './views/Detail.vue'),
    props: true,
  }, {
    path: '/api',
    component: API,
  }, {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: About,
  }],
})
