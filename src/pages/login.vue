<template>
  <div id="login" >
    <!-- color: String类型。默认'#dedede'。粒子颜色。
    particleOpacity: Number类型。默认0.7。粒子透明度。
    particlesNumber: Number类型。默认80。粒子数量。
    shapeType: String类型。默认'circle'。可用的粒子外观类型有："circle","edge","triangle", "polygon","star"。
    particleSize: Number类型。默认80。单个粒子大小。
    linesColor: String类型。默认'#dedede'。线条颜色。
    linesWidth: Number类型。默认1。线条宽度。
    lineLinked: 布尔类型。默认true。连接线是否可用。
    lineOpacity: Number类型。默认0.4。线条透明度。
    linesDistance: Number类型。默认150。线条距离。
    moveSpeed: Number类型。默认3。粒子运动速度。
    hoverEffect: 布尔类型。默认true。是否有hover特效。
    hoverMode: String类型。默认true。可用的hover模式有: "grab", "repulse", "bubble"。
    clickEffect: 布尔类型。默认true。是否有click特效。
    clickMode: String类型。默认true。可用的click模式有: "push", "remove", "repulse", "bubble"。-->
    <vue-particles style="background: lightslategrey"
      color="#fff"
      :particleOpacity="0.7"
      :particlesNumber="100"
      shapeType="circle"
      :particleSize="4"
      linesColor="#fff"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="4"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
      class="particles"
    ></vue-particles>
    <div class="con-box">
      <div class="con-title-box">
        <p class="con-title-h1">加强物业管理服务</p>
        <p class="con-title-h2">提高物业管理品质!</p>
      </div>
      <div class="login-box">
        <div class="login-title">
          <div class="login-title-l">密码登录</div>
        </div>
        <div class="login-form-box">
          <el-form :model="loginData">
            <el-form-item>
              <el-input v-model="loginData.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="loginData.password" type="password" placeholder="密码" @keyup.enter.native="login"></el-input>
            </el-form-item>
            <el-button type="warning" block class="login-btn" @click="login">登录</el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginData: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    login() {
      let that = this
      if (!this.loginData.username) {
        this.$message.warning('请输入账号');
      } else if (!this.loginData.password) {
        this.$message.warning('请输入密码');
      } else {
          let postform = {
              username: this.loginData.username,
              password: this.loginData.password
          };
        // 登录
           this.$http.loginPost('/login',
               postform
           ).then(res => {
             if(res.errorCode == 200) {
                 this.$store.commit(
                     "changeLogin",
                     JSON.stringify(res.jwtToken)
                 );
               this.$router.push("/home");
             }else {
               this.$message.error(res.errorMsg);
             }
           })
      }
    }
  }
};
</script>
<style>
#login {
  position: relative;
  min-width: 1300px;
}
.con-box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 66%;
  height: 500px;
  display: flex;
  justify-content: space-between;
  /* background: #fff; */
}
.login-box {
  width: 350px;
  height: 260px;
  background: #fff;
  margin-top: 60px;
}
.con-title-box {
  flex-grow: 1;
}
.con-title-h1 {
  font-size: 34px;
  margin-top: 80px;
  margin-bottom: 30px;
  color: #fff;
}
.con-title-h2 {
  font-size: 36px;
  color: #fff;
  margin-left: 100px;
}
.login-title {
  padding: 18px 20px;
  box-sizing: border-box;
}
.login-title-l {
  font-size: 18px;
  /*font-weight: 400px;*/
}
.login-form-box {
  padding: 0 20px 20px;
}
#login .el-input__inner,
#login .el-button {
  border-radius: 0 !important;
}
.login-btn {
  width: 100%;
}
.particles {
  width: 100%;
  height: 100vh;
  /* background:rgba(57, 61, 73); */
  background: #222;
}
</style>
