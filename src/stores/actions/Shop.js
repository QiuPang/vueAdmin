import { API } from '../API';
import QS from 'qs';

export default {

    /**
     * 商户列表
     */
    getShop(store, {$http}) {
        $http.get( API.admin.shop.list ).then((response) => {
            store.commit('update_APP_shop', response.data);
        });
    },

    /**
     * 添加商户
     */
    addShop(store, {$http, data}) {
        return $http({
            method: 'POST',
            url: API.admin.shop.add,
            data: QS.stringify(data)
        });
    },

    /**
     * 上传封面
     */
    uploadCover(store, {$http, data}) {

        // 通过formdata对象可以把数据解析成formdata格式，二进制
        let fd = new FormData();
        fd.append('id', data.id);
        fd.append('cover', data.cover);

        return $http({
            method: 'POST',
            url: API.admin.shop.uploadCover,
            data: fd,
            onUploadProgress: data.onUploadProgress
        });
    }

}
