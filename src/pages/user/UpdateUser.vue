<template>
    <transition name="dialog-fade">
        <el-dialog
                v-if="showDialog"
                :title="dialogTitle"
                class="dialog-component"
                :visible.sync="showDialog"
                width="500px"
                @close="closeDialog(0)"
        >
            <el-form
                    ref="formInfo"
                    :model="formInfo"
                    class="demo-form-inline"
                    label-width="80px"
            >
                <el-form-item label="用户名：" prop="account" required >
                    <el-input v-model="formInfo.account" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item label="姓名：" prop="user_name" required>
                    <el-input v-model="formInfo.user_name"></el-input>
                </el-form-item>
                <!--<el-form-item label="密码：" prop="password" required>
                    <el-input type="password" v-model="formInfo.password"></el-input>
                  </el-form-item>-->
                 <!--<el-form-item label="职位：" prop="role" required>
                    <el-input v-model="formInfo.role"></el-input>
                  </el-form-item>-->
              <el-form-item label="职位:" prop="role_id" >
                <el-select v-model="formInfo.role_id" filterable placeholder="请选择">
                  <el-option
                    v-for="item in selectKind"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
                <el-form-item style="text-align: right;">
                    <el-button type="primary" @click="submitForm('formInfo')"
                    >确定</el-button
                    >
                    <el-button @click="closeDialog(0)">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </transition>
</template>

<script>
    export default {
        name: "UpdateStock",
        props: {
            dialogTitle: {
                type: String,
                default: "修改员工信息",
            },
            itemInfo: {
                type: Object,
                default: function () {
                    return {};
                },
            },
            handelType: {
                type: Boolean
            },
            requestUrl: {
                type: String
            }
        },
        data() {
            return {
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
                    }*/
                ],
                showDialog: false,
                formInfo: JSON.parse(JSON.stringify(this.itemInfo)),
            };
        },
        methods: {
            // 保存操作
            submitForm(formName) {
                const that = this;
                const params = Object.assign(that.formInfo, {});

                that.$refs[formName].validate((valid) => {
                    if (valid) {
                        that.$http.post(that.requestUrl,{
                            id: params.id+"",
                            account: params.account,
                            user_name: params.user_name,
                            role: params.role_id,
                        }).then(res => {
                            if(res.errorCode == '200'){
                                that.$message({
                                    message: "操作成功！",
                                    type: "success",
                                });
                                that.closeDialog(1);
                            }else {
                                setTimeout(()=>{
                                    that.$message({
                                        message: res.errorMsg+"操作失败！",
                                        type: "error",
                                    });
                                },3000)
                                /*that.$router.push('/dashboard/error')*/
                            }
                        }).catch(err => {
                            setTimeout(()=>{
                                that.$message({
                                    message: "操作失败！",
                                    type: "error",
                                });
                            },1500)
                            that.$router.push('/dashboard/error')
                        })
                    } else {
                        return false;
                    }
                });
            },
            // 关闭弹框
            closeDialog(flag) {
                this.$refs["formInfo"].resetFields();
                this.showDialog = false;
                this.$emit("closeDialog", flag);
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

    .dialog-fade-enter-active {
        -webkit-animation: dialog-fade-in 0.3s;
        animation: dialog-fade-in 0.3s;
    }
    .dialog-fade-leave-active {
        -webkit-animation: dialog-fade-out 0.3s;
        animation: dialog-fade-out 0.3s;
    }
    @-webkit-keyframes dialog-fade-in {
        0% {
            -webkit-transform: translate3d(0, -20px, 0);
            transform: translate3d(0, -20px, 0);
            opacity: 0;
        }
        100% {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
            opacity: 1;
        }
    }
    @keyframes dialog-fade-in {
        0% {
            -webkit-transform: translate3d(0, -20px, 0);
            transform: translate3d(0, -20px, 0);
            opacity: 0;
        }
        100% {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
            opacity: 1;
        }
    }
    @-webkit-keyframes dialog-fade-out {
        0% {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
            opacity: 1;
        }
        100% {
            -webkit-transform: translate3d(0, -20px, 0);
            transform: translate3d(0, -20px, 0);
            opacity: 0;
        }
    }
    @keyframes dialog-fade-out {
        0% {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
            opacity: 1;
        }
        100% {
            -webkit-transform: translate3d(0, -20px, 0);
            transform: translate3d(0, -20px, 0);
            opacity: 0;
        }
    }
</style>
