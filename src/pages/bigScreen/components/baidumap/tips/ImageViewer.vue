<template>
	<div id="index">
		<ul>
			<li v-for="(item, index) in imgArr" :key="index">
				<a href="javascript:void(0)" data-magnify="gallery" :data-src="item">
					<img :src="item"/>
				</a>
			</li>
		</ul>
	</div>
</template>

<script>
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';
export default {
    name: 'ImageViewer',
    props:{
        imgArr:{
            type: Array,
            require: true
        },
    },
    data() {
        return {
            
        };
    },
	mounted() {
		let ViewerDom = document.getElementById('index');
		let viewer = new Viewer(ViewerDom, {
		

		  });
	}
}
</script>

<style scoped>
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
