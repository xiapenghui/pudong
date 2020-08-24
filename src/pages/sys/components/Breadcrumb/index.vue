<template>
    <div>
        <div class="breadcrumb-tips">当前位置：</div>
        <el-breadcrumb class="app-breadcrumb" separator="/">
            <transition-group name="breadcrumb">
                <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
                    <span v-if="item.noRedirect||index===levelList.length-1" class="no-redirect">{{item.title}}</span>
                    <router-link v-else :to="item.path">{{item.title}}</router-link>
                </el-breadcrumb-item>
            </transition-group>
        </el-breadcrumb>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import utils from '@utils'

  export default {
    name: 'Breadcrumb',
    created () {
      this.getBreadcrumb()
    },
    data () {
      return {
        levelList: [],
      }
    },
    computed: {
      ...mapState({
        menuMap: state => state.resourceStore.menuMap,
      }),
    },
    watch: {
      $route () {
        this.getBreadcrumb()
      },
      menuMap () {
        this.getBreadcrumb()
      },
    },
    methods: {
      getBreadcrumb () {
        this.levelList = []
        const { meta: { id: routeId, title }, path } = [...this.$route.matched].pop()
        if (routeId === 'dashboard') {
          this.levelList.push({ path, title })
        } else {
          const menu = this.menuMap[routeId]
          if (menu) {
            const parents = menu.parentIds.split(',')
            parents.forEach(parentId => {
              const parent = this.menuMap[parentId]
              if (parent) {
                const { path } = utils.router.getRouteInfoByMenu(parent)
                this.levelList.push({
                  path,
                  title: parent.resName,
                  noRedirect: path.indexOf('$$blank') !== -1,
                })
              }
            })
          }
          this.levelList.push({ path, title })
        }
      },
    },
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .breadcrumb-tips {
        float: left;
    }

    .app-breadcrumb.el-breadcrumb, .breadcrumb-tips {
        display: inline-block;
        font-size: 14px;
        line-height: 50px;

        .no-redirect {
            color: #97a8be;
            cursor: text;
        }
    }
</style>
