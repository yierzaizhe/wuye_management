<template>
  <div class="index">
    <div class="left">
      <navMenu :isfold="isfold" @getRouterData="routerData" />
    </div>
    <div class="right">
      <div class="header-box">
        <div class="header-utils">
          <i class="el-icon-s-unfold" v-if="isfold" @click="changeFold(false)"></i>
          <i class="el-icon-s-fold" v-else @click="changeFold(true)"></i>
          <div class="header-utils-r">
            <el-dropdown trigger="click"  @command="handleCommand">
              <span class="el-dropdown-link util">
                {{userInfo.userName}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu  slot="dropdown">
                <el-dropdown-item command="updatePass">修改密码</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div>
              <img class="avator" src="../assets/img/user.png" alt />
            </div>
          </div>
        </div>
        <div class="header-tag" ref='tag_box'>
          <el-tooltip class="item" effect="dark" :content="tag.name" placement="top"  v-for="(tag,index) in tags"
              :key="index">
            <el-tag
              class="header-tag-item"
              effect="plain"
              :closable="index==0?false:true"
              :type="tag.path == $route.path?'warning':'info'"
              @click="tagClick(tag.path)"
              @close="tagClose(index)"
            >
              <div class="tag-t" :style="{'width':tagWidth,}">
                {{tag.name}}
              </div>
            </el-tag>
          </el-tooltip>
        </div>
      </div>
      <div class="con">
        <div style="min-height:83vh"><router-view /></div>
      </div>

    </div>
  </div>
</template>

<script>
import navMenu from "../components/navMenu";
import jwtDecode from 'jwt-decode'
export default {
  name: "App",
  components: { navMenu },
  created() {
    if (localStorage.getItem("router_data")) {
      this.tags = JSON.parse(localStorage.getItem("router_data"));
    }
  },
  data() {
    return {
      isfold: false, //菜单是否折叠
      tags: [{ name: "数据概览", path: "/home" }], //tag列表
      tagWidth: 'auto',
      userInfo: {

      }
    };
  },
    created() {
        if (this.$store.state.Authorization == null) {
            this.userInfo =null
        } else {
            let map = jwtDecode(this.$store.state.Authorization)
            this.userInfo = JSON.parse(map.sub)
            console.log(JSON.parse(map.sub))
            /*console.log(this.userInfo)*/
        }
    },
  watch:{
    tags(){
        if(this.tags.length>10){
          const tag_box_width = this.$refs.tag_box.clientWidth
          console.log(tag_box_width);

          this.tagWidth = (tag_box_width/this.tags.length - 50) + 'px'
        }
    }
  },
  methods: {
    handleCommand(command){
        let that = this;
      if (command == 'logout') {
         this.$http.get('/logout')
             .catch(function(error) {
             console.log("服务端错误改为本地强行注销：", error);
         }).finally(function() {
             // 本地存储中删除 token
             window.localStorage.removeItem("Authorization");
             console.log("服务器 token 和本地 cookie 注销成功");
             that.$message({
                 showClose: true,
                 message: "注销成功！请重新登录",
                 offset: 66,
                 type: "success"
             });
             that.$router.push("/login");
         });


      }else if(command == 'updatePass'){
          this.$router.push({ name:'/updatePass', query: { account: this.userInfo.sub}})
      }
    },
    changeFold(val) {
      this.isfold = val;
    },
    //存储历史路由
    routerData(data) {
      let names = this.tags.map(item => {
        return item.name;
      });
      if (!names.includes(data.name)) {
        this.tags.push(data);

        localStorage.setItem("router_data", JSON.stringify(this.tags));
      }
    },
    // tag标签点击
    tagClick(path) {
      this.$router.push(path);
    },
    // tag标签关闭
    tagClose(index) {
      let data = JSON.parse(localStorage.getItem("router_data"));
      data.splice(
        data.findIndex((item, i) => i === index),
        1
      );
      this.$router.push(data[data.length - 1].path);
      this.tags = data;
      localStorage.setItem("router_data", JSON.stringify(data));
    }
  }
};
</script>
<style scoped>
.index {
  display: flex;
}
.left {
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}
.left::-webkit-scrollbar {
  display: none;
}
.right {
  flex-grow: 1;
  width: 80%;
}

.header-utils {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
  background: #fff;
}
.header-utils-r {
  display: flex;
  align-items: center;
}
.avator {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  margin-left: 16px;
}
.level-t {
  color: #000;
  font-size: 12px;
  margin-right: 16px;
}
.util{
  cursor: pointer;
}
.header-tag {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow-x: auto;
  display: flex;
}
.header-tag-item {
  margin-right: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.tag-t{
  max-width: 80px;
  min-width: 20px;
  height: 16px;
  line-height: 16px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.con {
  width: 100%;
  background: #fff;
  height: calc(100vh - 102px);
  overflow: auto;
}

.el-icon-s-unfold,
.el-icon-s-fold {
  font-size: 22px;
  color: #909399;
  cursor: pointer;
}
</style>
