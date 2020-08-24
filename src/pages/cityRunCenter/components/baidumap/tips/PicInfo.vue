 <!-- 通道检测正常画面 -->
 <template>
     <div class="picinfo" :style="{width:width+'px',height:height+'px',top:top+'px',left:left+'px'}" v-show="isShows==true">
		 <h4><i @click="closeFn"></i></h4>
		   <iframe name="myiframe" id="myrame"
		    src="http://117.131.33.221:60001/zhpd/views/zhjptest.html" frameborder="0"
		    align="left" width="100%" height="100%" scrolling="no">
		     </iframe>
	 </div>
 </template>
<script>
import eventBus from "../base/EventBus";	
export default {
	props:{
		width:{
			type: Number,
			default: 1930,
		},
		height:{
			type: Number,
			default: 910,
		},
		top:{
			type: Number,
			default: 0,
		},
		left:{
			type: Number,
			default: 0,
		},
		show:{
			type:Boolean,
			default: false,
		},
		
	},
  data() {
    return {
	    isShows:false,//tips显示隐藏
    }
   },
   methods: {
	   showPicInfo(){
		   this.isShows=true;
	   },
	   closeFn(){//关闭tips
	   		 this.isShows = false
	   		 this.$emit('close',false)
	   },
   },
   computed: {
	   
   },
   
   mounted(){
	    eventBus.on("graphic-click-showPicInfo", this.showPicInfo);//图层显示隐藏监听
   }
   
}
</script>

<style scoped>
	  .mapContain{
		  position: relative;
	  }	
	  .picinfo{
		  position: absolute;
		  /* background-image: url(../assets/images/bg_pop_2.png); */
		  background-repeat: no-repeat;
		  background-size: cover;
		  z-index: 999;
	  }
	  .picinfo h4{
		  position: relative;
	  }
	  .picinfo h4 i{
		  position: absolute;
		  top: -5px;
		  right: -5px;
		  width: 50px;
		  height: 50px;
		  background: url(../assets/images/ic_close.png) no-repeat center;
		  background-size: cover;
		  transition: all .6s;
		  }
		.picinfo h4 i:hover{
			transform: rotate(180deg); 
			transition: all .6s;
		}
</style>
