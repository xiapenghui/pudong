// 控件列表
let controls = []
// 控件图片地址
const imgUrl = '/common-assets/plugins/bMap/img'
// 街景层
let panoramaLayer = null
// 街景控件图标
let panoramaCtrl = null
// vue实例
let vm = null

function MapControl (ctrl, vueInstance) {
  this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT
  this.defaultOffset = new BMap.Size(10, 18)
  controls = ctrl
  vm = vueInstance
}

//继承BMap.Control
MapControl.prototype = new BMap.Control
//控件初始化
MapControl.prototype.initialize = function (map) {
  const top = Math.min(map.height / 20, 180)
  this.defaultOffset = new BMap.Size(Math.min(map.width / 40, 100), top)
  const controlBar = document.createElement('div')
  controlBar.setAttribute('id', 'controlBar')

  function appendControlToBar (obj) {
    const ctrl = document.createElement('span')
    ctrl.innerHTML = `<img class="tip-hotspot" data-tip="${obj.text}" src='${obj.imageUrl}' />`
    ctrl.style.display = 'inline-Block'
    ctrl.style.marginRight = '50px'
    ctrl.style.cursor = 'pointer'
    ctrl.addEventListener('click', obj.onclick)
    controlBar.appendChild(ctrl)
  }

  controls.forEach(ctrl => {
    if (typeof ctrl === 'string') {
      switch (ctrl) {
        case 'zoomIn':
          appendControlToBar({
            text: '放大',
            imageUrl: `${imgUrl}/ic_magnifying.png`,
            onclick () {
              const newZoom = map.getZoom() + 1
              map.zoomTo(newZoom)
              vm.$emit('map-zoom-in', newZoom)
            },
          })
          break
        case 'zoomOut':
          appendControlToBar({
            text: '缩小',
            imageUrl: `${imgUrl}/ic_reduce.png`,
            onclick () {
              const newZoom = map.getZoom() - 1
              map.zoomTo(newZoom)
              vm.$emit('map-zoom-out', newZoom)
            },
          })
          break
        case 'roaming':
          appendControlToBar({
            text: '漫游',
            imageUrl: `${imgUrl}/ic_hand.png`,
            onclick () {
              map.setDefaultCursor(`url('bird.cur')`)
            },
          })
          break
        case 'reset':
          appendControlToBar({
            text: '重置',
            imageUrl: `${imgUrl}/ic_globe.png`,
            onclick () {
              map.reset()
              vm.$emit('map-reset')
            },
          })
          break
        case 'clear':
          appendControlToBar({
            text: '清除',
            imageUrl: `${imgUrl}/ic_clear.png`,
            onclick () {
              map.clearOverlays()
              if (panoramaLayer) {
                map.removeOverlay(panoramaLayer)
                panoramaLayer = null
              }
              if (panoramaCtrl) {
                map.removeOverlay(panoramaCtrl)
              }
              vm.$emit('map-cleared')
            },
          })
          break
        case 'ranging':
          appendControlToBar({
            text: '测距',
            imageUrl: `${imgUrl}/ic_length.png`,
            onclick () {
              const ranging = new BMapLib.DistanceTool(map)
              ranging.open()
            },
          })
          break
        case 'streetView':
          if (map.mode === 'online') {
            appendControlToBar({
              text: '街景',
              imageUrl: `${imgUrl}/ic_street_p.png`,
              onclick () {
                panoramaLayer = new BMap.PanoramaCoverageLayer()
                map.addTileLayer(panoramaLayer)
                panoramaCtrl = new BMap.PanoramaControl()
                panoramaCtrl.setOffset(new BMap.Size(160, 180))
                map.addControl(panoramaCtrl)
              },
            })
          }
          break
        case 'satellite':
          appendControlToBar({
            text: '卫星图',
            imageUrl: `${imgUrl}/wxt.png`,
            onclick () {
              if (map.getMapType() === BMAP_NORMAL_MAP) {
                map.setMapType(BMAP_HYBRID_MAP)
              } else {
                map.setMapType(BMAP_NORMAL_MAP)
              }
            },
          })
          break
        default:
          break
      }
    } else {
      appendControlToBar(ctrl)
    }
  })

  const ctrlAmount = controlBar.children.length

  // 最后一个控件右侧距离移除
  controlBar.children[ctrlAmount - 1].style.marginRight = 0

  controlBar.style.width = '1100px'
  controlBar.style.height = `${top}px`
  controlBar.style.padding = '15px 60px'
  controlBar.style.backgroundColor = 'rgba(59,130,177,.28)'

  //添加控件到地图
  map.getContainer().appendChild(controlBar)
  return controlBar
}

export default MapControl