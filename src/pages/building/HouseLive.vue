<template>
    <div style="margin-left: 20px">
      <div style="position:absolute;right:20px;bottom:20px;">

        <el-button icon="el-icon-plus" type="primary"  @click="addItem()" circle></el-button>

      </div>
      <div>
        <el-form ref="form" :model="form" label-width="80px" :inline="true" style="margin-top: 20px">
          <el-form-item label="门牌号：" >
            <el-input v-model="selectHouseCode"></el-input>
          </el-form-item>
          <el-form-item label="居住类型:">
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
                    label="门牌号">
                <template slot-scope="scope">
                    <span >{{ scope.row.houseCode}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="居住类型">
                <template slot-scope="scope">
                    <el-switch
                            v-model="scope.row.kind"
                            active-color="#ff4949"
                            inactive-color="#13ce66"
                            active-text="租用"
                            inactive-text="购买"
                            disabled>
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                    label="具体类别">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.kindParam}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="金额"
                    >
                <template slot-scope="scope">
                    <span>{{ scope.row.houseFee}}</span>
                </template>
            </el-table-column>
            <el-table-column
                                label="入住时间"
                                width="200">
                            <template slot-scope="scope">
                                <i class="el-icon-time"></i>
                                <span style="margin-left: 10px">{{ (scope.row.startTime)}}</span>
                            </template>
                        </el-table-column>
            <el-table-column
                    label="结束时间"
                    width="200">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ (scope.row.endTime)}}</span>
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
        <UpdateHouseLive v-if="showDialog"
                        ref="updateHouseLive"
                        :dialog-title="dialogTitle"
                        :item-info="tableItem"
                         :requestUrl="requestUrl"
                        @closeDialog="closeDialog"></UpdateHouseLive>
    </div>
</template>

<script>
    import UpdateHouseLive from "./UpdateHouseLive";
    export default {
        name: "HouseLive",
        components: {
            UpdateHouseLive
        },
        data() {
            return {
                selectHouseCode: '',
                kindValue: '',
                selectKind: [
                    {
                        value: '0',
                        label: '购买'
                    },{
                        value: '1',
                        label: '租住'
                    },
                    {
                        value: null,
                        label: '全部'
                    }
                ],
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
                    kind: '',
                    startTime: '',
                    endTime: ''
                },
                showDialog: false, //更改组件的显示
                handelType: null,
                requestUrl: '',
                dialogTitle: '', //弹窗的title
                tableItem: { //用来更新 新增
                    id: "",
                    houseCode: "",
                    kind: "",
                    houseFee: "",
                    kindParam: "",
                    startTime: "",
                    endTime: "",
                },
            }
        },
        watch: {
            selectHouseCode(){
                this.getList()
            },
            kindValue(){
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
                this.$http.post('/house-live/search',
                    {
                        currentPage: that.currentPage+"",
                        pageSize: that.pageSize+"",
                        startTime: that.form.startTime,
                        endTime: that.form.endTime,
                        houseCode: that.selectHouseCode,
                        kind: that.kindValue
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
                const confirmResult = await this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
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
                this.$http.post('/house-live/delete',{
                       id: row.id,
                      houseCode: row.houseCode
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
                    /*console.log(err)
                    that.$message({
                        showClose: true,
                        message: err.errorMsg,
                        offset: 66,
                        type: "error"
                    });*/
                })
            },
            // 添加操作
            addItem(houseCode) {
                this.tableItem = {
                    houseCode: houseCode,
                    kind: true,
                    houseFee: "",
                    kindParam: "",
                    startTime: "",
                    endTime: "",
                };
                this.dialogTitle = "添加信息";
                this.showDialog = true;
                this.requestUrl = '/house-live/add';
                this.$nextTick(() => {
                    this.$refs["updateHouseLive"].showDialog = true;
                });
            },
            handleEdit(row){
                this.showDialog = true
                this.tableItem = row;
                this.dialogTitle = "编辑";
                this.requestUrl = '/house-live/update';
                this.$nextTick(() => {
                    this.$refs["updateHouseLive"].showDialog = true;
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
            if (this.$route.query.houseCode != null || this.$route.query.houseCode != undefined){
                this.addItem(this.$route.query.houseCode)
            }
        }
    }
</script>

<style scoped>

</style>
