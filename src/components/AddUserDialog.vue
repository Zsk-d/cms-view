<template>
    <el-dialog title="新增用户" :modal-append-to-body="false" :visible.sync="show" width="420px" center
     :show-close="false" 
     :close-on-click-modal="false"
     :close-on-press-escape="false"
     >
    <el-form ref="form" label-position="left" :model="form" label-width="120px">
        <el-form-item label="登录名">
            <el-input v-model="form.username" ></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input v-model="form.newPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="密码确认">
            <el-input v-model="form.newPasswordConfirm" type="password" @keyup.enter="changePassword"></el-input>
        </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
            <el-button type="primary" @click="changePassword" :disabled="action.btnDisabled">确定</el-button>
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
        form:{
            username:"",
            newPassword:"",
            newPasswordConfirm:"",
        },
        action:{
            btnDisabled:false
        }
      }
    },
    props:["cb"],
    watch:{
        'show':function(){
            this.form = {
            username:"",
            newPassword:"",
            newPasswordConfirm:"",
        };
        }
    },
    methods:{
        changePassword(){
            let self = this;
            if(this.form.username.trim() != '' && this.form.newPassword.trim() != '' && this.form.newPasswordConfirm.trim() != ''){
                if(this.form.newPassword != this.form.newPasswordConfirm){
                    Util.showMessage(self,"两次密码输入不一致",Util.elMessageType.error);
                    return false;
                }
                self.action.btnDisabled = true;
                // 请求新增
                let okCb = res=>{
                    if(res.status == 200){
                        Util.showMessage(self,"用户增加成功!",Util.elMessageType.sec);
                        self.show = false;
                        self.cb();
                    }else{
                        Util.showMessage(self,res.msg,Util.elMessageType.error);
                    }
                    self.action.btnDisabled = false;
                };
                let errCb = err =>{
                    Util.showMessage(self,"新增用户失败 " + err,Util.elMessageType.error);
                    self.action.btnDisabled = false;
                }
                Util.method.addUser(this.form.username,this.form.newPassword,okCb,errCb);
            }else{
                Util.showMessage(self,"输入不能为空",Util.elMessageType.error);
            }
        },
        open(){
            this.show = true;
        }
    }
  }
</script>

<style>

</style>
