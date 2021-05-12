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
                <el-form-item label="日期：" prop="createTime" required>
<!--                    <el-input v-model="formInfo.createTime"></el-input>-->
                    <el-date-picker
                            value-format="yyyy-MM-dd hh:mm:ss"
                            v-model="formInfo.createTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            default-time="12:00:00">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="名称：" prop="name" required>
                    <el-input v-model="formInfo.name"></el-input>
                </el-form-item>
                <el-form-item label="单元数：" prop="totalUnit" required>
                    <el-input v-model="formInfo.totalUnit"></el-input>
                </el-form-item>
                <el-form-item label="楼层：" prop="totalLevel" required>
                    <el-input v-model="formInfo.totalLevel"></el-input>
                </el-form-item>
                <el-form-item label="已住：" prop="existHouseholds" required>
                    <el-input v-model="formInfo.existHouseholds"></el-input>
                </el-form-item>
                <el-form-item label="总户数：" prop="totalHouseholds" required>
                    <el-input v-model="formInfo.totalHouseholds"></el-input>
                </el-form-item>
                <el-form-item label="描述：" prop="description" required>
                    <el-input v-model="formInfo.description"></el-input>
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
        name: "UpdateBuilding",
        props: {
            dialogTitle: {
                type: String,
                default: "添加人员",
            },
            itemInfo: {
                type: Object,
                default: function () {
                    return {};
                },
            },
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
                        that.$http.post('/building/update',{
                            id: params.id,
                            name: params.name,
                            totalUnit: params.totalUnit,
                            totalLevel: params.totalLevel,
                            existHouseholds: params.existHouseholds,
                            totalHouseholds: params.totalHouseholds,
                            description: params.description,
                            createTime: params.createTime,
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
