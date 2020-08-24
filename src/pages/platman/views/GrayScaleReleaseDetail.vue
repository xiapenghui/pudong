<template>
    <el-form class="with-border" ref="grayScaleReleaseForm" label-position="right" size="small" label-width="100px"
             :model="entity" :rules="rules">
        <el-row type="flex" justify="center">
            <el-col>
                <el-form-item prop="uri" label="地址">
                    <el-input placeholder="请输入版本地址" v-model="entity.uri"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center">
            <el-col>
                <el-form-item prop="weight" label="权重">
                    <el-input placeholder="请输入地址权重" v-model="entity.weight"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
  export default {
    name: 'grayScaleReleaseForm',
    props: {
      remainingWeight: {
        type: Number,
        default: 100,
      },
    },
    data () {
      const vm = this

      function checkRemainingWeight (rule, value, callback) {
        if (value > vm.remainingWeight) {
          callback(new Error('所有权重之和不得超过100'))
        } else {
          callback()
        }
      }

      return {
        entity: {
          uri: '',
          weight: '',
        },
        /**
         * 校验规则，对应页面el-form-item的prop属性值
         */
        rules: {
          uri: [
            { required: true, message: '地址不能为空', trigger: 'blur' },
            { max: 100, message: '长度不能超过 100 个字符', trigger: 'blur' },
            { validator: this.$$utils.validator.checkURL, name: '地址', trigger: 'blur' },
          ],
          weight: [
            { required: true, message: '权重不能为空', trigger: 'blur' },
            { validator: checkRemainingWeight, trigger: 'blur' },
          ],
        },
      }
    },
    computed: {},
    methods: {
      checkInput (callback) {
        const vm = this
        vm.$refs['grayScaleReleaseForm'].validate(function (valid) {
          if (valid) {
            typeof callback === 'function' && callback()
          } else {
            vm.$$utils.direwolfCommonTips('error', '内容填写有误，请修改后再提交')
          }
        })
      },
    },
    created () {
    },
  }
</script>

<style scoped>

</style>