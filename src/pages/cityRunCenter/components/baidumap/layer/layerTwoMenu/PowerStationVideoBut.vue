<template>
  <div class="liveVideoBut">
    <a style="padding: 4px;color: #faf6f6;" @click="playVideo">{{but}}</a>
  </div>
</template>

<script>
import eventBus from "../../base/EventBus";

export default {
  components: {},
  data() {
    return {
      but: "打开电站视频"
    };
  },
  computed: {},
  methods: {
    playVideo() {
      if (this.but == "打开电站视频") {
        this.but = "关闭电站视频";
        eventBus.emit("showVideo-PowerStationVideo", true);
      } else {
        this.but = "打开电站视频";
        eventBus.emit("showVideo-PowerStationVideo", false);
        eventBus.emit("clossVideo-PowerStationVideo", );//关闭时销毁
      }
    }
  }
};
</script>

<style scoped>
.liveVideoBut {
  display: block;
  position: absolute;
  width: 127px;
  height: 28px;
  left: 1602px !important;
  top: -29px !important;
  background: #293d74;
  /* border: 1px solid #008ed2; */
	text-align: center;
	border-radius: 5px;
  font-size: 17px;
}
</style>

