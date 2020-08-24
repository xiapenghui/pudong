<template>
  <div :style="{width:width+'px',height:height+'px',top:top+'px',left:left+'px'}" v-show="show">
    <div class="sectionTop">
      <div class="sectiontitle">智能井盖</div>
    </div>
    <div class="sectionIn">
      <div class="sectionInBody">
				<ul ref="articleUl" class="articleUl">
				  <li :style="{width:itemWidth+'px'}" class="articleLi" v-for="(items,index) in msgData">
				    <div class="articleItem articleHeightItem"  
						@click="onFun(index)"
						@mouseover="onOver(index)"
            @mouseleave="onLeave(index)">
				      <div class="articleItemIn">
				        <deviceDetail :device-data="items" />
				      </div>
				    </div>
				  </li>
				</ul>
				<ul ref="articleUl2" class="articleUl">
				  <li :style="{width:itemWidth+'px'}" class="articleLi" v-for="(items,index) in msgData">
				    <div class="articleItem articleHeightItem"
						  @click="onFun(index)"
						  @mouseover="onOver(index)"
					  	@mouseleave="onLeave(index)">
				      <div class="articleItemIn">
								<!-- <device-detail :device-data="items"></device-detail> -->
				        <deviceDetail :deviceData="items"/>
				      </div>
				    </div>
				  </li>
				</ul>
        <!-- <ul ref="articleUl" class="articleUl">
          <li :style="{width:itemWidth+'px'}" class="articleLi" v-for="items in msgData">
            <div class="articleItem" v-for="item in items">
              <div class="articleItemIn">
                <deviceDetail :deviceData="item" />
              </div>
            </div>
          </li>
        </ul>
        <ul ref="articleUl2" class="articleUl">
          <li :style="{width:itemWidth+'px'}" class="articleLi" v-for="items in msgData">
            <div class="articleItem" v-for="item in items">
              <div class="articleItemIn">
                <deviceDetail :deviceData="item" />
              </div>
            </div>
          </li>
        </ul> -->
      </div>
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
							 articleData:znjgInfo,
              // articleData: [
              //   {
              //     title: "井盖1",
              //     company: "上海浦东电力有限公司",
              //     people: "张三",
              //     contact: "18408762395"
              //   },
              //   {
              //     title: "井盖2",
              //     company: "上海浦东电力有限公司",
              //     people: "张三",
              //     contact: "18408762395"
              //   },
              //   {
              //     title: "井盖3",
              //     company: "上海浦东电力有限公司",
              //     people: "张三",
              //     contact: "18408762395"
              //   },
              //   {
              //     title: "井盖4",
              //     company: "上海浦东电力有限公司",
              //     people: "张三",
              //     contact: "18408762395"
              //   },
              //   {
              //     title: "井盖5",
              //     company: "上海浦东电力有限公司",
              //     people: "张三",
              //     contact: "18408762395"
              //   },
              //   {
              //     title: "井盖6",
              //     company: "上海浦东电力有限公司",
              //     people: "张三",
              //     contact: "18408762395"
              //   },
              //   {
              //     title: "井盖7",
              //     company: "上海浦东电力有限公司",
              //     people: "张三",
              //     contact: "18408762395"
              //   },
              //   {
              //     title: "井盖8",
              //     company: "上海浦东电力有限公司",
              //     people: "张三",
              //     contact: "18408762395"
              //   },
              //   {
              //     title: "井盖9",
              //     company: "上海浦东电力有限公司",
              //     people: "张三",
              //     contact: "18408762395"
              //   },
              //   {
              //     title: "井盖10",
              //     company: "上海浦东电力有限公司",
              //     people: "张三",
              //     contact: "18408762395"
              //   },
              // ]
          }
        },
        props:{
          width: {
            type: Number,
            default: 1050
          },
          height: {
            type: Number,
            default: 416
          },
          left: {
            type: Number,
            default: 61
          },
          top: {
            type: Number,
            default: 641
          },
          show: {
            type: Boolean,
            default: true
          },
          itemWidth: {
            type: Number,
            default: 492
          }
        },
        components: { deviceDetail },
        computed: {
          msgData(){
            let data = [];
            let len = this.articleData.length;
						data = this.articleData
						console.log("this.articleData",this.articleData)
            // for(let i=0;i<Math.ceil(len/2);i++){
            //     if( len%2 !== 0 && i === Math.ceil(len/2)-1 ){
            //       data.push([ this.articleData[i*2] ]);
            //       break;
            //     }
            //     data.push([ this.articleData[i*2], this.articleData[i*2+1] ]);
            // }
						console.log("data",data)
            return data;
          },
        },
				methods: {
					onFun(index) {
						console.log('onFun','点击')
					},
					onOver(index){
						// clearInterval(this.$parent.$data.clearLeft)
						console.log('悬浮')
					},
					onLeave(index){
						console.log('离开')
						// this.$parent.leftInterval(this.$refs.articleUl, this.$refs.articleUl2, 6000);
					}
				},
        mounted(){				
          this.$parent.setWidth(this.$refs.articleUl, this.$refs.articleUl2);
          if(this.articleData.length > 4){
            this.$parent.leftInterval(this.$refs.articleUl, this.$refs.articleUl2, 6000);
          }
        }
    }

</script>

<style scoped>
.articleHeightItem{
	height: 100%;
}
</style>
