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
  getStationList: config => {
    const { offset = 0, limit = 5, orderBy, name } = utils.getQueryObject(config.url)

    const mockList = List.filter(station => !(name && station.name.indexOf(name) === -1))

    const pageList = mockList.filter((item, index) => index < offset + limit && index >= offset)

    return {
      type: 0,
      message: '获取电站列表成功',
      data: {
        page: {
          offset,
          limit,
          count: mockList.length,
          orderBy,
          list: pageList,
        },
      },
    }
  },
}
