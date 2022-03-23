<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>日志查询</span>
      </div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="管理员账号">
          <el-input v-model="searchForm.params.username" :clearable="true" placeholder="管理员账号" style="width:150px;">
          </el-input>
        </el-form-item>
        <el-form-item label="管理员名">
          <el-input v-model="searchForm.params.nickname" :clearable="true" placeholder="管理员名" style="width:150px;">
          </el-input>
        </el-form-item>
        <el-form-item label="操作">
          <!-- <el-input v-model="searchForm.params.action" :clearable="true" placeholder="操作"></el-input> -->
          <el-select v-model="searchForm.params.action" placeholder="请选择">
            <el-option v-for="item in [{
          value: '',
          label: '全部'
        },{
          value: '新增',
          label: '新增'
        }, {
          value: '编辑',
          label: '编辑'
        }, {
          value: '删除',
          label: '删除'
        }]" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <SearchTable :option="tableOption" style="margin-top:10px;" ref="st"></SearchTable>
  </div>
</template>

<script>
  import util from "@/util.js"
  import urls from "@/urls.js"
  import SearchTable from "@/components/SearchTable.vue";
  export default {
    data() {
      let self = this;
      return {
        dialogVisible: false,
        searchForm: {
          params: {
            table: "logs"
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
              prop: "username",
              label: "管理员账号",
              align: "center",
              width: "150px",
              headerAlign: "center",
            },
            {
              prop: "nickname",
              label: "管理员名",
              width: "120px",
              align: "center",
              headerAlign: "center",
            },
            {
              prop: "action",
              label: "操作类型",
              align: "center",
              headerAlign: "center",
              width: "120px"
            },
            {
              prop: "msg",
              label: "信息",
              align: "left",
              headerAlign: "center",
            },
            {
              prop: "createTime",
              label: "操作时间",
              align: "center",
              headerAlign: "center",
              width: "175px",
            },
            {
              prop: "username",
              label: "操作",
              align: "center",
              headerAlign: "center",
              hasBtn: true,
              width: "160px",
              btns: [{
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
      }
    },
    methods: {
      search() {
        this.$refs.st.search(this.searchForm.params);
      },
      // type 0 del, 1 reset
      resetPwdAndDel(index, pageData, type) {
        let self = this;
        let row = pageData[index];
        this.$confirm(
            `确定删除?`,
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
            util.getJsonPost(urls.DELETE_DATA, okCb, errCb, {
              table: "logs",
              where: {
                createTime: row.createTime,
                username: row.username,
                action: row.action
              }
            });
          })
          .catch(() => {
            // 异常回调
          })
      }
    },
    mounted() {
      this.search();
    },
    components: {
      SearchTable
    }
  }

</script>

<style scoped>


</style>
