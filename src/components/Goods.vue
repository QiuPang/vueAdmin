<template>
  <div>
    <h1>商品管理</h1>
    <mu-raised-button label="列表" class="demo-raised-button" :primary="focus =='list'" @click="focus='list'"/>
    <mu-raised-button label="添加" class="demo-raised-button" :primary="focus =='add'" @click="focus='add'"/>
    <mu-raised-button label="批量删除" :secondary="!!arr.length" @click="multdelete" class="demo-raised-button"/>
    <div v-if="focus =='list'">
      <mu-table :enableSelectAll='!!goodsList.length' multiSelectable @rowSelection='rowSelection'>
          <mu-thead slot="header">
             <mu-tr>
               <mu-th tooltip="编号">编号</mu-th>
               <mu-th tooltip="商品图片">商品图片</mu-th>
               <mu-th tooltip="商品名称">商品名称</mu-th>
               <mu-th tooltip="所属商家">所属商家</mu-th>
               <mu-th tooltip="操作">操作</mu-th>
             </mu-tr>
         </mu-thead>
         <mu-tbody>
             <mu-tr v-for="l,index in goodsList" :key="l._id">
               <mu-td tooltip="编号">{{index+1}}</mu-td>
               <mu-td tooltip="商品图片">
                <img v-if="l.cover" style="width: 60px; height: 60px;" :src="'http://localhost:8888/'+ l.cover">
               </mu-td>
               <mu-td tooltip="商品名称">{{l.name}}</mu-td>
               <mu-td tooltip="所属商家">{{l.shop.name}}</mu-td>
               <mu-td tooltip="操作">
                 <mu-raised-button @click.native.stop="showEditGoods(l)" label="编辑" class="demo-raised-button" primary/>
                 <mu-raised-button @click.native.stop="deleteGoods(l._id)" label="删除" class="demo-raised-button" secondary/>
                 <mu-raised-button @click.native.stop="showImg(l._id)"
                 label="上传" class="demo-raised-button" secondary/>
               </mu-td>
             </mu-tr>
         </mu-tbody>
      </mu-table>
    </div>
    <div v-if="focus =='add'">
      <form>
        <h4>添加商品</h4>
        <p>
          <mu-text-field v-model="goods.name" label="请输入商品名称" labelFloat />
        </p>
        <p>
          <mu-select-field v-model="goods.selectIndex" :labelFocusClass="['label-foucs']" label="请选择所属的商家">
            <mu-menu-item v-for="(l,index) in shopList" :value=index :key="l._id" :title="l.name"/>
          </mu-select-field>
        </p>
        <mu-raised-button label="提交" @click='addGoods' class="demo-raised-button" secondary/>
      </form>
    </div>
    <mu-dialog :open="dialog.open"  @close="dialog.open=false">
            <form>
              <h4>更新商品信息</h4>
              <p>
                <mu-text-field v-model="editData.name" label="请输入商品名称" labelFloat />
              </p>
              <p>
                <mu-select-field v-model="editData.selectIndex" :labelFocusClass="['label-foucs']" label="选择你的美食类型">
                  <mu-menu-item v-for="(l,index) in shopList" :value=index :key="l._id" :title="l.name"/>
                </mu-select-field>
              </p>
            </form>
            <mu-flat-button slot="actions" primary backgroundColor="#ff5252" color="black" @click="editGoods" label="确定"/>
    </mu-dialog>
    <mu-dialog :open="upload.open" title="上传图片" @close="upload.open=false">
      <mu-linear-progress v-show="imgData.imgUrl" mode="determinate" :value="progressValue"/>
      <mu-grid-list v-show="imgData.imgUrl">
        <mu-sub-header >图片展示</mu-sub-header>
        <mu-grid-tile :cols="12">
          <img :src="imgData.imgUrl"/>
        </mu-grid-tile>
      </mu-grid-list>
      <input type="file" @change='change'>
      <mu-flat-button slot="actions" primary backgroundColor="#ff5252" color="black" @click="uploadImg" label="确定"/>
    </mu-dialog>
    <mu-popup :position="popup.position" :overlay="popup.overlay" :popupClass="{'demo-popup-top': true, error: popup.error}" :open="popup.open">
          {{popup.message}}
    </mu-popup>
  </div>
</template>
<script>
export default {
  name: "Goods",
  data: function data() {
    return {
      focus: "list",
      popup: {
        open: false,
        position: 'top',
        overlay: false,
        message: '',
        error: true
      },
      dialog:{open: false},
      goods:{
        selectIndex:0,
        name:''
      },
      editData:{
        selectIndex:0,
        name:''
      },
      arr:[],
      upload:{open: false},
      progressValue:0,
      imgData:{
        id:'',
        imgUrl:'',
        img:''
      }
    }
  },
  created(){
    this.$store.dispatch('getShop', {
      $http: this.$http
    });
    this.$store.dispatch('getGoods', {
      $http: this.$http
    });
  },
  computed:{
    shopList() {
      return this.$store.getters.Seller_shop
    },
    goodsList() {
      return this.$store.getters.Market_goods
    }
  },
  methods: {
    addGoods() {
      this.$store.dispatch('addGoods',{
        $http: this.$http,
        data:{
          name:this.goods.name,
          shop:this.shopList[this.goods.selectIndex]._id
        }
      }).then(() => {
        this.showPopup(false, "添加成功", 1000);
        this.$store.dispatch('getGoods', {
          $http: this.$http
        })
      }).catch((error) => {
        this.showPopup(true, error.message, 1000)
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
    deleteGoods(id){
      this.$store.dispatch('deleteGoods', {
        $http: this.$http,
        data: {
          id
        }
      }).then(() => {
        this.showPopup(true, error.message, 1000)
      }).catch((error) => {
        this.showPopup(false, '删除成功', 1000);
        this.$store.dispatch('getGoods', {
          $http: this.$http
        });
        this.arr.length=0
      })
    },
    rowSelection(selectedRowsindex) {
      let arr = [];
      this.goodsList.forEach((item, index) => {
        if (selectedRowsindex.includes(index)) {
          arr.push(item._id);
        }
      });
      this.arr = arr;
    },
    multdelete(){
      this.deleteGoods(this.arr.join(','));
    },
    showImg(id){
      this.upload.open=true;
      this.imgData.id=id;
      this.imgData.imgUrl='';
      this.imgData.img=null
    },
    change(e){
      this.imgData.file = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(this.imgData.file);
      reader.onload =()=>{
        this.imgData.imgUrl=reader.result
      }
    },
    uploadImg(){
      this.$store.dispatch('uploadGoodsImg',{
        $http:this.$http,
        data:{
          id:this.imgData.id,
          cover:this.imgData.file,
          onUploadProgress: (e)=> {
            this.progressValue = parseInt(e.loaded / e.total * 100);
          }
        }
      }).then((response)=>{
        this.showPopup(false, '上传成功', 1000);
        this.progressValue=0;
        if(!response.data.code){
          this.upload.open=false;
          this.$store.dispatch('getGoods',{
            $http:this.$http
          })
        }else{
          this.showPopup(true, response.data.message, 1000)
        }
      })
    },
    showEditGoods(data){
      this.dialog.open = true;
      this.editData._id = data._id;
      this.editData.name = data.name;
    },
    editGoods(){
      this.editData.shop=this.shopList[this.editData.selectIndex]._id;
      this.$store.dispatch('editGoods',{
        $http: this.$http,
        data:{
          id:this.editData._id,
          name:this.editData.name,
          shop:this.editData.shop
        }
      }).then((response) => {
              if (response.data.code) {
                  if (response.data.code == 2) {
                      this.editData.name = this.editData.origin_name;
                  }
                  this.showPopup(true, response.data.message, 1000);
              } else {
                  this.showPopup(false, '修改成功', 1000);
                  this.$store.dispatch('getGoods', {
                      $http: this.$http
                  });
                  this.dialog.open = false;
                  this.editData.selectIndex=0;
              }
          })
    }
  }
}
</script>
<style>
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
.mu-grid-tile-titlebar{
  display: none
}
</style>
