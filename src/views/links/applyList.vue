<template>
  <div class="app-container">

    <el-table v-loading="listLoading" :data="list" border stripe fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="id" width="50" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="名称" >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="个人网站">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="ip地址">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="留言时间">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="留言设备">
        <template slot-scope="scope">
          <span>{{ scope.row.os }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="浏览器">
        <template slot-scope="scope">
          <span>{{ scope.row.browser }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
         <el-tag :type="scope.row.status === 'true' ? 'success' :'danger'">
            {{ scope.row.status |statusFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="130">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="添加友链" placement="top-start">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="edit(scope.row)">
          </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除评论" placement="top-start">
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="del(scope.row.id)">
          </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="getList" />
      
    <el-dialog title="添加友链" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 700px; margin-left:50px;">
        <el-form-item label="留言内容:" prop="name">
          <p v-html="temp.content"></p>
        </el-form-item>

        <el-form-item label="网站名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>

        <el-form-item label="网站url" prop="url">
          <el-input v-model="temp.url" />
        </el-form-item>

        <el-form-item label="网站状态" prop="status">
          <el-input v-model="temp.status"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="add()">
          确定
        </el-button>
      </div>
    </el-dialog>
  
  
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import {delComment,changeStatus} from '@/api/comment'
import {addLinks,applyList } from '../../api/links';

export default {
  name: "comments",
  components: { Pagination },
  filters: {
    statusFilter(status) {
        if(status === 'true'){
            return '已添加';
        }else{
            return '未添加';
        }
    },
  },
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
      temp: {
        id: undefined,
        name:'',
        url:'',
        status:'',
        content:''
      },
      rules: {
        name: [{required: true,type:'string',message: '请输入',trigger:'blur'}],
        url:[{required:true,type:'string',message:'请输入',trigget:'blur'}],
        status:[{required:true,type:'string',message:'请输入',trigger:'blur'}]
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
      applyList(this.listQuery).then(response => {
        this.list = response.data;
        this.total = response.count;
        this.listLoading = false;
      });
    },
    // 重置表单
    resetTemp() {
      this.temp = {
        id: undefined,
        name:'',
        url:'',
        status:'',
        content:'',
      }
    },
    // 显示编辑表单
    edit(row){
      console.log(row)
      this.temp.id = row.id;
      this.temp.content = row.content;
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    del(id){
      this.$confirm('此操作将永久删除该留言, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delComment(id).then(response => {
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

    add(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let params = new URLSearchParams();
          params.append("name",this.temp.name);
          params.append("url",this.temp.url);
          params.append("status",this.temp.status);
          
          addLinks(params).then(response =>{
            if (response.status === true){
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '回复成功',
                type: 'success',
                duration: 2000
              })
              //重新加载数据
              changeStatus(this.temp.id)
              this.getList();
            }else{
              this.dialogFormVisible = false
              this.$message({
                message: '回复失败',
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

