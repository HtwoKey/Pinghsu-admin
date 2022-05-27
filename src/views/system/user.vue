<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="addCategory">
        添加用户
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="users" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="id" width="80" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.uid }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="登录名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.screenName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="登录错误次数">
        <template slot-scope="scope">
          <span>{{ scope.row.error }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="账号状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit(scope.row)">
          </el-button>
          
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="del(scope.row.cid)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
      
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 300px; margin-left:50px;">
                
        <el-form-item label="登录名" prop="name">
          <el-input v-model="user.username" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="user.password" />
        </el-form-item>

        <el-form-item label="确认密码" prop="repassword">
          <el-input v-model="user.repassword" />
        </el-form-item>

        <el-form-item label="用户名" prop="screenName">
          <el-input v-model="user.screenName" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createCategory():updateCategory()">
          确定
        </el-button>
      </div>
    </el-dialog>
  
  
  </div>
</template>

<script>
import {add,del,list,update } from "@/api/user";

export default {
  name: "category",
  
  //   filters: {
  //     parseTime(time){
  //       return dateTimeFormat(time)
  //     }
  //   },
  data() {
    return {
      users: [],
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '添加用户'
      },
      user: {
        uid: undefined,
        username: '',
        password: '',
        screenName:'',
      },
      rules: {
        name: [{required: true,type:'string',message: '请输入',trigger:'blur'}],
        description: [{required: true,type:'string',message: '请输入',trigger:'blur'}],
        english: [{required: true,type:'string',message: '请输入',trigger:'blur'}],
      },
    }
  },
  created() {
    this.initData();
  },
  methods: {
    //获取数据
    initData() {
      this.listLoading = true;
      list().then(response => {
        this.users = response.data;
        this.listLoading = false;
      });
    },
    // 重置表单
    resetTemp() {
      this.temp = {
        cid: undefined,
        name: '',
        description: '',
        english:'',
      }
    },
    // 显示添加表单
    addCategory() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 显示编辑表单
    edit(row){
      console.log(row)
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    del(id){
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delCategory(id).then(response => {
            if(response.status === true){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getList();
            }else{
              this.$message({
                message: '删除失败，'+response.message,
                type: 'error',
              })
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    createCategory(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let params = new URLSearchParams();
          params.append("name",this.temp.name);
          params.append("description",this.temp.description);
          params.append("english",this.temp.english);
          add(params).then(response =>{
            if (response.status === true){
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              //重新加载数据
              this.getList();
            }else{
              this.dialogFormVisible = false
              this.$message({
                message: '添加失败',
                type: 'error'
              })
            }
          })
        }else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateCategory(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let params = new URLSearchParams();
          params.append("name",this.temp.name);
          params.append("description",this.temp.description);
          params.append("english",this.temp.english);
          params.append("cid",this.temp.cid);
          update(params).then(response =>{
            if (response.status === true){
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              //重新加载数据
              this.getList();
            }else{
              this.dialogFormVisible = false
              this.$message({
                message: '添加失败',
                type: 'error'
              })
            }
          })
        }else {
          console.log('error submit!!')
          return false
        }
      })
    },

  }
};
</script>

<style scoped>

.filter-container{
  padding-bottom: 10px;
}

</style>

