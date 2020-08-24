<template>
	<div :style="{width:width+'px',height:height+'px',top:top+'px',left:left+'px'}" v-show="show">
		<div class="sectionMain">
			<div class="sectionHead">
				<div class="sectionTop">
					<div class="sectiontitle">作业安全管控</div>
				</div>
			</div>
			<div class="sectionBody sectionBody9">
				<jrgz-section></jrgz-section>
				<gzp-section></gzp-section>
			</div>
		</div>
	</div>

</template>
<script>
	import gzpSection from './GzpSection.vue'
	import jrgzSection from './JrgzSection.vue'

	export default {
		components: {
			gzpSection,
			jrgzSection
		},
		name: 'xczySection',
		props: {
			width: {
				type: Number,
				default: 980
			},
			height: {
				type: Number,
				default: 942
			},
			left: {
				type: Number,
				default: 64
			},
			top: {
				type: Number,
				default: 112
			},
			show: {
				type: Boolean,
				default: true
			},
		},
		data() {
			return {
			}
		},
		methods: {
			setId(pid, id) {
				return this.$parent.setId(pid, id)
			},
			msgInterval(dom1, dom2, times){
				this.$parent.msgInterval(dom1, dom2, times);
			}
		},
	
		mounted() {

		

		},




	}
</script>
