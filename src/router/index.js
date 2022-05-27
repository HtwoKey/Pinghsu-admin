import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },

  {
    path: '/article',
    component: Layout,
    redirect: '/article/list',
    name: '文章管理',
    meta: { title: '文章管理', icon: 'documentation' },
    children: [
      {
        path: 'create',
        name: '发布文章',
        component: () => import('../views/article/create'),
        meta: { title: '发布文章', icon: 'edit' }
      },
      {
        path: 'editor/:id(\\d+)',
        name: '编辑文章',
        component: () => import('../views/article/edit'),
        meta: { title: '编辑文章', noCache: true, activeMenu: '/article/list' },
        hidden: true
      },
      {
        path: 'list',
        name: '文章列表',
        component: () => import('@/views/article/index'),
        meta: { title: '文章列表', icon: 'list' }
      }
    ]
  },

  {
    path: '/manage',
    component: Layout,
    redirect: 'noredirect',
    name: '标签分类管理',
    meta: { title: '标签分类管理', icon: 'example' },
    children: [
      {
        path: 'tag',
        name: '标签管理',
        component: () => import('@/views/tag/index'),
        meta: { title: '标签管理', icon: 'tag-fill' }
      },
      {
        path: 'category',
        name: '分类管理',
        component: () => import('@/views/category/index'),
        meta: { title: '分类管理', icon: 'tree' }
      }
    ]
  },
  {
    path: '/comments',
    component: Layout,
    redirect: 'noredirect',
    name: '消息管理',
    meta: { title: '评论管理', icon: 'message' },
    children: [
      {
        path: 'list',
        name: '评论列表',
        component: () => import('@/views/comments/index'),
        meta: { title: '评论列表', icon: 'list' }
      },
      {
        path: 'tree',
        name: '消息管理',
        component: () => import('@/views/tree/index'),
        meta: { title: '消息管理', icon: 'message' }
      }
    ]
  },

  {
    path: '/links',
    component: Layout,
    redirect: 'noredirect',
    name: '友链管理',
    meta: { title: '友链管理', icon: 'link' },
    children: [
      {
        path: 'table',
        name: '友链列表',
        component: () => import('@/views/links/index'),
        meta: { title: '友链列表', icon: 'list' }
      },
      {
        path: 'applyList',
        name: '友链申请列表',
        component: () => import('@/views/links/applyList'),
        meta: { title: '友链申请列表', icon: 'list' }
      }
    ]
  },
  {
    path: '/chart',
    component: Layout,
    name: '数据中心',
    meta: { title: '数据中心', icon: 'chart' },
    children: [
      {
        path: 'pvData',
        name: '访问量数据',
        component: () => import('@/views/chart/index'),
        meta: { title: '访问量数据分析', icon: 'chart-area' }
      },
      {
        path: 'userData',
        name: '用户分析',
        component: () => import('@/views/chart/userData'),
        meta: { title: '用户数据分析', icon: 'chart-bar' }
      },
      {
        path: 'commentData',
        name: '留言分析',
        component: () => import('@/views/chart/commentData'),
        meta: { title: '留言数据分析', icon: 'chart-line' }
      }
    ]
  },
  {
    path: '/sys',
    component: Layout,
    redirect: 'noredirect',
    name: '系统管理',
    meta: { title: '系统管理', icon: 'cog-fill' },
    children: [
      {
        path: 'access',
        name: '访问记录',
        component: () => import('@/views/system/access'),
        meta: { title: '访问记录', icon: 'list' }
      },
      {
        path: 'http',
        name: '请求日志',
        component: () => import('@/views/system/httpLog'),
        meta: { title: '请求日志', icon: 'form' }
      },
      {
        path: 'tree',
        name: '登录日志',
        component: () => import('@/views/tree/index'),
        meta: { title: '登录日志', icon: 'form' }
      },
      {
        path: 'user',
        name: '管理员设置',
        component: () => import('@/views/system/user'),
        meta: { title: '管理员设置', icon: 'user' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  mode: 'history',
  base: 'admin',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
