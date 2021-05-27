<template>
  <div style="margin-left: 20px">

    <div style="margin-top: 20px">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="车牌号">
          <el-input v-model="formInline.carCard" placeholder="车牌号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addItem">进入</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div>
      <el-form ref="form" :model="form" label-width="80px" :inline="true" style="margin-top: 20px">
        <el-form-item label="车牌号：" >
          <el-input v-model="selectCardCode"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%;"
    >
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        label="车牌号">
        <template slot-scope="scope">
          <span >{{ scope.row.carCard}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="本小区车辆">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.havePark"
            active-value="0"
            inactive-value="1"
            disabled>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="备注">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.payRemark}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="进入时间" style="width: 300px;"
      >
        <template slot-scope="scope" >
          <span >{{ (scope.row.startTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click.native.prevent="toPay(scope.row)">结算</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page=currentPage
        :page-size=pageSize
        layout="total, prev, pager, next, jumper"
        :total=total>
      </el-pagination>
    </div>
  </div>
</template>

<script>
    export default {
        name: "ParkingPay",
        data() {
            return {
                formInline: {
                    carCard: ''
                },
                dialogVisible: false,
                tableData: [], //数据

                //分页数据
                pageSize: 6,
                currentPage: 1,
                totalPage: 0,
                total: 0,

                //表单
                form: {
                    houseCode: '',
                    name: '',
                    date: '',
                    startTime: '',
                    endTime: ''
                },
                selectCardCode: '',

                showDialog: false, //更改组件的显示
                handelType: null,
                dialogTitle: '', //弹窗的title
                requestUrl: '',
                tableItem: { //用来更新 新增
                    /*id: "",
                    carCard: "",
                    pay: "",
                    endTime: "",
                    payRemark: ""*/
                },
            }
        },
        watch: {
            selectCardCode(){
                this.getList()
            },

        },
        methods: {
            pay(row,res) {
                this.$http
                    .post(
                        // 也可以设置为自己的主机名加端口号
                        "/order/alipay?outTradeNo=" +
                         row.payRemark+
                        "&subject=" +
                        row.carCard +
                        "&totalAmount=" +
                        res.totalFee +
                        "&description=" +
                        res.timeRange
                    )
                    .then((resp) => {
                        console.log(resp)
                        document.querySelector('body').innerHTML = resp;
                        const div = document.createElement('div') // 创建div
                        div.innerHTML = resp // 将返回的form 放入div
                        document.body.appendChild(div)
                        document.forms[0].submit()

                    });
            },
            handleCurrentChange(page) {
                this.currentPage = page //点击的时候把拿到的页码 赋值给组件
                this.getList()
            },
            //查找
            getList() {
                let that = this
                this.$http.post('/parking-log/search',
                    {
                        currentPage: that.currentPage + "",
                        pageSize: that.pageSize + "",
                        createTime: that.form.startTime,
                        updateTime: that.form.endTime,
                        carCode: that.selectCardCode,
                        finish: '0'
                    }).then(res => {
                    if (res.errorCode == 200) {
                        that.tableData = res.data
                        that.totalPage = res.totalPages
                        that.total = res.total
                    } else {
                        that.$message({
                            showClose: true,
                            message: res.errorMsg,
                            offset: 66,
                            type: "error"
                        });
                    }
                }).catch(err => {
                    that.$router.push('/dashboard/error')
                    console.log(err)
                    that.$message({
                        showClose: true,
                        message: err.errorMsg,
                        offset: 66,
                        type: "error"
                    });
                })
            },
            async handleDelete(index, row) {
                const confirmResult = await this.$confirm('此操作将永久删除该车停车信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                /*如果用户确认打印confirm,如果用户取消显示cancel*/
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除!')
                }
                // console.log('确认了删除')
                let that = this
                this.$http.post('/parking-log/delete', {
                    id: row.id,
                }).then(res => {
                    if (res.errorCode == 200) {
                        that.currentPage = 1
                        that.getList()
                    } else {
                        that.$message({
                            showClose: true,
                            message: res.errorMsg,
                            offset: 66,
                            type: "error"
                        });
                    }
                }).catch(err => {
                    that.$router.push('/dashboard/error')

                })
            },
            // 添加操作
            addItem() {
                if (!this.formInline.carCard) {
                    this.$message.warning('请输入车牌号');
                }else {
                    this.$http.post('/parking-log/add', {
                        carCard: this.formInline.carCard,
                        finish: '0'
                    }).then(res => {
                        if (res.errorCode == 200) {
                            this.$message.success(this.formInline.carCard+"已经进入！")


                        } else {
                            this.$message.error(this.formInline.carCard+"停车失败！")
                        }
                        this.getList()
                    }).catch(err => {
                        this.$message.error("停车失败！")
                        this.$router.push("/*")
                    })
                }

            },
            toPay(row) {
                this.$http.post('/parking-log/toPay', {
                    id: row.id,
                    carCard: row.carCard,
                    startTime: row.startTime,
                    havePark: row.havePark,
                }).then(res => {
                    if (res.errorCode == 200) {
                        if (row.havePark == "0"){
                            this.$message.success(row.carCard+"请通行！！")
                            this.getList()
                        }else {
                            setTimeout(()=>{
                                this.$message.success(row.carCard+"请缴费！！"+res.data.totalFee+"元！")
                            },3000)

                            this.pay(row,res.data)
                        }

                    } else {
                        this.$message.error(this.formInline.carCard+"结算失败！")
                    }
                }).catch(err => {
                    this.$message.error("结算失败！")
                    this.$router.push("/*")
                })
            },

        },
        created() {
            this.getList();
        }
    }

</script>

<style scoped>

</style>
