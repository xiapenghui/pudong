<template>
  <div :style="{width:width+'px',height:height+'px',top:top+'px',left:left+'px'}" class="YchSetionPadding" v-show="show">
    <div class="sectionTop">
      <!-- <div class="sectiontitle">异常环境</div> -->
    </div>
     <div class="sectionIn">
			 <div class="smallTitle onetitle"><i class="icon_right"></i>变电</div>
      <div class="bianpic"></div>
    </div> 
  </div>
</template>

<script>   

    import deviceDetail from './DeviceDetail.vue'
    import znjgInfo from './baidumap/assets/mock/znjginfo'
    export default{
        name: 'tdjpSection',
        data(){
            return {
						
          }
        },
        props:{
          width: {
            type: Number,
            default: 1276
          },
          height: {
            type: Number,
            default: 246
          },
          left: {
            type: Number,
            // default: 2882
						default: 2928
          },
          top: {
            type: Number,
            default: 793
          },
          show: {
            type: Boolean,
            default: true
          },
          itemWidth: {
            type: Number,
            default: 606
          }
        },
        components: { deviceDetail },
       
        methods: {

        },
        mounted(){
         
        }
    }

</script>

<style scoped>
	.YchSetionPadding{
		padding-top: 10px;
	}
  .articleItem.all{
    height: 100%;
  }
	.smallTitle{
		  font-size: 18px;
			color: #ffffff;
			margin-bottom: 10px;
	  }
		 .smallTitle .icon_right{
		  width: 30px;
		  height: 30px;
		  background: url(../assets/images/ic_triangle.png) no-repeat;
		  background-repeat: no-repeat;
		  background-size: contain;
		  background-position: center;
		  display: inline-block;
		  vertical-align: middle;
		  margin-right:2px;
		}
		.bianpic{
			width: 100%;
			height: 165px;
			background-image: url(../assets/images/biandian.png);
			background-repeat: no-repeat;
			background-position: center;
			background-size: cover;
			margin: 25px 0;
		}
		.sectionTop:before,
		.sectionTop:after{
			display: none;
		}
		
</style>
