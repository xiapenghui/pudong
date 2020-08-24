<template>
  <div class="offsetBox" :style="{left:newOffset.x+'px',top:newOffset.y+'px'}">
     <div class="boxinfo" :style="{width:width+'px',height:newHeight+'px',top:top+'px',left:left+'px'}" v-show="isShow==true">
		 <h4>{{title}} <i @click="closeFn"></i></h4>
		  <div class="boxdetali" :style="{height:detailHeight+'px'}">
		 	<!-- 当前工作单位主要汇聚在<span>陆家嘴可靠性示范区</span>，高达<span>150起</span>，现需要资源配合，望引起重视 -->
			 <!-- 抢修人员照片 -->
			   <div class="people" v-show="peopleInfo==true">
				   <img src="../assets/images/people.png" alt="">
			   </div>
				<ul>
					<li v-for="(item,index) in text">{{item.type}}
						<span v-if='item.detail=="10户"'><a style="display: inline-block;color: #03c6cc" @click="showGzUserInfo">{{item.detail}}</a></span>
						<span v-else>{{item.detail}}</span>
					</li> 
			  </ul>
		 </div>
		 <div v-for="(item,index) in button" class="boxNum" @click="clickBut(item.type)">{{item.name}}</div>

	 </div>
 </div>
 </template>
<script>

import eventBus from "../base/EventBus";	
import Console from "../support/Console";

export default {
	props:{
		width:{
			type: Number,
			default: 375,
		},
		height:{
			type: Number,
			default: 250,
		},
		// top:{
		// 	type: Number,
		// 	default: 200,
		// },
		// left:{
		// 	type: Number,
		// 	default: 200,
		// },
		show:{
			type:Boolean,
			default: false,
		},
		// newOffset:{
		// 	type:Object
		// }
	},
  data() {
    return {
		peopleInfo:false,
		isShow:false,//tips显示隐藏
		text:[],//tips字段数据
		title:"",//tips标题
		button:[],//tips按钮
		itmeData:"",//图层数据
		graphicData:"",//图层信息
		newOffset:{
			x:0,
			 y:0
		},
		top:0,
		left:0,
		newPoint:{},
		newMap:null,
		newHeight:250,
		detailHeight: 78
    }
   },
   methods: {
	showGzUserInfo(){
		eventBus.emit("showVue-GzUserInfo",);//故障-用户信息
	},
	showTips({pixel, point, graphic,map,itme }){//打开tips
		let pix = map.pointToOverlayPixel(point);
		console.log("pix",pix)
		this.peopleInfo=false;
		this.newMap = map;
		this.newPoint = point;
		this.left = pix.x-(this.width/2);
		this.top = pix.y-this.newHeight;
		this.isShow = true;//打开tips框
		this.text=itme.data;
		this.title=itme.title;
		this.button=itme.button;
		this.itmeData=itme;
		this.graphicData=graphic;
		console.log(this.title)
		if(this.title=='指挥中心' || this.title=='电缆振动'){//tips不带按钮
			this.detailHeight = 180;
			this.newHeight = 250;
			this.top=pix.y-this.height;
		}else if(this.title=='故障跳闸'){
			this.detailHeight = 220;
			this.newHeight = 400;
			this.top=pix.y-this.height-140;
		}else if(this.title=='HPHL户表失电'){
			this.detailHeight = 180;
			this.newHeight = 360;
			this.top=pix.y-this.height-100;
		}else if(this.title=='抢修人员'){
			this.detailHeight = 110;
			this.newHeight = 250;
			this.top=pix.y-this.height;
			this.peopleInfo=true;//右侧照片
		}else if(this.title=='施工现场' || this.title=='工作票' || this.title=='智能井盖'){
			this.detailHeight = 100;
			this.newHeight = 250;
			this.top=pix.y-this.height;
		}else if(this.title=='保电对象'){
			this.detailHeight = 110;
			this.newHeight = 250;
			this.top=pix.y-this.height;
		}else{
			this.detailHeight = 78;
			this.newHeight = 250;
		}
		
		
		
	},
	clickBut(type){//tips二级菜单
		let itme=this.itmeData;
		let graphic=this.graphicData;
		eventBus.emit("layer-clickBut-"+this.itmeData.layerName, {graphic,itme,type });
		Console.debug("二级菜单：layer-clickBut-"+this.itmeData.layerName+">>>"+type)
	},
	closeFn(){//关闭tips
			 this.isShow = false
			 this.$emit('close',false)
	},
   },
   computed: {
	   textData(){
		   return this.text;
	   }
   },
   watch:{
	  show(newVal){
		 this.isShow = newVal
	  },
	 
   },
   mounted(){
	   this.$on('offset',(map)=>{
		   let mapEle = map.getContainer();
		   let mapViewEle = mapEle.firstChild;
		   let left = parseInt(mapViewEle.style.left);
		   let top = parseInt(mapViewEle.style.top);
		   this.newOffset={
		   	x:left,
		   	y:top
		   }
			
		});
		this.$on('place',()=>{
			if(this.newMap!==null){
				let pix = this.newMap.pointToOverlayPixel(this.newPoint);
				this.left = pix.x-(this.width/2);
				this.top = pix.y-this.newHeight;
			}	
		});
		eventBus.on("graphic-click-showTips", this.showTips);//打开tips
		eventBus.on("graphic-ShowInfo-closeTips", this.closeFn);//关闭tips
		this.newHeight = this.height
   }
   
}
</script>

<style scoped>
	.offsetBox{
		position: absolute;
	}
  .mapContain{
	  position: relative;
  }	
  .boxinfo{
	  position: absolute;
	  /* width: 375px;
	  height: 247px; */
/* 	  top: 200px;
	  left: 200px; */
	  padding: 20px 15px 13px 24px;
	  background-image: url(../assets/images/bg_pop_2.png);
	  background-repeat: no-repeat;
	  background-size: cover;
	   background-position: center;
	  z-index: 999;
  }
  .boxinfo h4{
	  position: relative;
	  width: 100%;
	  margin-bottom: 30px;
	  line-height: 22px;
	  font-size: 18px;
	  color: #cf863a;
  }
  .boxinfo h4::after{
	  content: "";
	  position: absolute;
	  left: 0;
	  bottom: -10px;
	  width: 115px;
	  height: 1px;
	  background-color: #03c6cc;
  }
  .boxinfo h4 i{
	  position: absolute;
	  top: -5px;
	  right: -5px;
	  width: 25px;
	  height: 25px;
	  background: url(../assets/images/ic_close.png) no-repeat center;
	  background-size: cover;
	  transition: all .6s;
	  }
	.boxinfo h4 i:hover{
		transform: rotate(180deg); 
		/* transform: scale(1.5); */
		transition: all .6s;
	}
  .boxdetali{
	  width: 100%;
	  height: 78px;
	  margin-bottom: 7px;
	  line-height: 26px;
	  font-size: 16px;
	  color: #fff;
	  overflow-y: auto;
  }
  .boxdetali span{
	  color: #03c6cc;
	  margin-left: 5px;
  }
  .boxNum{
	  cursor:pointer;
      float: left;
	  width: 163px;
	  height: 30px;
	  line-height: 30px;
	  margin-bottom: 10px;
	  text-align: center;
	  font-size: 14px;
	  color: #fff;
	  background-color: #153663;
  }
  .boxNum:nth-child(2n){
	  margin-left: 10px;
  }
  .boxdetali{
	 position: relative;
  }
  .boxdetali .people{
	 position: absolute;
	 top: 0;
	 right: 5px;
  }
  .boxdetali .people img{
	  width: 80px;
	  height: 100px;
  }
  
</style>
