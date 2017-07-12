<template lang="html">
  <div>
    <h1>商家分类管理</h1>
    <mu-raised-button label="列表" class="demo-raised-button"
    :primary="focus =='list'" @click="focus='list'"/>
    <mu-raised-button label="添加" class="demo-raised-button"
    :primary="focus =='add'" @click="focus='add'"/>
    <mu-raised-button label="批量删除" class="demo-raised-button" @click="multdelete"
    :secondary="!!arr.length" />
    <div v-if="focus =='list'">
      <mu-table :enableSelectAll='!!dataList.length' multiSelectable  @rowSelection="rowSelection">
          <mu-thead slot="header">
             <mu-tr>
               <mu-th tooltip="编号">编号</mu-th>
               <mu-th tooltip="名称">名称</mu-th>
               <mu-th tooltip="状态">操作</mu-th>
             </mu-tr>
         </mu-thead>
         <mu-tbody>
            <mu-tr v-for="(list,index) in dataList" :key="list._id">
              <mu-th tooltip="编号">{{index+1}}</mu-th>
              <mu-th tooltip="名称">{{list.name}}</mu-th>
              <mu-th tooltip="状态">
                  <mu-raised-button @click.native.stop="showEditShopType(list)" label="编辑" class="demo-raised-button" primary/>
                  <mu-raised-button @click.native.stop="deleteShopType(list._id)" label="删除" class="demo-raised-button" secondary/>
              </mu-th>
            </mu-tr>
        </mu-tbody>
      </mu-table>
    </div>
    <div v-if="focus =='add'">
      <form>
        <h4>添加菜系</h4>
        <p>
          <mu-text-field v-model="typename" label="请输入菜系名称" labelFloat />
        </p>
        <p>
          <mu-raised-button @click="addShopType" label="提交" class="demo-raised-button" secondary/>
        </p>
      </form>
    </div>
    <mu-popup :position="popup.position" :overlay="popup.overlay" :popupClass="{'demo-popup-top': true, error: popup.error}" :open="popup.open">
           {{popup.message}}
    </mu-popup>
    <mu-dialog :open="dialog.open" title="修改" @close="dialog.open=false">
            <form>
                <h4>菜系</h4>
                <p>
                    <mu-text-field v-model="editData.name" label="请输入一个菜系名称" labelFloat/>
                </p>
            </form>
            <mu-flat-button slot="actions" primary @click="editShopType" label="确定"/>
    </mu-dialog>
  </div>
</template>

<script>
export default {
  name: "ShopType",
  data: function() {
    return {
      focus: "list",
      typename: "",
      popup: {
        open: false,
        position: 'top',
        overlay: false,
        message: '',
        error: true
      },
      arr: [],
      enableSelectAll:true,
      editData: {},
      dialog:{open: false}
    }
  },
  created() {
    // let xhr = new XMLHttpRequest();
    // xhr.open("get",'http://localhost:8008/shoptype',true);
    // xhr.onload=() => {
    //   this.$store.commit('update_App_shopType',JSON.parse(xhr.responseText).data)
    // };
    // xhr.send()
    // this.$http.get('http://localhost:8008/shoptype').then((response)=>{
    //   this.$store.commit('update_App_shopType',response.data)
    // })
    this.$store.dispatch('getShopTypes', {
      $http: this.$http
    });
  },
  computed: {
    dataList() {
      return this.$store.getters.APP_shopType
    }
  },
  methods: {
    addShopType() {
      this.$store.dispatch('addShopType', {
        $http: this.$http,
        data: {
          name: this.typename
        }
      }).then((value) => {
        this.showPopup(false, "添加成功", 1000);
        this.$store.dispatch('getShopTypes', {
          $http: this.$http
        })
      }).catch((error) => {
        this.showPopup(true, error.message, 1000)
      })
    },
    multdelete() {
      this.deleteShopType(this.arr.join(','));
    },
    deleteShopType(id) {
      this.$store.dispatch('deleteShopType', {
        $http: this.$http,
        data: {
          id
        }
      }).then(() => {
        this.showPopup(true, error.message, 1000)
      }).catch((error) => {
        this.showPopup(false, '删除成功', 1000);
        this.$store.dispatch('getShopTypes', {
          $http: this.$http
        });
        this.arr.length=0;
      })
    },
    showEditShopType(data){
      this.editData = data;
      this.editData.origin_name = data.name;
      this.dialog.open = true;
    },
    editShopType() {
        this.$store.dispatch('editShopType', {
          $http: this.$http,
          data: {
            id: this.editData._id,
            name: this.editData.name
          }
        }).then((response) => {
                if (response.data.code) {
                    if (response.data.code == 2) {
                        this.editData.name = this.editData.origin_name;
                    }
                    this.showPopup(true, response.data.message, 1000);
                } else {
                    this.showPopup(false, '修改成功', 1000);
                    this.$store.dispatch('getShopTypes', {
                        $http: this.$http
                    });
                    this.dialog.open = false;
                }
            })
    },
    showPopup(type, message, time) {
      this.popup.error = type;
      this.popup.message = message;
      this.popup.open = true;
      setTimeout(() => {
        this.popup.open = false;
      }, time)
    },
    rowSelection(selectedRowsindex) {
      let arr = [];
      this.dataList.forEach((item, index) => {
        if (selectedRowsindex.includes(index)) {
          arr.push(item._id);
        }
      });
      this.arr = arr;
    }
  }
}
</script>

<style lang="css">
    .demo-popup-top {
    width: 100%;
    opacity: .8;
    height: 48px;
    line-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 375px;
    }
    .error {
    background: red !important;
    color: white !important;
    }
</style>
