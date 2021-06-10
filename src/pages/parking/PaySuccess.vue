<template>
  <div style="background-color: whitesmoke;height: 100%">
    <el-container style="margin-top: 30px">
      <el-header><h1 style="text-align: center">小区车位收费系统</h1></el-header>
      <el-main>
        <h1 style="text-align: center">缴费成功 请出场</h1>
        <h1 style="text-align: center">一路平安</h1>
      </el-main>
    </el-container>


    <el-row style="text-align: center">
      <el-button type="success" disabledb @click="toPay">返回</el-button>
    </el-row>
  </div>
</template>

<script>
    export default {
        name: "PaySuccess",
        methods: {
            toPay() {
              this.$router.push('/parkingPay')
            }
        }
    }
</script>

<style scoped>

</style>
