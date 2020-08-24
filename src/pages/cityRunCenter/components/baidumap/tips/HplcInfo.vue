<template>
	<div>
		<div class="hplcInfo"  @click="showInfoLocation()"  v-show="isShow==true">
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
					info:'05-28 12:54古桐四村盛卫明家电表失电'
				}
			}
		},
		methods: {
			showInfoLocation(){
				this.isShow=false;

				eventBus.emit("layer-visible-LineAllLayer",true);//线路 全部
				//eventBus.emit("layer-visible-LineFz2Layer",true);//线路 伦25东捷张江甲

				eventBus.emit("layer-visible-LineHplcLayer",true);//线路 HPLC

				eventBus.emit("showVue-HplcUserInfo",);//户表-用户信息

				this.HouseholdTableLocation();//定位到失电居民
			},
			HouseholdTableLocation(){//演示图层-户表 tips框
				 let layer={
      					id:"FF000000-0000-0000-1000-000000001300-00396",//定位对象id 
      					layerName:"HouseholdTableLayer",//定位图层
      					zoom:19,//定位图层
      					point:{
							lng:121.621145,
        					lat:31.205294,
        					// lng:121.626576,
							// lat:31.204364,
							//{"lng":121.621145,"lat":31.205294}
      					}
    				}
    			eventBus.emit("layer-flyClickTips", {layer});//演示图层井盖定位
			},
			showInfo(type){
				this.isShow=type;
			}
		},
		 mounted() {
		    eventBus.on("showInfo-HplcInfo",this.showInfo);//定位弹tips
		}
		
	}
</script>

<style scoped="scoped">
	.mapContain{
		position: relative;
	}	
	.mapContain .hplcInfo{
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
	.mapContain .hplcInfo i{
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
