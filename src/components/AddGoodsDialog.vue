<template>
  <el-dialog :title="(addAction?'新增':'修改')+'商品'" top="10vh" :modal-append-to-body="false" :visible.sync="show" width="520px" center
    :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="form" label-position="left" :model="form" label-width="120px">
      <el-form-item label="货号">
        <el-input v-model="form.gid" :readonly="!addAction"></el-input>
      </el-form-item>
      <el-form-item label="商品名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="单价">
        <el-input v-model="form.charge" type="number" min="1"></el-input>
      </el-form-item>
      <el-form-item label="库存数量">
        <el-input v-model="form.count" type="number" min="0"></el-input>
      </el-form-item>
      <el-form-item label="类别">
        <el-input v-model="form.category"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio v-model="form.status" label="1" border>上架</el-radio>
        <el-radio v-model="form.status" label="0" border>下架</el-radio>
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
        addAction: true,
        show: false,
        form: {
          status: '1',
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
            gid: "",
            count: "",
            category: "",
            charge: "",
            remarks: "",
            status: '1'
          };
        }
      }
    },
    methods: {
      submitAdd() {
        let self = this;
        if (this.form.name.trim() != '' &&
          this.form.gid.trim() != '' &&
          this.form.count.trim() != '' &&
          this.form.category.trim() != '' &&
          this.form.charge.trim() != '' &&
          this.form.status.trim() != ''
        ) {
          if (!(this.form.count > -1)) {
            Util.showMessage(self, "库存应大于等于0", Util.elMessageType.error);
            return false;
          }
          if (!(this.form.charge > 0)) {
            Util.showMessage(self, "单价应大于1", Util.elMessageType.error);
            return false;
          }
          self.action.btnDisabled = true;
          // 请求新增
          let okCb = res => {
            if (res.status == 200) {
              Util.showMessage(self, "操作成功!", Util.elMessageType.sec);
              self.show = false;
              self.cb();
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
            Util.method.addData("goods", {
              key: "gid",
              name: "货号"
            }, this.form, okCb, errCb);
          } else {
            Util.method.updateData("goods", "gid", this.form, okCb, errCb);
          }

        } else {
          Util.showMessage(self, "输入不能为空", Util.elMessageType.error);
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
