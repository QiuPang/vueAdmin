const H = 'http://localhost:8888/';

export const HOST = H;

export const API = {

    admin: {
        shopType: {
            list: H + 'admin/shoptype',
            add: H + 'admin/shoptype/add',
            edit: H + 'admin/shoptype/edit',
            delete: H + 'admin/shoptype/delete'
        },
        shop: {
            list: H + 'admin/shop',
            add: H + 'admin/shop/add',
            uploadCover: H + 'admin/shop/cover'
        }
    }

}
