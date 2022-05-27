<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="id" width="80" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="ip地址">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="访问时间">
        <template slot-scope="scope">
          <span>{{ scope.row.accessTime | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="浏览器名称">
        <template slot-scope="scope">
          <span>{{ scope.row.browserName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="浏览器类型">
        <template slot-scope="scope">
          <span>{{ scope.row.browserType }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="浏览器制造商">
        <template slot-scope="scope">
          <span>{{ scope.row.browserManufacturer }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="系统名称">
        <template slot-scope="scope">
          <span>{{ scope.row.osName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="系统类型">
        <template slot-scope="scope">
          <span>{{ scope.row.osGroup }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="设备类型">
        <template slot-scope="scope">
          <span>{{ scope.row.osDeviceType }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="完整userAgent" width="500" >
        <template slot-scope="scope">
          <span>{{ scope.row.userAgent }}</span>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.rows" @pagination="getList" />
  </div>
</template>

<script>
import {list} from '@/api/access' 
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { dateTimeFormat } from '@/utils'

export default {
  name: 'ArticleList',
  components: { Pagination },
  filters: {
    parseTime(time){
      return dateTimeFormat(time)
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        rows: 20
      }
    }
  },
  created() {
    this.getList()
    Date.prototype.toJSON = function () { return this.toLocaleString(); }
    var date = new Date();
    console.log(date.toString());
    console.log(JSON.stringify(date));
    

  },
  methods: {
    //获取数据
    getList() {
      this.listLoading = true
      list(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.count
        this.listLoading = false
      })
    },
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
</style>
