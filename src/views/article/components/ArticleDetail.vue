<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <CommentDropdown v-model="postForm.comment_switch" />
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          发布
        </el-button>
        <el-button v-loading="loading" type="warning" @click="save">
          草稿
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                标题
              </MDinput>
            </el-form-item>

            <el-form-item style="margin-bottom: 40px;" prop="slug">
              <MDinput v-model="postForm.slug" :maxlength="200" name="slug" required>
                摘要
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="60px" label="分类:" class="postInfo-container-item" prop="category">
                    <el-select v-model="postForm.category" placeholder="请选择">
                      <el-option v-for="(item,index) in categoryList" :key="item+index" :label="item.name" :value="item.cid" />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label-width="60px" label="标签:" class="postInfo-container-item" prop="tags">
                    <el-select v-model="postForm.tags" :multiple-limit = "4" multiple collapse-tags placeholder="请选择">
                      <el-option v-for="(item,index) in tagsList" :key="item+index" :label="item.name" :value="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>

              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item prop="contentMKD" style="margin-bottom: 30px;" >
          <mavon-editor
            ref="md"
            v-model="postForm.contentMKD"
            :ishljs = "true"
            @save="save"
            @imgAdd="$imgAdd"
            @imgDel="$imgDel" />
        </el-form-item>

        <!-- 文章封面上传 -->
        <el-form-item label="图片上传" prop="image_uri">
          <el-upload
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="httpRequest"
            class="upload-demo"
            action="url"
            name="image"
            drag>
            <i class="el-icon-upload"/>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>

      </div>
    </el-form>
  </div>
</template>

<script>

// import MarkdownEditor from '@/components/MarkdownEditor'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchArticle, updateArticle, createArticle } from '@/api/article'
import { list } from '@/api/category'
import { tagList } from '@/api/tag'
import { upload } from '@/api/upload'
import { CommentDropdown } from './Dropdown'

const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  slug: '', // 文章摘要
  category: undefined, // 分类id
  tags: '', // 标签
  contentHtml: '', // html文章内容
  contentMkd: '', // markdown
  image_uri: '', // 文章图片
  id: 0,
  comment_switch: true

}

export default {
  name: 'ArticleDetail',
  components: { MDinput, Sticky, CommentDropdown, mavonEditor },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '不能为空',
          type: 'error'
        })
        callback(new Error(rule.field + '不能为空'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      categoryList: [],
      tagsList: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ required: true, type: 'string', message: '请输入标题', trigger: 'blur' }],
        slug: [{ required: true, type: 'string', message: '请输入摘要', trigger: 'blur' }],
        category: [{ type: 'number', required: true, message: '请选择', trigger: 'change' }],
        tags: [{ type: 'array', required: true, message: '请选择标签', trigger: 'blur' }],
        contentMkd: [{ required: true, type: 'string', message: '请输入正文', trigger: 'blur' }]
      },
      tempRoute: {}
    }
  },
  computed: {
    // contentShortLength() {
    //   return this.postForm.content_short.length
    // }
  },
  created() {
    // 判断是新建还是修改
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
    // 加载分类
    this.getCategoryList()
    // 加载所有标签
    this.getTagsList()
  },
  methods: {
    // 根据id获取文章
    fetchData(id) {
      fetchArticle(id).then(response => {
        this.postForm.id = response.article.id
        this.postForm.title = response.article.title
        this.postForm.slug = response.article.slug
        this.postForm.category = response.article.category
        this.postForm.tags = response.tags
        this.postForm.contentMkd = response.article.contentMkd
        this.postForm.comment_switch = Boolean(response.article.comment_switch)
        this.postForm.image_uri = response.article.imageCover
      }).catch(err => {
        console.log(err)
      })
    },
    // 设置页面标题
    setTagsViewTitle() {
      const title = '编辑文章'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },

    // 直接发布
    submitForm() {
      const params = new URLSearchParams()
      params.append('title', this.postForm.title)
      params.append('slug', this.postForm.slug)
      params.append('contentMkd', this.postForm.contentMkd)
      params.append('contentHtml', this.$refs.md.d_render)
      params.append('status', true)
      params.append('category', this.postForm.category)
      params.append('comment_switch', this.postForm.comment_switch)
      params.append('tags', this.postForm.tags)
      params.append('imageCover', this.postForm.image_uri)
      params.append('id', this.postForm.id)

      this.$refs.postForm.validate(valid => {
        if (valid) {
          if (this.isEdit === true) {
            updateArticle(params).then(response => {
              this.loading = true
              if (response.status === true) {
                this.$message({
                  message: '文章修改成功',
                  type: 'success',
                  showClose: true,
                  duration: 1000
                })
                this.$router.push({ path: this.redirect || '/article/list' })
              } else {
                this.loading = false
              }
              this.postForm.status = 'published'
              this.loading = false
            })
          } else {
            createArticle(params).then(response => {
              this.loading = true
              if (response.status === true) {
                this.$message({
                  message: '发布文章成功',
                  type: 'success',
                  showClose: true,
                  duration: 1000
                })
                this.$router.push({ path: this.redirect || '/article/list' })
              } else {
                this.loading = false
              }
              this.postForm.status = 'published'
              this.loading = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 保存为草稿
    save(value, render) {
      console.log(this.postForm)
      const params = new URLSearchParams()
      params.append('title', this.postForm.title)
      params.append('slug', this.postForm.slug)
      params.append('contentMkd', this.postForm.contentMkd)
      params.append('contentHtml', render)
      params.append('status', false)
      params.append('category', this.postForm.category)
      params.append('comment_switch', this.postForm.comment_switch)
      params.append('tags', this.postForm.tags)
      params.append('imageCover', this.postForm.image_uri)
      params.append('id', this.postForm.id)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          if (this.isEdit === true) {
            updateArticle(params).then(response => {
              this.loading = true
              if (response.status === true) {
                this.$message({
                  message: '文章修改成功',
                  type: 'success',
                  showClose: true,
                  duration: 1000
                })
                this.$router.push({ path: this.redirect || '/article/list' })
              } else {
                this.loading = false
              }
              this.postForm.status = 'published'
              this.loading = false
            })
          } else {
            createArticle(params).then(response => {
              this.loading = true
              if (response.status === true) {
                this.$message({
                  type: 'success',
                  showClose: true,
                  duration: 1000
                })
                this.$router.push({ path: this.redirect || '/article/list' })
              } else {
                this.loading = false
              }
              this.postForm.status = 'published'
              this.loading = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 获取分类
    getCategoryList() {
      list().then(response => {
        this.categoryList = response.data
      })
    },
    // 获取标签
    getTagsList() {
      tagList().then(response => {
        this.tagsList = response.data
      })
    },
    // 覆盖上传组件的上传方法
    httpRequest(item) {
      const param = new FormData()
      param.append('image', item.file)
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      upload(param, config).then(response => {
        if (response.status == true) {
          this.postForm.image_uri = response.path
        }
      }).catch(err => {
        this.$message.error(err.message)
        console.log('报错', err)
      })
    },
    // 验证上传文件大小
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    // 编辑器的图片上传
    $imgAdd(pos, $file) {
      const param = new FormData()
      param.append('image', $file)
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      upload(param, config).then(response => {
        if (response.status == true) {
          this.$refs.md.$img2Url(pos, response.path)
        }
      }).catch(err => {
        this.$message.error(err.message)
        console.log('报错', err)
      })
    },
    // 删除图片
    $imgDel() {

    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
<style type="text/css" >
.sub-navbar{
  line-height:50px;
  position:relative;
  width:100%;
  text-align:right;
  padding-right:20px;
  transition:600ms ease position;
}
.draft{
  background:#d0d0d0;
}
.published{
  background:#20b6f9;
}
</style>
mavon-editor