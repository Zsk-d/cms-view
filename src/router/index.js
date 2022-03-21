import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/view/Home'
import Goods from '@/view/Goods'
import User from '@/view/User'
import Customer from '@/view/Customer'
import PurchaseHistory from '@/view/PurchaseHistory'
import GoodsCategory from '@/view/GoodsCategory'
import Statistics from '@/view/Statistics'
import Log from '@/view/Log'
import TestPage from '@/view/TestPage'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Home1',
    component: Home
  }, {
    path: '/home',
    name: 'Home2',
    component: Home
  }, {
    path: '/goods',
    name: 'goods',
    component: Goods
  }, {
    path: '/user',
    name: 'user',
    component: User
  }, {
    path: '/ph',
    name: 'ph',
    component: PurchaseHistory
  }, {
    path: '/customer',
    name: 'customer',
    component: Customer
  }, {
    path: '/log',
    name: 'log',
    component: Log
  }, {
    path: '/statistics',
    name: 'statistics',
    component: Statistics
  }, {
    path: '/goodsCategory',
    name: 'goodsCategory',
    component: GoodsCategory
  }, {
    path: '/test',
    name: 'test',
    component: TestPage
  }]
})
