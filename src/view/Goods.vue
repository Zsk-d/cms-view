<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>商品查询</span>
      </div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="货号:">
          <el-input v-model="searchForm.params.gid" :clearable="true" placeholder="货号"></el-input>
        </el-form-item>
        <el-form-item label="商品名:">
          <el-input v-model="searchForm.params.name" :clearable="true" placeholder="商品名"></el-input>
        </el-form-item>
        <el-form-item label="分类:">
          <el-input v-model="searchForm.params.category" :clearable="true" placeholder="分类"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
          <el-button type="primary" @click="add" icon="el-icon-plus">添加商品</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <SearchTable :option="tableOption" style="margin-top:10px;" ref="st"></SearchTable>
    <AddGoodsDialog ref="aud" :cb="addCb"></AddGoodsDialog>
  </div>
</template>

<script>
  import util from "@/util.js"
  import urls from "@/urls.js"
  import SearchTable from "@/components/SearchTable.vue";
  import AddGoodsDialog from "@/components/AddGoodsDialog.vue";
  export default {
    data() {
      let self = this;
      return {
        dialogVisible: false,
        searchForm: {
          params: {
            table: "goods"
          }
        },
        tableOption: {
          url: urls.SEARCH_DATA,
          maxHeight: window.innerHeight - 310,
          rowStyle(row){
            let style = {};
            if(row.row.status == '0'){
              style["background-color"] = "#c7b8b640";
            }
            return style;
          },
          cols: [{
              type: "index",
              label: "序号",
              align: "center",
              headerAlign: "center",
              width: "60px"
            },
            {
              prop: "gid",
              label: "货号",
              align: "center",
              headerAlign: "center",
            },
            {
              prop: "name",
              label: "商品名",
              align: "center",
              headerAlign: "center",
            },
            {
              prop: "charge",
              label: "单价/元",
              align: "center",
              headerAlign: "center",
              width: "80px"
            },
            {
              prop: "category",
              label: "分类",
              align: "center",
              headerAlign: "center",
              width: "90px"
            },
            {
              prop: "count",
              label: "库存数量",
              align: "center",
              headerAlign: "center",
              width:"120px",
            },
            {
              prop: "status",
              label: "状态",
              align: "center",
              headerAlign: "center",
              width:"100px",
              formatter(row){
                return row.status=='1'?"上架":"下架";
              }
            },
            {
              prop: "remarks",
              label: "备注",
              align: "center",
              headerAlign: "center"
            },
            {
              prop: "createTime",
              label: "创建时间",
              align: "center",
              headerAlign: "center",
              width: "200px",
            },
            {
              prop: "username",
              label: "操作",
              align: "center",
              headerAlign: "center",
              hasBtn: true,
              width: "230px",
              btns: [{
                name: "修改",
                size: "small",
                func(index, tableData) {
                  self.$refs.aud.open(util.deepCopy(tableData[index]));
                }
              }, {
                name: "下架",
                size: "small",
                getShow(row) {
                  return row.status == '1';
                },
                func(index, tableData) {
                  util.method.updateData("goods","gid",{gid:tableData[index].gid,status:"0"},res=>{
                    self.search();
                  });
                }
              }, {
                name: "上架",
                size: "small",
                getShow(row) {
                  return row.status == '0';
                },
                func(index, tableData) {
                  util.method.updateData("goods","gid",{gid:tableData[index].gid,status:"1"},res=>{
                    self.search();
                  });
                }
              }, {
                name: "删除",
                type: "danger",
                size: "small",
                func(index, tableData) {
                  self.del(index, tableData, 0)
                }
              }, ]
            },
          ],
        },
        addCb(form,isAdd) {
          self.search();
          if(isAdd){
            util.method.logAdd(`添加了商品[${form.name}]`);
          }else{
            util.method.logEdit(`修改了商品[${form.name}]`);
          }
        },
        updateInfoCb(info) {
          self.search();
        }
      }
    },
    methods: {
      search() {
        this.$refs.st.search(this.searchForm.params);
      },
      add() {
        this.$refs.aud.open();
      },
      // type 0 del, 1 reset
      del(index, pageData, type) {
        let self = this;
        let row = pageData[index];
        this.$confirm(
            `确定删除[${row.gid} - ${row.name}]?`,
            '注意', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }
          )
          .then(() => {
            // 确定回调
            let okCb = res => {
              if (res.status == 200) {
                util.showMessage(this, "操作成功", util.elMessageType.sec);
                self.search();
                util.method.logDel(`删除了商品[${row.name}]`);
              } else {
                util.showMessage(this, "操作失败", util.elMessageType.error);
              }
            };
            let errCb = err => {
              util.showMessage(this, "处理失败 " + err, util.elMessageType.error);
            };
            util.getJsonPost(urls.DELETE_DATA, okCb, errCb, {
              table: "goods",
              where: {
                gid: row.gid
              }
            });
          })
          .catch(() => {
            /// 异常回调
          })
      },
      updateUser(index, pageData) {
        this.$refs.uiud.open(util.deepCopy(pageData[index]));
      }
    },
    mounted() {
      this.search();
    },
    components: {
      SearchTable,
      AddGoodsDialog
    }
  }

</script>

<style scoped>


</style>
