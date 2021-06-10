<template>
  <div class="navMenu">
    <el-menu
      :default-active="menuIndex"
      class="el-menu-vertical"
      background-color="#222"
      text-color="#ccc"
      :collapse="isfold"
      :collapse-transition="true"
      :router="true"
      active-text-color="#E6A23C"
      :unique-opened="true"
    >
      <div class="navMenu-name">{{isfold?'SYS':'物业管理'}}</div>

      <fragment v-for="(item,index) in navigationList" :key="index" class="nav-item-box">
        <el-menu-item
          :index="item.index"
          @click="saveRouter({name:item.name,path:item.path})"
          v-if="item.child.length == 0"
        >
          <i :class="item.icon"></i>
          <span slot="title">{{item.name}}</span>
        </el-menu-item>
        <el-submenu :index="item.index" v-if="item.child.length > 0">
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{item.name}}</span>
          </template>
          <el-menu-item
            :index="itm.path"
            @click="saveRouter({name:itm.name,path:itm.path})"
            v-for="(itm,idx) in item.child"
            :key="idx"
          >{{itm.name}}</el-menu-item>
        </el-submenu>
      </fragment>
    </el-menu>
  </div>
</template>

<script>
    export default {
        name: "navMenu",
        data() {
            return {
                menuIndex: "/home",

                navigationList: [
                    {
                        name: "数据概览",
                        index: "/home",
                        path: "/home",
                        icon: "el-icon-s-data",
                        child: []
                    },
                    {
                        name: "房产信息",
                        icon: "el-icon-menu",
                        index: "1",
                        child: [
                            {
                                name: "楼栋详情",
                                index: "/building",
                                path: "/building",
                                child: []
                            },
                            {
                                name: "房屋信息",
                                index: "/houseProperty",
                                path: "/houseProperty",
                                child: []
                            },
                            {
                                name: "居住详情",
                                index: "/houseLive",
                                path: "/houseLive",
                                child: []
                            },
                        ]
                    },
                    {
                        name: "客户信息",
                        index: "/owner",
                        path: "/owner",
                        icon: "el-icon-s-custom",
                        child: []
                    },
                    {
                        name: "车辆管理",
                        index: '2',
                        icon: "el-icon-top",
                        child: [
                            {
                                name: "车位管理",
                                index: "/parking",
                                path: "/parking",
                                child: []
                            },
                            {
                                name: "车位使用",
                                index: "/parkingUse",
                                path: "/parkingUse",
                                child: []
                            },
                            {
                                name: "收费流水",
                                index: "/parkingLog",
                                path: "/parkingLog",
                                child: []
                            },
                        ]
                    },
                    {
                        name: "停车收费",
                        index: "/parkingPay",
                        path: "/parkingPay",
                        icon: "el-icon-truck",
                        child: []
                    },
                    {
                        name: "采购库存",
                        index: "3",
                        icon: "el-icon-goods",
                        child: [
                            {
                                name: "库存",
                                index: "/stock",
                                path: "/stock",
                                icon: "el-icon-menu",
                                child: []
                            },
                            {
                                name: "采购记录",
                                index: "/stockLog",
                                path: "/stockLog",
                                icon: "el-icon-goods",
                                child: []
                            },
                        ]
                    },
                    {
                        name: "员工管理",
                        index: "4",
                        icon: "el-icon-s-custom",
                        child: [
                            {
                                name: "新增员工",
                                index: "/userAdd",
                                path: "/userAdd",
                                icon: "el-icon-s-custom",
                                child: [
                                ]
                            }, {
                                name: "员工管理",
                                index: "/user",
                                path: "/user",
                                icon: "el-icon-s-custom",
                                child: [
                                ]
                            },
                        ]
                    },
                ]
            };
        },
        created() {
            this.menuIndex = this.$route.name;
        },
        watch: {
            $route: {
                handler(val, oldVal) {
                    this.menuIndex = val.name;
                },
                // 深度观察监听
                deep: true
            }
        },
        props: ["isfold"], //isfold 菜单折叠状态
        methods: {
            saveRouter(data) {
                this.$emit("getRouterData", data);
            }
        }
    };
</script>

<style scoped>

  .el-submenu .el-menu-item {
    min-width: 0;
  }
  .el-menu-vertical:not(.el-menu--collapse) {
    width: 200px;

  }

  .el-menu-vertical {
    min-height: 100vh;
    background: #222;
  }
  .navMenu-name {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    color: #5e6d82;
    background: #222;
    text-align: center;
    box-sizing: border-box;
  }

</style>
