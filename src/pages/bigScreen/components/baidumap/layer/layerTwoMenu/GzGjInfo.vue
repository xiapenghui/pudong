<template>
	<div>
		<div class="gjInfo" @click="showInfo" v-show="isShow==true">
			<i></i>{{gjInfo.date}}
		</div>
	</div>
</template>

<script>
import eventBus from "../../base/EventBus";

	export default {
		data() {
			return {
				isShow: false, //tips显示隐藏
				gjInfo:{
					date:'经智能诊断，伦12沈括线路可能因大吊机干扰，请尽快处理！',
				}
			}
		},
		methods: {
			showInfo(){
				this.isShow=true;
			}
		},
		mounted() {
   			 eventBus.on("showVue-GzGjInfo", this.showInfo); //监听图层tips按钮
  		}
	}
</script>

<style scoped="scoped">
	.mapContain{
		position: relative;
	}	
	.mapContain .gjInfo{
		background-color: #0E1F3D;
		bottom: 125px;
    	left: 600px;
		position: absolute;
		width: 850px;
		height: 45px;
		line-height: 45px;
		font-size: 24px;
		letter-spacing: 1px;
		/* background-image: url(../../assets/images/bg_warn.png); */
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center;
		color: #ffae4a;
        padding: 0 15px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;
	}
	/* .mapContain .gjInfo i{
		width: 26px;
		height: 26px;
		display:inline-block;
		vertical-align: middle;
		margin: -5px 5px 0 0;
		background-image: url(../../assets/images/ic_warn.png);
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center;
	} */
</style>
