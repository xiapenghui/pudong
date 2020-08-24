import config from '../configs'

let userWsInfo = {}

/**
 * 初始化跟用户相关的Websocket频道
 */
function initUserWs () {
  const user = JSON.parse(sessionStorage.getItem(config.userKey))

  userWsInfo[`/user/${user.userAccount}/topic/info`] = (utils, message) => {
    utils.direwolfCommonTips('warning', message.body)
  }

  userWsInfo[`/user/${user.userAccount}/queue/info`] = (utils, message) => {
    utils.direwolfCommonTips('warning', message.body)
  }

    /**
     * 管理员强制用户退出
     * @param utils
     * @param message
     */
    userWsInfo[`/user/${user.userAccount}/kickout`] = (utils, message) => {
        utils.direwolfCommonTips('warning', message.body)
        //TODO 调用logout退出
    }
}

export default {
  initUserWs,
  /**
   * 监听频道集合
   */
  topicSet: () => {
    return {
      /**
       * 系统通知
       * @param utils
       * @param message
       */
      '/topic/notice': (utils, message) => {
        utils.direwolfCommonTips('warning', message.body)
      },

      ...userWsInfo,
    }
  },
}