<template>
  <baidu-map
    class="mapContain"
    :ak="ak"
    center="上海"
    :zoom="zoom"
    :mapStyle="mapStyle"
    :min-zoom="minZoom"
	:max-zoom="maxZoom"
    :scroll-wheel-zoom="true"
    :high-resolution="true"
    :inertial-dragging="true"
    :continuous-zoom="true"
    @ready="onReadyHandler"
    @click="onClickHandler"
    @dblclick="onDoubleClickHandler"
    @rightclick="rightClickHandler"
    @maptypechange="mapTypeChangeHandler"
    @mousemove="mouseMoveHandler"
    @mouseover="mouseMoveOverHandler"
    @mouseout="mouseMoveOutHandler"
    @movestart="moveStartHandler"
    @moving="movingHandler"
    @moveend="moveEndHandler"
    @zoomstart="zoomStartHandler"
    @zoomend="zoomEndHandler"
    @addoverlay="addOverlayHandler"
    @addcontrol="addControlHandler"
    @removeoverlay="removeOverlayHandler"
    @removecontrol="removeControlHandler"
    @dragstart="dragStartHandler"
    @dragging="draggingHandler"
    @dragend="dragEndHandler"
    @addtilelayer="addTileLayerHandler"
    @removetilelayer="removeTileLayer"
    @load="loadHandler"
    @resize="resizeHandler"
    @tilesloaded="tilesLoadedHandler"
  >
	   <!-- <tool-bar @click="magnify"></tool-bar> -->
	    <tool-bar @on-magnify="onMagnify" @on-reduce="onReduce"  @on-globe="onGlobe"></tool-bar>
        <bm-view class="mapView"></bm-view>
        <!-- overlay -->
        <canvas-renderer type="default"></canvas-renderer>
	  	<canvas-renderer type="animal"></canvas-renderer>
        <!-- 地图控件 -->
      <!--  <vmap-toolbar></vmap-toolbar> -->
	  
	   <!-- 展示列表控件 -->
	   <list-bar></list-bar>
	  
	   <!-- tab切换展示比例尺控件 -->
	   <tab-bar></tab-bar>
	   
	   <!-- 提示信息弹出框 -->
	   <show-info ref="showInfo" :show="isShow"
	   @close="closeFn"></show-info>

        <!-- 提示信息弹出框1 -->
	   <!-- <show-info1 ref="showInfo1" :show="isShow"
	   @close="closeFn"></show-info1> -->

        <!-- 错误信息弹框 -->
	   <error-tips></error-tips>

       	<!-- 井盖曲线 -->
	   <intelligent-cover-chart></intelligent-cover-chart>

        <!-- 隐患缺陷详情 -->
	   <hidden-hefects-detail></hidden-hefects-detail>

        <!-- 网格化人员今日工作 -->
	   <grid-personnel-work></grid-personnel-work>

       <!-- 故障-人员信息 -->
	   <gz-ry-info></gz-ry-info>

       <!--故障-预报备 -->
	   <gz-ybb-info></gz-ybb-info>

       <!-- 故障-视频 -->
	   <gz-video-info></gz-video-info>

       <!-- 故障-地图下方告警 -->
	   <gz-gj-info></gz-gj-info>

       <!-- 故障-用户信息 -->
	   <gz-user-info></gz-user-info>

       <!-- 户表-智能诊断 -->
	   <hplc-znzd-info></hplc-znzd-info>

       <!-- 户表-短信内容 -->
	   <hplc-dxnr-info></hplc-dxnr-info>

       <!-- 户表-用户信息 -->
	   <hplc-user-info></hplc-user-info>
	   
	   <!-- 警告信息弹出框 -->
	   <warn-info></warn-info>
	   
	   <!-- hplc信息弹窗 -->
       <hplc-info></hplc-info>
			  
		<!-- 附件上传轮播信息弹窗 -->
		<lunbo-info></lunbo-info>
					  
	   <!-- 通道监拍正常画面弹出框 -->
	   <pic-info :show="isShows"></pic-info>
	   
      <!-- 智能保障通道监拍画面弹出框 -->
      <nopic-info :show="isShows"></nopic-info>

      <!-- 保障对象通道监拍 -->
      <bzdx-info :show="isShows"></bzdx-info >

      <!-- 电站视频-->
      <power-station-video></power-station-video>

      <!-- 电站视频按钮-->
      <power-station-video-but></power-station-video-but>
	   
      <!-- 4G单兵页面-->
      <single-pawn></single-pawn>

       <!-- 电站曲线-->
      <dzqx-chart></dzqx-chart>

      <!-- 在线单兵-->
      <init-zxdb></init-zxdb>

    </baidu-map>
</template>
<script>
    import bmlib, {EventBus} from "./baidumap/index.js";
    import mapConfig from "./baidumap/mapConfig";
    import CanvasRenderer from "./baidumap/base/CanvasRenderer";
	import ToolBar from "./baidumap/control/ToolBar";
	import ListBar from "./baidumap/control/ListBar";
	import TabBar from "./baidumap/control/TabBar";
    import ShowInfo from "./baidumap/tips/ShowInfo";//tips弹框
    // import ShowInfo1 from "./baidumap/tips/ShowInfo1";//tips弹框1
    import WarnInfo from "./baidumap/tips/WarnInfo";//错误信息弹框
    import PicInfo from "./baidumap/tips/PicInfo";//通道监正常正常拍弹框
    import NopicInfo from "./baidumap/tips/NopicInfo";//通道监拍异常画面弹框
    import BzdxInfo from "./baidumap/tips/BzdxInfo";//保障对象通道监拍弹框
    import HplcInfo from "./baidumap/tips/HplcInfo";//智能电表弹出框
    import LunboInfo from "./baidumap/tips/LunboInfo";//附件上传轮播信息弹窗
 
 
    import ErrorTips from "./baidumap/tips/ErrorTips";//错误信息弹框
    import IntelligentCoverChart from "./baidumap/layer/layerTwoMenu/IntelligentCoverChart";//井盖曲线
    import HiddenHefectsDetail from "./baidumap/layer/layerTwoMenu/HiddenHefectsDetail";//隐患缺陷详情
    import GridPersonnelWork from "./baidumap/layer/layerTwoMenu/GridPersonnelWork";//网格化人员今日工作
    import GzRyInfo from "./baidumap/layer/layerTwoMenu/GzRyInfo";//故障-人员信息
    import GzYbbInfo from "./baidumap/layer/layerTwoMenu/GzYbbInfo";//故障-预报备
    import GzVideoInfo from "./baidumap/layer/layerTwoMenu/GzVideoInfo";//故障-视频
    import GzGjInfo from "./baidumap/layer/layerTwoMenu/GzGjInfo";//故障-地图下方告警
    import GzUserInfo from "./baidumap/layer/layerTwoMenu/GzUserInfo";//故障-用户信息
    import HplcZnzdInfo from "./baidumap/layer/layerTwoMenu/HplcZnzdInfo";//户表-智能诊断
    import HplcDxnrInfo from "./baidumap/layer/layerTwoMenu/HplcDxnrInfo";//户表-短信内容
    import HplcUserInfo from "./baidumap/layer/layerTwoMenu/HplcUserInfo";//户表-用户信息
    import PowerStationVideoBut from "./baidumap/layer/layerTwoMenu/PowerStationVideoBut";//电站视频按钮
    import PowerStationVideo from "./baidumap/layer/layerTwoMenu/PowerStationVideo";//电站视频
    import SinglePawn from "./baidumap/layer/layerTwoMenu/SinglePawn";//4G单兵
    import DzqxChart from "./baidumap/layer/layerTwoMenu/DzqxChart";//电站曲线
    import InitZxdb from "./baidumap/layer/layerTwoMenu/InitZxdb";//初始化在线单兵
	import Console from "./baidumap/support/Console";
	

	
    export default {
        name: "mapSection",
        components: {CanvasRenderer,ToolBar,ListBar,TabBar,ShowInfo,WarnInfo,ErrorTips,IntelligentCoverChart,HiddenHefectsDetail,GridPersonnelWork,GzRyInfo,GzYbbInfo,GzVideoInfo,GzGjInfo,GzUserInfo,HplcZnzdInfo,HplcDxnrInfo,HplcUserInfo,PicInfo,NopicInfo,BzdxInfo,HplcInfo,LunboInfo,PowerStationVideo,PowerStationVideoBut,SinglePawn,DzqxChart,InitZxdb},
       /*  components: {
           BaiduMap
         }, */
        data() {
            return {
                ak: mapConfig.ak,
                zoom: mapConfig.zoom,
				minZoom : mapConfig.minZoom,
				maxZoom : mapConfig.maxZoom,
				enableMapClick:true,
                center: {
                    lng: mapConfig.center.x,
                    lat: mapConfig.center.y
                },
                mapStyle: {
                    styleJson: mapConfig.style
                },
				mapClick:false,
				highResolution : true,
				width:1750,
                height:940,
                isShow: false,
				isShows: false,
                widthTips:375,
				heightTips:247,
				top:0,
				left: 0,
				newOffset:{
					x:0,
					y:0
                },
                mapFly:"",
                BMapFly:"",
            };
        },
		
        methods: {
            //地图上的弹出框
			closeFn(obj){
				this.isShow = obj;
			},
			gogo(index){
				if(index == 0){
					this.newMap.setMapType(BMAP_NORMAL_MAP);
				}else{
					this.newMap.setMapType(BMAP_HYBRID_MAP);
				}
			},
			defaultBlack(index){
				if(index == 0){
					this.newMap.setMapStyle({style:'normal'})
				}else{
					this.newMap.setMapStyle(this.mapStyle);
					$(".mapView").css("background-color","initial")
				}
			},
			
			// 放大效果
			 onMagnify(){
                 this.zoom++ 
            },
			//缩小效果
            onReduce(){
                this.zoom--
            },
			//还原效果
			 onGlobe(){
                 //this.zoom = 12;
                 canvasRender.default.eventBus.emit("canvas-renderer-fly" ,{x :mapConfig.center.x, y : mapConfig.center.y , zoom : 12});//定位
			},
            onReadyHandler({BMap, map}) {
                this.mapFly=map;
                this.BMapFly=BMap;

				this.newMap = map
                //设置百度地图的瓦片下的默认背景色
                map.Va.style.backgroundColor = "rgba(255,0,0,0)";
                window.bmap = map;
                window.vueMap = this;

                this.center.lng = mapConfig.center.x; //116.404
                this.center.lat = mapConfig.center.y; ////39.915
                this.zoom = 12;
                EventBus.emit("_map_ready_", {
                    vmap: this,
                    map: map,
                    BMap: BMap
                });
            },
            onClickHandler(event) {
                console.log("地图点击坐标："+JSON.stringify(event.point))
                this.isShow = false;
				
				//重要：地图全局Click事件，不能修改，否则设计click的处理全会出错
                let {type, target, point, pixel, overlay} = event;
                EventBus.emit("click", event);

                // {
                //     type: type,
                //         target: target,
                //     point: point,
                //     pixel: pixel,
                //     overlay: overlay
                // }

            },
            onDoubleClickHandler({type, target, pixel, point}) {
                EventBus.emit("double-click", {
                    type: type,
                    target: target,
                    point: point,
                    pixel: pixel
                });
            },
            rightClickHandler({type, target, point, pixel, overlay}) {
                EventBus.emit("right-click", {
                    type: type,
                    target: target,
                    point: point,
                    pixel: pixel,
                    overlay: overlay
                });
            },
            mapTypeChangeHandler({type, target}) {
                EventBus.emit("maptype-change", {
                    type: type,
                    target: target
                });
            },
            mouseMoveHandler({type, target, point, pixel, overlay}) {
                EventBus.emit("mouse-move", {
                    type: type,
                    target: target,
                    point: point,
                    pixel: pixel,
                    overlay: overlay
                });
            },
            mouseMoveOverHandler({type, target}) {
                EventBus.emit("mouse-move-over", {
                    type: type,
                    target: target
                });
            },
            mouseMoveOutHandler({type, target}) {
                EventBus.emit("mouse-move-out", {
                    type: type,
                    target: target
                });
            },
            moveStartHandler({type, target}) {
				Console.log("Map Move Start");
                EventBus.emit("move-start", {
                    type: type,
                    target: target
                });
            },
            movingHandler({type, target}) {
                EventBus.emit("moving", {
                    type: type,
                    target: target
                });
            },
            moveEndHandler({type, target}) {
				Console.log("Map Move End");
				this.$refs.showInfo.$emit('offset',this.newMap);
				
                EventBus.emit("move-end", {
                    type: type,
                    target: target
                });
            },
            zoomStartHandler({type, target}) {

                EventBus.emit("zoom-start", {
                    type: type,
                    target: target
                });
            },
            zoomEndHandler({type, target}) {
				//this.zoom = this.newMap.getZoom();

				this.$refs.showInfo.$emit('place');
                EventBus.emit("zoom-end", {
                    type: type,
                    target: target
                });
            },
            addOverlayHandler({type, target}) {
                EventBus.emit("add-overlay", {
                    type: type,
                    target: target
                });
            },
            addControlHandler({type, target}) {
                EventBus.emit("addcontrol", {
                    type: type,
                    target: target
                });

                if (target.removeCopyright) {
                    //移除百度版权信息
                    setTimeout(
                        (function (control) {
                            return function () {
                                control.removeCopyright();
                            };
                        })(target),
                        200
                    );
                } else if (
                    target.getContainer().innerHTML.indexOf("copyright_logo.png") >= 0
                ) {
                    //移除百度Logo
                    target.getContainer().innerHTML = "<div></div>";
                }
            },
            removeOverlayHandler({type, target}) {
                EventBus.emit("remove-overlay", {
                    type: type,
                    target: target
                });
            },
            removeControlHandler({type, target}) {
                EventBus.emit("remove-control", {
                    type: type,
                    target: target
                });
            },
            dragStartHandler({type, target, pixel, point}) {
				Console.log("Map Drag Start");

                EventBus.emit("drag-start", {
                    type: type,
                    target: target
                });
            },
            draggingHandler({type, target, pixel, point}) {
                EventBus.emit("dragging", {
                    type: type,
                    target: target
                });
            },
            dragEndHandler({type, target, pixel, point}) {
				Console.log("Map Drag End");

                EventBus.emit("drag-end", {
                    type: type,
                    target: target
                });
            },
            addTileLayerHandler({type, target}) {
                EventBus.emit("add-tilelayer", {
                    type: type,
                    target: target
                });
            },
            removeTileLayer: function ({type, target}) {
                EventBus.emit("remove-tilelayer", {
                    type: type,
                    target: target
                });
            },
            loadHandler: function ({type, target, pixel, point, zoom}) {
                EventBus.emit("load", {
                    type: type,
                    target: target,
                    pixel: pixel,
                    point: point,
                    zoom: zoom
                });
            },
            resizeHandler({type, target, size}) {
                EventBus.emit("resize", {
                    type: type,
                    target: target,
                    size: size
                });
            },
            tilesLoadedHandler({type, target}) {
                EventBus.emit("tiles-loaded", {
                    type: type,
                    target: target
                });
            },
            flyClickTips({layer}) {//定位弹tips
                EventBus.emit("graphic-ShowInfo-closeTips", );//关闭tips
                let pixel="";
                let map=this.mapFly;
                EventBus.emit("graphic-flyShowTips-"+layer.layerName, { pixel,layer, map });
            }
        },
        mounted() {
            EventBus.on("layer-flyClickTips",this.flyClickTips);//定位弹tips
        }
    };
</script>
<style scoped>
.mapContain {
  left: 1140px;
  top: 126px;
  width: 1750px;
  height: 940px;
}

/*.mapContain {*/
/*	left: 0px;*/
/*	top: 126px;*/
/*	width: 4300px;*/
/*	height: 940px;*/
/*}*/

.mapView {
  flex: 1;
  width: 1750px;
  height: 940px;
}

/*.mapView {*/
/*	flex: 1;*/
/*	width: 4300px;*/
/*	height: 940px;*/
/*}*/


 .boxinfo{ 
 	  position: absolute;
 	  padding: 20px 15px 0 24px;
 	  background-image: url(baidumap/assets/images/bg_pop_2.png);
 	  background-repeat: no-repeat;
 	  background-size: cover;
    }
	/deep/ .BMap_pop,
	/deep/ .BMap_top,
	/deep/ .BMap_center,
	/deep/ .BMap_bottom,
	/deep/ .BMap_shadow,
	/deep/  .BMap_pop>img{
		display: none !important;
	}

</style>
