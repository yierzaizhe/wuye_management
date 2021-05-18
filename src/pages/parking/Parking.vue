<template>
  <div style="margin-left: 20px">
    <div style="position:absolute;right:20px;bottom:20px;">

      <el-button icon="el-icon-plus" type="primary"  @click="addItem" circle></el-button>

    </div>
    <div>
      <el-form ref="form" :model="form" label-width="80px" :inline="true" style="margin-top: 20px">
        <el-form-item label="编号：" >
          <el-input v-model="selectParkingCode"></el-input>
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
        label="车位编码">
        <template slot-scope="scope">
          <span >{{ scope.row.code}}</span>
        </template>
      </el-table-column>
      <
      <el-table-column
        label="车位名称">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column
        label="是否使用"
        width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isUse"

            disabled>
          </el-switch>
        </template>
      </el-table-column>-->
      <el-table-column
        label="创建时间"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ (scope.row.createTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ (scope.row.updateTime)}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click.native.prevent="handleEdit(scope.row)">编辑</el-button>
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
    <UpdateParking v-if="showDialog"
                     ref="updateParking"
                     :dialog-title="dialogTitle"
                     :item-info="tableItem"
                     :requestUrl="requestUrl"
                     @closeDialog="closeDialog"></UpdateParking>
  </div>
</template>

<script>
    import UpdateParking from "./UpdateParking";
    export default {
        name: "Parking",
        components: {
          UpdateParking
        },
        data() {
            return {
                dialogVisible: false,
                tableData: [], //数据
                timeRange: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)], //时间范围
                input: '',
                multipleSelection: [], //选择框

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
                selectParkingCode: '',

                showDialog: false, //更改组件的显示
                handelType: null,
                dialogTitle: '', //弹窗的title
                requestUrl: '',
                tableItem: { //用来更新 新增
                    id: "",
                    code: "",
                    name: "",
                    createTime: "",
                    isUse: ""
                },
            }
        },
        watch: {
            selectParkingCode(){
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
                this.$http.post('/parking/search',
                    {
                        currentPage: that.currentPage+"",
                        pageSize: that.pageSize+"",
                        createTime: that.form.startTime,
                        updateTime: that.form.endTime,
                        code: that.selectParkingCode,
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
                const confirmResult = await this.$confirm('此操作将永久删除该楼信息, 是否继续?', '提示', {
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
                this.$http.post('/parking/delete',{
                    id: row.id,
                }).then( res => {
                    if(res.errorCode == 200){
                        that.currentPage = 1
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
