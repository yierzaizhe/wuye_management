<template>
  <div style="margin-left: 20px">

    <div>
      <el-form ref="form" :model="form" label-width="80px" :inline="true" style="margin-top: 20px">
        <el-form-item label="编号：" >
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
        label="收费" style="width: 100px;">
        <template slot-scope="scope">
          <span >{{ scope.row.pay}}</span>
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
      <el-table-column
        label="出场时间"
      >
        <template slot-scope="scope">
          <span>{{ (scope.row.endTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否完成">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.finish"
            active-value="1"
            inactive-value="0"
            disabled>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!--<el-button
            size="mini"
            @click.native.prevent="handleEdit(scope.row)">编辑</el-button>-->
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
        name: "ParkingLog",
        data() {
            return {
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
                    name:'',
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
                    id: "",
                    code: "",
                    name: "",
                    createTime: "",
                },
            }
        },
        watch: {
            selectCardCode(){
                this.getList()
            },

        },
        methods: {

            handleCurrentChange(page){
                this.currentPage = page //点击的时候把拿到的页码 赋值给组件
                this.getList()
            },
            //查找
            getList(){
                let that = this
                this.$http.post('/parking-log/search',
                    {
                        currentPage: that.currentPage+"",
                        pageSize: that.pageSize+"",
                        createTime: that.form.startTime,
                        updateTime: that.form.endTime,
                        carCode: that.selectCardCode,
                    }).then( res => {
                    if(res.errorCode == 200){
                        that.tableData = res.data
                        that.totalPage = res.totalPages
                        that.total = res.total
                    }else {
                        that.$message({
                            showClose: true,
                            message: res.errorMsg,
                            offset: 66,
                            type: "error"
                        });
                    }
                }).catch( err => {
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
            async handleDelete(index,row){
                const confirmResult = await this.$confirm('此操作将永久删除该流水信息, 是否继续?', '提示', {
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
                this.$http.post('/parking-log/delete',{
                    id: row.id,
                }).then( res => {
                    if(res.errorCode == 200){
                        that.currentPage = 1
                        that.$message({
                            showClose: true,
                            message: "成功移除信息",
                            offset: 66,
                            type: "success"
                        });
                        that.getList()
                    }else {
                        that.$message({
                            showClose: true,
                            message: res.errorMsg,
                            offset: 66,
                            type: "error"
                        });
                    }
                }).catch( err => {
                    that.$router.push('/dashboard/error')

                })
            },
            // 添加操作
            addItem() {
                this.tableItem = {
                    id: "",
                    code: "",
                    name: "",
                    createTime: "",
                };
                this.dialogTitle = "添加信息";
                this.handelType = false;
                this.showDialog = true;
                this.requestUrl = '/parking/add';
                this.$nextTick(() => {
                    this.$refs["updateParking"].showDialog = true;
                });
            },
            handleEdit(row){
                this.showDialog = true
                this.tableItem = row;
                this.handelType = true;
                this.dialogTitle = "编辑";
                this.requestUrl = '/parking/update';
                this.$nextTick(() => {
                    this.$refs["updateParking"].showDialog = true;
                });
            },
            // 关闭操作
            closeDialog(flag) {
                if (flag) {
                    // 重新刷新表格内容
                    this.getList();
                }
                this.showDialog = false;
            },
        },
        created() {
            this.getList();
        }
    }
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
