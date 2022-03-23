<template>
  <el-dialog title="店铺商品管理系统 - 登录" :visible.sync="visible" width="500px" center :show-close="false"
    :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="form" label-position="left" :model="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password" @keyup.enter="login"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="login" :disabled="action.btnDisabled">登 录</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
  import Util from "@/util.js"
  import Urls from "@/urls.js"
  export default {
    data() {
      return {
        visible: false,
        form: {
          username: "",
          password: ""
        },
        action: {
          btnDisabled: false
        }
      }
    },
    props: ["onLogOk"],
    methods: {
      open() {
        this.visible = true;
      },
      login() {
        let self = this;
        self.action.btnDisabled = true;
        // 请求登录
        let okCb = res => {
          if (res.status == 200) {
            Util.showMessage(self, "登陆成功", Util.elMessageType.sec);
            self.closeThis(res.data);
          } else {
            Util.showMessage(self, "账号或密码不正确", Util.elMessageType.error);
          }
          self.action.btnDisabled = false;
        };
        let errCb = err => {
          Util.showMessage(self, "登录失败", Util.elMessageType.error);
          self.action.btnDisabled = false;
          console.log(err);
        }
        Util.getJsonPost(Urls.LOGIN, okCb,
          errCb, {
            username: this.form.username,
            password: this.form.password
          });

      },
      closeThis(userInfo) {
        this.visible = false;
        // 调用回调
        this.onLogOk(userInfo);
      }
    }
  }

</script>

<style>

</style>
