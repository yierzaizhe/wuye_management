<template>
  <div>
    <h1>支付成功。。。。</h1>
    <h1>请出场    </h1>
    <h1>一路平安</h1>
    <el-row>
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
