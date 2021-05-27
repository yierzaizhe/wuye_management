<template>
    <div style="margin-left: 20px">
        <div style="position:absolute;right:20px;bottom:20px;">
                <el-button icon="el-icon-plus" type="primary"  @click="addItem" circle></el-button>
        </div>
      <div>
        <el-form ref="form" :model="form" label-width="80px" :inline="true" style="margin-top: 20px">
          <el-form-item label="楼号：" >
            <el-input v-model="selectBuildingName"></el-input>
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
                    label="完工日期"
                    width="200">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ (scope.row.createTime)}}</span>

                </template>
            </el-table-column>
            <el-table-column
                    label="楼号"
                    width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="单元数"
                    width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.totalUnit}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="层数"
                    width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.totalLevel}}</span>
                </template>
            </el-table-column>
            <!--<el-table-column
                    label="居住情况"
                    width="180">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.existHouseholds}}/{{ scope.row.totalHouseholds}}</span>
                </template>
            </el-table-column>-->
          <el-table-column
            label="总户数"
            width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.totalHouseholds}}户</span>
            </template>
          </el-table-column>
            <el-table-column
                    label="描述"
                    width="180">
                <template slot-scope="scope">
                    <!--<span style="margin-left: 10px">{{ scope.row.description}}</span>-->
                    <!--<el-button type="text" @click="dialogVisible = true">点击查看详情</el-button>
                    <el-dialog
                            title="提示"
                            :visible.sync="dialogVisible"
                            width="30%"
                            :before-close="handleClose">
                        <span>{{ scope.row.description}}</span>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                        </span>
                    </el-dialog>-->

                  <el-popover
                    placement="top-start"
                    title="详情"
                    width="200"
                    trigger="hover"
                    >
                    <span style="margin-left: 10px">{{ scope.row.description}}</span>
                    <el-button slot="reference">查看</el-button>
                  </el-popover>
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
        <UpdateBuilding v-if="showDialog"
                        ref="updateBuilding"
                        :dialog-title="dialogTitle"
                        :item-info="tableItem"
                        :requestUrl="requestUrl"
                        @closeDialog="closeDialog"></UpdateBuilding>
    </div>
</template>

<script>
    import UpdateBuilding from "./UpdateBuilding";
    export default {
        name: "Building",
        components: {
          UpdateBuilding
        },
        data() {
            return {
                requestUrl: '',
                selectBuildingName: '',
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
                    name:'',
                    date: '',
                    startTime: '',
                    endTime: ''
                },
                showDialog: false, //更改组件的显示
                dialogTitle: '', //弹窗的title
                tableItem: { //用来更新 新增
                    id: "",
                    name: "",
                    totalUnit: "",
                    totalLevel: "",
                    existHouseholds: "",
                    totalHouseholds: "",
                    description: "",
                    createTime: "",
                },
            }
        },
        watch: {
            selectBuildingName(){
                this.getList()
            }
        },
        methods: {
            /**焦点失去事件 */
            handleEvent (row) {},
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            handleCurrentChange(page){
                this.currentPage = page //点击的时候把拿到的页码 赋值给组件
                this.getList()
            },
            //查找
            getList(){
                let that = this
                this.$http.post('/building/search',
                    {
                        currentPage: that.currentPage+"",
                        pageSize: that.pageSize+"",
                        startTime: that.form.startTime,
                        endTime: that.form.endTime,
                        name: that.selectBuildingName
                    }).then( res => {
                    if(res.errorCode == '200'){
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
                this.$http.post('/building/delete',{
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
                    //console.log(err)
                    /*if(err.errorCode == '2001'){
                        that.$message({
                            showClose: true,
                            message: err.errorMsg,
                            offset: 66,
                            type: "error"
                        });
                    }else {

                    }*/
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
                this.requestUrl = '/building/add';
                this.$nextTick(() => {
                    this.$refs["updateBuilding"].showDialog = true;
                });
            },
            handleEdit(row){
                this.showDialog = true
                this.tableItem = row;
                this.dialogTitle = "编辑";
                this.requestUrl = '/building/update';
                this.$nextTick(() => {
                    this.$refs["updateBuilding"].showDialog = true;
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

</style>
