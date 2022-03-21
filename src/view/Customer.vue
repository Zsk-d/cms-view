<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>会员查询</span>
      </div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="会员名">
          <el-input v-model="searchForm.params.name" :clearable="true" placeholder="会员名" style="width:150px;"></el-input>
        </el-form-item>
        <el-form-item label="会员编号">
          <el-input v-model="searchForm.params.cid" :clearable="true" placeholder="会员编号" style="width:150px;"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.params.tel" :clearable="true" placeholder="手机号"  style="width:140px;"></el-input>
        </el-form-item>
        <el-form-item label="住址">
          <el-input v-model="searchForm.params.loc" :clearable="true" placeholder="住址"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
          <el-button type="primary" @click="addUser" icon="el-icon-plus">会员注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <SearchTable :option="tableOption" style="margin-top:10px;" ref="st"></SearchTable>
    <AddCustomerDialog ref="aud" :cb="addCb"></AddCustomerDialog>
  </div>
</template>

<script>
  import util from "@/util.js"
  import urls from "@/urls.js"
  import SearchTable from "@/components/SearchTable.vue";
  import AddCustomerDialog from "@/components/AddCustomerDialog.vue";
  export default {
    data() {
      let self = this;
      return {
        dialogVisible: false,
        searchForm: {
          params: {
            table: "customer"
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
              prop: "cid",
              label: "会员编号",
              align: "center",
              width: "100px",
              headerAlign: "center",
            },
            {
              prop: "name",
              label: "会员名",
              width: "100px",
              align: "center",
              headerAlign: "center",
            },
            {
              prop: "sex",
              label: "性别",
              align: "center",
              headerAlign: "center",
              width: "60px",
              formatter(row) {
                return row.sex == "1" ? "男" : "女";
              }
            },
            {
              prop: "loc",
              label: "住址",
              align: "center",
              headerAlign: "center",
            },
            {
              prop: "mail",
              label: "邮箱",
              align: "center",
              headerAlign: "center",
            },
            {
              prop: "tel",
              label: "手机号",
              align: "center",
              width: "115px",
              headerAlign: "center",
            },
            {
              prop: "createTime",
              label: "注册时间",
              align: "center",
              headerAlign: "center",
              width: "175px",
            },
            {
              prop: "remarks",
              label: "备注",
              align: "center",
              headerAlign: "center",
            },
            {
              prop: "username",
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
        addCb() {
          self.search();
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
      addUser() {
        this.$refs.aud.open();
      },
      // type 0 del, 1 reset
      resetPwdAndDel(index, pageData, type) {
        let self = this;
        let user = pageData[index];
        this.$confirm(
            `确定${type==0?'删除':'重置'}用户[${user.username}${user.nickname?(' - ' + user.nickname):""}]${type==1?'的密码为123456':''}?`,
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
              } else {
                util.showMessage(this, "操作失败", util.elMessageType.error);
              }
            };
            let errCb = err => {
              util.showMessage(this, "处理失败 " + err, util.elMessageType.error);
            };
            util.getJsonPost(type == 0 ? urls.DELETE_DATA : urls.RESET_PASSWORD, okCb, errCb, type == 1 ? {
              username: user.username
            } : {
              table: "user",
              where: {
                username: user.username
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
      AddCustomerDialog
    }
  }

</script>

<style scoped>


</style>
