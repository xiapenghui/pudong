<template>
    <div class="main">
        <div class="header">
            <div class="logo">
                <span class="big">{{$$config.siteName}}</span>
                <span class="min">{{$$config.minSiteMame}}</span>
            </div>
            <el-tooltip placement="right" :content="`点击${sideBarHidden?'打开':'收起'}侧边栏`">
                <span class="header-btn" @click="hiddenSidebar">
                    <i class="el-icon-menu"></i>
                </span>
            </el-tooltip>
            <Bread-Crumb class="breadcrumb-container"></Bread-Crumb>
            <div class="right">
                <span class="header-btn" @click="screenfullToggle">
                    <el-tooltip placement="bottom" :content="`点击切换全屏`">
                        <i class="fa fa-arrows-alt"></i>
                    </el-tooltip>
                </span>
                <theme-picker class="theme-switch right-menu-item"/>
                <el-dropdown>
                    <span class="header-btn">
                        <i class="el-icon-setting"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <div style="padding: 10px;text-align:center;width: 280px">
                            <div class="setting-category">
                                <el-switch
                                        @change="saveSwitchTabBarVal"
                                        v-model="switchTabBar"
                                        active-text="开启页签"
                                        inactive-text="关闭页签">
                                </el-switch>
                                <el-switch
                                        @change="saveFixedTabBar"
                                        v-if="switchTabBar"
                                        v-model="fixedTabBar"
                                        style="margin-top: 10px"
                                        active-text="页签固定"
                                        inactive-text="页签滚动">
                                </el-switch>
                                <el-alert
                                        v-if="switchTabBar"
                                        style="margin-top: 10px"
                                        title="导航页签超出显示区域时,可在导航上滚动鼠标来移动标签"
                                        type="info"
                                        show-icon>
                                </el-alert>
                            </div>
                        </div>
                    </el-dropdown-menu>
                </el-dropdown>
                <span class="header-btn">
                    <el-badge :value="3" class="badge">
                        <i class="el-icon-bell"></i>
                    </el-badge>
                </span>
                <el-dropdown :style="{zIndex:$$utils.getTopIndex()}">
                    <span class="header-btn">
                        {{userInfo.user.userAccount}}
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="$router.push(personalPath)">
                            <i style="padding-right: 8px" class="fa fa-cog"></i>个人中心
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="$$utils.router.logout">
                            <i style="padding-right: 8px" class="fa fa-key"></i>退出系统
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <div class="app">
            <div class="aside">
                <div v-slimscroll="options">
                    <div class="menu">
                        <el-menu
                                router
                                :default-active="$route.path"
                                @open="handleOpen"
                                @close="handleClose"
                                :collapse="isCollapse"
                        >
                            <NavMenu :navMenus="menuTree"></NavMenu>
                        </el-menu>
                    </div>
                </div>
                <div class="sidebar-toggle" @click="sidebarToggle">
                    <el-tooltip placement="top" content="点击切换展示模式">
                        <div class="icon-left">
                            <i class="el-icon-back"></i>
                        </div>
                    </el-tooltip>
                </div>
            </div>

            <div class="app-body">
                <NavBar id="nav-bar" v-if="switchTabBar"
                        :style="fixedTabBar && switchTabBar?'position: fixed;top: 0;':''"></NavBar>
                <div v-else style="margin-top: 50px;"></div>
                <div id="mainContainer" :style="fixedTabBar && switchTabBar?'margin-top: 88px;':''"
                     class="main-container">
                    <transition name="fade">
                        <el-card class="box-card">
                            <router-view :key="routerViewKey"></router-view>
                        </el-card>
                    </transition>
                </div>
                <EuiFooter></EuiFooter>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Screenfull from 'screenfull'
  import EuiFooter from './Footer.vue'
  import NavBar from './NavBar.vue'
  import NavMenu from './NavMenu.vue'
  import personalRoute from '@/sys/router/personal'
  import ThemePicker from '@/sys/components/ThemePicker/index'
  import BreadCrumb from '@/sys/components/Breadcrumb/index'

  export default {
    data () {
      return {
        fixedTabBar: true,
        switchTabBar: true,
        siteName: this.$$config.siteName,
        isCollapse: false,
        sideBarHidden: false,
        options: {
          height: 'calc(100vh - 90px)',
          size: '4px',
          color: 'rgb(48, 65, 86)',
        },
        routePath: this.$router,
        personalPath: personalRoute.showInAdmin.path,
      }
    },
    computed: {
      ...mapState({
        menuTree: state => state.resourceStore.menuTree,
        userInfo: state => state.userStore.currentUserInfo,
      }),
      routerViewKey () {
        return this.$route.fullPath
      },
    },
    methods: {
      NavBarWidth () {
        let navBar = document.getElementById('nav-bar')
        if (!navBar) return
        if (!(this.fixedTabBar && this.switchTabBar)) {
          navBar.style.width = '100%'
          return
        }
        let sidebarClose = document.body.classList.contains('sidebar-close')
        if (sidebarClose) {
          navBar.style.width = '100%'
          return
        }
        if (this.isCollapse) navBar.style.width = 'calc(100% - 64px)'
        else navBar.style.width = 'calc(100% - 200px)'
      },
      screenfullToggle () {
        if (!Screenfull.enabled) {
          this.$message({
            message: '你的浏览器不支持全屏！',
            type: 'warning',
          })
          return false
        }
        Screenfull.toggle()
      },
      saveFixedTabBar (v) {
        v ? localStorage.setItem('fixedTabBar', v) : localStorage.removeItem('fixedTabBar')
        this.NavBarWidth()
      },
      saveSwitchTabBarVal (v) {
        let containerDom = document.getElementById('mainContainer')
        v ? containerDom.style.minHeight = 'calc(100vh - 139px)' : containerDom.style.minHeight = 'calc(100vh - 101px)'
        v ? localStorage.setItem('switchTabBar', v) : localStorage.removeItem('switchTabBar')
        this.NavBarWidth()
      },
      sidebarToggle (e) {
        e.preventDefault()
        if (this.isCollapse) {
          document.body.classList.remove('sidebar-hidden')
          this.siteName = this.$$config.siteName
          this.isCollapse = false
        } else {
          document.body.classList.add('sidebar-hidden')
          this.isCollapse = true
        }
        this.NavBarWidth()
      },
      hiddenSidebar (e) {
        e.preventDefault()
        document.body.classList.toggle('sidebar-close')
        this.sideBarHidden = !this.sideBarHidden
        this.NavBarWidth()
      },
      handleOpen (key, keyPath) {
        if (key && !key.includes('$$blank')) {
          this.$router.push(key)
        }
      },
      handleClose (key, keyPath) {
        //关闭菜单
      },
    },
    created: function () {

    },
    mounted: function () {
      const vm = this
      this.switchTabBar = !!localStorage.getItem('switchTabBar')
      this.fixedTabBar = !!localStorage.getItem('fixedTabBar')
      if (this.switchTabBar) document.getElementById('mainContainer').style.minHeight = 'calc(100vh - 139px)'

      if (!this.isCollapse) {

        document.body.classList.remove('sidebar-hidden')
        this.siteName = this.$$config.siteName
      } else {
        document.body.classList.add('sidebar-hidden')
      }

      setTimeout(() => {
        this.NavBarWidth()
      }, 1000)

      const sysGatewayRoute = vm.$$sysConfig.gatewayRoute
      // 设置跟用户相关的消息频道
      vm.$$config.ws.initUserWs()
      // 设置消息监听
      vm.$$utils.axiosRequest(`${sysGatewayRoute}/getJWTToken`, '获取消息服务认证信息').then(result => {
        const socket = new SockJS(`/api${sysGatewayRoute}/websocket`)
        const socket_client = Stomp.over(socket)
        socket_client.connect({ 'Auth-Token': result.data }, () => {
          const topicSet = vm.$$config.ws.topicSet()
          Object.keys(topicSet).forEach(topic => {
            const callback = topicSet[topic]
            if (typeof callback === 'function') {
              socket_client.subscribe(topic, message => callback(vm.$$utils, message))
            }
          })
        })
      })

      vm.$$utils.axiosRequest(`${sysGatewayRoute}/noticeLogin`, '获取登录消息').then(result => {
        if (result && result.data && result.data.length > 0) {
          this.$notify({
            title: '登录提示',
            dangerouslyUseHTMLString: true,
            message: result.data,
            duration: 15000,
            position: 'bottom-right',
          })
        }
      })
    },
    components: {
      EuiFooter, NavBar, NavMenu, ThemePicker, BreadCrumb,
    },
  }
</script>
<style lang="scss">
    .main {
        display: flex;

        .el-menu:not(.el-menu--collapse) {
            width: 200px;
        }

        .app {
            width: 100%;
            background-color: #f7f9fa;
            height: 100%;
        }

        .aside {
            position: fixed;
            margin-top: 50px;
            z-index: 10;
            background-color: #222d32;
            transition: all 0.3s ease-in-out;
            height: calc(100% - 100px);

            .menu {
                height: 100%;
                background-color: #304156;
                text-color: #bfcbd9;
            }

            .sidebar-toggle {
                position: relative;
                width: 100%;
                height: 50px;
                color: #fff;
                cursor: pointer;

                .icon-left {
                    position: absolute;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    right: 0;
                    width: 100%;
                    height: 100%;
                    font-size: 14px;
                    transition: all 0.3s ease-in-out;
                }
            }
        }

        .app-body {
            margin-left: 200px;
            -webkit-transition: margin-left 0.3s ease-in-out;
            transition: margin-left 0.3s ease-in-out;
        }

        .main-container {
            //margin-top: 50px;
            padding: 6px;
            min-height: calc(100vh - 101px);
        }
    }

    .header {
        width: 100%;
        position: fixed;
        display: flex;
        height: 50px;
        background-color: #fff;
        border-bottom: solid 1px #e6e6e6;
        z-index: 10;

        .logo {
            .min {
                display: none;
            }

            width: 200px;
            height: 50px;
            text-align: center;
            line-height: 50px;
            color: #fff;
            background-color: #304156;
            -webkit-transition: width 0.35s;
            transition: all 0.3s ease-in-out;
        }

        .right {
            position: absolute;
            right: 0;
        }

        .header-btn {
            .el-badge__content {
                top: 14px;
                right: 7px;
                text-align: center;
                font-size: 9px;
                padding: 0 3px;
                background-color: #059893;
                color: #fff;
                border: none;
                white-space: nowrap;
                vertical-align: baseline;
                border-radius: .25em;
            }

            overflow: hidden;
            height: 50px;
            display: inline-block;
            text-align: center;
            line-height: 50px !important;
            cursor: pointer;
            padding: 0 14px;
            color: #333;

            &:hover {
                background-color: #e6e6e6
            }
        }

    }

    .breadcrumb-container {
        float: left;
    }
</style>
