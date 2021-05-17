<template>
<div style="margin: 40px;width: 500px">
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="申请人">
      <el-input v-model="form.username" disabled></el-input>
    </el-form-item>
    <el-form-item label="物品名称">
      <el-input v-model="form.goods" disabled></el-input>
    </el-form-item>
    <el-form-item label="数   量">
      <el-input v-model="form.total" ></el-input>
    </el-form-item>
    <el-form-item label="总金额">
      <el-input v-model="form.totalFee" placeholder="入库须填写金额"></el-input>
    </el-form-item>

    <el-form-item label="描述">
      <el-input v-model="form.logRemark" ></el-input>
    </el-form-item>
    <el-form-item label="出 / 入">
      <el-radio-group v-model="form.resource">
        <el-radio label="出库" value="出库"></el-radio>
        <el-radio label="入库" value="入库"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button  @click="getBack">返回</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
    import jwtDecode from 'jwt-decode'
    export default {
        name: "UpdateStockLog",
        data() {
            return {
                form: {
                    sum: '',
                    username: '',
                    total: '',
                    goods: '',
                    goodsId: '',
                    totalFee: '',
                    logRemark: '',
                    resource: '',
                },

            }
        },
        methods: {
            getBack(){
                this.$router.push('/stock')
            },
            onSubmit() {
                if (!this.form.resource) {
                    this.$message.warning('请选择出入库');
                } else if (!this.form.total ) {
                    this.$message.warning('请填写数量');
                }else {
                    if (this.form.resource == "出库" ){
                        this.form.sum=Number(this.$route.query.total) - Number(this.form.total)
                    }else {
                        this.form.sum=Number(this.$route.query.total)+Number(this.form.total)
                    }
                    this.$http.post('/stock-log/add',{
                        goodsId:  this.$route.query.goodsId,
                        sum: this.form.sum,
                        goods: this.form.goods,
                        total: Number(this.form.total),
                        username: this.form.username,
                        totalFee: this.form.totalFee,
                        logRemark: this.form.resource+this.form.logRemark,

                    }).then(res => {
                        if (res.errorCode == 200) {
                            this.$message.success("申请成功，等待审批");
                            this.$router.push('/stock')
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
                        that.$router.push('*')
                    })
                }
            },
            async getUserInfo() {
                if (this.$store.state.Authorization == null) {
                    this.form.username =null
                } else {
                    this.form.username = jwtDecode(this.$store.state.Authorization).sub

                }
            }
        },
        created() {
            this.form.goods = this.$route.query.goods
            this.getUserInfo()
        }
    }
</script>

<style scoped>


</style>
