import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index';
import ShopType from '@/components/ShopType';
import Shop from '@/components/Shop';
import Goods from '@/components/Goods';

Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    }, {
      path: '/shoptype',
      name: 'ShopType',
      component: ShopType
    }, {
      path: '/shop',
      name: 'Shop',
      component: Shop
    },{
      path: '/goods',
      name: 'Goods',
      component: Goods
    }
  ]
})
