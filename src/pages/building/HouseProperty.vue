<template>
    <div style="margin-left: 20px">
      <div style="position:absolute;right:20px;bottom:20px;">

        <el-button icon="el-icon-plus" type="primary"  @click="addItem" circle></el-button>

      </div>
      <div>
        <el-form ref="form" :model="form" label-width="80px" :inline="true" style="margin-top: 20px;height: 50px">
          <el-form-item label="楼号：" >
            <el-input v-model="selectBuildCode"></el-input>
          </el-form-item>
          <el-form-item label="单元：" >
            <el-input v-model="selectUnitCode"></el-input>
          </el-form-item>
          <el-form-item label="门牌号：" >
            <el-input v-model="selectHouseCode"></el-input>
          </el-form-item>
        </el-form>
      </div>
        <el-table
                :data="tableData"
                style="width: 100%"
                height="400">

            <el-table-column
                    label="楼号">
                <template slot-scope="scope">
                    <span >{{ scope.row.buildingName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="单元">
                <template slot-scope="scope">
                    <span >{{ scope.row.unit}} 单元</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="层数">
                <template slot-scope="scope">
                    <span >{{ scope.row.floor}}层</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="门牌号">
                <template slot-scope="scope">
                    <span >{{ scope.row.houseCode}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="是否居住"
                    width="100">
                <template slot-scope="scope">
                    <el-switch
                            v-model="scope.row.isLive"
                            disabled>
                    </el-switch>
                </template>
            </el-table-column>
          <el-table-column
            label="面积"
            >
            <template slot-scope="scope">
              <span >{{ scope.row.area}}</span>
            </template>
          </el-table-column>
            <el-table-column
                    label="描述"
            width="350">
                <template slot-scope="scope">
                    <span >{{ scope.row.description}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
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
        <UpdateHouse v-if="showDialog"
                        ref="updateHouse"
                        :dialog-title="dialogTitle"
                        :item-info="tableItem"
                        :handel-type = 'handelType'
                        @closeDialog="closeDialog"></UpdateHouse>

    </div>
</template>

<script>
    import UpdateHouse from "./UpdateHouse";
    export default {
        name: "HouseProperty",
        components: {
            UpdateHouse,
        },
        data() {
            return {
                buildList: [],
                dialogVisible: false,
                tableData: [], //数据

                //分页数据
                pageSize: 6,
                currentPage: 1,
                totalPage: 0,
                total: 0,

                //表单
                form: {
                    buildingName:'',
                    kind: '',
                    startTime: '',
                    endTime: '',
                    houseCode: '',
                    ownerName: '',
                    unit: '',
                },
                handelType: null, //操作的类型 true更新 false新增
                showDialog: false, //更改组件的显示
                dialogTitle: '', //弹窗的title
                tableItem: { //用来更新 新增
                    id: "",
                    buildingId: "",
                    buildingName: "",
                    unit: "",
                    floor: "",
                    houseCode: "",
                    isLive: "",
                    area: "",
                },
                selectHouseCode: '',
                selectBuildCode: '',
                selectUnitCode: ''

            };
        },
        watch: {
            selectHouseCode(){
                this.getList()
            },
            selectBuildCode(){
                this.getList()
            },
            selectUnitCode(){
                this.getList()
            }

        },
        methods: {
            handleCurrentChange(page){
                this.currentPage = page //点击的时候把拿到的页码 赋值给组件
                this.getList()
            },
            //查找
            getList(){
                let that = this
                this.$http.post('/house/search',
                    {
                        currentPage: that.currentPage+"",
                        pageSize: that.pageSize+"",
                        buildingName: that.selectBuildCode,
                        houseCode: that.selectHouseCode,
                        unit: that.selectUnitCode,
                    }).then( res => {
                    if(res.errorCode == 200){
                        that.tableData = res.data
                        that.totalPage = res.totalPages
                        that.total = res.total
                        if(res.data.length <=0){
                            that.$message({
                                showClose: true,
                                message: '查询结果为空，请重试！',
                                offset: 66,
                                type: "error"
                            });

                        }
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
                const confirmResult = await this.$confirm('此操作将永久删除该房信息, 是否继续?', '提示', {
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
                this.$http.post('/house/delete',{
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
                    name: "",
                    totalUnit: "",
                    totalLevel: "",
                    existHouseholds: "",
                    totalHouseholds: "",
                    description: "",
                    createTime: "",
                };
                this.dialogTitle = "添加信息";
                this.showDialog = true;
                this.handelType = false;
                this.$nextTick(() => {
                    this.$refs["updateHouse"].showDialog = true;
                });
            },
            handleEdit(row){
                this.showDialog = true
                this.tableItem = row;
                this.dialogTitle = "编辑";
                this.handelType = true;
                this.$nextTick(() => {
                    this.$refs["updateHouse"].showDialog = true;
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
