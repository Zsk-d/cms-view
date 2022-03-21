<template>
  <div>
    <el-card>
      <div class="clearfix">
        <span>商品分类统计</span>
      </div>
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
            table: "goods"
          }
        },
        tableOption: {
          url: urls.GET_GROUP,
          reqEx:{
            groupParams:{_id:"$category",priceTotal: {"$sum": "$charge"},countTotal: {"$sum": 1}}
          },
          maxHeight: window.innerHeight - 230,
          cols: [{
              type: "index",
              label: "序号",
              align: "center",
              headerAlign: "center",
              width: "80px"
            },
            {
              prop: "_id",
              label: "分类名",
              align: "center",
              headerAlign: "center",
            },
            {
              prop: "countTotal",
              label: "商品种类数量",
              align: "center",
              headerAlign: "center",
            }
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
