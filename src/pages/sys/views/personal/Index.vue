<template>
    <div>
        <el-card class="box-card">
            <el-tabs v-model="activeName">
                <el-tab-pane label="基本信息" name="index">
                    <div class="panel-heading">
                        <img src="/common-assets/img/avatar/profile_small.jpg">
                        <span class="title">
                            <p class="role">{{userRoleNames}}</p>
                            <span class="name">{{userInfo.user.userAccount}}</span>
                        </span>
                        <el-tooltip content="编辑">
                            <i class="el-icon-edit-outline" @click="editUserInfo"
                               style="font-size: 28px; position: absolute; right: 75px; cursor: pointer;"></i>
                        </el-tooltip>
                        <el-tooltip content="保存">
                            <i class="el-icon-circle-check-outline" @click="saveUserInfo" v-show="!disabled"
                               style="font-size: 28px; position: absolute; right: 31px; cursor: pointer;"></i>
                        </el-tooltip>
                    </div>
                    <div class="panel-body">
                        <el-form ref="userDetailsForm" :rules="userDetailRules" class="with-border">
                            <ul>
                                <li>
                                    <el-row :gutter="20" type="flex">
                                        <el-col :span="1"><i class="fa fa-id-card"></i></el-col>
                                        <el-col :span="3">姓名</el-col>
                                        <el-col :span="6">
                                            <el-input v-model="user.userName" :disabled="disabled"></el-input>
                                        </el-col>
                                    </el-row>
                                </li>
                                <li>
                                    <el-row :gutter="20" type="flex">
                                        <el-col :span="1"><i class="fa fa-user"></i></el-col>
                                        <el-col :span="3">昵称</el-col>
                                        <el-col :span="6">
                                            <el-input v-model="user.nickName" :disabled="disabled"></el-input>
                                        </el-col>
                                    </el-row>
                                </li>
                                <li>
                                    <el-row :gutter="20" type="flex">
                                        <el-col :span="1"><i class="fa fa-envelope"></i></el-col>
                                        <el-col :span="3">电子邮箱</el-col>
                                        <el-col :span="6">
                                            <el-input v-model="user.email" :disabled="disabled"></el-input>
                                        </el-col>
                                    </el-row>
                                </li>
                                <li>
                                    <el-row :gutter="20" type="flex">
                                        <el-col :span="1"><i class="fa fa-female"></i></el-col>
                                        <el-col :span="3">性别</el-col>
                                        <el-col :span="6">
                                            <el-select v-model="user.sex" :disabled="disabled">
                                                <el-option v-for="param in dictMap['sex_type']" :key="param.id"
                                                           :value="param.paramCode"
                                                           :label="param.paramName"></el-option>
                                            </el-select>
                                        </el-col>
                                    </el-row>
                                </li>
                                <li>
                                    <el-row :gutter="20" type="flex">
                                        <el-col :span="1"><i class="fa fa-phone"></i></el-col>
                                        <el-col :span="3">手机号</el-col>
                                        <el-col :span="6">
                                            <el-input v-model="user.mobile" :disabled="disabled"></el-input>
                                        </el-col>
                                    </el-row>
                                </li>
                            </ul>
                        </el-form>
                    </div>
                </el-tab-pane>
                <!--<el-tab-pane label="头像修改" name="second">-->
                <!--<div class="acavatUpload">-->
                <!--<AcavatUpload></AcavatUpload>-->
                <!--</div>-->
                <!--</el-tab-pane>-->
                <el-tab-pane label="密码修改" name="third">
                    <div class="panel-body">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form class="changePassword" ref="form" :rules="rules" :model="formPassword"
                                         label-width="100px">
                                    <el-form-item prop="oldPassword" label="原始密码">
                                        <el-input type="password" v-model="formPassword.oldPassword"></el-input>
                                    </el-form-item>
                                    <el-form-item prop="newPassword" label="新密码">
                                        <el-input type="password" v-model="formPassword.newPassword"></el-input>
                                    </el-form-item>
                                    <el-form-item prop="makeSurePassword" label="确认密码">
                                        <el-input type="password" v-model="formPassword.makeSurePassword"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" @click="onSubmit">提交</el-button>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                        </el-row>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
  // import AcavatUpload from '@/views/components/avatar-upload/avatarUpload'
  import { mapState, mapActions } from 'vuex'
  import { backendContext } from '../../config'

  export default {
    // components: { AcavatUpload },
    data () {
      const vm = this

      /**
       * 原始密码校验
       */
      function oldPasswordCheck (rule, value, callback) {
        callback()
      }

      /**
       * 密码复杂度校验
       */
      function passwordCheck (rule, value, callback) {
        if (vm.pwdRegName) {
          if (new RegExp(vm.pwdRegName).test(value)) {
            callback()
          } else {
            callback(new Error('密码至少8位，必须包含数字、字母及特殊字符'))
          }
        } else {
          vm.$$utils.axiosRequest(`${backendContext}/sys/user/getPassWordPolicy`, '获取密码校验规则').
            then(result => {
              const { pwdRegName } = result
              vm.pwdRegName = pwdRegName
              if (pwdRegName && new RegExp(pwdRegName).test(value)) {
                callback()
              } else {
                callback(new Error('密码至少8位，必须包含数字、字母及特殊字符'))
              }
            })
        }
      }

      /**
       * 确认密码与新密码相同
       * @param rule
       * @param value
       * @param callback
       */
      function newPasswordConfirmCheck (rule, value, callback) {
        if (value !== vm.formPassword.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }

      return {
        activeName: 'index',
        disabled: true,
        dictMap: {},
        pwdRegName: '',
        user: JSON.parse(JSON.stringify(this.$store.state.userStore.currentUserInfo.user)),
        formPassword: {
          oldPassword: '',
          newPassword: '',
          makeSurePassword: '',
        },
        rules: {
          oldPassword: [
            { required: true, message: '原密码不能为空', trigger: 'blur' },
            { validator: oldPasswordCheck, trigger: 'blur' },
            { validator: passwordCheck, trigger: 'blur' }],
          newPassword: [
            { required: true, message: '新密码不能为空', trigger: 'blur' },
            { validator: passwordCheck, trigger: 'blur' }],
          makeSurePassword: [
            { required: true, message: '请再次输入新密码', trigger: 'blur' },
            { validator: newPasswordConfirmCheck, trigger: 'blur' },
            { validator: passwordCheck, trigger: 'blur' }],
        },
        userDetailRules: {
          email: [
            { required: true, message: '请再次输入新密码', trigger: 'blur' },
            { max: 5, type: 'email', message: '请输入正确的电子邮箱地址', trigger: 'blur' }],
        },
      }
    },
    computed: {
      ...mapState({
        userInfo: state => state.userStore.currentUserInfo,
        userRoles: state => state.roleStore.userRoles,
      }),
      userRoleNames () {
        let roleNames = []
        this.userRoles.forEach(role => roleNames.push(role.roleName))
        return roleNames.join('、')
      },
    },
    methods: {
      ...mapActions([
        'getUserRoles',
      ]),
      onSubmit () {
        const vm = this
        vm.$$utils.direwolfCommonConfirm({
          message: '修改密码后需要重新登录，确定继续吗？',
          title: '重新登录提示',
        }, () => {
          vm.$refs['form'].validate(valid => {
            if (valid) {
              const routerUtils = vm.$$utils.router
              routerUtils.getDefaultKey(vm.userInfo.user.userAccount).then(result => {
                const defaultInfo = result.data || result
                let { oldPassword, newPassword } = vm.formPassword
                vm.$store.dispatch('changePassword', {
                  oldPassword: routerUtils.encryptPassword(oldPassword, defaultInfo),
                  newPassword: routerUtils.encryptPassword(newPassword, defaultInfo),
                  userId: vm.user.id,
                  encSalt: defaultInfo.loginSalt,
                })
              })
              return
            }
            vm.$$utils.direwolfCommonTips('warning', '输入有误，请重新确认后再提交')
          })
        })
      },
      editUserInfo () {
        this.disabled = false
      },
      saveUserInfo () {
        this.disabled = true
        this.$store.dispatch('saveUser', this.user)
      },
    },
    created () {
      const vm = this
      vm.$store.dispatch('getDictByCodes', 'sex_type').then(result => {
        vm.dictMap = result.data
      })
    },
    mounted: function () {
      this.getUserRoles()
    },
  }
</script>
<style lang="scss" scoped="">
    .box-card {
        border-radius: 0;

        .panel-heading {
            display: flex;
            text-align: left;
            width: 100%;
            border-bottom: 1px solid #eeeff1;
            padding: 15px;
            font-weight: bold;

            img {
                margin-right: 15px;
                width: 90px;
                height: 90px;
                border-radius: 50%;
            }

            .title {
                display: flex;
                flex-direction: column;
                justify-content: center;

                .name {
                    color: inherit;
                    font-size: 18px;
                }

                .role {
                    color: inherit;
                }
            }
        }

        .panel-body {
            color: inherit;

            ul {
                .el-row {
                    border-bottom: 1px solid #eeeff1;
                    padding: 0 15px;
                    height: 45px;
                    line-height: 45px;
                }
            }
        }
    }

    .changePassword {
        margin-top: 15px;
    }

    .acavatUpload {
        margin-top: 15px;
    }
</style>