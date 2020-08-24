<template>
  <div :style="{width:width+'px',height:height+'px',top:top+'px',left:left+'px'}" v-show="show">
    <div class="sectionTop">
      <div class="sectiontitle">异常画面</div>
    </div>
    <div class="sectionIn">
      <iframe name="myiframe" id="myrame"
        src="https://s1.zhysdxl.com:5412/zhpd/views/approveNew.html?lineID=5467" frameborder="0"
        align="left" width="100%" height="100%" scrolling="no">
         </iframe>
        <!-- <iframe name="myiframe" id="myrame"
        src="https://s1.zhysdxl.com:5412/zhpd/views/zhjpVisual.html?lineID=5467" frameborder="0"
        align="left" width="100%" height="100%" scrolling="no">
         </iframe> -->
      <!-- <div class="sectionInLeft"></div>
      <div class="sectionInBody">
        <ul ref="articleUl" class="articleUl">
          <li :style="{width:itemWidth+'px'}" class="articleLi" v-for="items in msgData">
            <div class="articleItem" v-for="item in items">
              <div class="articleItemIn">
                <img :src="item" alt="">
              </div>
            </div>
          </li>
        </ul>
        <ul ref="articleUl2" class="articleUl">
          <li :style="{width:itemWidth+'px'}" class="articleLi" v-for="items in msgData">
            <div class="articleItem" v-for="item in items">
              <div class="articleItemIn">
                <img :src="item" alt="">
              </div>
            </div>
          </li>
        </ul>
      </div> -->
    </div>
  </div>
</template>

<script>

    export default{
        name: 'tdjpSection',
        data(){
            return {
              articleData: [
                    require('../assets/images/bg_number.png'),
                    require('../assets/images/ic_bdzjs.png'),
                    require('../assets/images/ic_pdzjs.png'),
                    require('../assets/images/ic_video.png'),
                    require('../assets/images/ic_xljp.png'),
                    require('../assets/images/bg_number.png'),
                    require('../assets/images/ic_bdzjs.png'),
                    require('../assets/images/ic_pdzjs.png'),
                    require('../assets/images/ic_video.png'),
                    require('../assets/images/ic_xljp.png'),
                ],
          }
        },
        props:{
          width: {
            type: Number,
            default: 1282
          },
          height: {
            type: Number,
            default: 660
          },
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
        computed: {
          // msgData(){
          //   let data = [];
          //   let len = this.articleData.length;
          //   for(let i=0;i<Math.ceil(len/2);i++){
          //       if( len%2 !== 0 && i === Math.ceil(len/2)-1 ){
          //         data.push([ this.articleData[i*2] ]);
          //         break;
          //       }
          //       data.push([ this.articleData[i*2], this.articleData[i*2+1] ]);
          //   }
          //   return data;
          // },
        },
        mounted(){
          // this.$parent.setWidth(this.$refs.articleUl, this.$refs.articleUl2);
          // if(this.articleData.length > 4){
          //   this.$parent.leftInterval(this.$refs.articleUl, this.$refs.articleUl2, 6000);
          // }
        }
    }

</script>

<style scoped>

</style>
