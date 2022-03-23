<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>用户查询</span>
      </div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.params.username" :clearable="true" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
          <el-button type="primary" @click="addUser" icon="el-icon-plus">新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <SearchTable :option="tableOption" style="margin-top:10px;" ref="st"></SearchTable>
    <AddUserDialog ref="aud" :cb="addCb"></AddUserDialog>
    <UserInfoUpdateDialog ref="uiud" :cb="updateInfoCb"></UserInfoUpdateDialog>
  </div>
</template>

<script>
  import util from "@/util.js"
  import urls from "@/urls.js"
  import SearchTable from "@/components/SearchTable.vue";
  import AddUserDialog from "@/components/AddUserDialog.vue";
  import UserInfoUpdateDialog from "@/components/UserInfoUpdateDialog.vue";
  export default {
    data() {
      let self = this;
      return {
        dialogVisible: false,
        searchForm: {
          params: {
            table: "user"
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
              width: "80px"
            },
            {
              prop: "username",
              label: "登录名",
              align: "center",
              headerAlign: "center",
            },
            {
              prop: "nickname",
              label: "名称",
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
              headerAlign: "center",
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
              width: "340px",
              btns: [{
                  name: "信息完善",
                  size:"small",
                  func(index, tableData) {
                    self.updateUser(index, tableData)
                  }
                },
                {
                  name: "密码初始化",
                  size:"small",
                  func(index, tableData) {
                    self.resetPwdAndDel(index, tableData, 1);
                  }
                }, {
                  name: "删除",
                  type: "danger",
                  size:"small",
                  getShow(row){
                    return row.username != "cmsadmin";
                  },
                  func(index, tableData) {
                    self.resetPwdAndDel(index, tableData, 0)
                  }
                },
              ]
            },
          ],
        },
        addCb(form) {
          self.search();
          util.method.logAdd(`添加了管理员用户[${form.username}]`);
        },
        updateInfoCb(form){
          self.search();
          util.method.logEdit(`修改了管理员用户[${form.username}]`);
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
                if(type==0){
                  util.method.logDel(`删除了管理员用户[${user.username}]`);
                }else{
                  util.method.logEdit(`重置了管理员用户[${user.username}]的密码`);
                }
              } else {
                util.showMessage(this, "操作失败", util.elMessageType.error);
              }
            };
            let errCb = err => {
              util.showMessage(this, "处理失败 " + err, util.elMessageType.error);
            };
            util.getJsonPost(type == 0 ? urls.DELETE_DATA : urls.RESET_PASSWORD, okCb, errCb, type==1?{username:user.username}:{table:"user",where:{username:user.username}});
          })
          .catch(() => {
            /// 异常回调
          })
      },
      updateUser(index, pageData){
        this.$refs.uiud.open(util.deepCopy(pageData[index]));
      }
    },
    mounted() {
      this.search();
    },
    components: {
      SearchTable,
      UserInfoUpdateDialog,
      AddUserDialog
    }
  }

</script>

<style scoped>


</style>
