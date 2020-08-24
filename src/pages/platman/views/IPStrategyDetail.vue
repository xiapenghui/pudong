<template>
    <el-form class="with-border" ref="IPStrategyForm" label-position="right" size="small" label-width="100px"
             :model="entity" :rules="rules">
        <el-row type="flex" justify="center">
            <el-col :span="12">
                <el-form-item prop="beginIP" label="起始IP">
                    <el-input placeholder="请输入起始IP" v-model="entity.beginIP"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item prop="endIP" label="结束IP">
                    <el-input placeholder="请输入结束IP" v-model="entity.endIP"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center">
            <el-col :span="12">
                <el-form-item prop="beginTime" label="开始时间">
                    <el-time-picker :append-to-body="false" v-model="entity.beginTime"
                                    placeholder="请选择开始时间" value-format="HH:mm:ss"></el-time-picker>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item prop="endTime" label="结束时间">
                    <el-time-picker :append-to-body="false" v-model="entity.endTime"
                                    placeholder="请选择结束时间" value-format="HH:mm:ss"></el-time-picker>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
  export default {
    name: 'IPStrategyForm',
    props: {
      /**
       * 页面编辑类型
       */
      editType: {
        default: 'view',
      },
      /**
       * 网关路由配置ID
       */
      configId: String,
      /**
       * 策略类型
       */
      type: String,
      /**
       * 数据
       */
      data: Object,
    },
    data () {
      const vm = this

      /**
       * 结束IP需要大于等于起始IP
       * @param rule
       * @param value
       * @param callback
       */
      function compareToBeginIP (rule, value, callback) {
        // 移除掩码后按点分隔
        const beginIPArr = vm.entity.beginIP.split('/')[0].split('.')
        const endIPArr = value.split('/')[0].split('.')
        let error = false
        for (let i = 0; i < 4; i++) {
          const begin = Number(beginIPArr[i])
          const end = Number(endIPArr[i])
          // 若相等则继续判断，否则起始大于小于结束都能得到最终结果
          if (begin !== end) {
            error = begin > end
            break
          }
        }
        if (error) {
          callback(new Error('结束IP必须大于起始IP'))
        } else {
          callback()
        }
      }

      function compareToBeginTime (rule, value, callback) {
        if (value < vm.entity.beginTime) {
          callback(new Error('结束时间必须大于开始时间'))
        } else {
          callback()
        }
      }

      return {
        entity: {
          type: vm.type,
          beginIP: '',
          endIP: '',
          beginTime: '',
          endTime: '',
          routeConfigId: vm.configId,
        },
        /**
         * 校验规则，对应页面el-form-item的prop属性值
         */
        rules: {
          beginIP: [
            { required: true, message: '起始IP地址不能为空', trigger: 'blur' },
            { validator: this.$$utils.validator.checkIPv4, name: '起始IP地址', trigger: 'blur' },
          ],
          endIP: [
            { required: true, message: '结束IP地址不能为空', trigger: 'blur' },
            { validator: this.$$utils.validator.checkIPv4, name: '结束IP地址', trigger: 'blur' },
            { validator: compareToBeginIP, trigger: 'blur' },
          ],
          endTime: [
            { validator: compareToBeginTime, trigger: 'blur' },
          ],
        },
      }
    },
    methods: {
      saveConfig (callback) {
        const vm = this
        vm.$refs['IPStrategyForm'].validate(function (valid) {
          if (valid) {
            callback(vm.entity)
          } else {
            vm.$$utils.direwolfCommonTips('error', '内容填写有误，请修改后再提交')
          }
        })
      },
    },
    created: function () {
      const vm = this
      if (vm.data) {
        vm.entity = vm.data
      }
    },
  }
</script>

<style scoped>

</style>