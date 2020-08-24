const { adminPath, gatewayRoute } = JSON.parse(sysServiceConfig)
// 认证服务网关路由地址
const { gatewayRoute: authGatewayRoute } = JSON.parse(authServiceConfig)

export const backendContext = `${gatewayRoute}${adminPath}`

export default {
  adminPath,
  gatewayRoute,
  msaUrl: {
    keyUrl: `${gatewayRoute}/common/getDefaultKey`,
    loginUrl: `${authGatewayRoute}/oauth/token`,
    logoutUrl: `${authGatewayRoute}/oauth/logout`,
    // 此处/sys是后端内部路径，不是网关路径
    menuUrl: `${backendContext}/sys/resource/getCurUserMenu?appId=1`,
    checkPermissionUrl: `${gatewayRoute}/user/checkPermission`,
    getEnableJcaptcha: `${gatewayRoute}/common/getEnableJcaptcha`,
  },
  soaUrl: {
    // 注意此处的path第一部分没有意义，在向后端重定向后将被直接移除，其他所有单体请求均是如此
    keyUrl: `/useless/common/getUserSalt?userName=`,
    loginUrl: `/useless/a/login`,
    logoutUrl: `/useless/logout`,
    menuUrl: `${backendContext}/sys/menu/menus_v2?appId=1`,
    checkPermissionUrl: `/useless/user/checkPermission`,
    getEnableJcaptcha: `/useless/common/getEnableJcaptcha`,
  },
}