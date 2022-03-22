<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>数据统计</span>
      </div>
      <el-row>
        <el-col :span="13">
          <div id="goodsCategory"></div>
        </el-col>
        <el-col :span="10" :offset="1">
          <div id="customerCr"></div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import util from "@/util.js"
  import urls from "@/urls.js"
  export default {
    data() {
      let self = this;
      return {
        innerHeight1: 0,
        innerWidth1: 0,
        // 商品分类
        goodsCategory: {

        },
        // 客户消费排行
        customerCr: {

        }
      }
    },
    methods: {
      initGoodsCategory() {
        let req = {
          "params": {
            "table": "goods"
          },
          "offset": 0,
          "pageSize": 999999,
          "groupParams": {
            "_id": "$category",
            "priceTotal": {
              "$sum": "$charge"
            },
            "countTotal": {
              "$sum": 1
            }
          }
        };

        // 基于准备好的dom，初始化echarts实例
        let goodsCategory = this.$echarts.init(document.getElementById('goodsCategory'))
        let option = {
          title: {
            text: '商品种类',
            subtext: '占比',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10
          },
          series: [{
            name: '商品种类数量',
            type: 'pie',
            radius: '40%',
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        };
        util.getJsonPost(urls.GET_GROUP, res => {
          if (res.status == 200) {
            let data = [];
            res.data.tableData.forEach(item => {
              data.push({
                name: item._id,
                value: item.countTotal
              });
            });
            option.series[0].data = data;
            goodsCategory.setOption(option);
          } else {

          }
        }, err => {}, req);

      },
      initCustomerCr() {
        let req = {
          "params": {
            "table": "ph"
          },
          "offset": 0,
          "pageSize": 999999,
          "groupParams": {
            "_id": "$cname",
            "priceTotal": {
              "$sum": "$total"
            }
          }
        };
        let customerCr = this.$echarts.init(document.getElementById('customerCr'))
        let option = {
          xAxis: {
            max: 'dataMax'
          },
          yAxis: {
            type: 'category',
            inverse: true,
            animationDuration: 300,
            animationDurationUpdate: 300,
            max: 4 // only the largest 3 bars will be displayed
          },
          series: [{
            realtimeSort: true,
            name: '会员消费排行',
            type: 'bar',
            data: [],
            label: {
              show: true,
              position: 'right',
              valueAnimation: true
            }
          }],
          legend: {
            show: true
          },
          animationDuration: 0,
          animationDurationUpdate: 3000,
          animationEasing: 'linear',
          animationEasingUpdate: 'linear'
        };
        util.getJsonPost(urls.GET_GROUP, res => {
          if (res.status == 200) {
            let idData = [];
            let data = [];
            res.data.tableData.forEach(item => {
              idData.push(item._id);
              data.push(item.priceTotal);
            });
            option.yAxis.data = idData;
            option.series[0].data = data;
            customerCr.setOption(option);
          } else {

          }
        }, err => {}, req);
      }
    },
    mounted() {
      let category = document.getElementById("goodsCategory");
      category.style.width = (window.innerWidth - 200) / 2 + 'px';
      category.style.height = (window.innerHeight - 200) + 'px';

      let customerCr = document.getElementById("customerCr");
      customerCr.style.width = (window.innerWidth - 500) / 2 + 'px';
      customerCr.style.height = (window.innerHeight - 200) + 'px';

      this.initGoodsCategory();
      this.initCustomerCr();
    },
    components: {}
  }

</script>

<style scoped>


</style>
