import qs from 'qs'
import axiosRequest from './axiosRequest'
import config from '../configs'
import utils from '@utils'
import store from '@/sys/store'
import adminRouter from '@/admin/router'

const { projectContext, adminContext, tokenKey, publicKey, moduleNames, userKey, roleKey, permissionKey, menuKey, routeKey, menuMapKey, backServerType } = config
const adminPath = adminContext.split('/')[2] || ''
let loginPath = `${adminContext}/login`

/**
 * 所有路由访问前，必须调用此方法进行权限验证和菜单获取
 * 路由测试样例 todo 带参数和以斜杠结尾的需要再测测
 * 未登录：
 * 1. 进入系统http://localhost:8888/direwolf-app/admin，应为登录
 * 2. 进入系统任意匹配http://localhost:8888/direwolf-app/admin/anything，应为带route参数的登录页面
 * 点击登录应跳转至正确的route目标页面，未登录前访问以下地址跳转至登录页后点击登录：
 * 1. 无route参数http://localhost:8888/direwolf-app/admin/应为主页
 * 2. 跳转至内部模块根路由http://localhost:8888/direwolf-app/sub应为内部模块根路由
 * 3. 跳转至内部模块子路由http://localhost:8888/direwolf-app/sub/index应为内部模块子路由
 * 4. 跳转至独立页面（登录判断在public/common-assets/js/common.js 无认证信息）http://localhost:8888/direwolf-app/platman-app/pages/msSecurityStrategyConfigList.html
 * 5. 跳转至管理未知路由http://localhost:8888/direwolf-app/admin/unknown，应为内部404页面
 * 6. 跳转至动态生成的管理界面其他路由http://localhost:8888/direwolf-app/admin/sub/index应为主页面内的其他模块子路由
 * 7. 跳转至内部模块未知路由http://localhost:8888/direwolf-app/sub/unknown，应为内部模块根路由？？（内部模块需定义自己的404）
 * 已登录
 * 1. 访问点击登录上述7个地址，能得到相同的结果
 * @param {object} routerParam 路由参数
 * @param {object} routerParam.to 目标路由
 * @param {object} routerParam.from 起始路由
 * @param {function} routerParam.next 路由回调
 * @param {object} invokeParam 调用方参数
 * @param {object} invokeParam.router 当前Vue实例注入的router实例
 * @param {string} invokeParam.module 当前调用方法的模块名称
 * @param {string} invokeParam.loginUrl 当前调用方法的模块自己的登录界面
 */
function beforeEachRoute ({ to, from, next }, { router, module, loginUrl }) {
	next()
  // const { path: toPath = '', query, meta: { permission } } = to
  // const pathArr = toPath.split('/')
  // const projectName = projectContext.split('/')[1]
  // if (pathArr[1] === projectName) {
  //   // 此处进入系统
  //   console.log(router)
  //   const isRoot = toPath === adminContext || toPath === `${adminContext}/`
  //   const pathModule = pathArr[2]
  //   if (loginUrl) {
  //     loginPath = loginUrl
  //   }
  //   // 未登录
  //   if (!sessionStorage.getItem(tokenKey)) {
  //     // 路由跳转顺序不要改变，否则无法得到正确的结果
  //     // 将原地址作为参数携带，使得登录后直接进入原地址
  //     if (isRoot) {
  //       // 系统根路径跳转到登录页面
  //       next({ path: loginPath, query, replace: true })
  //     } else if (toPath === loginPath) {
  //       // 已在登录页面，继续执行
  //       next()
  //     } else if (moduleNames.indexOf(pathModule) !== -1 && pathModule !== adminPath) {
  //       // 非管理模块，通过根路由进入自己模块的路由，此时路由匹配可能因为不在同一个路由实例而匹配404，因此需要在进404之前执行
  //       window.location.replace(loginPath + '?route=' + toPath)
  //     } else {
  //       // 管理模块的页面或其他在管理路由可以匹配到的页面，直接使用路由跳转
  //       next({ path: loginPath, query: { route: toPath }, replace: true })
  //     }
  //   } else {
  //     // 用户已登录，如果在根路径或者登录页面，则跳转至主页面
  //     if (toPath === loginPath) {
  //       next({ path: `${adminContext}/`, replace: true })
  //     } else {
  //       // 先判断权限加载动态路由，重新判定此路径是否能匹配到，否则都是404
  //       if (permission) {
  //         axiosRequest(utils.getBackServerUrl('checkPermissionUrl'), '校验用户权限', 'GET', { permission }).
  //           then(result => {
  //             // 校验不成功或者校验结果为无权限
  //             if (result.type !== 'success' || !result.data) {
  //               next({ path: `${adminContext}/401`, replace: true })
  //             } else {
  //               // 进入页面
  //               tryToMatchPath({ to, from, next }, { router, module })
  //             }
  //           }).
  //           catch(error => {
  //             if (error.response.status === 401) {
  //               utils.axiosErrorTips(error, '认证失效，请重新登录')
  //               logout()
  //             } else {
  //               utils.axiosErrorTips(error, '校验用户权限失败，无法访问该页面')
  //               // 校验不成功
  //               next({ path: `${adminContext}/500`, replace: true })
  //             }
  //           })
  //       } else {
  //         // 进入页面
  //         tryToMatchPath({ to, from, next }, { router, module })
  //       }
  //     }
  //   }
  // } else {
  //   // 会被导向全匹配404页面
  //   next()
  // }
}

/**
 * 因页面刷新导致菜单数据丢失，从服务器重新获取
 * @param {object} routerParam 路由参数
 * @param {object} routerParam.to 目标路由
 * @param {object} routerParam.from 起始路由
 * @param {function} routerParam.next 路由回调
 * @param {function} routerParam.next 路由回调
 * @param {object} invokeParam 调用方参数
 * @param {object} invokeParam.router 当前Vue实例注入的router实例
 * @param {string} invokeParam.module 当前调用方法的模块名称
 */
let originRoutes = []

function tryToMatchPath ({ to, from, next }, { router, module }) {
  let { path } = to
  const pathArr = path.split('/')
  const pathModule = pathArr[2]
  if (moduleNames.indexOf(pathModule) !== -1) {
    // 内部模块
    if (pathModule === 'admin') {
      // 管理模块判断是否需要从服务端加载菜单
      const { path: toPath, matched, meta: { status: errorStatus = 200 } } = to
      let { menuTree } = store.state.resourceStore
      // 刷新页面导致菜单丢失，重新获取
      if (menuTree.length === 0) {
        restoreMenuAndUser()
        // 从缓存将动态路由重设
        const userRoutes = JSON.parse(sessionStorage.getItem(routeKey))
        generateRouteByInfo(userRoutes)
        // 路由生成后重新匹配目标
        redirectAfterRouteGenerated({ to, from, next })
      } else if (toPath === loginPath) {
        // 将访问登录页面的已登录用户引导至首页面
        next({ path: `${adminContext}/` })
      } else if (!matched || errorStatus === 404) {
        redirectFrom404({ to, from, next }, '')
      } else {
        next()
      }
    } else if (pathModule !== module) {
      window.location.replace(path)
    } else if (pathModule === 'sys') {
      restoreMenuAndUser()
      next()
    } else {
      // 自己的调用
      next()
    }
  } else {
    // 独立页面直接访问
    window.location.replace(path)
  }
}

/**
 * 恢复菜单和用户信息
 */
function restoreMenuAndUser () {
  const userStr = sessionStorage.getItem(userKey)
  const menuStr = sessionStorage.getItem(menuKey)
  if (userStr && menuStr) {
    // 从缓存将用户权限信息重设回变量
    store.commit('setCurrentUserInfo', {
      user: JSON.parse(userStr),
      roles: sessionStorage.getItem(roleKey).split(','),
      permissions: sessionStorage.getItem(permissionKey).split(','),
    })
    // 从缓存将菜单信息重设回变量
    const userMenu = JSON.parse(menuStr)
    store.commit('setMenuTree', userMenu)
    const menuMap = JSON.parse(sessionStorage.getItem(menuMapKey))
    store.commit('setMenuMap', menuMap)
  } else {
    // 无用户信息，退出重新登录
    utils.direwolfCommonTips('error', '未能获取到用户及菜单信息，请重新登录')
    setTimeout(logout, 2000)
  }
}

/**
 * 根据信息生成动态路由
 * @param userRoutes
 */
function generateRouteByInfo (userRoutes) {
  let mainView = adminRouter.options.routes[1]
  // 防止重复添加
  if (originRoutes.length === 0) {
    originRoutes = [...mainView.children]
  }
  let routerArr = [...originRoutes]
  userRoutes.forEach(({ path, pageDirection, title, url, permission, id }) => {
    routerArr.unshift({
      path,
      component: () => import(`@components/${pageDirection}`),
      meta: { title, url, permission, id },
    })
  })
  routerArr.push({
    path: `${adminContext}/*`,
    meta: {
      status: 404,
      title: '指定资源不存在',
    },
    component: (resolve) => require(['@components/ErrorPage.vue'], resolve),
  })
  // 重新组装路由列表
  adminRouter.options.routes.splice(1, 1, { ...mainView, children: routerArr })
  adminRouter.addRoutes(adminRouter.options.routes)
}

/**
 * 首次匹配404可能是因为路由还没刷新或者没进入到对应的路由实例，再给一次机会
 * @param {object} routerParam 路由参数
 * @param {object} routerParam.to 目标路由
 * @param {object} routerParam.from 起始路由
 * @param {function} routerParam.next 路由回调
 * @param flag 仅在菜单刚初始化时给第二次机会
 */
function redirectFrom404 ({ to: { path, query }, from: { path: fromPath }, next }, flag) {
  const pathArr = path.split('/')
  const pathModule = pathArr[2]
  if (moduleNames.indexOf(pathModule) !== -1 && pathModule !== adminPath) {
    // 工程内部其他模块，若调用地址不是在自己的模块范围内，则通过根路由重新跳转，否则无法到达
    let target = pathArr.slice(0, 3).join('/')
    const subPath = pathArr.slice(3).join('/')
    if (subPath) {
      target += `?route=/${subPath}`
    }
    window.location.replace(target)
  } else if (moduleNames.indexOf(pathModule) === -1) {
    // 尝试是否为非工程内部模块，直接跳转至目标，不会再进入路由
    if (!query.redirect) {
      window.location.replace(`${path}?redirect=1`)
    } else {
      // 结果第二次进入路由，表示是异常页面，直接进404
      next()
    }
  } else if (pathModule === adminPath && flag === 'menuInitialed') {
    next({ path, replace: true })
  } else {
    next()
  }
}

/**
 * 菜单初始化成功后，重新匹配路由
 * @param {object} routerParam 路由参数
 * @param {object} routerParam.to 目标路由
 * @param {object} routerParam.from 起始路由
 * @param {function} routerParam.next 路由回调
 */
function redirectAfterRouteGenerated ({ to, from, next }) {
  // 获取成功，将用户引导至原始页面
  let { path, matched, query: { route }, meta: { status = 200, redirect } } = to
  const target = { path, replace: true, meta: { redirect: false } }
  if (matched.length === 0 && !redirect) {
    // 未匹配成功，可能是路由未更新或有目标参数，刷新路由尝试
    if (route) {
      // 防止出现两个斜杠并列
      if (path.endsWith('/') && route.startsWith('/')) {
        route = route.substr(1, route.length)
      }
      // 跳转到目标地址
      target.path += route
    } else {
      target.meta.redirect = true
    }
    next(target)
  } else if (status === 404) {
    redirectFrom404({ to, from, next }, 'menuInitialed')
  } else if (matched.length > 0) {
    // 匹配成功
    next()
  } else {
    // 重新匹配仍未成功，404
    target.path = `${adminContext}/404`
    next(target)
  }
}

/**
 * 登录
 * @param vueInstance 页面实例
 * @param info 登录信息
 * @param pageUrl 成功跳转地址
 */
function login (vueInstance, info, pageUrl) {
  const { username } = info
  vueInstance.loginLoading = true
  vueInstance.loginStep = '加密信息...'
  getDefaultKey(username).then(result => {
    const defaultInfo = result.data || result
    vueInstance.loginStep = '提交信息...'
    submitLogin(info, defaultInfo).then(result => {
      // msa特有字段，成功后将TOKEN放入缓存
      if (result.access_token) {
        sessionStorage.setItem(tokenKey, result.access_token)
        // 获取用户信息
        vueInstance.loginStep = '获取用户权限...'
        store.dispatch('getUserInfo').then(() => initUserMenu(vueInstance, pageUrl))
      } else if (result.type === 'success') {
        // soa登录成功
        const info = result.data
        sessionStorage.setItem(tokenKey, info.loginToken)
        sessionStorage.setItem(publicKey, info.key)
        // soa会返回部分用户信息，暂时用这么多，若需要其他字段，则仍旧去调用getUserInfo即可
        store.dispatch('setUserInfo', {
          user: {
            id: info.userid,
            userAccount: info.useraccount,
            hrCode: info.hrCode,
            orgId: info.orgId,
            orgName: info.orgName,
          },
          permissions: info.permissionCodes,
          roles: info.roleCodes,
        }).then(() => initUserMenu(vueInstance, pageUrl))
      } else {
        utils.direwolfCommonTips('error', '获取用户认证信息失败')
      }
    }).catch(error => {
      vueInstance.loginLoading = false
      // 认证失败，提示用户重新输入
      if (error.response && error.response.data) {
        const { msg, message, error_description } = error.response.data
        if (msg === 'Bad credentials') {
          utils.axiosErrorTips(error, '账户不存在或密码错误')
        } else if (error_description) {
          utils.axiosErrorTips(error, error_description)
        } else if (msg || message) {
          utils.axiosErrorTips(error, msg || message)
        } else {
          utils.axiosErrorTips(error, `登录失败，服务器内部错误`)
        }
      } else if (error.message.indexOf('timeout') !== -1) {
        utils.axiosErrorTips(error, `登录失败，服务器响应超时`)
      } else if (error.message.indexOf('返回信息') !== -1) {
        utils.axiosErrorTips(error, error.message)
      } else {
        // 其他异常信息，开发人员可在控制台查看错误堆栈
        utils.axiosErrorTips(error, '登录异常')
      }
      vueInstance.refreshCodeImgSrc()
    })
  }).catch(() => vueInstance.loginLoading = false)
}

/**
 * 根据用户账号获取登录必要信息
 * @param userName 用户账号
 * @returns {*}
 */
function getDefaultKey (userName) {
  let url = utils.getBackServerUrl('keyUrl')
  let method = 'GET'
  if (backServerType === 'soa') {
    url += userName
    method = 'POST'
  }
  return axiosRequest(url, '获取登录必要信息', method)
}

/**
 * 提交登录信息
 * @param info 登录信息
 * @param defaultInfo 登录必要信息
 * @returns {*}
 */
function submitLogin (info, defaultInfo) {
  const loginUrl = utils.getBackServerUrl('loginUrl')
  const submitInfo = {
    ...info,
    ...encryptPassword(info.password, defaultInfo),
  }
  if (backServerType === 'soa') {
    return utils.axiosRequest(loginUrl, '登录', 'POST', qs.stringify({
      ...submitInfo,
      loginSalt: defaultInfo.loginSalt,
    }), {
      headers: { 'content-type': 'application/x-www-form-urlencoded', stateless: 'yes' },
    })
  } else {
    // 向后台请求认证TOKEN
    return utils.axiosRequest(loginUrl, '登录', 'GET', {
      ...submitInfo,
      grant_type: 'password',
      scope: 'server',
    }, {
      headers: {
        'Authorization': 'Basic c3lzOnN5cw==',
      },
    })
  }
}

/**
 * 密码加密
 * @param plainPassword 用户填写密码
 * @param defaultInfo 加密依据
 * @returns {*}
 */
function encryptPassword (plainPassword, defaultInfo) {
  const { loginSalt: salt, key: encryptKey, iv: encryptIV, salt: userSalt } = defaultInfo
  const aes = new AesUtil()
  // 后台获取的加密参数本身是被加密的
  const key = aes.aesDecrypt(encryptKey, salt, salt)
  const iv = aes.aesDecrypt(encryptIV, salt, salt)
  let result = {}
  let digest
  // soa会有用户盐，msa采用Bcrypt加密，不会返回用户盐字段
  if (userSalt) {
    const plainSalt = aes.aesDecrypt(userSalt, salt, salt)
    digest = CryptoJS.HmacSHA256(plainPassword, plainSalt)
  } else {
    // msa后台要用到明文，所以不能取摘要
    digest = CryptoJS.enc.Utf8.parse(plainPassword)
  }
  const hashInBaseHex = CryptoJS.enc.Hex.stringify(digest)
  const encodePwd = aes.aesEncrypt(hashInBaseHex, key, iv)
  const encodePwdE = aes.aesEncrypt(encodePwd, salt, salt)
  const hashDigest = CryptoJS.HmacSHA256(encodePwdE, salt)
  // 取最终摘要防篡改
  result['digest'] = CryptoJS.enc.Hex.stringify(hashDigest)
  // msa需要将随机盐传到后台来解密
  result['extraInfo'] = userSalt || aes.aesEncrypt(salt, key, iv)
  result['password'] = encodePwdE
  return result
}

/**
 * 初始化用户菜单
 * @param vueInstance
 * @param pageUrl
 */
function initUserMenu (vueInstance, pageUrl) {
  // 获取用户菜单，以控制用户可访问的页面
  vueInstance.loginStep = '获取用户菜单...'
  store.dispatch('initUserMenu').then(() => {
    const { route } = vueInstance.$route.query
    vueInstance.$router.push({ path: route || pageUrl || `${adminContext}/` })
  })
}

/**
 * 登出系统
 */
function logout () {
  const url = utils.getBackServerUrl('logoutUrl')
  // 单体应用调用退出方法
  if (backServerType === 'soa') {
    axiosRequest(url, '退出登录', 'POST')
  } else {
    axiosRequest(url, '退出登录', 'GET', null, {
      headers: {
        Authorization: sessionStorage.getItem(tokenKey),
      },
    })
  }
  // 触发清除事件，将其他页签登录页面同时退出
  localStorage.setItem('clearSessionStorage', loginPath)
  // 退出当前页签
  sessionStorage.clear()
  window.location.replace(loginPath)
}

/**
 * 根据菜单类型返回菜单路由地址
 * @param menu
 */
function getRouteInfoByMenu (menu) {
  const { menuType, target } = menu
  let pageDirection, path = '', url = ''
  let targetFix = ''
  if (target) {
    targetFix = target
    if (target.startsWith('/')) {
      targetFix = target.substr(1, target.length)
    }
  } else {
    targetFix = `$$blank/${Math.ceil(Math.random() * 1e10)}`
  }
  switch (menuType) {
    case '02':
      path = `${adminContext}/${targetFix}`
      url = `${projectContext}/${targetFix}`
      pageDirection = target ? 'IFramePage.vue' : 'Blank.vue'
      break
    case '03':
      path = `${adminContext}/${targetFix}`
      url = `${projectContext}/${targetFix}`
      pageDirection = target ? 'IFramePage.vue' : 'Blank.vue'
      break
    case '04':
      path = target ? `${adminContext}/${target.split('://')[1]}` : `${adminContext}/404`
      url = target
      pageDirection = target ? 'IFramePage.vue' : 'ErrorPage.vue'
      break
    default:
      path = `${adminContext}/${targetFix}?status=500`
      pageDirection = 'ErrorPage.vue'
      break
  }
  return { pageDirection, path: path.split('?')[0], url }
}

export default {
  beforeEachRoute,
  encryptPassword,
  getDefaultKey,
  generateRouteByInfo,
  getRouteInfoByMenu,
  login,
  logout,
}