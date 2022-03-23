<template>
  <el-dialog :title="(addAction?'注册':'修改')+'会员'" top="10vh" :modal-append-to-body="false" :visible.sync="show" width="520px" center
    :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="form" label-position="left" :model="form" label-width="120px">
      <el-form-item label="会员编号">
        <el-input v-model="form.cid" :readonly="!addAction" maxlength="8" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="会员名">
        <el-input v-model="form.name" maxlength="8" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio v-model="form.sex" label="1" border>男</el-radio>
        <el-radio v-model="form.sex" label="0" border>女</el-radio>
      </el-form-item>
      <el-form-item label="住址">
        <el-input v-model="form.loc"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.mail"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.tel"  maxlength="11" show-word-limit ></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remarks"></el-input>
      </el-form-item>

    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitAdd" :disabled="action.btnDisabled">确定</el-button>
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
        table:"customer",
        addAction: true,
        show: false,
        form: {
          sex: '1',
        },
        action: {
          btnDisabled: false
        }
      }
    },
    props: ["cb"],
    watch: {
      'show': function (value) {
        if (!value) {
          this.form = {
            name: "",
            cid: "",
            loc: "",
            mail: "",
            tel: "",
            remarks: "",
            sex: '1'
          };
        }
      }
    },
    methods: {
      submitAdd() {
        let self = this;
        if (this.form.name.trim() != '' &&
          this.form.cid.trim() != ''
        ) {
          self.action.btnDisabled = true;
          // 请求新增
          let okCb = res => {
            if (res.status == 200) {
              Util.showMessage(self, "操作成功!", Util.elMessageType.sec);
              self.show = false;
              self.cb(Util.deepCopy(this.form),this.addAction);
            } else {
              Util.showMessage(self, res.msg, Util.elMessageType.error);
            }
            self.action.btnDisabled = false;
          };
          let errCb = err => {
            Util.showMessage(self, "操作失败 " + err, Util.elMessageType.error);
            self.action.btnDisabled = false;
          }
          if (this.addAction) {
            Util.method.addData(self.table, {
              key: "cid",
              name: "会员编号"
            }, this.form, okCb, errCb);
          } else {
            Util.method.updateData(self.table, "cid", this.form, okCb, errCb);
          }

        } else {
          Util.showMessage(self, "会员名和编号必填", Util.elMessageType.error);
        }
      },
      open(info) {
        if (info) {
          this.addAction = false;
          this.form = info;
        } else {
          this.addAction == true;
        }
        this.show = true;
      }
    }
  }

</script>

<style>

</style>
