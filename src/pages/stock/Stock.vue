<template>
  <div style="margin-left: 20px">
    <div style="position:absolute;right:20px;bottom:20px;">

      <el-button icon="el-icon-plus" type="primary"  @click="addItem" circle></el-button>

    </div>
    <div>
      <el-form ref="form" :model="form" label-width="80px" :inline="true" style="margin-top: 20px">
        <el-form-item label="物品：" >
          <el-input v-model="selectGoods"></el-input>
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
        label="物品名称" width="150">
        <template slot-scope="scope">
          <span >{{ scope.row.goods}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="描述">
        <template slot-scope="scope">
          <span >{{ scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="数量" width="100">
        <template slot-scope="scope">
          <span >{{ scope.row.total}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
      >
        <template slot-scope="scope">
          <span >{{ (scope.row.createTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
      >
        <template slot-scope="scope">
          <span >{{ (scope.row.updateTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" style="width: 200vh">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click.native.prevent="handleEdit(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            @click.native.prevent="stockLog(scope.row)">出入库</el-button>
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
    <UpdateStock v-if="showDialog"
                   ref="updateStock"
                   :dialog-title="dialogTitle"
                   :item-info="tableItem"
                   :requestUrl="requestUrl"
                   @closeDialog="closeDialog"></UpdateStock>

  </div>
</template>

<script>
  import UpdateStock from "./UpdateStock";
  import UpdateStockLog from "./UpdateStockLog";
    export default {
        name: "Stock",
        components: {
            UpdateStock,
            UpdateStockLog
        },
        data() {
            return {
                tableData: [], //数据

                //分页数据
                pageSize: 6,
                currentPage: 1,
                totalPage: 0,
                total: 0,

                //表单
                form: {
                    houseCode: '',
                    goods:'',
                    startTime: '',
                    endTime: ''
                },
                selectGoods: '',

                showDialog: false, //更改组件的显示

                handelType: null,

                dialogTitle: '', //弹窗的title

                requestUrl: '',
                tableItem: { //用来更新 新增
                    id: "",
                    goods: "",
                    remark: "",
                    total: "",
                },

            }
        },
        watch: {
            selectGoods(){
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
                this.$http.post('/stock/search',
                    {
                        currentPage: that.currentPage+"",
                        pageSize: that.pageSize+"",
                        createTime: that.form.startTime,
                        updateTime: that.form.endTime,
                        goods: that.selectGoods,
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
                let that = this
                this.$http.post('/stock/delete',{
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
                    goods: "",
                    remark: "",
                    total: "",
                };
                this.dialogTitle = "添加信息";
                this.handelType = false;
                this.showDialog = true;
                this.requestUrl = '/stock/add';
                this.$nextTick(() => {
                    this.$refs["updateStock"].showDialog = true;
                });
            },
            handleEdit(row){
                this.showDialog = true
                this.tableItem = row;
                this.handelType = true;
                this.dialogTitle = "编辑";
                this.requestUrl = '/stock/update';
                this.$nextTick(() => {
                    this.$refs["updateStock"].showDialog = true;
                });
            },
            stockLog(row){
                this.$router.push({ name:'/updateStock', query: { goods: row.goods ,goodsId: row.id ,total: row.total}})
            },
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
