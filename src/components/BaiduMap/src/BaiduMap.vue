<template>
    <div :style="{width, height}" id="mapContent"></div>
</template>

<script>
  import mapUtils from '../utils/mapUtils'
  import defaultConfig from './defaultConfig'

  export default {
    name: 'BaiduMap',
    props: {
      width: {
        default: '1024px',
      },
      height: {
        default: '768px',
      },
      /**
       * 最小缩放
       */
      minZoom: {
        default: 1,
      },
      /**
       * 默认缩放
       */
      zoom: {
        default: 14,
      },
      /**
       * 默认中心点
       */
      center: {
        default: () => [121.506377, 31.245105],
      },
      /**
       * 地图配色
       */
      mapStyle: {
        default: () => defaultConfig.mapStyle,
      },
      /**
       * 地图边界
       */
      displayBoundary: {
        default: () => [],
      },
      /**
       * 地图控件
       */
      controls: {
        default: () => [
          'zoomIn',
          'zoomOut',
          'roaming',
          'reset',
          'clear',
          'ranging',
          'streetView',
          'search',
          'satellite'],
      },
      /**
       * 地图加载模式
       */
      mode: {
        default: 'online',
      },
      searchConfig: Object,
    },
    data () {
      return {
        markerCache: {},
        infoBoxCache: {},
        lineCache: {},
      }
    },
    methods: {
      createMap () {
        const vm = this
        // 初始化地图
        const map = new BMap.Map('mapContent', { enableMapClick: false, minZoom: vm.minZoom })
        // 定义地图类型，离线在线
        map.mode = () => vm.mode
        // 定义地图元素缓存
        map.getItemStore = () => {
          return {
            markerCache: vm.markerCache,
            infoBoxCache: vm.infoBoxCache,
            lineCache: vm.lineCache,
          }
        }
        // 定义一个中心点坐标
        const point = new BMap.Point(vm.center[0], vm.center[1])
        // 定制地图背景
        map.setMapStyle(vm.mapStyle)
        // 设定地图的中心点和坐标并将地图显示在地图容器中
        map.centerAndZoom(point, vm.zoom)
        // 点击事件
        map.addEventListener('click', (e) => {
          // 查询下拉框清空并隐藏
          const searchResultContainer = document.getElementById('searchResultContainer')
          if (searchResultContainer) {
            const searchResultList = searchResultContainer.getElementsByTagName('ul')
            searchResultList.innerHTML = ''
            searchResultContainer.style.display = 'none'
          }
          const infoBoxCache = vm.infoBoxCache
          Object.keys(infoBoxCache).forEach(key => {
            if (!e.overlay || e.overlay.id !== key.split('_')[1]) {
              infoBoxCache[key].close()
              const marker = infoBoxCache[key]._marker
              marker.setShadow(marker.getIcon())
            }
          })
          vm.$emit('map-clicked', map)
        })

        // 地图加载完成事件
        map.addEventListener('tilesloaded', () => {
          // 移除地图版权信息
          const anchorBLs = document.getElementsByClassName('anchorBL')
          for (let i = 0; i < anchorBLs.length; i++) {
            const el = anchorBLs[i]
            el.parentNode.removeChild(el)
          }
          // 加载完成事件
          vm.$emit('map-loaded', map)
        })

        // 设置地图事件
        //启用地图拖拽事件，默认启用(可不写)
        map.enableDragging()
        // 启用地图滚轮放大缩小
        map.enableScrollWheelZoom()
        // 禁用鼠标双击放大，默认启用
        map.disableDoubleClickZoom()
        //启用键盘上下左右键移动地图
        map.disableKeyboard()

        // 设置地图边界
        if (vm.displayBoundary.length > 0) {
          mapUtils.setDisplayBoundary(map, vm.displayBoundary)
        }
        // 向地图添加控件
        mapUtils.initControl(map, vm.controls, vm)
        if (vm.controls.indexOf('search') !== -1) {
          mapUtils.addSearchControl(map, vm.searchConfig, vm)
        }
      },
    },
    beforeCreate () {
      mapUtils.extendMapObject()
    },
    mounted () {
      this.createMap()
    },
  }
</script>

<style scoped>
    .searchResult {
        padding: 20px;
        width: 100%;
        height: auto;
        max-height: 1600px;
        overflow-y: auto;
        position: absolute;
        top: 100%;
        left: 0;
        border: 1px solid rgba(5, 83, 129, .5);
        background-color: rgba(59, 130, 177, .28);
        color: #16cff7
    }

    .searchResult ul li a {
        display: block;
        margin: 20px 0;
    }

    .searchResult ul li a:hover {
        background-color: rgba(59, 130, 177, .38);
        color: #fff;
    }
</style>