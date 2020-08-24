import Mock from 'mockjs'
import utils from '@utils'

let List = []
const count = 60

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.ctitle(),
    addr: Mock.mock('@county(true)'),
  }))
}

export default {
  getUserSalt: config => {
    const { userName } = utils.getQueryObject(config.url)
    return {
      data: {
        loginSalt: '12345678',
        key: 'coJ9zRhWPBN7WZd5m7+fiw==',
        iv: 'coJ9zRhWPBN7WZd5m7+fiw==',
        salt: 'dl72bkEPFXVCUq0hKzV5Pg==',
      },
      type: 'success',
    }
  },
  login: config => {
    return {
      data: {
        loginToken: '12312312',
        key: 'adfadsfa',
        userName: '开发账号',
        userid: '1',
        useraccount: 'dev',
        hrCode: null,
        orgId: '1',
        orgName: '上海浦东电力公司',
        permissionCodes: ['*'],
        roleCodes: ['-1'],
      },
      type: 'success',
    }
  },
  checkPermission: config => {
    return {
      data: true,
      type: 'success',
    }
  },
  getParamsByCodeStr: config => {
    return {
      data: [
        {
          paramCode: '01',
          paramName: '呵呵',
        }],
      type: 'success',
    }
  },
  getUserRoles: config => {
    return {
      data: [
        {
          roleName: '开发账号',
        }],
      type: 'success',
    }
  },
  getDefaultKey: config => {
    const { userName } = utils.getQueryObject(config.url)
    return {
      data: {
        iv: 'HjyB/cO9NwI2PuEHxWjzYA==',
        key: 'P5T2bo9fjjMuSnCiNvT7Lw==',
        loginSalt: '32740f890a056833',
      },
      type: 'success',
    }
  },
  getEnableJcaptcha: config => {
    const { userName } = utils.getQueryObject(config.url)
    return {
      'type': 'success',
      'message': '获取系统配置成功',
      'data': {
        'id': 'JCAPTCHA_ENABLE',
        'createUserId': null,
        'modifyUserId': null,
        'createTime': null,
        'modifyTime': null,
        'lockVersion': 0,
        'isNewRecord': false,
        'sysParamCode': 'JCAPTCHA_ENABLE',
        'sysParamValue': 'false',
        'sysParamExt': '1',
        'sysParamDesc': '是否启用验证码，true表示启用，false表示不启用',
        'appId': '1',
        'application': 'direwolf-auth',
        'profile': 'dev',
        'label': 'master',
      },
      'redirect': null,
    }
  },
  getAuthToken: config => {
    return {
      'access_token': '1331dae1-3220-4f2d-b8d6-95f829f649b7',
      'token_type': 'bearer',
      'refresh_token': 'eed99ad9-4bc2-4bf5-b902-2d0e3df7fba7',
      'expires_in': 34809,
      'scope': 'server',
      'license': 'copyright by Direwolf@shineenergy.com',
    }
  },
  getJWTToken: config => {
    return {
      data: '123123123',
      type: 'success',
    }
  },
  getUserInfo: config => {
    return {
      'msg': 'success', 'code': 0, 'data': {
        'user': {
          'id': '01c578152b474d719c7b7ec7c69dcsdc',
          'createUserId': null,
          'modifyUserId': null,
          'createTime': '2018-03-26 13:51:03',
          'modifyTime': null,
          'lockVersion': 0,
          'isNewRecord': false,
          'userAccount': 'admin',
          'userName': 'admin',
          'nickName': 'admin',
          'email': 'admin@126.com',
          'mobile': '13423977682',
          'empNo': null,
          'userStatus': '1',
          'strUserStatus': null,
          'userType': '1',
          'photo': null,
          'qrcode': '2018-2-2-10:0:37',
          'limitTime': '2017-11-16 08:53:41',
          'orgId': '5dbc21481a9346e58d46182825325be5',
          'orgName': '上海电力',
          'sex': '0',
          'enTimeLimit': '1',
          'bgTime': null,
          'edTime': null,
          'lastLoginIp': '127.0.0.1',
          'limitIp': null,
          'pwdChgTime': '2019-04-03 17:32:27',
          'lastLoginTime': '2019-04-11 10:01:50',
          'strLastLoginTime': null,
          'identityCode': '330424201701010001',
          'hrCode': null,
          'userHeadImg': null,
          'bgTimeFormater': '',
          'edTimeFormater': '',
        }, 'permissions': ['*'], 'roles': ['11'],
      },
    }
  },
  getMenu: config => {
    return [
      {
        'id': 'f482e2ea5eda4e57840b4e8a82880d0e',
        'isNewRecord': false,
        'resName': '示例菜单',
        'resType': '1',
        'menuIcon': 'fa-key',
        'useTag': '1',
        'permission': 'sys:*',
        'parentId': '0',
        'parentIds': '0',
        'menuOrder': 1,
        'appId': '1',
        'createTime': '2017-07-20 15:56:53',
        'target': null,
        'parentResName': null,
        'appName': 'direwolf-app',
        'menuType': '02',
        'resCode': '1',
        'visiable': '1',
      },
      {
        'id': '25b6f9aeca814f75b168269f6c2e66df',
        'isNewRecord': false,
        'resName': '测试模块',
        'resType': '1',
        'menuIcon': 'fa-th-large',
        'useTag': '1',
        'permission': 'sys:resource:*',
        'parentId': 'f482e2ea5eda4e57840b4e8a82880d0e',
        'parentIds': '0,f482e2ea5eda4e57840b4e8a82880d0e',
        'menuOrder': 2,
        'appId': '1',
        'createTime': null,
        'target': '/sub',
        'menuType': '02',
        'parentResName': '示例菜单',
        'appName': 'direwolf-app',
        'resCode': '1',
        'visiable': '1',
      }]
  },
}
