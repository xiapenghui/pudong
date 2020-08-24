<template>
	<div>
		<div class="warning" @click="showWarnPage" v-show="isShow==true">
			<i></i>{{warning.date}}{{warning.info}}
		</div>
	</div>
</template>

<script>
import eventBus from "../base/EventBus";

	export default {
		data() {
			return {
				isShow: false, //tips显示隐藏
				warning:{
					date:'',//'12点59分',
					info:'05月28日蔡伦站伦12沈括线路接地闸刀在07:05:36发生跳闸，影响用户10户'
				}
			}
		},
		methods: {
			showWarnPage(){
				//canvasRender.default.eventBus.emit("canvas-renderer-fly" ,{x : 121.610606, y : 31.195476 , zoom : 16});//定位
				canvasRender.default.eventBus.emit("canvas-renderer-fly" ,{x :121.62186901612826, y : 31.199534181022717 , zoom : 16});//定位
				eventBus.emit("layer-visible-FaultStationYSLayer", {layer: "FaultStationYSLayer"});//演示-故障电站
				eventBus.emit("layer-visible-LineAllLayer",true);//线路 全部
				//eventBus.emit("layer-visible-IntelligentCoverYSLayer", {layer: "IntelligentCoverYSLayer"});//智能井盖
				let point={jd:121.62186901612826,wd:31.199534181022717}
				eventBus.emit("layer-addPulseGraphic",{point});//脉冲
				this.faultStation();//故障跳闸tips

				eventBus.on("layer-znddYpjg-show", this.znddYpjgShow);//打开两边通道监拍
				this.isShow=false;//隐藏告警
				//this.$parent.$parent.$parent.changePage();
			},
			faultStation(){//故障跳闸tips
				 let layer={
      					id:"FF000000-0000-0000-1000-000000001300-00396",//定位对象id 
      					layerName:"FaultStationYSLayer",//定位图层
      					zoom:18,//定位图层
      					point:{
        					lng:121.62186901612826,//121.6110843,
        					lat:31.199534181022717,//31.19610456
      					}
    				}
    			eventBus.emit("layer-flyClickTips", {layer});//演示图层井盖定位
			},
			znddYpjgShow(){//打开两边通道监拍
				this.$parent.$parent.$parent.changePage();
			}
		}
	}
</script>

<style scoped="scoped">
	.mapContain{
		position: relative;
	}	
	.mapContain .warning{
		border: 1px solid #ffae4a;
		background-color: #09172E;
		position: absolute;
		top: 65px;
		left: 0;
		width: 505px;
		height: 45px;
		line-height: 45px;
		/* background-image: url(../assets/images/bg_warn.png); */
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center;
		color: #ffae4a;
		font-size: 13px;
        padding: 0 15px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;
	}
	.mapContain .warning i{
		width: 26px;
		height: 26px;
		display:inline-block;
		vertical-align: middle;
		margin: -5px 5px 0 0;
		background-image: url(../assets/images/ic_warn.png);
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center;
	}
</style>
