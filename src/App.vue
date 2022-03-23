<template>
  <div id="app">
    <el-container v-show="!needLogin" direction="vertical">
      <el-header id="header" style="text-align: right; padding:20px;z-index:10;">
        <label
          style="float:left;font-size:19px;letter-spacing: 3px;font-weight: bold;color: #000000a6;"><i class="el-icon-s-platform"></i> 店铺用户管理系统</label>
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px;cursor: pointer;"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="changePassword">修改密码</el-dropdown-item>
            <el-dropdown-item @click.native="logout"> 退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>{{userinfo.nickname?userinfo.nickname:userinfo.username}}</span>
      </el-header>
      <el-container style="z-index:5;">
        <el-aside width="200px;" style="box-shadow: 0px 0px 5px 0 rgb(203 25 25 / 20%);">
          <Menu></Menu>
        </el-aside>
        <el-main style="padding:6px">
          <div
            style="background-color:#FFFFFF;height: -webkit-fill-available;border: 1px solid #d5c3c347;border-radius: 6px;padding:5px;">
            <router-view />
          </div>
        </el-main>
      </el-container>
    </el-container>
    <LoginDialog ref="ld" :onLogOk="onLogOk"></LoginDialog>
    <ChangeSelfPasswordDialog ref="cspd"></ChangeSelfPasswordDialog>
  </div>
</template>

<script>
  import Menu from "./components/Menu.vue";
  import util from "./util.js";
  import LoginDialog from "./components/LoginDialog.vue";
  import ChangeSelfPasswordDialog from "./components/ChangeSelfPasswordDialog.vue";
  export default {
    name: 'App',
    data: () => {
      let self = this;
      return {
        dialogVisible: true,
        needLogin: true,
        userinfo: {}
      };
    },
    mounted() {
      let userinfo = util.getSession("userinfo");
      if (!userinfo) {
        // 登录
        this.$refs.ld.open();
      } else {
        // 保存
        this.userinfo = util.getObjSession("userinfo");
        this.needLogin = false;
      }
      this.$router.push('/home');
    },
    methods: {
      onLogOk(userinfo) {
        this.userinfo = userinfo;
        this.needLogin = false;
        util.setSession("userinfo", userinfo);
      },
      logout() {
        util.logout();
      },
      changePassword() {
        this.$refs.cspd.open(this.userinfo.username);
      }
    },
    components: {
      Menu,
      LoginDialog,
      ChangeSelfPasswordDialog
    }
  }

</script>

<style>
  #app {
    background-color: #fafafa;
  }

  html,
  body,
  #app,
  #header,
  .el-aside,
  .el-container {
    padding: 0px;
    margin: 0px;
    height: 100%;
  }

  #header {
    box-shadow: 0px 2px 5px 0 rgb(203 25 25 / 20%), 0 1px 5px 0 rgb(0 0 0 / 19%);
  }

  .el-menu {
    border-right: 0;
  }

</style>
