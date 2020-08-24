<template>
  <vmap-control>
      <ul class="toolbar"  v-if="show==true">
				<li  v-for="(item,index) in piclist">
						<span  :title='item.title'   :class="{active: isActive}"  :style="{backgroundImage:item.isHover ? 'url('+item.url+')' : 'url('+item.hover+')'}"
						@mouseover="onOver(item)"
						@mouseleave="onLeave(item)"
						@click="onFun(item.type)"></span>
				</li>
		  <li class="left" @click="show=false"><span></span></li>
      </ul>
	   <ul class="toolbar_two" v-else>
		  <li class="Chest"><span></span></li>
		  <li class="right" @click="show=true"><span></span></li>
	  </ul>
  </vmap-control>
</template>

<script>
	import eventBus from "../base/EventBus";
	
export default {
  data() {
    return {
			  show:true,
			  isActive: true,
				piclist:[
					{
						isHover:true,
						url:require('../assets/images/ic_magnifying.png'),
						hover:require('../assets/images/ic_magnifying_sel.png'),
						title:'放大',
						type:'magnify'
					},
					{
						isHover:true,
						url:require('../assets/images/ic_reduce.png'),
						hover:require('../assets/images/ic_reduce_sel.png'),
						title:'缩小',
						type:'reduce'
					},
					{
						isHover:true,
						url:require('../assets/images/ic_hand.png'),
						hover:require('../assets/images/ic_hand_sel.png'),
						title:'平移'
					},
					{
						isHover:true,
						url:require('../assets/images/ic_globe.png'),
						hover:require('../assets/images/ic_globe_sel.png'),
						title:'还原',
						type:'globe'
					},
					{
						isHover:true,
						url:require('../assets/images/ic_clear.png'),
						hover:require('../assets/images/ic_clear_sel.png'),
						title:'清除',
						type:'clear'
					},
					{
						isHover:true,
						url:require('../assets/images/ic_length.png'),
						hover:require('../assets/images/ic_length_sel.png'),
						title:'1'
					},
					{
						isHover:true,
						url:require('../assets/images/ic_measure.png'),
						hover:require('../assets/images/ic_measure_sel.png'),
						title:'2'
					},
					{
						isHover:true,
						url:require('../assets/images/ic_subject.png'),
						hover:require('../assets/images/ic_subject_sel.png'),
						title:'3'
					},
					{
						isHover:true,
						url:require('../assets/images/ic_video.png'),
						hover:require('../assets/images/ic_video_sel.png'),
						title:'通道监拍',
						type:'jianpai'
					},
					{
						isHover:true,
						url:require('../assets/images/ic_heat.png'),
						hover:require('../assets/images/ic_heat_sel.png'),
						title:'网格化运维热力图',
						type:'wghywHeat'
					},
				]
				
    };
  },
  methods:{
		 onFun(type){
			 console.log('type',type)
			 //BufferAreaLayer LineAllLayer LineFz1Layer LineFz2Layer
			 //RepairPersonnelLineLayer PulseLayer
			 // console.log("type","on-"+type)
			 this.$emit("on-"+type);
			 if(type=='jianpai'){//通道监拍
				 eventBus.emit("graphic-click-showPicInfo","aaa" );
			 }
			 if(type=='clear'){//清除-隐藏地图线面图层
			 		//eventBus.emit("layer-clear-Layer", );//清除图层
					let layers=canvasRender.default.layers;//所有图层
					for(let i=0;i<layers.length;i++){
						if(layers[i].$data.name=="BufferAreaLayer" || layers[i].$data.name=="LineAllLayer" || 
							layers[i].$data.name=="LineFz1Layer" || layers[i].$data.name=="LineFz2Layer" || 
							layers[i].$data.name=="RepairPersonnelLineLayer" || layers[i].$data.name=="PulseLayer" ||
							layers[i].$data.name=="IntelligentDeviceLayer" || layers[i].$data.name=="RepairPersonnelYSLayer"||
							layers[i].$data.name=="FaultStationYSLayer" || layers[i].$data.name=="ProtectionLineLayer" ||
							layers[i].$data.name=="ProtectionDsdLayer" || layers[i].$data.name=="ConstructionTrajectoryLayer" ||
							layers[i].$data.name=="GridPersonnelTrajectoryLayer" || layers[i].$data.name=="LineHplcLayer" ||
							layers[i].$data.name=="FlyPointBdLayer"){
								layers[i].visible=false;			
						}
					}
			 }
			 if(type=='wghywHeat'){//网格化运维热力图
				 let layers=canvasRender.default.layers;//所有图层
				 for(let i=0;i<layers.length;i++){
				 	if(layers[i].$data.name=="GridPersonnelHeatLayer"){
						 eventBus.emit("layer-visible-GridPersonnelHeatLayer", !layers[i].visible);//网格化运维人员热力图
				 	}
				 }
			 }
		 },
		 onOver(item){
			item.isHover = false
		},
		onLeave(item){
			item.isHover = true
		},
  },
};
</script>

<style scoped>
  .toolbar,
	.toolbar_two{
       /* position: fixed;
        top: 100px;
        left: 50%; */
        width : auto;;
        height: 50px;
        color: #ffffff;
        background-color:rgba(20,60,111,.8);
        background-color:rgb(20,60,111,.8);
        border-radius: 4px;
        overflow: hidden;
        z-index: 999999;
    }
    .toolbar li,
	.toolbar_two li{
      float: left;
      width: 42px;
      height: 50px;
      line-height: 50px;
      text-align: center;
    }
    .toolbar li span,
	.toolbar_two li span{
      display: block;
      width: 26px;
      height: 30px;
      margin: 10px auto;
      background-position: center;
      background-repeat: no-repeat;
      background-size: 100%;
	  cursor: pointer;
    }
	.toolbar .active{
		transition: all .3s;
	}
	.left span{
	   background-image: url('../assets/images/ic_back.png');
	   position: relative;
	}
	.left span:after{
		 position: absolute;
		 top: -7px;
		 left: -5px;
		 width: 0.2px;
		 height: 45px;
		 content: '';
		 background: #918f8f;
	}
	.left:hover span{
       background-image: url('../assets/images/ic_back_sel.png');
	   transition: all .3s;
    }
	
	.Chest span{
		 background-image: url('../assets/images/ic_tool_nor.png');
		 
	}
	.Chest:hover span{
		 background-image: url('../assets/images/ic_tool_sel.png');
		 transition: all .3s;
	}
	.right span{
		 background-image: url('../assets/images/ic_unfold_nor.png');
		  position: relative;
	}
	.right span:after{
		 position: absolute;
		 top: -7px;
		 left: -5px;
		 width: 0.2px;
		 height: 45px;
		 content: '';
		 background: #918f8f;
	}
	.right:hover span{
	 background-image: url('../assets/images/ic_unfold_sel.png');
	 transition: all .3s;
	}
</style>
