<template>
	<div class="lunboInfo" :style="{width:width+'px',height:height+'px',top:top+'px',left:left+'px'}" v-show="isShow==true">
		<h4>{{title}}<i @click="closeFn"></i></h4>
		<div id="picshow">
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import eventBus from "../base/EventBus";
	import imageViewer from "./ImageViewer";

	export default {
		props: {
			width: {
				type: Number,
				default: 375,
			},
			height: {
				type: Number,
				default: 247,
			},
			top: {
				type: Number,
				default: 130,
			},
			left: {
				type: Number,
				default: 200,
			},
			show: {
				type: Boolean,
				default: false,
			},

		},
		components:{
			imageViewer
		},
		data() {
			return {
				isShow: false, //tips显示隐藏
				title: '图片详情',
				Magnify: 'null',
				imgArr: [
					require("../assets/images/ceshi01.jpg"),
					require("../assets/images/ceshi03.jpg"),
					require("../assets/images/ceshi02.jpg"),
					require("../assets/images/ceshi02.jpg")
				]
			}
		},
		methods: {
			showImg(data){
				this.isShow=true;
				this.title=data.title;
				this.imgArr=data.fileIds;
				
				console.log(data.fileIds);
				
				let picshow = document.getElementById("picshow");
				let innerDiv = document.createElement("div");
				
				// var viewer=document.getElementsByClassName("viewer-backdrop")[0];
				// console.log('viewer',viewer)
				// var mapWrap=document.getElementsByClassName("mapWrap")[0];
				// console.log('mapWrap',mapWrap)
				// mapWrap.append(123456);
				// mapWrap.append(viewer);
				// 
				
				
				
				innerDiv.id="picWrap";
				picshow.appendChild(innerDiv);
			    
				let index = document.getElementById("index");
				if(index){
					picshow.removeChild(index);
				}
				
				// 动态挂在图片显示组件
				let imgArr = data.fileIds;
				let Profile = Vue.extend(imageViewer);
			
				new Profile({
					propsData:{
						imgArr:imgArr
					}
				}).$mount("#picWrap")
				
			},
			closeFn() { //关闭tips
				this.isShow = false
				this.$emit('close', false)
			},
		},
		
		  
	   
		computed: {

		},
		mounted() {
			eventBus.on("graphic-LunboInfo-showImg", this.showImg);//图片展示监听
		}
	};
</script>

<style scoped>
	.mapContain {
		position: relative;
	}

	 .mapContain  .mapWrap{
		 position: absolute;
		 top: 0;
		 left: 0;
		 width: 1000px;
		 height: 100%;
	 }

	.lunboInfo {
	    position: absolute;
		padding: 20px 15px 0 24px;
		background-image: url(../assets/images/pic_pop.png);
		background-repeat: no-repeat;
		background-size: cover;
		z-index: 999;
	}

	.lunboInfo h4 {
		position: relative;
		width: 100%;
		margin-bottom: 30px;
		line-height: 22px;
		font-size: 18px;
		color: #cf863a;
	}

	.lunboInfo h4::after {
		content: "";
		position: absolute;
		left: 0;
		bottom: -10px;
		width: 115px;
		height: 1px;
		background-color: #03c6cc;
	}

	.lunboInfo h4 i {
		position: absolute;
		top: -5px;
		right: -5px;
		width: 25px;
		height: 25px;
		background: url(../assets/images/ic_close.png) no-repeat center;
		background-size: cover;
		transition: all .6s;
	}

	.lunboInfo h4 i:hover {
		transform: rotate(180deg);
		transition: all .6s;
	}
	#picshow {
		height: 150px;
		overflow-y: auto;
	}
	
	#picshow ul li {
		display: inline-block;
		float: left;
		width: 45%;
		height: 140px;
		margin: 5px;
	}
	
	#picshow ul li a {
		display: inline;
	}
	
	#picshow ul li img {
		width: 100%;
		height: 100%;
	}
	

</style>
