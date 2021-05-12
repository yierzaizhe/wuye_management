<template>
    <transition name="dialog-fade">
        <el-dialog
                v-if="showDialog"
                :title="dialogTitle"
                class="dialog-component"
                :visible="showDialog"
                width="500px"
                @close="closeDialog(0)"
                :destroy-on-close="true"
                ref="formInfo"
        >
            <el-form
                    ref="formInfo"
                    :model="formInfo"
                    class="demo-form-inline"
                    label-width="80px"
            >
                <el-form-item label="门牌号：" prop="houseCode" required>
                    <el-input v-model="formInfo.houseCode"></el-input>
                </el-form-item>
                <el-form-item label="居住类型" prop="kind" required>
                    <el-switch
                            v-model="formInfo.kind"
                            active-color="#ff4949"
                            inactive-color="#13ce66"
                            active-text="租用"
                            inactive-text="购买"
                            >
                    </el-switch>
                </el-form-item>

                <el-form-item label="总费用：" prop="houseFee" required>
                    <el-input v-model="formInfo.houseFee"></el-input>
                </el-form-item>
                <el-form-item label="描述：" prop="kindParam" required>
                    <el-input v-model="formInfo.kindParam"></el-input>
                </el-form-item>

                <el-form-item label="入住时间" prop="startTime" required>
                    <el-date-picker
                            value-format="yyyy-MM-dd hh:mm:ss"
                            v-model="formInfo.startTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            default-time="12:00:00">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="endTime" required>
                    <el-date-picker
                            value-format="yyyy-MM-dd hh:mm:ss"
                            v-model="formInfo.endTime"
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
        name: "UpdateHouseLive",
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
            },
            requestUrl: {
                type: String
            }
        },
        data() {
            return {
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

                        // 走保存请求
                        that.$http.post(that.requestUrl,{
                            id: params.id,
                            houseCode: params.houseCode,
                            kind: params.kind,
                            houseFee: params.houseFee,
                            kindParam: params.kindParam,
                            startTime: params.startTime,
                            endTime: params.endTime,
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
