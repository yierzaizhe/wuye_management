<template>
  <div style="margin-top: 20px">

    <el-row>
      <el-col :span="12"><div id="myChart2" :style="{width: '30vw', height: '30vw'}"></div></el-col>
      <el-col :span="12"><div id="myChart3" :style="{width: '30vw', height: '30vw'}"></div></el-col>
    </el-row>

    <el-row>
      <el-col :span="24"> <div id="myChart1" :style="{width: '30vw', height: '40vh'}"></div></el-col>
    </el-row>
  </div>

</template>
<script>

    export default {
        name: 'home',
        data () {
            return {
                msg: '数据统计'
            }
        },
        mounted(){
            this.drawLine();
            this.drawLine2();
            this.drawLine3();
        },
        methods: {
            drawLine(){
                // 基于准备好的dom，初始化echarts实例
                let myChart1 = this.$echarts.init(document.getElementById('myChart1'))
                // 绘制图表

                myChart1.setOption({
                    title: {
                        text: "每栋楼居住人数",
                        x:'center'
                    },
                    xAxis: {
                        type: 'category',
                        data: []
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: [],
                        type: 'bar',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(180, 180, 180, 0.2)'
                        }
                    }]
                });
                this.$http.get('/count/buildPeople').then(res => {
                    myChart1.setOption({
                        xAxis: [{
                            data: res.data.building_name
                        }],
                        series: [{
                            data:res.data.count
                        }]
                    })
                }).catch(err =>{
                    this.$router.push("/*")
                })

                /*myChart1.showLoading({
                    text: '数据正在努力加载...',
                    textStyle: { fontSize : 30 , color: '#444' },
                    effectOption: {backgroundColor: 'rgba(0, 0, 0, 0)'}
                });
                myChart.hideLoading();*/


            },
            drawLine2(){
                // 基于准备好的dom，初始化echarts实例
                let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
                // 绘制图表
                myChart2.setOption({
                    title: {
                        text: '住房类型统计',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                    },
                    series: [
                        {
                            name: '居住类型',
                            type: 'pie',
                            radius: '50%',
                            data: [
                                {value: 1048, name: '搜索引擎'},
                                {value: 735, name: '直接访问'},
                                {value: 580, name: '邮件营销'},
                                {value: 484, name: '联盟广告'},
                                {value: 300, name: '视频广告'}
                            ],
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
                this.$http.get('/count/countLiveType').then(res => {
                    myChart2.setOption({
                        series: [{
                            data: res.data
                        }],
                    })
                }).catch(err =>{
                    this.$router.push("/*")
                })

            },
            drawLine3(){
                // 基于准备好的dom，初始化echarts实例
                let myChart3 = this.$echarts.init(document.getElementById('myChart3'))
                // 绘制图表
                myChart3.setOption({
                    title: {
                        text: '车位使用类型',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                    },
                    series: [
                        {
                            name: '使用类型',
                            type: 'pie',
                            radius: '50%',
                            data: [

                            ],
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
                this.$http.get('/count/countParkType').then(res => {
                    myChart3.setOption({
                        series: [{
                            data: res.data
                        }],
                    })
                }).catch(err =>{
                    this.$router.push("/*")
                })

            },
        }
    }
</script>
<style scoped>

</style>
