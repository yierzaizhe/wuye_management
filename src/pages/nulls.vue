<template>
  <div class="_404">
    <h2 class="m-0">抱歉，页面未找到，<span>{{countDown}}</span>s后自动跳转到
      <a href="javascript:;" @click="goHome">首页</a>
    </h2>
    <img src="../assets/img/404.gif" alt="页面未找到">
  </div>
</template>
<script>
    export default {
        name: "nulls",
        data() {
            return {
                countDown: 5
            }
        },
        methods: {
            goHome() {
                this.$router.push('/home')
            }
        },
        created() {
            setInterval(() => {
                this.countDown > 0 ? this.countDown-- : this.$router.push('/home')
            }, 1000)
        }
    }
</script>

<style scoped>
  body {
    background-color: #dceebc;
  }

  ._404 {
    width: 100%;
    text-align: center;
  }

  ._404 img {
    width: 60vw;
  }

  ._404 a {
    color: #010101;
  }

  ._404 a:hover {
    color: skyblue;
  }
</style>
<!--<template>
    <div class="null-box">
        <img class="null-img" src="../assets/img/404.gif" alt="">
    </div>
</template>
<style scoped>
.null-box{
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
.null-img{
    width: 55%;
}
</style>-->
