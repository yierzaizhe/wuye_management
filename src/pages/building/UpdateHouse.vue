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
                <el-form-item label="楼栋：" prop="buildingName" required>
                    <el-input v-model="formInfo.buildingName"></el-input>
                </el-form-item>
                <el-form-item label="单元：" prop="unit" required>
                    <el-input v-model="formInfo.unit"></el-input>
                </el-form-item>
                <el-form-item label="楼层：" prop="floor" required>
                    <el-input v-model="formInfo.floor"></el-input>
                </el-form-item>
                <el-form-item label="门牌号：" prop="houseCode" required>
                    <el-input v-model="formInfo.houseCode"></el-input>
                </el-form-item>
                <el-form-item label="是否入住" prop="isLive" required>
                    <el-switch
                            v-model="formInfo.isLive"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-form-item label="面积：" prop="area" required>
                    <el-input v-model="formInfo.area"></el-input>
                </el-form-item>
                <el-form-item label="描述：" prop="area" required>
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
        name: "UpdateHouse",
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
            };
        },
        methods: {
            // 保存操作
            submitForm(formName) {
                const that = this;
                const params = Object.assign(that.formInfo, {});
                that.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = '/house/update';
                        if (!that.handelType){
                            url ='/house/add';
                        }
                        // 走保存请求
                        that.$http.post(url,{
                            id: params.id,
                            buildingId: params.buildingId,
                            buildingName: params.buildingName,
                            unit: params.unit,
                            floor: params.floor,
                            houseCode: params.houseCode,
                            isLive: params.isLive,
                            area: params.area,
                            description: params.description,
                            /*ownerId: params.ownerId,
                            ownerName: params.ownerName,
                            ownerTel: params.ownerTel,*/
                           /* kind: params.kind,
                            startTime: params.startTime,
                            endTime: params.endTime,*/
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
