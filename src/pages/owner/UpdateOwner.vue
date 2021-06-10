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
                    :rules="rules"
            >
                <el-form-item label="门牌号：" prop="houseCode" required >
                    <el-input v-model="formInfo.houseCode" placeholder="楼栋/单元/层户，例01010101"></el-input>
                </el-form-item>
                <el-form-item label="姓名：" prop="name" required>
                    <el-input v-model="formInfo.name"></el-input>
                </el-form-item>
                <el-form-item label="性别：" prop="sex" required>
                    <el-switch
                            v-model="formInfo.sex"
                            active-color="#409EFF"
                            inactive-color="#F56C6C"
                            active-text="男"
                            inactive-text="女">
                    </el-switch>
                </el-form-item>
                <el-form-item label="身份号：" prop="idCard" required>
                    <el-input v-model="formInfo.idCard"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" prop="telephone" required>
                    <el-input v-model="formInfo.telephone"></el-input>
                </el-form-item>
                <el-form-item label="是否户主" prop="isMain" required>
                    <el-switch
                            v-model="formInfo.isMain"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-form-item label="类型：" prop="type" required>
                    <el-switch
                            v-model="formInfo.type"
                            active-color="#ff4949"
                            inactive-color="#13ce66"
                            active-text="租用"
                            inactive-text="购买">
                    </el-switch>
                </el-form-item>
                <el-form-item label="职业：" prop="profession" required>
                    <el-input v-model="formInfo.profession"></el-input>
                </el-form-item>
                <el-form-item label="描述：" prop="remark" required>
                    <el-input v-model="formInfo.remark"></el-input>
                </el-form-item>
                <el-form-item label="入住时间" prop="createTime" required>
                    <el-date-picker
                            value-format="yyyy-MM-dd hh:mm:ss"
                            v-model="formInfo.createTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            default-time="12:00:00">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="生日" prop="birthday" required>
                    <el-date-picker
                            value-format="yyyy-MM-dd hh:mm:ss"
                            v-model="formInfo.birthday"
                            type="datetime"
                            placeholder="选择日期时间"
                            default-time="12:00:00">
                    </el-date-picker>
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
        name: "UpdateOwner",
        props: {
            dialogTitle: {
                type: String,
                default: "添加信息",
            },
            itemInfo: {
                type: Object,
                default: function () {
                    return {};
                },
            },
            handelType: {
                type: Boolean
            }
        },
        data() {
            return {
                showDialog: false,
                formInfo: JSON.parse(JSON.stringify(this.itemInfo)),
                rules:{
                    telephone: [
                        {
                            required:true,
                            message:'请输入正确的11位固定或手机号码',
                            trigger:'change'
                        },
                        {
                            pattern:/^((0\d{2,3}-\d{7,8})|(1[35784]\d{9}))$/,
                            message:'请输入合法手机号/电话号',
                            trigger:'blur'
                        }
                    ]
                    ,idCard: [
                        {
                            required:true,
                            message:'请输入正确的身份证号码',
                            trigger:'change'
                        },
                        {
                            pattern:/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                            message:'请输入正确的身份证号码',
                            trigger:'blur'
                        }
                    ]
                },
            };
        },
        methods: {
            // 保存操作
            submitForm(formName) {
                const that = this;
                const params = Object.assign(that.formInfo, {});

                that.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = '/owner/update';
                        if (!that.handelType){
                            url ='/owner/add';
                        }
                        // 走保存请求
                        that.$http.post(url,{
                            id: params.id,
                            houseCode: params.houseCode,
                            name: params.name,
                            sex: params.sex,
                            idCard: params.idCard,
                            telephone: params.telephone,
                            isMain: params.isMain,
                            type: params.type,
                            profession: params.profession,
                            remark: params.remark,
                            createTime: params.createTime,
                            updateTime: params.updateTime,
                            birthday: params.birthday,
                        }).then(res => {
                            if(res.errorCode == '200'){
                                that.$message({
                                    message: "操作成功！",
                                    type: "success",
                                });
                                that.closeDialog(1);
                            }else {
                                that.$message({
                                    message: res.errorMsg+"操作失败！",
                                    type: "error",
                                });
                                setTimeout(()=>{
                                    that.$router.go(0)
                                },2000)
                                /*setTimeout(()=>{
                                    that.$message({
                                        message: res.errorMsg+"操作失败！",
                                        type: "error",
                                    });
                                },3000)*/
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
        },
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
