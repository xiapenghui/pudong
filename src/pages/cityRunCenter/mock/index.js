import Mock from 'mockjs'
import stationAPI from './station'
// 设置全局延时 没有延时的话有时候会检测不到数据变化 建议保留
Mock.setup({
  timeout: '300-600'
})

// Mock.mock(/\/auth\/oauth\/token/, 'get', loginAPI.getToken)

export default Mock
