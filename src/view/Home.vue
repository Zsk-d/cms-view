<template>
  <div>
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>总 览</span>
        </div>
        <el-row style="text-align:center;">
          <el-col :span="parseInt(24/statusBar.length)" v-for="item in statusBar" :key="item.name">
            <h2 v-loading="item.count==-1">{{ item.count!=-1?item.tmp.replace("{}",item.count):"-" }}</h2>
            <div>
              <label style="color:#666;font-size:small;">{{item.name}}</label>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </el-row><br>
    <el-row>
      <el-card class="box-card" :style="{'text-align':'center'}">
        <el-row :gutter="10" :style="{'height':historyCardHeight+'px'}">
          <el-col :span="8">
            <h3>近期注册会员</h3>
            <SearchTable ref="tu" :option="table.user"></SearchTable>
          </el-col>
          <el-col :span="8">
            <h3>近期销售记录</h3>
            <SearchTable ref="tp" :option="table.ph"></SearchTable>
          </el-col>
          <el-col :span="8">
            <h3>近期登记商品</h3>
            <SearchTable ref="tg" :option="table.goods"></SearchTable>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
  </div>
</template>

<script>
  import SearchTable from "@/components/SearchTable.vue";
  import util from "@/util.js"
  import urls from "@/urls.js"
  export default {
    name: 'home',
    data() {
      //
      return {
        table: {
          user: {
            url: urls.SEARCH_DATA,
            maxHeight: window.innerHeight - 410,
            hideP: true,
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
                headerAlign: "center",
              }, {
                prop: "name",
                label: "会员名",
                align: "center",
                headerAlign: "center",
              },
              {
                prop: "tel",
                label: "手机号",
                align: "center",
                headerAlign: "center",
              }
            ]
          },
          ph: {
            url: urls.SEARCH_DATA,
            hideP: true,
            maxHeight: window.innerHeight - 410,
            cols: [{
                type: "index",
                label: "序号",
                align: "center",
                headerAlign: "center",
                width: "60px"
              },
              {
                prop: "gname",
                label: "商品名",
                align: "center",
                headerAlign: "center",
              },
              {
                prop: "cname",
                label: "会员名",
                align: "center",
                width: "100px",
                headerAlign: "center",
              },
              {
                prop: "total",
                label: "总价/元",
                align: "center",
                headerAlign: "center",
              }
            ]
          },
          goods: {
            url: urls.SEARCH_DATA,
            hideP: true,
            maxHeight: window.innerHeight - 410,
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
                prop: "count",
                label: "库存",
                align: "center",
                headerAlign: "center",
                width: "80px",
              }
            ]
          }
        },
        historyCardHeight: window.innerHeight - 340,
        statusBar: [{
          name: "商品",
          tmp: "共 {} 个",
          count: -1,
          table: "goods"
        }, {
          name: "注册会员",
          tmp: "共 {} 位",
          count: -1,
          table: "customer"
        }, {
          name: "管理员用户",
          tmp: "共 {} 位",
          count: -1,
          table: "user"
        }, {
          name: "销售记录",
          tmp: "共 {} 条",
          count: -1,
          table: "ph"
        }, ]
      }
    },
    mounted() {
      this.statusBar.forEach(item => {
        util.method.getDataCount(item.table, res => {
          item.count = res.data;
        })
      });
      this.$refs.tu.search({
        table: "customer"
      });
      this.$refs.tp.search({
        table: "ph"
      });
      this.$refs.tg.search({
        table: "goods"
      });
    },
    components: {
      SearchTable
    }
  }

</script>

<style scoped>
  .status-panel {
    padding: 12px;
  }

</style>
