<template>
    <div :class="{fullScreen: $route.meta.fullscreen}">
        <div class="errPage-container">
            <el-row>
                <el-col :span="12">
                    <h1 class="text-jumbo text-ginormous">Oops!<strong>{{status}}</strong></h1>
                    <h2 class="text-primary" style="margin-bottom: 15px">{{title}}</h2>
                    <h3 style="margin-bottom: 15px">请联系管理员</h3>
                    <ul class="list-unstyled">
                        <li>或者你可以去:</li>
                        <li class="link-type">
                            <router-link :to="indexPath">回首页</router-link>
                        </li>
                    </ul>
                    <el-button icon="arrow-left" class="pan-back-btn" @click="back">立即返回</el-button>
                </el-col>
                <el-col :span="12">
                    <img src="/common-assets/img/error.gif" width="313" height="428"
                         alt="Girl has dropped her ice cream.">
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
  import config from '@configs'

  export default {
    name: 'ErrorPage',
    data () {
      return {
        title: '',
        desc: '',
        status: this.$route.meta.status || this.$route.query.status,
        indexPath: `${config.adminContext}/`,
      }
    },
    methods: {
      back () {
        if (this.$route.query.noGoBack) {
          this.$router.push({ path: this.indexPath })
        } else {
          this.$router.go(-1)
        }
      },
    },
    created () {
      switch (Number(this.status)) {
        case 404:
          this.title = '在服务器上未找到指定资源'
          this.desc = '请联系管理员'
          break
        case 401:
          this.title = '您没有权限查看当前资源'
          this.desc = '请联系管理员'
          break
        case 500:
          this.title = '服务器内部错误'
          this.desc = '请联系管理员'
          break
      }
    },
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .fullScreen {
        width: 100%;
        height: 100%;
        background: #fff;
        padding: 50px 0;
    }

    .errPage-container {
        width: 800px;
        max-width: 100%;
        margin: 0 auto;

        .pan-back-btn {
            background: #008489;
            color: #fff;
            border: none !important;
        }

        .pan-gif {
            margin: 0 auto;
            display: block;
        }

        .pan-img {
            display: block;
            margin: 0 auto;
            width: 100%;
        }

        .text-jumbo {
            font-size: 60px;
            font-weight: 700;
            color: #484848;
        }

        .list-unstyled {
            font-size: 14px;

            li {
                margin-bottom: 10px;
                list-style-type: none;
            }

            a {
                color: #008489;
                text-decoration: none;

                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
</style>