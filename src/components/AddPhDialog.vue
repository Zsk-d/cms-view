<template>
  <el-dialog :title="(addAction?'新建':'修改')+'销售记录'" top="10vh" :modal-append-to-body="false" :visible.sync="show"
    width="520px" center :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="form" label-position="left" :model="form" label-width="120px">
      <el-form-item label="商品编号">
        <el-autocomplete v-model="form.gid" @blur="inputBlur('gid','gname','goods','name')"
          :fetch-suggestions="gidQuerySearch" placeholder="商品编号" :trigger-on-focus="false"
          @select="handleSelect('gid','gname','goods','name')" :readonly="!addAction">
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="商品名">
        <el-input v-model="form.gname" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="会员编号">
        <el-autocomplete v-model="form.cid" @blur="inputBlur('cid','cname','customer','name')"
          :fetch-suggestions="cidQuerySearch" placeholder="会员编号" :trigger-on-focus="false"
          @select="handleSelect('cid','cname','customer','name')" :readonly="!addAction">
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="会员名">
        <el-input v-model="form.cname" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="数量">
        <el-input v-model="form.count" type="number" min="1" @blur="getTotal"></el-input>
      </el-form-item>
      <el-form-item label="总价/元">
        <el-input v-model="form.total" :readonly="true"></el-input>
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
        table: "ph",
        addAction: true,
        show: false,
        form: {
          gid: "",
          gname: "",
          cid: "",
          cname: "",
          count: "",
          total: "",
          remarks: ""
        },
        gid:null,
        lastCount:null,
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
            gid: "",
            gname: "",
            cid: "",
            cname: "",
            count: "",
            total: "",
            remarks: ""
          };
        }
        this.gid = null;
        this.lastCount = null;
      },
    },
    methods: {
      inputBlur(id, updateId, table, queryKey) {
        if (!this.form[id]) {
          this.form[updateId] = '';
        } else {
          this.reHandleSelect(id, updateId, table, queryKey);
        }
      },
      getTotal() {
        let self = this;
        if (this.form.gid.trim() && this.form.count > 0) {
          Util.method.getData("goods", {
            gid: this.form.gid.trim()
          }, false, (res) => {
            if (res.status == 200 && res.data) {
              let buyCount = parseInt(self.form.count);
              let goodsCount = parseInt(res.data[0].count);
              let charge = parseInt(res.data[0].charge);
              if (goodsCount < buyCount) {
                self.$set(self.form, 'count', goodsCount);
                buyCount = goodsCount;
              }
              self.$set(self.form, 'total', buyCount * charge);
              self.gid = this.form.gid.trim();
              self.lastCount = goodsCount - buyCount;
            }
          });
        }
      },
      handleSelect(id, updateId, table, queryKey) {
        if (!queryKey) {
          return false;
        }
        let self = this;
        this.querySearch(table, id, queryKey, this.form[id], (res) => {
          if (res.length > 0) {
            // self.form[updateId] = res[0].value;
            self.$set(self.form, updateId, res[0].value);
          } else {
            self.$set(self.form, updateId, '');
          }
        });
      },
      reHandleSelect(id, updateId, table, queryKey) {
        if (!queryKey) {
          return false;
        }
        let self = this;
        this.reQuerySearch(table, id, queryKey, this.form[id], (res) => {
          if (res.length > 0) {
            // self.form[updateId] = res[0].value;
            self.$set(self.form, updateId, res[0].value);
          } else {
            self.$set(self.form, updateId, '');
          }
        });
      },
      gidQuerySearch(queryString, cb) {
        this.querySearch("goods", 'gid', null, queryString, cb);
      },
      cidQuerySearch(queryString, cb) {
        this.querySearch("customer", 'cid', null, queryString, cb);
      },
      querySearch(table, key, want, queryString, cb) {
        let where = {};
        where[key] = queryString;
        Util.method.getData(table, where, true, (res) => {
          let data = [];
          if (res.status == 200 && res.data) {
            res.data.forEach(item => {
              data.push({
                value: item[want ? want : key]
              });
            });
          }
          cb(data);
        });
      },
      reQuerySearch(table, key, want, queryString, cb) {
        let where = {};
        where[key] = queryString;
        Util.method.getData(table, where, false, (res) => {
          let data = [];
          if (res.status == 200 && res.data) {
            res.data.forEach(item => {
              data.push({
                value: item[want ? want : key]
              });
            });
          }
          cb(data);
        });
      },
      submitAdd() {
        let self = this;
        if (
          this.form.gid.trim() != '' &&
          this.form.gname.trim() != '' &&
          this.form.cid.trim() != '' &&
          this.form.cname.trim() != '' &&
          (typeof (this.form.count) != 'number' && this.form.count.trim() != '' || this.form.count > 0)
        ) {
          self.action.btnDisabled = true;
          // 请求新增
          let okCb = res => {
            if (res.status == 200) {
              Util.showMessage(self, "操作成功!", Util.elMessageType.sec);
              Util.method.updateData("goods","gid",{'gid':this.gid,'count':this.lastCount});
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
            Util.method.addData(self.table, null, this.form, okCb, errCb);
          } else {
            Util.method.updateData(self.table, "cid", this.form, okCb, errCb);
          }
        } else {
          Util.showMessage(self, "除备注外其他必填", Util.elMessageType.error);
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
