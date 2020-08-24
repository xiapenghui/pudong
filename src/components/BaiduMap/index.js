import BaiduMap from '../BaiduMap/src/BaiduMap';

BaiduMap.install = function (Vue) {
  Vue.component(BaiduMap.name, BaiduMap);
}

export default BaiduMap;