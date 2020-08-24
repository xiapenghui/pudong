<template>
	<div class="login">
		<div class="login-form">
			<div class="login-form-tail"></div>
			<div class="login-form-tail"></div>
			<div class="login-form-tail"></div>
			<div class="login-form-tail"></div>
			<div class="login-header">
				<!-- <p>智能主动安全防护系统</p> -->
				<p>全景智慧电力物联系统</p>
			</div>
			<el-form ref="loginForm" :model="formEntity" label-width="20%" :rules="rules">
				<el-form-item label="用户名:" prop="username"><el-input placeholder="请输入用户名" v-model="formEntity.username"></el-input></el-form-item>
				<el-form-item label="密码:" prop="password">
					<el-input placeholder="请输入密码" v-model="formEntity.password" type="password" @keyup.native.enter="handlePasswordEnter"></el-input>
				</el-form-item>
				<el-form-item prop="code" v-if="showValidateCode">
					<el-input placeholder="请输入验证码" v-model="formEntity.code" @keyup.native.enter="handleCodeEnter">
						<span slot="suffix" style="margin-top:3px;display: inline-block">
							<img ref="codeImg" alt="获取失败" :src="newCodeImgSrc" class="login-code-img" @click="refreshCodeImgSrc" />
						</span>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" :loading="loginLoading" style="width: 85%;" @click.native="login">{{ loginLoading ? loginInfo : '登录' }}</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';
export default {
	name: 'bigScreenLogin',
	data() {
		const vm = this;

		function checkCode(rules, value, callback) {
			if (!value && vm.showValidateCode) {
				callback(new Error('验证码不能为空'));
			} else {
				callback();
			}
		}

		return {
			loginStep: '登录',
			formEntity: {
				username: '',
				password: '',
				remember: false,
				/**
				 * 验证码
				 */
				code: '',
				/**
				 * 验证码版本
				 */
				randomStr: ''
			},
			/**
			 * 登录提交状态，防止重复点击
			 */
			pageLoading: false,
			/**
			 * 登录提交状态，防止重复点击
			 */
			loginLoading: false,
			/**
			 * 是否启用验证码
			 */
			showValidateCode: false,
			/**
			 * 验证码地址
			 */
			codeImgSrc: `${axios.defaults.baseURL}/code?randomStr=`,
			/**
			 * 加密信息
			 */
			defaultInfo: {},
			/**
			 * 校验规则
			 */
			rules: {
				username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
				password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
				code: [{ validator: checkCode, trigger: 'blur' }]
			}
		};
	},
	computed: {
		...mapState({
			menuTree: state => state.resourceStore.menuTree,
			userInfo: state => state.userStore.currentUserInfo
		}),
		loginInfo() {
			return this.loginStep || '登录';
		},
		newCodeImgSrc() {
			return this.getCodeSrc();
		}
	},
	methods: {
		/**
		 * 按回车或者点击登录按钮
		 */
		login() {
			let vm = this;
			// 输入内容校验
			vm.$refs['loginForm'].validate(valid => {
				console.log(this.$$config);

				if (valid) {
					vm.$$utils.router.login(vm, vm.formEntity, this.$$config.projectContext + '/bigScreen/index');
				} else {
					// 校验失败取消提交状态，使用户可以重新点击提交
					vm.loginLoading = false;
					return false;
				}
			});
		},
		/**
		 * 使用时间串获取新的验证码
		 */
		getCodeSrc() {
			const str = Date.now();
			this.formEntity.randomStr = str;
			return `${this.codeImgSrc}${str}`;
		},
		/**
		 * 刷新验证码
		 */
		refreshCodeImgSrc() {
			if (this.showValidateCode) {
				this.$refs['codeImg'].src = this.getCodeSrc();
				this.formEntity.code = '';
			}
		},
		/**
		 * 密码输入框敲击回车事件
		 */
		handlePasswordEnter() {
			// 若没有验证码则直接提交，否则无视
			if (!this.showValidateCode) {
				this.login();
			}
		},
		/**
		 * 验证码输入框敲击回车事件
		 */
		handleCodeEnter() {
			this.login();
		}
	},
	created: function() {
		const vm = this;
		vm.pageLoading = true;
		// 请求所有字典，全部请求返回后再继续加载页面
		vm.$$utils.axiosRequest(vm.$$utils.getBackServerUrl('getEnableJcaptcha'), '获取系统配置').then(result => {
			if (result.type === 'success') {
				vm.showValidateCode = result.data.sysParamValue === 'true';
				vm.pageLoading = false;
			}
		});
	}
};

// export default {
//   name: 'BigScreenLogin',
//   data () {
//     return {
//
//       entity: {
//         username: 'admin',
//         password: 'admin',
//       },
//
//       rules: {
//         username: [
//           { required: true, message: '用户名不能为空', trigger: 'blur' },
//         ],
//         password: [
//           { required: true, message: '密码不能为空', trigger: 'blur' },
//         ],
//       },
//
//     }
//   },
//   methods: {
//     login () {
//       this.$$utils.router.login(this, this.entity, `${this.$$config.projectContext}/bigScreen/index`)
//     },
//   },
// }
</script>

<style lang="scss">
@import 'Login';
</style>
