<template>
	<div :style="{ width: width + 'px', top: top + 'px', left: left + 'px' }" v-show="show">
		<div class="sectionTop"><div class="sectiontitle">研判结果</div></div>
		<div class="sectionIn">
			<div class="smallTitle onetitle">
				<i class="icon_right"></i>
				输电
			</div>
			<div class="tdjp_btn">
				<a href="javascript:;">通道监拍</a>
				<span class="time">
					<i></i>
					<b>2019-05-28 07:00:10</b>
				</span>
				<span>伦12沈括001号 (大号侧NG) 四周发现有起吊机</span>
			</div>
			<div class="video"></div>
		</div>
		<div class="pic_center"></div>
	</div>
</template>

<script>
export default {
	name: 'tdjpSection',
	data() {
		return {};
	},
	props: {
		width: {
			type: Number,
			default: 1282
		},
		// height: {
		//   type: Number,
		//   default: 350
		// },
		left: {
			type: Number,
			// default: 2882
			default: 2928
		},
		top: {
			type: Number,
			default: 124
		},
		show: {
			type: Boolean,
			default: true
		},
		itemWidth: {
			type: Number,
			default: 447
		}
	},
	computed: {},
	mounted() {}
};
</script>

<style scoped>
.smallTitle {
	font-size: 18px;
	color: #ffffff;
	margin-bottom: 10px;
}

.video {
	width: 100%;
	height: 350px;
	background-image: url(../assets/images/pic_video.jpg);
	background-repeat: no-repeat;
	background-size: cover;
	background-position: center;
	border: 2px solid #d73f4c;
}

.tdjp_btn {
	margin: 10px 0;
}
.tdjp_btn a,
.tdjp_btn span {
	display: inline-block;
}
.tdjp_btn a {
	color: #ffffff;
	padding: 5px 10px;
	background: #1a3061;
	font-size: 15px;
	margin-right: 10px;
}
.tdjp_btn span {
	color: #d73f4c;
	letter-spacing: 1px;
	font-size: 16px;
}
.tdjp_btn span.time i {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: #d73f4c;
	display: inline-block;
	margin: 10px 10px 0;
}
.tdjp_btn span.time {
	margin: 0 10px;
}

.pic_center {
	width: 100%;
	height: 110px;
	background-image: url(../assets/images/sudian.png);
	background-repeat: no-repeat;
	background-size: contain;
	margin: 25px 0;
}

.smallTitle .icon_right {
	width: 30px;
	height: 30px;
	background: url(../assets/images/ic_triangle.png) no-repeat;
	background-repeat: no-repeat;
	background-size: contain;
	background-position: center;
	display: inline-block;
	vertical-align: middle;
	margin-right: 2px;
}
.hasLeftSection {
	background: none;
}
</style>
