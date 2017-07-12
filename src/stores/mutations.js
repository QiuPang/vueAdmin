export default {
    UI_open_toggle(state){
        state.UI.open = !state.UI.open;
    },

    update_APP_shopType(state, data) {
        state.APP.shopType = data;
    },

    update_APP_shop(state, data) {
        state.APP.shop = data;
    }
};
