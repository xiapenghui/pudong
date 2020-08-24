/** 定义公共方法 **/
// import Global from './Global'
// import commonUtils from './commonUtils'
// import server from '../api/server/index'
// import trackUtils from './trackUtils'
// import wrjConfig from '../components/config/wrjConfig'
// import bdztAPI from '../api/server/modules/bdztAPI'
// import dyjkConfig from '../components/config/dyjkConfig'
import MapControl from './MapControl'
import SearchControl from './SearchControl'

let markerCircle = {}
let mapItemStore = {
  markerCache: {},
  infoBoxCache: {},
  lineCache: {},
  gxzdLineCache: {},
}

let tipLabel = new BMap.Label('未设置名称', { offset: new BMap.Size(20, -10) })
tipLabel.setStyle({
  color: '#fff',
  fontSize: '32px',
  backgroundColor: 'rgba(11,73,132,.7)',
  border: '0',
  padding: '20px',
})

// 坐标转换常量
const pi = 3.14159265358979324
const a = 6378245.0
const ee = 0.00669342162296594323
const x_pi = 3.14159265358979324 * 3000.0 / 180.0

//世界大地坐标转为百度坐标
function wgs2bd (lat, lon) {
  const wgs2gcjR = wgs2gcj(lat, lon)
  return gcj2bd(wgs2gcjR[0], wgs2gcjR[1])
}

function gcj2bd (lat, lon) {
  const x = lon, y = lat
  const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi)
  const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi)
  const bd_lon = z * Math.cos(theta) + 0.0065
  const bd_lat = z * Math.sin(theta) + 0.006
  let result = []
  result.push(bd_lat)
  result.push(bd_lon)
  return result
}

function bd2gcj (lat, lon) {
  const x = lon - 0.0065, y = lat - 0.006
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi)
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi)
  const gg_lon = z * Math.cos(theta)
  const gg_lat = z * Math.sin(theta)
  let result = []
  result.push(gg_lat)
  result.push(gg_lon)
  return result
}

function wgs2gcj (lat, lon) {
  let dLat = transformLat(lon - 105.0, lat - 35.0)
  let dLon = transformLon(lon - 105.0, lat - 35.0)
  const radLat = lat / 180.0 * pi
  let magic = Math.sin(radLat)
  magic = 1 - ee * magic * magic
  const sqrtMagic = Math.sqrt(magic)
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi)
  dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi)
  const mgLat = lat + dLat
  const mgLon = lon + dLon
  let result = []
  result.push(mgLat)
  result.push(mgLon)
  return result
}

function transformLat (lat, lon) {
  let ret = -100.0 + 2.0 * lat + 3.0 * lon + 0.2 * lon * lon + 0.1 * lat * lon +
    0.2 * Math.sqrt(Math.abs(lat))
  ret += (20.0 * Math.sin(6.0 * lat * pi) + 20.0 * Math.sin(2.0 * lat * pi)) *
    2.0 / 3.0
  ret += (20.0 * Math.sin(lon * pi) + 40.0 * Math.sin(lon / 3.0 * pi)) * 2.0 /
    3.0
  ret += (160.0 * Math.sin(lon / 12.0 * pi) + 320 * Math.sin(lon * pi / 30.0)) *
    2.0 / 3.0
  return ret
}

function transformLon (lat, lon) {
  let ret = 300.0 + lat + 2.0 * lon + 0.1 * lat * lat + 0.1 * lat * lon + 0.1 *
    Math.sqrt(Math.abs(lat))
  ret += (20.0 * Math.sin(6.0 * lat * pi) + 20.0 * Math.sin(2.0 * lat * pi)) *
    2.0 / 3.0
  ret += (20.0 * Math.sin(lat * pi) + 40.0 * Math.sin(lat / 3.0 * pi)) * 2.0 /
    3.0
  ret += (150.0 * Math.sin(lat / 12.0 * pi) + 300.0 *
    Math.sin(lat / 30.0 * pi)) * 2.0 / 3.0
  return ret
}

/**
 * 单个坐标转换
 * @param point
 * @returns {BMap.Point}
 */
function GpsToBaiduPoint (point) {
  const _t = wgs2bd(point.lat, point.lng)
  return new BMap.Point(_t[1], _t[0])
}

/**
 * 批量坐标转换
 * @param points
 * @returns {Array}
 */
function GpsToBaiduPoints (points) {
  let resultPoints = []
  $.each(points, function (index, point) {
    const _t = wgs2bd(point.lat, point.lng)
    const _BPoint = new BMap.Point(_t[1], _t[0])
    resultPoints.push(_BPoint)
  })
  return resultPoints
}

/**
 * 扩展百度地图对象，添加ID、名称等
 */
function extendMapObject () {
  if (!BMap.Overlay.prototype.setId) {
    BMap.Overlay.prototype.setId = function (id) {
      this.id = id
    }
  }
  if (!BMap.Overlay.prototype.getId) {
    BMap.Overlay.prototype.getId = function () {
      return this.id
    }
  }
  if (!BMap.Overlay.prototype.setName) {
    BMap.Overlay.prototype.setName = function (name) {
      this.name = name
    }
  }
  if (!BMap.Overlay.prototype.getName) {
    BMap.Overlay.prototype.getName = function () {
      return this.name
    }
  }
  if (!BMapLib.InfoBox.prototype.setId) {
    BMapLib.InfoBox.prototype.setId = function (id) {
      this.id = id
    }
  }
  if (!BMapLib.InfoBox.prototype.getId) {
    BMapLib.InfoBox.prototype.getId = function () {
      return this.id
    }
  }
  if (!BMapLib.InfoBox.prototype.setName) {
    BMapLib.InfoBox.prototype.setName = function (name) {
      this.name = name
    }
  }
  if (!BMapLib.InfoBox.prototype.getName) {
    BMapLib.InfoBox.prototype.getName = function () {
      return this.name
    }
  }
}

/**
 * 设置地图展示边界
 * @param map 地图对象
 * @param boundaryPoints 以逗号分隔的经纬度字符串边界点数组
 */
function setDisplayBoundary (map, boundaryPoints) {
  let firstPoint = boundaryPoints[0]
  let EN = ''    //行政区划东北段点的集合
  let pt_e = firstPoint //行政区划最东边点的经纬度
  let pt_n = firstPoint //行政区划最北边点的经纬度
  let pt_w = firstPoint //行政区划最西边点的经纬度
  let pt_s = firstPoint //行政区划最南边点的经纬度
  let n1 = 0 //行政区划最东边点在点集合中的索引位置
  let n2 = 0 //行政区划最北边点在点集合中的索引位置
  let n3 = 0 //行政区划最西边点在点集合中的索引位置
  let n4 = 0 //行政区划最南边点在点集合中的索引位置

  //2.循环行政区划边框点集合找出最东南西北四个点的经纬度以及索引位置
  for (let n = 0; n < boundaryPoints.length; n++) {
    let point = boundaryPoints[n]
    let pt_e_f = parseFloat(pt_e.split(',')[0])
    let pt_n_f = parseFloat(pt_n.split(',')[1])
    let pt_w_f = parseFloat(pt_w.split(',')[0])
    let pt_s_f = parseFloat(pt_s.split(',')[1])

    let sPt = []
    try {
      sPt = point.split(',')
      const spt_j = parseFloat(sPt[0])
      const spt_w = parseFloat(sPt[1])
      if (pt_e_f < spt_j) {   //东
        pt_e = point
        pt_e_f = spt_j
        n1 = n
      }
      if (pt_n_f < spt_w) {  //北
        pt_n_f = spt_w
        pt_n = point
        n2 = n
      }

      if (pt_w_f > spt_j) {   //西
        pt_w_f = spt_j
        pt_w = point
        n3 = n
      }
      if (pt_s_f > spt_w) {   //南
        pt_s_f = spt_w
        pt_s = point
        n4 = n
      }
    } catch (err) {
      alert(err)
    }
  }

  for (let o = n1; o < boundaryPoints.length; o++) {
    EN += boundaryPoints[o] + ';'
  }
  for (let o = 0; o <= n1; o++) {
    EN += boundaryPoints[o] + ';'
  }

  //4.自定义外围边框点的集合
  const E_JW = '170.672126, 39.623555;'            //东
  const EN_JW = '170.672126, 81.291804;'       //东北角
  const NW_JW = '-169.604276,  81.291804;'     //西北角
  const WS_JW = '-169.604276, -68.045308;'     //西南角
  const SE_JW = '170.672126, -68.045308 ;'         //东南角

  const ply1 = new BMap.Polygon(EN + E_JW + EN_JW + NW_JW + WS_JW + SE_JW + E_JW,
    {
      strokeColor: 'none',
      fillColor: 'rgb(2,34,55)',
      strokeOpacity: 0,
      fillOpacity: 0.8,
      enableMassClear: false,
    }) //建立多边形覆盖物
  map.addOverlay(ply1)

  //5. 给目标行政区划添加边框，其实就是给目标行政区划添加一个没有填充物的遮罩层
  const ply = new BMap.Polygon(boundaryPoints.join(';'),
    { strokeWeight: 2, strokeColor: '#000000', fillColor: '', enableMassClear: false })
  map.addOverlay(ply)
}

/**
 * 初始化地图控件
 */
function initControl (map, controls, vueInstance) {
  map.addControl(new MapControl(controls, vueInstance))
}

/**
 * 初始化地图控件
 */
function addSearchControl (map, searchConfig, vueInstance) {
  if (!searchConfig) {searchConfig = {}}
  map.addControl(new SearchControl(searchConfig, vueInstance))
}

/**
 * 定位
 *
 * @param map 地图实例
 * @param params 定位参数
 * @returns
 */
function locate (map, params) {
  const that = this
  if ('length' in params.position && params.position.length === 2) {
    // 若无需转换，则显式设置needConvert为false
    let position = new BMap.Point(params.position[0], params.position[1])
    if (params.needConvert !== false) {
      position = GpsToBaiduPoint(position)
    }
    map.panTo(position, { noAnimation: true })
    map.getOverlays().forEach(overlay => {
      if ('getId' in overlay && overlay.getId() === params.data) {
        overlay.setAnimation(BMAP_ANIMATION_BOUNCE)
        if (params.showDetail) {
          overlay.dispatchEvent('click')
          if (params.detailBtnClick && params.device) {
            const infoBox = mapItemStore.infoBoxCache[`infoBox_${overlay.getId()}`]
            if (params.detailBtnClick === 'rwxf') {
              that.taskDispatch(that, infoBox, params.device)
            } else if (params.detailBtnClick === 'ztjc') {
              that.showMonitorPage(infoBox, params.device, params.vueIns)
            }
          }
        }
      }
    })
  }
}

/**
 *
 * @param jsonObj
 * @returns {*}
 */
function convertGeoJson (jsonObj) {
  let geoJson = jsonObj
  for (const collection of jsonObj) {
    for (const feature of collection.features) {
      let points = []
      const geo = feature.geometry
      if (geo.type === 'Point') {

      } else {
        if (geo.type === 'LineString') {
          for (const coordinate of geo.coordinates) {
            points.push(new BMap.Point(coordinate[0], coordinate[1]))
          }
          geo.coordinates = []
          for (const point of GpsToBaiduPoints(points)) {
            geo.coordinates.push([point.lng, point.lat])
          }
        } else if (geo.type === 'Polygon') {
          for (const coordinate of geo.coordinates[0]) {
            points.push(new BMap.Point(coordinate[0], coordinate[1]))
          }
          geo.coordinates[0] = []
          for (const point of GpsToBaiduPoints(points)) {
            geo.coordinates[0].push([point.lng, point.lat])
          }
        }
      }
    }
  }
  return geoJson
}

export default {
  addSearchControl,
  extendMapObject,
  initControl,
  locate,
  setDisplayBoundary,
  mapItemStore,
  GpsToBaiduPoint,
  GpsToBaiduPoints,
  convertGeoJson,
}
