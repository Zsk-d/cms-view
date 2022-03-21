<template>
  <div style="background-color:#FFFFFF;height:100%;">
    <el-menu :router="true" default-active="home" class="menu" @open="handleOpen" @close="handleClose">
      <el-menu-item v-for="item in menu" :key="item.index" :index="item.index">
        <i :class="item.icon"></i>
        <span slot="title">{{item.name}}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        menu: [{
            index: "home",
            name: "首页",
            icon: "el-icon-s-home"
          },
          {
            index: "customer",
            name: "会员管理",
            icon: "el-icon-s-custom"
          },
          {
            index: "goods",
            name: "商品管理",
            icon: "el-icon-s-goods"
          },
          {
            index: "ph",
            name: "销售记录",
            icon: "el-icon-s-order"
          },
          {
            index: "user",
            name: "用户管理",
            icon: "el-icon-user-solid"
          },
          {
            index: "log",
            name: "操作日志",
            icon: "el-icon-info"
          },{
            index: "test",
            name: "测试工具",
            icon: "el-icon-s-tools"
          },
        ]
      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }

</script>
<style scoped>
  .menu {
    /* margin-top:5px; */
    width: 200px;
  }

</style>
