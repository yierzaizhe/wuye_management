<template>
    <div style="margin-left: 20px">
        <div>
            <el-row>
                <el-button icon="el-icon-plus" type="primary" @click="addItem">新增</el-button>
            </el-row>
        </div>
      <div>
        <el-form ref="form" :model="form" label-width="80px" :inline="true" style="margin-top: 20px">
          <el-form-item label="门牌号：" >
            <el-input v-model="selectHouseCode"></el-input>
          </el-form-item>
          <el-form-item label="姓名：" >
            <el-input v-model="selectOwnerName"></el-input>
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
                :data="tableData"
                style="width: 100%"
                height="400">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="身份证:">
                            <span>{{ props.row.idCard }}</span>
                        </el-form-item>
                        <el-form-item label="职业:">
                            <span>{{ props.row.profession }}</span>
                        </el-form-item>
                        <el-form-item label="备注:">
                            <span>{{ props.row.remark }}</span>
                        </el-form-item>
                        <el-form-item label="入住时间:">
                            <span>{{ props.row.createTime }}</span>
                        </el-form-item>
                        <el-form-item label="更新时间:">
                            <span>{{ props.row.updateTime }}</span>
                        </el-form-item>
                        <el-form-item label="出生日期:">
                            <span>{{ props.row.birthday }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                    label="门牌号">
                <template slot-scope="scope">
                    <span >{{ scope.row.houseCode}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="姓名">
                <template slot-scope="scope">
                    <span >{{ scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="sex" width="120" label="性别" :formatter="sexFormat">
            </el-table-column>
            <el-table-column
                    label="联系方式">
                <template slot-scope="scope">
                    <span >{{ scope.row.telephone}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="是否户主"
                    width="100">
                <template slot-scope="scope">
                    <el-switch
                            v-model="scope.row.isMain"
                            disabled>
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="type" width="120" label="居住类型" :formatter="typeFormat"></el-table-column>
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
        <UpdateOwner v-if="showDialog"
                        ref="updateOwner"
                        :handel-type = 'handelType'
                        :dialog-title="dialogTitle"
                        :item-info="tableItem"
                        @closeDialog="closeDialog"></UpdateOwner>
    </div>
</template>

<script>
    import UpdateOwner from "./UpdateOwner";
    export default {
        name: "Owner",
        components: {
          UpdateOwner
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
                selectHouseCode: '',
                selectOwnerName: '',
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
                showDialog: false, //更改组件的显示
                handelType: null,
                dialogTitle: '', //弹窗的title
                tableItem: { //用来更新 新增
                    id: "",
                    house_code: "",
                    name: "",
                    sex: "",
                    id_card: "",
                    telephone: "",
                    is_main: "",
                    type: "",
                    profession: "",
                    remark: "",
                    create_time: "",
                    update_time: "",
                    birthday: "",
                },
            }
        },
        watch: {
            selectHouseCode(){
                this.getList()
            },
            selectOwnerName(){
                this.getList()
            },
            kindValue(){
                this.getList()
            }
        },
        methods: {
            sexFormat(row,column){
                if(row.sex == 1 ){
                    return '男'
                }else {
                    return '女'
                }
            },
            typeFormat(row,column){
                if(row.type == 1 ){
                    return '租住'
                }else {
                    return '购买'
                }
            },

            handleCurrentChange(page){
                this.currentPage = page //点击的时候把拿到的页码 赋值给组件
                this.getList()
            },
            //查找
            getList(){
                let that = this
                this.$http.post('/owner/search',
                    {
                        currentPage: that.currentPage+"",
                        pageSize: that.pageSize+"",
                        startTime: that.form.startTime,
                        endTime: that.form.endTime,
                        name: that.selectOwnerName,
                        type: that.kindValue,
                        houseCode: that.selectHouseCode,
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
                this.$http.post('/owner/delete',{
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
                    houseCode: "",
                    name: "",
                    sex: true,
                    idCard: "",
                    telephone: "",
                    isMain: false,
                    type: false,
                    profession: "",
                    remark: "",
                    createTime: "",
                    updateTime: "",
                    birthday: "",
                };
                this.dialogTitle = "添加信息";
                this.handelType = false;
                this.showDialog = true;
                this.$nextTick(() => {
                    this.$refs["updateOwner"].showDialog = true;
                });
            },
            handleEdit(row){
                this.showDialog = true
                this.tableItem = row;
                this.handelType = true;
                this.dialogTitle = "编辑";
                this.$nextTick(() => {
                    this.$refs["updateOwner"].showDialog = true;
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
