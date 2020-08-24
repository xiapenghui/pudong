<template>
  <div class="deviceWrap" :style="{backgroundImage:'url('+deviceData.url+')'}">
  <!-- <div class="deviceTitle">{{ deviceData.name }}</div>
    <div class="deviceItem">
      <div class="itemLeft">所属公司：</div>
      <div class="itemRight">浦东电力公司</div>
    </div>
    <div class="deviceItem">
      <div class="itemLeft">井盖地址：</div>
      <div class="itemRight">{{ deviceData.address }}</div>
    </div>
    <div class="deviceItem">
      <div class="itemLeft">检测状态：</div>
      <div class="itemRight">正常</div>
    </div>
    <div class="location" @click="locationZnjg(deviceData.primaryId,deviceData.lon,deviceData.lat)"></div> -->
  </div>
</template>

<script>
import eventBus from "./baidumap/base/EventBus";	

export default {
  name: 'deviceDetail',
  props: {
    deviceData: {
      type: Object,
      required: true,
      default: {
        title: "井盖",
        company: "上海浦东电力有限公司",
        people: "张三",
        contact: "正常",
				url:require("./baidumap/assets/images/sbgzpic/quxian01.png")
      }
    },
  },
  methods: {
    locationZnjg(id,lon,lat){
     //canvasRender.default.eventBus.emit("canvas-renderer-fly" ,{x : lon, y : lat , zoom : 18});//定位
    let layer={
      id:id,//定位对象id
      layerName:"IntelligentCoverYSLayer",//定位图层
      zoom:18,//定位图层
      point:{
        lng:lon,
        lat:lat
      }
    }
    //let graphic=canvasRender.default.layers[16].graphics[0];
    eventBus.emit("layer-flyClickTips", {layer});//演示图层井盖定位
    }
  }
};
</script>
<style scoped>
.deviceWrap{
  width: 100%;
  height: 100%;
  padding: 10px 55px 0 24px;
  position: relative;
	background-repeat: no-repeat;
	background-size: contain;
	background-position: center;
}
.deviceTitle{
  width: 100%;
  height: 38px;
  line-height: 38px;
  font-size: 18px;
  color: #00ffff;
  text-indent: 32px;
  background: url('../assets/images/ic_triangle.png') no-repeat left center;
}
.deviceItem{
  width: 100%;
  height: 32px;
  line-height: 32px;
  font-size: 18px;
}
.itemLeft{
  color: #ffffff;
  width: 118px;
  text-align: right;
  float: left;
}
.itemRight{
  width: calc(100% - 118px);
  float: left;
  text-indent: 12px;
  color: #00ffff;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.location{
  cursor:pointer;
  width: 30px;
  height: 34px;
  position: absolute;
  right: 21px;
  top: 18px;
  background: url('../assets/images/ic_location_blue.png') no-repeat left center;
}
.deviceWrap.type2 .deviceTitle{
  background: url('../assets/images/ic_triangle_orange.png') no-repeat left center;
}
.deviceWrap.type2 .deviceTitle,.deviceWrap.type2 .itemRight{
  color: #f49b3c;
}
.deviceWrap.type2 .location{
  background: url('../assets/images/ic_location_orange.png') no-repeat left center;
}
</style>

