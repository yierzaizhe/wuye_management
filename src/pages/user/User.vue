<template>
  <div style="margin-left: 20px">
    <!--<div style="position:absolute;right:20px;bottom:20px;">

      <el-button icon="el-icon-plus" type="primary"  @click="addItem" circle></el-button>

    </div>-->
    <div>
      <el-form ref="form" :model="form" label-width="80px" :inline="true" style="margin-top: 20px">
        <el-form-item label="用户名：" >
          <el-input v-model="selectAccount"></el-input>
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
            <el-form-item label="创建时间:">
              <span>{{ props.row.create_time | dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
            </el-form-item>
            <el-form-item label="更新时间:">
              <span>{{ props.row.update_time |dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
            </el-form-item>
            <el-form-item label="上次登陆时间:">
              <span>{{ props.row.last_login_time |dateformat('YYYY-MM-DD HH:mm:ss')}}</span>
            </el-form-item>
            <el-form-item label="职责描述:">
              <span>{{ props.row.role_description }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="用户名">
        <template slot-scope="scope">
          <span >{{ scope.row.account}}</span>
        </template>
      </el-table-column>
      <
      <el-table-column
        label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.user_name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否可用"
        width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            @change="changeSwitch(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="是否过期"
        width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.account_not_expired"
            @change="changeSwitch(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="是否锁定"
        width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.account_not_locked"
            @change="changeSwitch(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="角色"
        width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.role_name != undefined">{{ scope.row.role_name}}</span>
          <span v-else>未赋权</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click.native.prevent="handleEdit(scope.row)">修改信息</el-button>

          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button
            size="mini"
            @click.native.prevent="restPassword(scope.row)">重置密码</el-button>
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
    <UpdateUser    v-if="showDialog"
                   ref="UpdateUser"
                   :dialog-title="dialogTitle"
                   :item-info="tableItem"
                   :requestUrl="requestUrl"
                   @closeDialog="closeDialog"></UpdateUser>
  </div>
</template>

<script>
  import UpdateUser from "./UpdateUser";
    export default {
        name: "User",
        components:{
            UpdateUser
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
                    name:'',
                    date: '',
                    startTime: '',
                    endTime: ''
                },
                selectAccount: '',

                showDialog: false, //更改组件的显示
                handelType: null,
                dialogTitle: '', //弹窗的title
                requestUrl: '',
                tableItem: { //用来更新 新增
                    id: "",
                    account: "",
                    userName: "",
                    password: "",
                    role: ""
                },
            }
        },
        watch: {
            selectAccount(){
                this.getList()
            },

        },
        methods: {
            changeSwitch(row){
                let that = this
                this.$http.post('/user/updateState',
                    {
                        id:row.id+"",
                        enabled:row.enabled,
                        accountNotExpired:row.account_not_expired,
                        accountNotLocked:row.account_not_locked,
                    }).then( res => {
                    if(res.errorCode == 200){
                        that.$message.success("状态修改成功");
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
                    console.log(err)
                    that.$message({
                        showClose: true,
                        message: err.errorMsg,
                        offset: 66,
                        type: "error"
                    });
                    that.$router.push('/dashboard/error')

                })
            },
            handleCurrentChange(page){
                this.currentPage = page //点击的时候把拿到的页码 赋值给组件
                this.getList()
            },
            //查找
            getList(){
                let that = this
                this.$http.post('/user/searchAll',
                    {
                        currentPage: that.currentPage+"",
                        pageSize: that.pageSize+"",
                        createTime: that.form.startTime,
                        updateTime: that.form.endTime,
                        account: that.selectAccount,
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
                const confirmResult = await this.$confirm('此操作将永久删除该员工信息, 是否继续?', '提示', {
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
                this.$http.post('/user/delete',{
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
            handleEdit(row){
                row.role_id = String(row.role_id)
                this.showDialog = true
                this.tableItem = row;
                this.handelType = true;
                this.dialogTitle = "修改用户信息";
                this.requestUrl = '/user/update';
                this.$nextTick(() => {
                    this.$refs["UpdateUser"].showDialog = true;
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
            async restPassword(row){
                const confirmResult = await this.$confirm('此操作将重置员工的密码, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                /*如果用户确认打印confirm,如果用户取消显示cancel*/
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消重置!')
                }
                let that = this
                this.$http.post('/user/restPassword',{
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
