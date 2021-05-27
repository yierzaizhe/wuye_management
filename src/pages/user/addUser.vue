<template>
  <div style="margin: 40px;width: 500px;text-align: center">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.account" ></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="form.userName" ></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="职位:" prop="kindParam">
        <el-select v-model="form.kindParam" filterable placeholder="请选择">
          <el-option
            v-for="item in selectKind"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即注册</el-button>
        <el-button  @click="getBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

    export default {
        name: "addUser",
        data() {
            return {
                form: {
                    password: '',
                    userName: '',
                    account: '',
                },
                selectKind: [
                    /*{
                        value: '2',
                        label: '经理'
                    },{
                        value: '3',
                        label: '物业员工'
                    },{
                        value: '4',
                        label: '保安'
                    },*/
                ],
            }
        },
        methods: {
            getBack(){
                this.$router.push('/user')
            },
            onSubmit() {
                if (!this.form.account) {
                    this.$message.warning('请填写用户名');
                } else if (!this.form.userName ) {
                    this.$message.warning('请填写姓名');
                }if (!this.form.password ) {
                    this.$message.warning('请填写密码');
                }else if (!this.form.kindParam ) {
                    this.$message.warning('请选择角色');
                }else {
                    this.$http.post('/user/add',{
                        userName: this.form.userName,
                        password: this.form.password,
                        account: this.form.account,
                        role: this.form.kindParam,
                    }).then(res => {
                        if (res.errorCode == 200) {
                            this.$message.success("账号申请成功，请告知员工");
                            this.$router.push('/user')
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
            getRoleList(){
                this.$http.get('/user/getRole',{
                }).then(res => {
                    if (res.errorCode == 200) {
                        console.log(res)
                        this.selectKind=res.data
                    }else{
                        this.$message.error("res");
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
        created() {
            this.getRoleList()
        }
    }
</script>

<style scoped>


</style>
