<template>
  <el-dialog title="信息完善" :modal-append-to-body="false" :visible.sync="show" width="520px" center :show-close="false"
    :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="form" label-position="left" :model="form" label-width="120px">
      <el-form-item label="登录名">
        <el-input v-model="form.username" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.mail"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.tel"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="btnOk" :disabled="action.btnDisabled">确定</el-button>
        <el-button type="primary" @click="show = false">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
  import Util from "@/util.js"
  export default {
    data() {
      return {
        show: false,
        form: {
          username: "",
          newPassword: "",
          newPasswordConfirm: "",
        },
        action: {
          btnDisabled: false
        }
      }
    },
    props: ["cb"],
    watch: {
      'show': function () {

      }
    },
    methods: {
      btnOk() {
        let self = this;
        self.action.btnDisabled = true;
        // 请求更新
        let okCb = res => {
          if (res.status == 200) {
            Util.showMessage(self, "信息完善成功!", Util.elMessageType.sec);
            self.show = false;
            self.cb();
          } else {
            Util.showMessage(self, res.msg, Util.elMessageType.error);
          }
          self.action.btnDisabled = false;
        };
        let errCb = err => {
          Util.showMessage(self, "信息完善失败 " + err, Util.elMessageType.error);
          self.action.btnDisabled = false;
        }
        Util.method.updateData("user", "username", this.form, okCb, errCb);
      },
      open(info) {
        this.form = info;
        this.show = true;
      }
    }
  }

</script>

<style>

</style>
