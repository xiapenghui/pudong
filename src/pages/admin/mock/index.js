import Mock from 'mockjs'
import commonAPI from './common'

// 设置全局延时 没有延时的话有时候会检测不到数据变化 建议保留
Mock.setup({
  timeout: '300-600'
})

// soa模拟
Mock.mock(/\/sys\/common\/getUserSalt/, 'post', commonAPI.getUserSalt)
Mock.mock(/\/auth\/a\/login/, 'post', commonAPI.login)
Mock.mock(/\/a\/sys\/menu\/menus_v2/, 'get', commonAPI.getMenu)
Mock.mock(/\/sys\/user\/checkPermission/, 'get', commonAPI.checkPermission)
Mock.mock(/\/getJWTToken/, 'get', commonAPI.getJWTToken)
Mock.mock(/\/a\/sys\/sysParam\/getParamsByCodeStr/, 'get', commonAPI.getParamsByCodeStr)
Mock.mock(/\/a\/sys\/role\/getUserRoles/, 'get', commonAPI.getUserRoles)
// msa模拟
Mock.mock(/\/sys\/common\/getDefaultKey/, 'get', commonAPI.getDefaultKey)
Mock.mock(/\/sys\/common\/getEnableJcaptcha/, 'get', commonAPI.getEnableJcaptcha)
Mock.mock(/\/auth\/oauth\/token/, 'get', commonAPI.getAuthToken)
Mock.mock(/\/sys\/user\/info/, 'get', commonAPI.getUserInfo)
Mock.mock(/\/sys\/a\/sys\/resource\/getCurUserMenu/, 'get', commonAPI.getMenu)

export default Mock
