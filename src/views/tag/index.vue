<template>
  <div class="app-container">

    <div class="filter-container">
      <el-button class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="showAddFrom">
        添加
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="id" width="80" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标签名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditFrom(scope.row)">
          </el-button>
          
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="del(scope.row.id)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="getList" />
      
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 300px; margin-left:50px;">
                
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?addTag():updateTag()">
          确定
        </el-button>
      </div>
    </el-dialog>
  
  
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { pageList,delTag,update,add } from "@/api/tag";

export default {
  name: "category",
  components: { Pagination },
  //   filters: {
  //     parseTime(time){
  //       return dateTimeFormat(time)
  //     }
  //   },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        rows: 20
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑标签',
        create: '添加标签'
      },
      temp: {
        id: undefined,
        name: '',
      },
      rules: {
        name: [{required: true,type:'string',message: '请输入',trigger:'blur'}],
      },
    }
  },
  created() {
    this.getList();
  },
  methods: {
    //获取数据
    getList() {
      this.listLoading = true;
      pageList(this.listQuery).then(response => {
        this.list = response.data;
        this.total = response.count;
        this.listLoading = false;
      });
    },
    // 重置表单
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
      }
    },
    // 显示添加表单
    showAddFrom() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 显示编辑表单
    showEditFrom(row){
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
          delTag(id).then(response => {
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
    addTag(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let params = new URLSearchParams();
          params.append("name",this.temp.name);

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
    updateTag(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let params = new URLSearchParams();
          params.append("name",this.temp.name);
          params.append("id",this.temp.id);

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

