import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    UI: {
      open: true
    },
    APP: {
      shopType: []
    },
    Seller:{
      shop:[]
    },
    Market:{
      goods:[]
    }
  },
  getters: {
    UI_open(state) {
      return state.UI.open
    },
    APP_shopType(state) {
      return state.APP.shopType
    },
    Seller_shop(state){
      return state.Seller.shop
    },
    Market_goods(state){
      return state.Market.goods
    }
  },
  mutations: {
    UI_open_toggle(state) {
      state.UI.open = !state.UI.open;
    },
    UI_open_close(state) {
      state.UI.open = false;
    },
    update_App_shopType(state, data) {
      state.APP.shopType = data;
    },
    update_Seller_shop(state, data){
      state.Seller.shop = data;
    },
    update_Market_goods(state, data){
      state.Market.goods = data;
    }
  },
  actions: {
    //shoptype
    getShopTypes(store, payload) {
      // console.log(arguments);
      payload.$http.get('http://localhost:8888/admin/shoptype').then((response) => {
        // console.log(response);
        store.commit('update_App_shopType', response.data);
      });
    },
    // 提交新的商家类型
    addShopType(store, payload) {
      // console.log(payload);
      let config = {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      };
      return new Promise(function(resolve, reject) {
        payload.$http.post('http://localhost:8888/admin/shoptype/add', 'name=' + payload.data.name, config).then((response) => {
          if (response.data.code) {
            reject(response.data);
          } else {
            resolve(response.data);
          }
        });
      })
    },
    deleteShopType(store, payload) {
      return payload.$http.get('http://localhost:8888/admin/shoptype/delete?id=' + payload.data.id);
    },
    editShopType(store, payload) {
        let config = {
          headers: {'content-type': 'application/x-www-form-urlencoded'}
        };
        return payload.$http.post('http://localhost:8888/admin/shoptype/edit', 'id='+payload.data.id+'&name='+payload.data.name, config);
    },
    //shop
    getShop(store, payload){
      payload.$http.get('http://localhost:8888/admin/shop').then((response) => {
        store.commit('update_Seller_shop', response.data);
      });
    },
    addShop(store, payload) {
      let config = {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      };
      return new Promise(function(resolve, reject) {
        payload.$http.post('http://localhost:8888/admin/shop/add','name='+payload.data.name+'&type='+payload.data.type+'&phone='+payload.data.phone+'&address='+payload.data.address+'&description='+payload.data.description, config).then((response) => {
          console.log(response);
          if (response.data.code) {
            reject(response.data);
          } else {
            resolve(response.data);
          }
        });
      })
    },
    deleteShop(store, payload) {
      return payload.$http.get('http://localhost:8888/admin/shop/delete?id=' + payload.data.id);
    },
    editShop(store, payload) {
      console.log(payload.data);
      let config = {
        headers: {'content-type': 'application/x-www-form-urlencoded'}
      };
      return payload.$http.post('http://localhost:8888/admin/shop/edit', 'id='+payload.data.id+'&name='+payload.data.name+'&type='+payload.data.type+'&phone='+payload.data.phone+'&address='+payload.data.address+'&description='+payload.data.description, config);
    },
    uploadShopImg(store, {$http,data}){
      let fd = new FormData();
      fd.append('id', data.id);
      fd.append('cover', data.cover);
      return $http({
        method: 'POST',
        url: 'http://localhost:8888/admin/shop/cover',
        data: fd,
        onUploadProgress:data.onUploadProgress
      });
    },
    addPicture(store, {$http,data}){
      console.log(data.pic);
      let fd = new FormData();
      fd.append('id', data.id);
      fd.append('description', data.description);
      fd.append('pic', data.pic);
      return $http({
        method: 'POST',
        url: 'http://localhost:8888/admin/shop/gallery',
        data: fd
      });
    },
    deletePic(store, payload){
      return payload.$http.post('http://localhost:8888/admin/shop/gallery/delete', 'id='+payload.data.id+'&gid='+payload.data.gid);
    },
    //商品
    getGoods(store, payload){
      payload.$http.get('http://localhost:8888/admin/goods').then((response) => {
        store.commit('update_Market_goods', response.data);
      });
    },
    addGoods(store,payload){
      let config = {
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      };
      return new Promise(function(resolve, reject) {
        payload.$http.post('http://localhost:8888/admin/goods/add', 'name=' + payload.data.name+'&shop='+payload.data.shop, config).then((response) => {
          if (response.data.code) {
            reject(response.data);
          } else {
            resolve(response.data);
          }
        });
      })
    },
    deleteGoods(store,payload){
      return payload.$http.get('http://localhost:8888/admin/goods/delete?id=' + payload.data.id);
    },
    uploadGoodsImg(store, {$http,data}){
      let fd = new FormData();
      fd.append('id', data.id);
      fd.append('cover', data.cover);
      return $http({
        method: 'POST',
        url: 'http://localhost:8888/admin/goods/cover',
        data: fd,
        onUploadProgress:data.onUploadProgress
      });
    },
    editGoods(store,payload){
      let config = {
        headers: {'content-type': 'application/x-www-form-urlencoded'}
      };
      return payload.$http.post('http://localhost:8888/admin/goods/edit', 'id='+payload.data.id+'&name='+payload.data.name+'&shop='+payload.data.shop, config);
    }
  }
})
