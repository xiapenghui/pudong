<template>
  <div :style="{width:width+'px',height:height+'px',top:top+'px',left:left+'px'}" v-show="show">
    <div class="sectionTop">
      <div class="sectiontitle">通道监拍</div>
    </div>
    <div class="sectionIn">
      <div class="sectionInBody">
       <!-- <iframe name="myiframe" id="myrame" 
        src="https://s1.zhysdxl.com:5412/zhpd/views/autoCompanyPic.html?lineID=5467" frameborder="0" 
        align="left" width="100%" height="100%" scrolling="no">
         </iframe> -->
         <ul ref="articleUl" class="articleUl">
          <li :style="{width:itemWidth+'px'}" class="articleLi" v-for="items in msgData">
            <div class="articleItem" v-for="item in items">
              <div class="articleItemIn hasBorder">
                <img :src="item" alt="">
              </div>
            </div>
          </li>
        </ul>
        <ul ref="articleUl2" class="articleUl">
          <li :style="{width:itemWidth+'px'}" class="articleLi" v-for="items in msgData">
            <div class="articleItem" v-for="item in items">
              <div class="articleItemIn hasBorder">
                <img :src="item" alt="">
              </div>
            </div>
          </li>
        </ul> 
      </div>
    </div>
  </div>
</template>

<script>

    export default{
        name: 'tdjpSection',
        data(){
            return {
              articleData: [
                    require('../assets/images/picvideo/video01.jpg'),
                    require('../assets/images/picvideo/video02.jpg'),
                    require('../assets/images/picvideo/video03.jpg'),
                    require('../assets/images/picvideo/video04.jpg'),
                    require('../assets/images/picvideo/video05.jpg'),
                    require('../assets/images/picvideo/video06.jpg'),
                    require('../assets/images/picvideo/video07.jpg'),
                    require('../assets/images/picvideo/video10.jpg'),
                    require('../assets/images/picvideo/video11.jpg'),
                    require('../assets/images/picvideo/video12.jpg'),
                    require('../assets/images/picvideo/video13.jpg'),
                    require('../assets/images/picvideo/video14.jpg'),
                    require('../assets/images/picvideo/video15.jpg'),
                    require('../assets/images/picvideo/video16.jpg'),
                    require('../assets/images/picvideo/video17.jpg'),
                    require('../assets/images/picvideo/video18.jpg'),
                    require('../assets/images/picvideo/video19.jpg'),
                    require('../assets/images/picvideo/video20.jpg'),
                    require('../assets/images/picvideo/video21.jpg'),
                    require('../assets/images/picvideo/video22.jpg'),
                    require('../assets/images/picvideo/video23.jpg'),
                    require('../assets/images/picvideo/video24.jpg'),
                    require('../assets/images/picvideo/video25.jpg'),
                    require('../assets/images/picvideo/video26.jpg'),
                    require('../assets/images/picvideo/video27.jpg'),
                    require('../assets/images/picvideo/video28.jpg'),
                    require('../assets/images/picvideo/video29.jpg'),
                    require('../assets/images/picvideo/video30.jpg'),
                    require('../assets/images/picvideo/video31.jpg'),
                    require('../assets/images/picvideo/video32.jpg'),
                    require('../assets/images/picvideo/video33.jpg'),
                    require('../assets/images/picvideo/video34.jpg')
                   
                ],
          }
        },
        props:{
          width: {
            type: Number,
            default: 1050
          },
          height: {
            type: Number,
            default: 509
          },
          left: {
            type: Number,
            default: 61
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
            default: 492
          }
        },
        computed: {
          msgData(){
            let data = [];
            let len = this.articleData.length;
            for(let i=0;i<Math.ceil(len/2);i++){
                if( len%2 !== 0 && i === Math.ceil(len/2)-1 ){
                  data.push([ this.articleData[i*2] ]);
                  break;
                }
                data.push([ this.articleData[i*2], this.articleData[i*2+1] ]);
            }
            return data;
          },
        },
        methods: {

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

</style>
