<template>
  <div>
    <h1>商家管理</h1>
    <mu-raised-button label="列表" class="demo-raised-button" :primary="focus =='list'" @click="focus='list'"/>
    <mu-raised-button label="添加商户" class="demo-raised-button" :primary="focus =='addShop'" @click="focus='addShop'"/>
    <mu-raised-button label="添加商户相册" class="demo-raised-button" :primary="focus =='addPhoto'" @click="focus='addPhoto'"/>
    <mu-raised-button label="批量删除" class="demo-raised-button" @click="multdelete"
    :secondary="!!arr.length" />
    <div v-if="focus =='list'">
      <mu-table :enableSelectAll='!!dataList.length' multiSelectable @rowSelection='rowSelection'>
          <mu-thead slot="header">
             <mu-tr>
               <mu-th tooltip="编号">编号</mu-th>
               <mu-th tooltip="封面">封面</mu-th>
               <mu-th tooltip="商户">商户</mu-th>
               <mu-th tooltip="菜系">菜系</mu-th>
               <mu-th tooltip="电话">电话</mu-th>
               <mu-th tooltip="操作">操作</mu-th>
             </mu-tr>
         </mu-thead>
         <mu-tbody>
             <mu-tr v-for="(list,index) in dataList" :key="list._id">
               <mu-td tooltip="编号">{{index+1}}</mu-td>
               <mu-td tooltip="封面">
                <img v-if="list.cover" style="width: 60px; height: 60px;" :src="'http://localhost:8888/'+ list.cover" alt="">
               </mu-td>
               <mu-td tooltip="商户">{{list.name}}</mu-td>
               <mu-td tooltip="菜系">{{list.type.name}}</mu-td>
               <mu-td tooltip="电话">{{list.phone}}</mu-td>
               <mu-td tooltip="操作">
                 <mu-raised-button @click.native.stop="showEditShop(list)" label="编辑" class="demo-raised-button" primary/>
                 <mu-raised-button @click.native.stop="deleteShop(list._id)" label="删除" class="demo-raised-button" secondary/>
                 <mu-raised-button @click.native.stop="showImg(list._id)"
                 label="上传封面" class="demo-raised-button" primary/>
                 <mu-raised-button @click.native.stop="showPhoto(list._id)"
                 label="查看相册" class="demo-raised-button" primary/>
               </mu-td>
             </mu-tr>
         </mu-tbody>
      </mu-table>
    </div>
    <div v-if="focus =='addShop'">
      <form>
        <h4>添加商户</h4>
        <p>
          <mu-text-field v-model="shop.name" label="请输入商户名称" labelFloat />
        </p>
        <p>
          <mu-select-field v-model="shop.selectIndex" :labelFocusClass="['label-foucs']" label="选择你的美食类型">
            <mu-menu-item v-for="(l,index) in List" :value=index :key="l._id" :title="l.name"/>
          </mu-select-field>
        </p>
        <p>
          <mu-text-field v-model="shop.phone" label="请输入商户电话" labelFloat />
        </p>
        <p>
          <mu-text-field v-model="shop.address" label="请输入商户地址" labelFloat />
        </p>
        <p>
          <mu-text-field v-model="shop.description" label="请输入商户简介" labelFloat />
        </p>
        <mu-raised-button @click="addShop" label="提交" class="demo-raised-button" secondary/>
      </form>
    </div>
    <div v-if="focus =='addPhoto'">
      <form>
        <h4>添加商户相册</h4>
        <mu-grid-list v-show="imgData.imgUrl">
          <mu-sub-header>图片展示</mu-sub-header>
          <mu-grid-tile :cols="12">
            <img :src="imgData.imgUrl"/>
          </mu-grid-tile>
        </mu-grid-list>
        <input type="file" @change='change'>
        <p>
          <mu-select-field v-model="photo.selectIndex" :labelFocusClass="['label-foucs']" label="请选择所属的商家">
            <mu-menu-item v-for="(l,index) in dataList" :value=index :key="l._id" :title="l.name"/>
          </mu-select-field>
        </p>
        <p>
          <mu-text-field v-model="photo.description" label="请输入照片描述" labelFloat />
        </p>
        <mu-raised-button label="提交" @click='addPicture' class="demo-raised-button" secondary/>
      </form>
    </div>

    <mu-popup :position="popup.position" :overlay="popup.overlay" :popupClass="{'demo-popup-top': true, error: popup.error}" :open="popup.open">
           {{popup.message}}
    </mu-popup>

    <mu-dialog :open="dialog.open"  @close="dialog.open=false">
            <form>
              <h4>更新商户信息</h4>
              <p>
                <mu-text-field v-model="editData.name" label="请输入商户名称" labelFloat />
              </p>
              <p>
                <mu-select-field v-model="editData.selectIndex" :labelFocusClass="['label-foucs']" label="选择你的美食类型">
                  <mu-menu-item v-for="(l,index) in List" :value=index :key="l._id" :title="l.name"/>
                </mu-select-field>
              </p>
              <p>
                <mu-text-field v-model="editData.phone" label="请输入商户电话" labelFloat />
              </p>
              <p>
                <mu-text-field v-model="editData.address" label="请输入商户地址" labelFloat />
              </p>
              <p>
                <mu-text-field v-model="editData.description" label="请输入商户简介" labelFloat />
              </p>
            </form>
            <mu-flat-button slot="actions" primary backgroundColor="#ff5252" color="black" @click="editShop" label="确定"/>
    </mu-dialog>

    <mu-dialog :open="upload.open" title="上传图片" @close="upload.open=false">
      <mu-linear-progress v-show="imgData.imgUrl" mode="determinate" />
      <mu-grid-list v-show="imgData.imgUrl">
        <mu-sub-header>图片展示</mu-sub-header>
        <mu-grid-tile :cols="12">
          <img :src="imgData.imgUrl"/>
        </mu-grid-tile>
      </mu-grid-list>
      <input type="file" @change='change'>
      <mu-flat-button slot="actions" primary backgroundColor="#ff5252" color="black" @click="uploadImg" label="确定"/>
    </mu-dialog>

    <mu-dialog :open="picList.open" :title="!!Gallerys.length?'相册详情':'相册为空，请上传照片！'" @close="picList.open=false">
      <mu-raised-button v-if="!!Gallerys.length" label="批量删除" class="demo-raised-button"/>
      <mu-table multiSelectable enableSelectAll v-if="!!Gallerys.length">
        <mu-thead>
          <mu-tr>
            <mu-th tooltip="图片">图片</mu-th>
            <mu-th tooltip="描述">描述</mu-th>
            <mu-th tooltip="操作">操作</mu-th>
          </mu-tr>
        </mu-thead>
        <mu-tbody>
          <mu-tr v-for="g,index in Gallerys" :key="index">
            <mu-td tooltip="图片">
              <img v-if="g.path" style="width: 60px; height: 60px;" :src="'http://localhost:8888/'+ g.path">
            </mu-td>
            <mu-td tooltip="描述">{{g.description}}</mu-td>
            <mu-td tooltip="操作">
              <mu-raised-button @click.native.stop="deletePic(index)" label="删除" class="demo-raised-button" secondary/>
            </mu-td>
          </mu-tr>
        </mu-tbody>
      </mu-table>
    </mu-dialog>
  </div>
</template>

<script>
export default {
  name: 'Shop',
  data:function () {
    return{
      focus: "list",
      popup: {
        open: false,
        position: 'top',
        overlay: false,
        message: '',
        error: true
      },
      shop:{
        selectIndex:0,
        name:'',
        type:'',
        phone:'',
        address:'',
        description:''
      },
      arr:[],
      editData: {
        selectIndex:0,
        name:'',
        type:'',
        phone:'',
        address:'',
        description:''
      },
      photo:{
        selectIndex:0,
        description:'',
      },
      picList:{open: false},
      dialog:{open: false},
      upload:{open: false},
      progressValue:0,
      imgData:{
        id:'',
        imgUrl:'',
        img:''
      },
      shopId:'',
      Gallerys:''
    }
  },
  created() {
    this.$store.dispatch('getShopTypes', {
      $http: this.$http
    });
    this.$store.dispatch('getShop', {
      $http: this.$http
    });
  },
  computed:{
    dataList() {
      return this.$store.getters.Seller_shop
    },
    List(){
      return this.$store.getters.APP_shopType
    }
  },
  methods:{
    addShop() {
      this.$store.dispatch('addShop',{
        $http:this.$http,
        data: {
          name: this.shop.name,
          type: this.List[this.shop.selectIndex]._id,
          phone: this.shop.phone,
          address: this.shop.address,
          description: this.shop.description
        }
      }).then(() => {
        console.log(1);
        this.showPopup(false, "添加成功", 1000);
        this.$store.dispatch('getShop', {
          $http: this.$http
        })
      }).catch((error) => {
        this.showPopup(true, error.message, 1000)
      })
    },
    deleteShop(id){
      this.$store.dispatch('deleteShop', {
        $http: this.$http,
        data: {
          id
        }
      }).then(() => {
        this.showPopup(true, error.message, 1000)
      }).catch((error) => {
        this.showPopup(false, '删除成功', 1000);
        this.$store.dispatch('getShop', {
          $http: this.$http
        });
        this.arr.length=0;
      })
    },
    rowSelection(selectedRowsindex) {
      let arr = [];
      this.dataList.forEach((item, index) => {
        if (selectedRowsindex.includes(index)) {
          arr.push(item._id);
        }
      });
      this.arr = arr;
    },
    multdelete(){
      this.deleteShop(this.arr.join(','));
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
        this.imgData.imgUrl=reader.result;
      }
    },
    uploadImg(){
      // console.log(this.imgData.imgUrl);
      this.$store.dispatch('uploadShopImg',{
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
          this.$store.dispatch('getShop',{
            $http:this.$http
          })
        }else{
          this.showPopup(true, response.data.message, 1000)
        }
      })
    },
    showEditShop(data){
      this.editData._id = data._id;
      this.editData.name = data.name;
      this.editData.phone = data.phone;
      this.editData.address = data.address;
      this.editData.description = data.description;
      this.dialog.open = true;
      this.selectIndex=0
    },
    editShop() {
        this.editData.type = this.List[this.editData.selectIndex]._id;
        this.$store.dispatch('editShop', {
          $http: this.$http,
          data: {
            id: this.editData._id,
            name: this.editData.name,
            type:this.editData.type,
            phone:this.editData.phone,
            address:this.editData.address,
            description:this.editData.description,
          }
        }).then((response) => {
                if (response.data.code) {
                    if (response.data.code == 2) {
                        this.editData.name = this.editData.origin_name;
                    }
                    this.showPopup(true, response.data.message, 1000);
                } else {
                    this.showPopup(false, '修改成功', 1000);
                    this.$store.dispatch('getShop', {
                        $http: this.$http
                    });
                    this.dialog.open = false;
                    this.editData.selectIndex=0;
                }
            })
    },
    addPicture(){
      this.$store.dispatch('addPicture',{
        $http:this.$http,
        data:{
          id:this.dataList[this.photo.selectIndex]._id,
          description:this.photo.description,
          pic:this.imgData.file
        }
      }).then(() => {
        this.showPopup(false, "上传相册成功", 1000);
        this.$store.dispatch('getShop', {
          $http: this.$http
        })
      }).catch((error) => {
        this.showPopup(true, error.message, 1000)
      })
    },
    showPhoto(id){
      this.picList.open=true;
      this.shopId=id;
      this.Gallerys=this.dataList.filter(function (item) {
        return item._id==id;
      })[0].gallery;
    },
    deletePic(index){
      this.$store.dispatch('deletePic',{
        $http: this.$http,
        data: {
          id:this.shopId,
          gid:index
        }
      }).then(() => {
        this.showPopup(true, error.message, 1000)
      }).catch((error) => {
        this.showPopup(false, '删除成功', 1000);
        this.$store.dispatch('getShop', {
          $http: this.$http
        });
      })
    },
    showPopup(type, message, time) {
      this.popup.error = type;
      this.popup.message = message;
      this.popup.open = true;
      setTimeout(() => {
        this.popup.open = false;
      }, time)
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
    .mu-grid-tile-titlebar{
      display: none
    }
</style>
