<template>
  <div class="offsetBox" :style="{left:newOffset.x+'px',top:newOffset.y+'px'}">
     <div class="boxinfo" :style="{width:width+'px',height:newHeight+'px',top:top+'px',left:left+'px'}" v-show="isShow==true">
		 <h4>隐患缺陷<i @click="closeFn"></i></h4>
		  <div class="boxdetali" :style="{height:detailHeight+'px'}">
				<ul>
					<li><span>发现时间</span>：2019-09-16 10:36:34</li>
					<li><span>情况描述</span>：上海书院奇异梅种植基地,书院镇石家港路附近110kv汇芦1510架空线路下有未加固的蔬菜大棚，存在大面积停电隐患。</li>
			  </ul>
		 </div>
		  <div class="testImg"><img src="../assets/images/testImg.jpg" alt=""></div>
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
			default: 450,
		},
		height:{
			type: Number,
			default: 450,
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
		newOffset:{
			x:0,
			 y:0
		},
		top:200,
		left:200,
		newPoint:{},
		newMap:null,
		newHeight:250,
		detailHeight: 78
    }
   },
   methods: {

	closeFn(){//关闭tips
			 this.isShow = false
			 this.$emit('close',false)
	},
	WaitDelete(){
		this.isShow=true
	}
   },

   mounted(){
		eventBus.on("graphic-click-WaitDelete", this.WaitDelete);//打开tips
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
	  background-image: url(../assets/images/pic_pop.png);
	  background-repeat: no-repeat;
	  background-size: cover;
	   background-position: center;
	  z-index: 999;
  }
  .boxinfo .testImg img{
	  width: 405px;
	  height: 270px;
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
