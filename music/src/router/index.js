import Vue from 'vue'
import VueRouter from 'vue-router'
import RecommendMusic from '../views/RecommendMusic.vue'
import Search from '../views/Search.vue'
import PlayList from '../views/PlayList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'RecommendMusic',
    component: RecommendMusic,
    meta: { isShowNav: true },
  },
  {
    path: '/hot',
    name: 'Hot',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Hot.vue'),
    meta: { isShowNav: true },
  },
  {
    path : '/search',
    name : 'Search',
    component: Search,
    meta: { isShowNav: true },
  },
  {
    path : '/playList',
    name : 'PlayList',
    component: PlayList,
  }
]

const router = new VueRouter({
  routes
})

export default router
