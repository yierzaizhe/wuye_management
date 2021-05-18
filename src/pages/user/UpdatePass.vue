<template>
  <div style="margin: 40px;width: 500px;text-align: center">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="用户名">
        <el-input v-model="form.account" ></el-input>
      </el-form-item>
      <el-form-item label="旧密码">
        <el-input v-model="form.oldPassword" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model="form.newPassword" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码">
        <el-input v-model="form.confirmPassword" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">修改密码</el-button>
        <el-button  @click="getBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

    export default {
        name: "UpdatePass",
        data() {
            return {
                form: {
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                    account: '',
                },

            }
        },
        methods: {
            getBack(){
                this.$router.push('/home')
            },
            logout(){
                let that = this;
                this.$http.get('/logout')
                    .catch(function(error) {
                        console.log("服务端错误改为本地强行注销：", error);
                    }).finally(function() {
                    // 本地存储中删除 token
                    window.localStorage.removeItem("Authorization");
                    console.log("服务器 token 和本地 cookie 注销成功");
                    that.$message({
                        showClose: true,
                        message: "注销成功！请重新登录",
                        offset: 66,
                        type: "success"
                    });
                    that.$router.push("/login");
                    });
            },
            onSubmit() {
                if (!this.form.account) {
                    this.$message.warning('请填写用户名');
                } else if (!this.form.oldPassword) {
                    this.$message.warning('请填写旧密码');
                }if (!this.form.newPassword ) {
                    this.$message.warning('请填写新密码');
                }else if (!this.form.confirmPassword ) {
                    this.$message.warning('再次请填写新密码');
                } else if (this.form.confirmPassword != this.form.newPassword) {
                    this.$message.warning('两次密码不一致');
                }else {
                    this.$http.post('/user/updatePass',{
                        account: this.form.account,
                        oldPassword: this.form.oldPassword,
                        newPassword: this.form.newPassword,
                    }).then(res => {
                        if (res.errorCode == 200) {
                            this.$message.success("密码修改成功，重新登陆");
                            this.logout()
                        }else{
                            this.$message.error(res.errorMsg);
                        }
                    }).catch(err => {
                        setTimeout(()=>{
                            this.$message({
                                message: "操作失败！",
                                type: "error",
                            });
                        },1500)
                        this.$router.push('*')
                    })
                }
            },

        },
        created() {
            this.form.account=this.$route.query.account
        }
    }
</script>

<style scoped>


</style>
