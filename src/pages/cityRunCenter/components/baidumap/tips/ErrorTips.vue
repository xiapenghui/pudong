<template>
  <div>
    <div
      class="boxerror"
      :style="{width:'210px',height:'70x',top:'1px',left:'600px'}"  v-show="isShow==true">
      <h4>{{errorText}}</h4>
    </div>
  </div>
</template>

<script>
import eventBus from "../base/EventBus";
import Console from "../support/Console";
import { setTimeout } from 'timers';

export default {
  data() {
    return {
      isShow: false, //tips显示隐藏
      errorText: "" //错误信息
    };
  },
  methods: {
    errorFn(text) {
      this.errorText=text;
      this.isShow=true;
      let _this=this
      setTimeout(function(){
        _this.isShow=false;
      },2000)
    }
  },
  mounted() {
    eventBus.on("graphic-ErrorTips", this.errorFn); //错误提示信息
  }
};
</script>

<style scoped>
.mapContain {
  position: relative;
}
.boxerror {
  position: absolute;
  /* width: 375px;
	  height: 247px; */
  /* 	  top: 200px;
	  left: 200px; */
  padding: 20px 15px 0 24px;
  background-image: url(../assets/images/menuTips/pop_2.png);
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 999;
}
.boxerror h4 {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
  line-height: 22px;
  font-size: 18px;
  color: #f70f0f;
	text-align: center;
}
</style>
