import config from '@configs'

export default {
  /**
   * 将用户保存到缓存
   * @param user
   */
  saveUserToSession (user) {
    // 删除密码相关字段
    delete user.digest
    delete user.salt
    delete user.password
    // 缓存用户信息
    sessionStorage.setItem(config.userKey, JSON.stringify(user))
  },
}
