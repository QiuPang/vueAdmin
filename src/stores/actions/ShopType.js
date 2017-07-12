import QS from 'qs';    //queryString
import { API } from '../API';

export default {
    // 获取所有的商家类型信息
    getShopTypes(store, {$http} ) {
        $http({
            url: API.admin.shopType.list
        }).then((response) => {
            response.data.forEach(function(item) {
                item.allowSelected = true;
            })
            store.commit('update_APP_shopType', response.data);
        });
    },
    // 提交新的商家类型
    addShopType(store, {$http, data}) {
        return $http({
            method: 'POST',
            url: API.admin.shopType.add,
            data: QS.stringify(data)
        });
    },
    //编辑
    editShopType(store, {$http, data}) {
        return $http({
            method: 'POST',
            url: API.admin.shopType.edit,
            data: QS.stringify(data)
        });
    },
    // 删除
    deleteShopType(store, {$http, data}) {
        return $http({
            url: API.admin.shopType.delete,
            params: data
        });
    }
}
