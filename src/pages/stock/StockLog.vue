<template>
  <div style="margin-left: 20px">
   <!-- <div style="position:absolute;right:20px;bottom:20px;">

      <el-button icon="el-icon-plus" type="primary"  @click="addItem" circle></el-button>

    </div>-->
    <div>
      <el-form ref="form" :model="form" label-width="80px" :inline="true" style="margin-top: 20px">
        <el-form-item label="物品：" >
          <el-input v-model="selectGoods"></el-input>
        </el-form-item>
        <el-form-item label="操作人：" >
          <el-input v-model="selectOwnerName"></el-input>
        </el-form-item>
        <el-form-item label="出入库:">
          <el-select v-model="kindValue2" filterable placeholder="请选择">
            <el-option
              v-for="item in selectKind2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批:">
          <el-select v-model="kindValue" filterable placeholder="请选择">
            <el-option
              v-for="item in selectKind"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      height="400"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="描述:">
              <span>{{ props.row.logRemark }}</span>
            </el-form-item>
            <el-form-item label="申请时间:">
              <span>{{ props.row.createTime }}</span>
            </el-form-item>
            <el-form-item label="更新时间:">
              <span>{{ props.row.updateTime }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="物品">
        <template slot-scope="scope">
          <span >{{ scope.row.goods}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作人">
        <template slot-scope="scope">
          <span >{{ scope.row.username}}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="数量">
        <template slot-scope="scope">
          <span >{{ scope.row.total}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="费用">
        <template slot-scope="scope">
          <span >{{ scope.row.totalFee}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="审批">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isExamine"
            active-value="1"
            inactive-value="0"
            disabled>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click.native.prevent="handleEdit(scope.row)">审批</el-button>
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
    <UpdateParkingUse v-if="showDialog"
                      ref="updateParkingUse"
                      :requestUrl = 'requestUrl'
                      :dialog-title="dialogTitle"
                      :item-info="tableItem"
                      @closeDialog="closeDialog"></UpdateParkingUse>
  </div>
</template>

<script>
    export default {
        name: "StockLog",
        components:{

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
                selectGoods: '',
                selectOwnerName: '',
                kindValue: '',
                kindValue2: '',
                selectKind: [
                    {
                        value: '0',
                        label: '未审批'
                    },{
                        value: '1',
                        label: '审批'
                    },
                    {
                        value: null,
                        label: '全部'
                    }
                ],
                selectKind2: [
                    {
                        value: '出库',
                        label: '出库'
                    },{
                        value: '入库',
                        label: '入库'
                    },
                    {
                        value: null,
                        label: '全部'
                    }
                ],

                showDialog: false, //更改组件的显示
                handelType: null,
                dialogTitle: '', //弹窗的title
                requestUrl: '',
                tableItem: { //用来更新 新增
                    id: "",
                    parkingCode: "",
                    carCard: "",
                    ownerName: "",
                    ownerTel: "",
                    useType: "",
                    totalFee: "",
                    createTime: "",
                    updateTime: "",
                    startTime: "",
                    endTime: "",
                },
            }
        },
        watch: {
            selectGoods(){
                this.getList()
            },
            selectOwnerName(){
                this.getList()
            },
            kindValue(){
                this.getList()
            },
            kindValue2(){
                this.getList()
            }
        },
        methods: {
            typeFormat(row,column){
                if(row.useType == 0 ){
                    return '购买'
                }else if(row.useType == 1 ){
                    return '月租'
                }else if(row.useType == 2 ){
                    return '年租'
                }
            },
            handleCurrentChange(page){
                this.currentPage = page //点击的时候把拿到的页码 赋值给组件
                this.getList()
            },
            //查找
            getList(){
                let that = this
                this.$http.post('/stock-log/search',
                    {
                        currentPage: that.currentPage+"",
                        pageSize: that.pageSize+"",
                        createTime: that.form.startTime,
                        updateTime: that.form.endTime,
                        goods: that.selectGoods,
                        username: that.selectOwnerName,
                        isExamine: that.kindValue,
                        logRemark: that.kindValue2
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
                this.$http.post('/stock-log/delete',{
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

            },
            handleEdit(row){
                /*this.$http.get('/stock-log/updateStatus/1/'+row.id)
                    .then(res => {
                        if (res.errorCode == '200'){
                            this.$message.success("审批完成！！！");
                            this.getList()
                        }else {
                            this.$message.error("审批失败！！！");
                        }
                    }).catch(err => {
                        this.$router.push('*')
                })*/
                this.$http.post('/stock-log/updateStatus',{
                    id: row.id,
                    status: '1'
                }).then(res => {
                        if (res.errorCode == '200'){
                            this.$message.success("审批完成！！！");
                            this.getList()
                        }else {
                            this.$message.error(res.errorMsg);
                        }
                    }).catch(err => {
                        this.$router.push('*')
                })
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
  ::-webkit-scrollbar {
    width: 0;    height: 0;
  }
</style>
