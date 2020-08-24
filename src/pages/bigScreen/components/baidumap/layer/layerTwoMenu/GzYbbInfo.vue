<template>
  <div>
    <div class="boxmune" :style="{width:'544px',height:'197px',top:'120px'}" v-show="isShow==true" @click="closeFn">
      <h4>
        {{title}}
        <i @click="closeFn"></i>
      </h4>
      <!-- <div class="boxdetalis">
        <ul>
          <li v-for="(item,index) in itmeData">
            {{item.type}}
            <span>{{item.detail}}</span>
          </li>
        </ul>
      </div> -->
    </div>
  </div>
</template>

<script>
import eventBus from "../../base/EventBus";

export default {
  data() {
    return {
      isShow: false, //tips显示隐藏
      title: "", //标题
      itmeData: [] //tips字段数据
    };
  },
  methods: {
    //预报备
    clickMenuTips() {
      this.isShow = true;
      // this.title = itme.twoTitle;
      // this.itmeData = itme.detail;
    },
    //关闭tips
    closeFn() {
      this.isShow = false;
      this.$emit("close", false);
    }
  },
  computed: {},
  watch: {
    show(newVal) {
      this.isShow = newVal;
    }
  },
  mounted() {
    eventBus.on("showVue-GzYbbInfo", this.clickMenuTips); //监听图层tips按钮
  }
};
</script>

<style scoped>
.mapContain {
  position: relative;
}
.boxmune {
  position: absolute;
  padding: 15px 15px 0 24px;
  background-image: url(../../assets/images/menuTips/ic_dxnr.png);
	/* background-color: rgba(11,31,57,.7);
	background-color: rgb(11,31,57,.7);
	border: 1px solid #03c6cc; */
  z-index: 999;
}
.boxmune h4 {
  position: relative;
  width: 100%;
  margin-bottom: 15px;
  font-size: 18px;
  color: #19b7bb;
}
/* .boxmune h4::after {
  content: "";
  position: absolute;
  left: -23px;
  bottom: -10px;
  width: 110%;
  height: 1px;
  background-color: #03c6cc;
} */
.boxmune h4 i {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 25px;
  height: 25px;
  background: url(../../assets/images/menuTips/ic_close.png) no-repeat center;
  background-size: cover;
  transition: all 0.6s;
}
.boxmune h4 i:hover {
  transform: rotate(180deg);
  transition: all 0.6s;
}
.boxdetalis {
  width: 100%;
  height: 350px;
  margin-bottom: 15px;
  line-height: 26px;
  font-size: 16px;
  color: #fff;
  overflow-y: auto;
}
.boxdetalis span {
  color: #03c6cc;
  margin-left: 5px;
	}
</style>
