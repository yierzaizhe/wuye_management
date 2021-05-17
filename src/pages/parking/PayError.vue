<template>
  <div>
    <h1>支付失败。。。。</h1>
    <h1>请人工核算</h1>
    <el-row>
      <el-button type="success" disabledb @click="toPay">返回</el-button>
    </el-row>
  </div>
</template>

<script>
    export default {
        name: "PayError",
        methods: {
            toPay() {
              this.$router.push('/parkingPay')
            }
        }
    }
</script>

<style scoped>

</style>
