<template>
    <div class="navMenu">
        <template v-for="navMenu in navMenus">
            <!-- 最后一级菜单 -->
            <el-menu-item v-if="!navMenu.children" :index="navMenu.path">
                <i :class="['fa', navMenu.menuIcon]"></i>
                <span slot="title">{{navMenu.resName}}</span>
            </el-menu-item>
            <!-- 此菜单下还有子菜单 -->
            <el-submenu v-if="navMenu.children" :index="navMenu.path">
                <template slot="title">
                    <i :class="['fa', navMenu.menuIcon]"></i>
                    <span>{{navMenu.resName}}</span>
                </template>
                <!-- 递归 -->
                <NavMenu :navMenus="navMenu.children"></NavMenu>
            </el-submenu>
        </template>
    </div>
</template>

<script>
  export default {
    name: 'NavMenu',//使用递归组件必须要有
    props: ['navMenus'],// 传入子组件的数据
    data () {
      return {}
    },
    methods: {},
  }
</script>

<style lang="scss">
    .sidebar-hidden {
        .header {
            .logo {
                background: #304156;

                .big {
                    display: none;
                }

                .min {
                    display: block;
                }

                width: 64px;
            }
        }

        .aside {
            .sidebar-toggle {
                .icon-left {
                    transform: rotate(180deg);
                }
            }
        }

        .main {
            .app-body {
                margin-left: 64px;
            }
        }
    }

    .sidebar-close {
        .header {
            .logo {
                width: 0;
                overflow: hidden;
            }
        }

        .aside {
            margin-left: -200px;
        }

        .main {
            .app-body {
                margin-left: 0;
            }
        }
    }

    .sidebar-hidden.sidebar-close {
        .aside {
            margin-left: -64px;
        }
    }

    .el-menu--collapse .el-menu-item span, .el-menu--collapse .el-submenu .el-submenu__title span {
        height: 0;
        width: 0;
        overflow: hidden;
        visibility: hidden;
        display: inline-block;
    }

    .menu {
        border-right: none;
        background-color: #304156;
        text-color: #bfcbd9;
    }

    .el-menu--vertical {
        min-width: 190px;
    }

    .setting-category {
        padding: 10px 0;
        border-bottom: 1px solid #eee;
    }
</style>
