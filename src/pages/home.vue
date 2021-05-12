<template>
  <div class="home-box">
    <div class="user-num-box">
      <div class="el-cols-title-box">
          <i class="el-icon-s-data" style="color:#909399;font-size:22px;margin-right:4px;"></i>
          <span class="el-cols-title">垃圾分类总量</span>
      </div>
      <div class="user-num-item">
        <div class="user-num-item-in">
          <div class="el-cols-item-name">干垃圾</div>
          <div class="el-cols-item-num-all">
            <countTo :startVal="0" :endVal="userTypetotalNum" :duration="1000"></countTo>
          </div>
        </div>
        <div class="user-num-item-in">
          <div class="el-cols-item-name">湿垃圾</div>
          <div class="el-cols-item-num-test">
            <countTo :startVal="0" :endVal="userTypetimeNum" :duration="1000"></countTo>
          </div>
        </div>
        <div class="user-num-item-in">
          <div class="el-cols-item-name">可回收物</div>
          <div class="el-cols-item-num-all">
            <countTo :startVal="0" :endVal="userTypetotalNum" :duration="1000"></countTo>
          </div>
        </div>
        <div class="user-num-item-in">
          <div class="el-cols-item-name">有害垃圾</div>
          <div class="el-cols-item-num-test">
            <countTo :startVal="0" :endVal="userTypetimeNum" :duration="1000"></countTo>
          </div>
        </div>
      </div>
    </div>
    <div class="user-num-box">
      <div class="el-cols-title-box">
        <i class="el-icon-s-data" style="color:#909399;font-size:22px;margin-right:4px;"></i>
        <span class="el-cols-title">用户数据</span>
      </div>
      <div class="user-num-item">
        <div class="user-num-item-in">
          <div class="el-cols-item-name">用户总数</div>
          <div class="el-cols-item-num-all">
            <countTo :startVal="0" :endVal="orderTypetotalNum" :duration="1000"></countTo>
          </div>
        </div>
        <div class="user-num-item-in">
          <div class="el-cols-item-name">答题总数</div>
          <div class="el-cols-item-num-test">
            <countTo :startVal="0" :endVal="orderTypetimeNum" :duration="1000"></countTo>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import countTo from "vue-count-to";
export default {
  components: { countTo },
  data() {
    return {
      user_type:'',
      user_first: '',
      user_second: '',
      user_date:  '1',
      userDateSelect: [{
        "label": '日',
        "value": '1',
      },{
        "label": '周',
        "value": '7',
      },{
        "label": '月',
        "value": '30',
      }],
      userSecondSelect: [],
      userTypeSelect: [{
        "label": '全部',
        "value": '',
      },{
        "label": '散户',
        "value": '0',
      },{
        "label": '正式用户',
        "value": '1',
      }],
      userFirstSelect: [],
      order_type: '',
      orderTypeSelect: [{
        "label": '全部',
        "value": '',
      },{
        "label": '散户',
        "value": '0',
      },{
        "label": '正式用户',
        "value": '1',
      }],
      order_first: '',
      orderFirstSelect: [],
      order_second: '',
      orderSecondSelect: [],
      order_date: '1',
      orderDateSelect: [{
        "label": '日',
        "value": '1',
      },{
        "label": '周',
        "value": '7',
      },{
        "label": '月',
        "value": '30',
      }],
      user_form: {

      },
      processData: [],
       processData_bottom: [
         {
           percentage: 4,
           color: "#5FB878",
           status: "用户",
           value: 496
         },
         {
           percentage: 6,
           color: "#FFB800",
           status: "需求",
           value: 616
         }
       ],
      userClick: 0,
      agreeNum: 0,
      applyNum: 0,
      tmpUserClick:0,
      statistics_userNum: 0,
      statistics_orderNum: 0,
      Black_userNum: 0,
      Black_orderNum: 0,
      userTypeRadio: '',
      userTypeStatus: '',
      userTypetimeNum: 0,
      userTypetotalNum: 0,
      orderTypeRadio: '',
      orderTypeStatus: '',
      orderTypetimeNum: 0,
      orderTypetotalNum: 0,
    };
  },
  created() {
    this.getFirstClass()
    // this.getType()
    this.getClickNum()
    this.statisticsAuditNum()
    this.statisticsBlackListNum()
    this.userType()
    this.orderNum()
  },
  watch: {
    order_second() {
      this.orderNum()
    },
    order_type() {
      this.orderNum()
    },
    order_date() {
      this.orderNum()
    },
    user_date() {
      this.userType()
    },
    user_second() {
      this.userType()
    },
    user_type() {
      this.userType()
    },
    user_first() {
      this.userType()
      this.getSecondClass(this.user_first)
    },
    order_first() {
      this.orderNum()
      this.getSecondClassOrder(this.order_first)
    },
  },
  methods: {
    orderNum() {
      let that = this
      this.$http.post('/server/statistics/orderNum',{
        "days": that.order_date,
        "firstType": that.order_first,
        "secondType": that.order_second,
        "userType": that.order_type
      }).then(res => {
        if (res.rspCode=='0000') {
          that.orderTypeRadio = res.rspData.ratio
          that.orderTypeStatus = res.rspData.status
          that.orderTypetimeNum = res.rspData.timeNum
          that.orderTypetotalNum = res.rspData.totalNum
        }
      })
    },
    statisticsBlackListNum() {
      let that = this
      this.$http.post('/server/statistics/statisticsBlackListNum',{

      }).then(res => {
        if (res.rspCode=='0000') {
          that.Black_userNum = res.rspData.userNum
          that.Black_orderNum = res.rspData.orderNum
        }
      })
    },
    statisticsAuditNum() {
      let that = this
      this.$http.post('/server/statistics/statisticsAuditNum',{

      }).then(res => {
        if (res.rspCode=='0000') {
          that.statistics_userNum = res.rspData.userNum
          that.statistics_orderNum = res.rspData.orderNum
        }
      })
    },
    getClickNum() {
      let that = this
      this.$http.post('/server/statistics/clickNum',{

    }).then(res => {
        if (res.rspCode=='0000') {
          that.userClick = res.rspData.userClick
          that.agreeNum = res.rspData.agreeNum
          that.applyNum = res.rspData.applyNum
          that.tmpUserClick = res.rspData.tmpUserClick
        }
      })
    },
    userType() {
      let that = this
      this.$http.post('/server/statistics/userNum',{
        "days": that.user_date,
        "firstType": that.user_first,
        "secondType": that.user_second,
        "userType": that.user_type
      }).then(res => {
        if (res.rspCode=='0000') {
          that.userTypeRadio = res.rspData.ratio
          that.userTypeStatus = res.rspData.status
          that.userTypetimeNum = res.rspData.timeNum
          that.userTypetotalNum = res.rspData.totalNum
        }
      })
    },
    getType() {
      let that = this
      this.$http.post('/server/view/classify/getType',{

      }).then(res => {
        if (res.rspCode=='0000') {
          let typeClassList = res.rspData
          let arr = new Array()
          let first = {}
          first.label='全部'
          first.value = ''
          arr.push(first)
          typeClassList.map(item => {
            let tempObj = {}
            tempObj.label = item.typeName
            tempObj.value = item.id
            arr.push(tempObj)
          })
          that.orderTypeSelect = arr
          that.userTypeSelect = arr
        }
      })
    },
    getFirstClass() {
      let that = this
      this.$http.post('/server/view/classify/getFirstClass',{

      }).then(res => {
        if (res.rspCode=='0000') {
          let firstClassList = res.rspData
          let arr = new Array()
          let first = {}
          first.label='全部'
          first.value = ''
          arr.push(first)
          firstClassList.map(item => {
            let tempObj = {}
            tempObj.label = item.identityName
            tempObj.value = item.id
            arr.push(tempObj)
          })
          that.userFirstSelect = arr
          that.orderFirstSelect = arr
        }
      })
    },
    getSecondClass(firstId) {
      let that = this
      this.$http.get('/server/view/classify/getSecondClass/' + firstId).then(res => {
        if (res.rspCode=='0000') {
          let secondClassList = res.rspData
          let arr = new Array()
          let first = {}
          first.label='全部'
          first.value = ''
          arr.push(first)
          secondClassList.map(item => {
            let tempObj = {}
            tempObj.label = item.typeName
            tempObj.value = item.id
            arr.push(tempObj)
          })
          that.userSecondSelect = arr
        }
      })
    },
    getSecondClassOrder(firstId) {
      let that = this
      this.$http.get('/server/view/classify/getSecondClass/' + firstId).then(res => {
        if (res.rspCode=='0000') {
          let secondClassList = res.rspData
          let arr = new Array()
          let first = {}
          first.label='全部'
          first.value = ''
          arr.push(first)
          secondClassList.map(item => {
            let tempObj = {}
            tempObj.label = item.typeName
            tempObj.value = item.id
            arr.push(tempObj)
          })
          that.orderSecondSelect = arr
        }
      })
    },
  }
};
</script>
<style scoped>
.home-box {
  width: 100%;
  /*height: 100%;*/
  padding: 20px;
  box-sizing: border-box;
}
.user-num-box {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding: 15px;
}
.user-num-item {
  padding: 15px;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
}
.user-num-item-in {
  width: 33%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.el-rows {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.el-cols-l {
  width: 35%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 15px;
  box-sizing: border-box;
}
.el-cols-r {
  width: 64%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  box-sizing: border-box;
}
.el-cols-title-box {
  display: flex;
  align-items: center;
}
.el-cols-title {
  font-size: 16px;
  color: #666;
}
.el-cols-item {
  display: flex;
  flex-wrap: wrap;
}
.el-cols-item-in {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.el-cols-item-name {
  font-size: 14px;
  color: #666;
  padding: 35px 0;
}
.el-cols-item-num {
  font-size: 32px;
  color: #e6a23c;
  font-style: italic;
}
.el-cols-item-num-all {
  font-size: 40px;
  color: #409eff;
  font-style: italic;
}
.el-cols-item-num-real {
  font-size: 40px;
  color: #67c23a;
  font-style: italic;
}
.el-cols-item-num-test {
  font-size: 40px;
  color: #909399;
  font-style: italic;
}
.credit-satatus-box {
  margin: 15px 0;
}
.credit-satatus-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.credit-satatus-progress {
  width: 75%;
  margin-right: 10px;
}
.credit-satatus-item-num {
  font-size: 15px;
  color: #909399;
  font-style: italic;
}

</style>
