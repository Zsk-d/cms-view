<template>
    <el-dialog title="修改密码" :visible.sync="show" width="420px" center
     :show-close="false" 
     :close-on-click-modal="false"
     :close-on-press-escape="false"
     >
    <el-form ref="form" label-position="left" :model="form" label-width="120px">
        <el-form-item label="原密码">
            <el-input v-model="form.oldPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
            <el-input v-model="form.newPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码确认">
            <el-input v-model="form.newPasswordConfirm" type="password" @keyup.enter="changePassword"></el-input>
        </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
            <el-button type="primary" @click="changePassword" :disabled="action.btnDisabled">修改</el-button>
            <el-button type="primary" @click="show = false">取消</el-button>
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
        show: false,
        form:{
            oldPassword:"",
            newPassword:"",
            newPasswordConfirm:"",
        },
        action:{
            btnDisabled:false
        }
      }
    },
    watch:{
        'show':function(){
            this.form = {
            oldPassword:"",
            newPassword:"",
            newPasswordConfirm:"",
        };
        }
    },
    methods:{
        changePassword(){
            let self = this;
            if(this.form.oldPassword.trim() != '' && this.form.newPassword.trim() != '' && this.form.newPasswordConfirm.trim() != ''){
                if(this.form.newPassword != this.form.newPasswordConfirm){
                    Util.showMessage(self,"两次密码输入不一致",Util.elMessageType.error);
                    return false;
                }
                self.action.btnDisabled = true;
                // 请求修改
                let okCb = res=>{
                    if(res.status == 200){
                        Util.showMessage(self,"修改成功,即将退出",Util.elMessageType.sec);
                        Util.logout();
                    }else{
                        Util.showMessage(self,res.msg,Util.elMessageType.error);
                    }
                    self.action.btnDisabled = false;
                };
                let errCb = err =>{
                    Util.showMessage(self,"修改失败 " + err,Util.elMessageType.error);
                    self.action.btnDisabled = false;
                }
                Util.method.changeSelfPassword(this.form.oldPassword,this.form.newPassword,this.username,okCb,errCb);
            }else{
                Util.showMessage(self,"输入不能为空",Util.elMessageType.error);
            }
        },
        open(username){
            this.username = username;
            this.show = true;
        }
    }
  }
</script>

<style>

</style>
