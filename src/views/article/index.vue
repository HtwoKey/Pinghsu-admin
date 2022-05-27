<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="请输入" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="请选择分类" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="id" width="80" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="250" align="center" label="标题" prop="title">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="发布时间">
        <template slot-scope="scope">
          <span>{{ scope.row.created | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="最后修改时间">
        <template slot-scope="scope">
          <span>{{ scope.row.modified | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="点击量">
        <template slot-scope="scope">
          <span>{{ scope.row.hits }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="评论数">
        <template slot-scope="scope">
          <span>{{ scope.row.commentsnum }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="分类">
        <template slot-scope="scope">
          <span>{{ scope.row.cname }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="评论开关">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.commentSwitch"
            active-text="开"
            active-value="true"
            inactive-text="关"
            inactive-value="false"
            @change="changeCommentSwitch(scope.row.id,scope.row.commentSwitch)"
          />
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <router-link :to="'/article/editor/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit" />
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="del(scope.row.id)" />

          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            active-value="true"
            active-text="发布"
            inactive-color="#ff4949"
            inactive-value="false"
            inactive-text="草稿"
            @change="changeArticleStatus(scope.row.id,scope.row.status)"
          />

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="getList" />
  </div>
</template>

<script>
import { list, delArticle, changeSwitch, changeStatus } from '@/api/article'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { parseTime } from '@/utils'

export default {
  name: 'ArticleList',
  components: { Pagination },
  filters: {
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    }
  },
  data() {
    return {
      list: [],
      categoryList: [],
      total: 0,
      listLoading: true,
      downloadLoading: false,
      listQuery: {
        page: 1,
        rows: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取文章列表
    getList() {
      this.listLoading = true
      list(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.count
        this.listLoading = false
      })
    },
    // 删除文章
    del(id) {
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delArticle(id).then(response => {
            if (response.status === true) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getList()
            } else {
              this.$message({
                message: '删除失败，' + response.message,
                type: 'error'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 修改文章评论开关
    changeCommentSwitch(id, value) {
      const params = new URLSearchParams()
      params.append('id', id)
      params.append('value', value)
      changeSwitch(params).then(response => {
        if (response.status === true) {
          // this.getList();
        }
      })
    },
    // 修改文章发布状态
    changeArticleStatus(id, value) {
      const params = new URLSearchParams()
      params.append('id', id)
      params.append('value', value)
      changeStatus(params).then(response => {})
    },
    // 条件过滤
    handleFilter() {},
    // 导出数据
    handleDownload() {}
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.filter-container {
  padding-bottom: 10px;
}
</style>
