<template>
  <div>
      <ul class="listbar" v-show="show==true">
		<li v-for="(item,index) in piclist" :key="index">
			  <i><img :src="item.url" :alt="item.alt"></i><span>{{item.title}}</span> 
		</li>
	 </ul>
	 <div class="btn_list" @click="shows()"><span></span></div>
	</div>	
	
 </template>
<script>
	
// const mapCtx = "./pages/bigScreen/components/baidumap";
// const imageCtx = "../assets/images";	

export default {
  data() {
    return {
		     show:false,
			 piclist:[
				 {
					  url: require('../assets/images/ic_kv_red.png'),
					  alt:'10kv变电站',
					  title:'10kv变电站'
					},
				  {
					  url: require('../assets/images/ic_kv_yell.png'),
					  alt:'35kv变电站',
					  title:'35kv变电站'
					},
					 {
						url:require('../assets/images/ic_kv_green.png'),
						alt:'110kv变电站',
						title:'110kv变电站'
					},
					 {
						url:require('../assets/images/ic_zhzx.png'),
						alt:'指挥中心',
						title:'指挥中心'
					},
					//  {
					// 	url:require('../assets/images/ic_gd.png'),
					// 	alt:'工地',
					// 	title:'工地'
					// },
					 {
						url:require('../assets/images/ic_ybyhd.png'),
						alt:'一般隐患点',
						title:'一般隐患点'
					},
					 {
						url:require('../assets/images/ic_yzyhd.png'),
						alt:'严重隐患点',
						title:'严重隐患点'
					},
					 {
						url:require('../assets/images/ic_wjyhd.png'),
						alt:'危急隐患点',
						title:'危急隐患点'
					},
					 {
						url:require('../assets/images/ic_bdzy.png'),
						alt:'变电专业',
						title:'变电专业'
					},
					 {
						url:require('../assets/images/ic_dl.png'),
						alt:'电缆专业',
						title:'电缆专业'
					},
					 {
						url:require('../assets/images/ic_pd.png'),
						alt:'配电专业',
						title:'配电专业'
					},
					 {
						url:require('../assets/images/ic_xlzy.png'),
						alt:'线路专业',
					  title:'线路专业'
					},
					 {
						url:require('../assets/images/ic_yxyth.png'),
						alt:'营销一体化',
						title:'营销一体化'
					},
					 {
						url:require('../assets/images/ic_yyz.png'),
						alt:'营业站',
						title:'营业站'
					},
					 {
						url:require('../assets/images/ic_pdzdh.png'),
						alt:'配电自动化',
						title:'配电自动化'
					},
					 {
						url:require('../assets/images/ic_gzxkr.png'),
						alt:'工作许可入',
						title:'工作许可入'
					},
					 {
						url:require('../assets/images/ic_gzfzr.png'),
						alt:'工作负责人',
						title:'工作负责人'
					},
					 {
						url:require('../assets/images/ic_glry.png'),
						alt:'管理人员',
						title:'管理人员'
					},
					 {
						url:require('../assets/images/ic_cgry.png'),
						alt:'查岗人员',
						title:'查岗人员'
					},
					 {
						url:require('../assets/images/ic_txry.png'),
						alt:'特巡人员',
						title:'特巡人员'
					},
					 {
						url:require('../assets/images/ic_gzp_green.png'),
						alt:'已完成工作票',
						title:'已完成工作票'
					},
					 {
						url:require('../assets/images/ic_gzp_yellow.png'),
						alt:'计划工作票',
						title:'计划工作票'
					},
					 {
						url:require('../assets/images/ic_right_well_lid.png'),
						alt:'正常井盖',
						title:'正常井盖'
					},
					{
						url:require('../assets/images/ic_right_well_lidr.png'),
						alt:'异常井盖',
						title:'异常井盖'
					},
					{
						url:require('../assets/images/ic_dlzd.png'),
						alt:'电缆震动',
						title:'电缆震动'
					},
					{
						url:require('../assets/images/ic_yj.png'),
						alt:'一级重要用户',
						title:'一级重要用户'
					},
					{
						url:require('../assets/images/ic_ej.png'),
						alt:'二级重要用户',
					    title:'二级重要用户'
					},
					{
						url:require('../assets/images/ic_jg.png'),
						alt:'景观重要用户',
					    title:'景观重要用户'
					},
					// {
					// url:require('../assets/images/ic_dsd.png'),
					// alt:'蹲守点',
					// title:'蹲守点'
					// },
				 ]
			 }
    },
	  methods:{
		  shows(){
			  this.show=!this.show //图例的显示隐藏
			  this.$parent.$parent.$parent.zkCenter= !this.$parent.$parent.$parent.zkCenter  //中控的显示隐藏
		  }
	},
	
}
</script>

<style scoped>
   .mapContain{
		 position: relative;
	 }
	.mapContain  .btn_list{
		position: absolute;
		background-color:rgba(20,60,111,.8);
		background-color:rgb(20,60,111,.8);
		width: 50px;
		height: 50px;
		right: 40px;
		bottom: 50px;
		cursor: pointer;
		border-radius: 5px;
	 }
	 .mapContain  .btn_list span{
		 width: 40px;
		height: 40px;
		display: block;
		background-image: url('../assets/images/ic_tl.png');
		background-position:center;
		background-repeat: no-repeat;
		background-size: cover;
		margin: 6px auto;
	 }
	 .mapContain  .btn_list:hover span{
		 background-image: url('../assets/images/ic_tl_sel.png');
	 }
	 .mapContain .btn_list img{
		  width: 100%;
	 }
	  .mapContain .listbar{
			width: 1005px;
			height: 200px;
			background-color:rgba(20,60,111,.8);
			background-color:rgb(20,60,111,.8);
			position: absolute;
			right: 100px;
			bottom: 50px;
			border-radius: 5px;
			padding: 8px;
		}
		.listbar li{
			float: left;
			width: 125px;
			margin:8px;
		}
	 .listbar li i{
			margin-right: 3px;
		}
	.listbar li i img{
		display: inline-block;
		vertical-align: middle;
		width: 32px;
		height: 32px;
		
	}
	.listbar li span{
		display: inline-block;
		color: #ffffff;
		font-size: 15px;
	}
</style>
