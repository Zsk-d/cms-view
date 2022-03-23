<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>销售记录查询</span>
      </div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="商品编号">
          <el-input v-model="searchForm.params.gid" :clearable="true" placeholder="商品编号" style="width:150px;">
          </el-input>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.params.gname" :clearable="true" placeholder="商品名称" style="width:150px;">
          </el-input>
        </el-form-item>
        <el-form-item label="会员名">
          <el-input v-model="searchForm.params.cname" :clearable="true" placeholder="会员名" style="width:150px;">
          </el-input>
        </el-form-item>
        <el-form-item label="会员编号">
          <el-input v-model="searchForm.params.cid" :clearable="true" placeholder="会员编号" style="width:150px;">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
          <el-button type="primary" @click="addUser" icon="el-icon-plus">新增销售记录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <SearchTable :option="tableOption" style="margin-top:10px;" ref="st"></SearchTable>
    <AddPhDialog ref="aud" :cb="addCb"></AddPhDialog>
  </div>
</template>

<script>
  import util from "@/util.js"
  import urls from "@/urls.js"
  import SearchTable from "@/components/SearchTable.vue";
  import AddPhDialog from "@/components/AddPhDialog.vue";
  export default {
    data() {
      let self = this;
      return {
        dialogVisible: false,
        searchForm: {
          params: {
            table: "ph"
          }
        },
        tableOption: {
          url: urls.SEARCH_DATA,
          maxHeight: window.innerHeight - 310,
          cols: [{
              type: "index",
              label: "序号",
              align: "center",
              headerAlign: "center",
              width: "60px"
            },
            {
              prop: "gid",
              label: "商品编号",
              align: "center",
              width: "150px",
              headerAlign: "center",
            },
            {
              prop: "gname",
              label: "商品名",
              width: "150px",
              align: "center",
              headerAlign: "center",
            }, {
              prop: "cid",
              label: "会员编号",
              align: "center",
              width: "100px",
              headerAlign: "center",
            },
            {
              prop: "cname",
              label: "会员名",
              width: "100px",
              align: "center",
              headerAlign: "center",
            },
            {
              prop: "count",
              label: "数量",
              width: "80px",
              align: "center",
              headerAlign: "center",
            },
            {
              prop: "total",
              label: "总价/元",
              width: "100px",
              align: "center",
              headerAlign: "center",
            },
            {
              prop: "createTime",
              label: "消费时间",
              align: "center",
              headerAlign: "center",
              width: "185px",
            },
            {
              prop: "remarks",
              label: "备注",
              align: "center",
              headerAlign: "center",
            },
            {
              prop: "index",
              label: "操作",
              align: "center",
              headerAlign: "center",
              hasBtn: true,
              width: "160px",
              btns: [{
                name: "修改",
                size: "small",
                func(index, tableData) {
                  self.$refs.aud.open(util.deepCopy(tableData[index]));
                }
              }, {
                name: "删除",
                type: "danger",
                size: "small",
                func(index, tableData) {
                  self.resetPwdAndDel(index, tableData, 0)
                }
              }, ]
            },
          ],
        },
        addCb(form,isAdd) {
          self.search();
          if(isAdd){
            util.method.logAdd(`添加了销售记录[${form.cname} - ${form.gname}]`);
          }else{
            util.method.logEdit(`修改了销售记录[${form.cname} - ${form.gname}]`);
          }
        },
      }
    },
    methods: {
      search() {
        this.$refs.st.search(this.searchForm.params);
      },
      addUser() {
        this.$refs.aud.open();
      },
      // type 0 del, 1 reset
      resetPwdAndDel(index, pageData, type) {
        let self = this;
        let row = pageData[index];
        this.$confirm(
            `确定删除记录?`,
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
                util.method.logDel(`删除了销售记录[${form.cname} - ${form.gname}]`);
              } else {
                util.showMessage(this, "操作失败", util.elMessageType.error);
              }
            };
            let errCb = err => {
              util.showMessage(this, "处理失败 " + err, util.elMessageType.error);
            };
            util.getJsonPost(urls.DELETE_DATA, okCb, errCb,{
              table: "ph",
              where: {
                gid:row.gid,
                cid:row.cid,
                createTime: row.createTime
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
      AddPhDialog
    }
  }

</script>

<style scoped>


</style>
