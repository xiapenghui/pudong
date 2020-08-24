<template>
  <div>
    <!-- 电子图影像图切换 -->
    <div class="electron_tab">
      <span
        v-for="(item,index) in liList"
        @click="addClass(index)"
        v-bind:class="{ classwrite:index==current}"
      >{{item.title}}</span>

      <div class="electron_tab_child" v-show="isShows==true">
        <label class="line_tab">
          <input
            type="radio"
            :id="radio_one[0].radios"
            :name="radio_one[0].name"
            :checked="radio_one0"
            @change="radioOne(0)"
          />
          <span>{{radio_one[0].title}}</span>
        </label>
        <label class="line_tab">
          <input
            type="radio"
            :id="radio_one[1].radios"
            :name="radio_one[1].name"
            :checked="radio_one1"
            @change="radioOne(1)"
          />
          <span>{{radio_one[1].title}}</span>
        </label>
      </div>
    </div>

    <!-- 比例尺tab -->
    <div
      class="scale_tab"
      id="scale_tab"
      v-show="isShow==true"
      :style="{top:top+'px',left:left+'px'}"
    >
      <label>
        <input
          type="radio"
          :id="radio_list[0].radios"
          :name="radio_list[0].name"
          :checked="indexType0"
          @change="changeRadio(0)"
        />
        <span>{{radio_list[0].title}}</span>
      </label>
      <label>
        <input
          type="radio"
          :id="radio_list[1].radios"
          :name="radio_list[1].name"
          :checked="indexType1"
          @change="changeRadio(1)"
        />
        <span>{{radio_list[1].title}}</span>
      </label>
      <!-- <template v-for="(item,index) in radio_list">
		    <label :for="item.radios">
		      <input type="radio" :id="item.radios" :name="item.name" :checked="index == 0" @change="changeRadio(index)">
		      <span>{{item.title}}</span>
		    </label>
      </template>-->
    </div>

    <div class="btn_list" v-show="show==false">
      <ul>
        <li v-for="(item,index) in piclist" :key="index">
          <span
            :style="{backgroundImage:item.isHover ? 'url('+item.url+')' : 'url('+item.hover+')'}"
            :title="item.title"
            @mouseover="onOver(item,index)"
            @mouseleave="onLeave(item,index)"
            @click="onClick(item,index)"
          ></span>
        </li>
      </ul>
    </div>
    <div class="btn_click" @click="toggleShow">
      <span></span>
    </div>
  </div>
</template>
<script>
import eventBus from "../base/EventBus";
import layerConfig from "../../baidumap/layerConfig";

export default {
  data() {
    return {
      indexType0: true, //比例尺控制图层
      indexType1: false, //比例尺控制图层
      radio_one0: true, //常规
      radio_one1: false, //深蓝黑
      controlName: null, //图层控制
      show: true,
      isShow: false,
      isShows: false,
      current: 0,
      top: "15",
      left: "1220",
      liList: [{ title: "电子图" }, { title: "影像图" }],
      radio_list: [
        {
          title: "随比例尺显示",
          name: "radio",
          radios: "radio_1"
        },
        {
          title: "不随比例尺显示",
          name: "radio",
          radios: "radio_2"
        }
      ],
      radio_one: [
        {
          title: "常规",
          name: "radioOne",
          radios: "radioOne_1"
        },
        {
          title: "深蓝黑",
          name: "radioOne",
          radios: "radioOne_2"
        }
      ],
      piclist: [
        {
          isHover: true,
          url: require("../assets/images/ic_zhzx_sel.png"),
          hover: require("../assets/images/ic_zhzx_nor.png"),
          title: "指挥中心",
          class: "flag",
          layerName: "CommandCentreLayer",
          controlName: ["CommandCentreLayer"]
        },
        {
          isHover: true,
          url: require("../assets/images/ic_kv_sel.png"),
          hover: require("../assets/images/ic_kv_nor.png"),
          title: "变电站",
          class: "stop",
          layerName: "PowerStationLayer",
          controlName: [
            "PowerStationLayer10kv",
            "PowerStationLayer35kv",
            "PowerStationLayer110kv"
          ]
        },
        {
          isHover: true,
          url: require("../assets/images/ic_zykh_sel.png"),
          hover: require("../assets/images/ic_zykh_nor.png"),
          title: "保电对象",
          class: "big_g",
          layerName: "ProtectionObjectLayer",
          controlName: ["ProtectionObjectLayer"]
        },
        {
          isHover: true,
          url: require("../assets/images/ic_dxxx_nor.png"),
          hover: require("../assets/images/ic_dxxx_sel.png"),
          title: "4",
          class: "house",
          layerName: "",
          controlName: [""]
        },
        {
          isHover: true,
          url: require("../assets/images/ic_danger_sel.png"),
          hover: require("../assets/images/ic_danger_nor.png"),
          title: "隐患点等级",
          class: "warning",
          layerName: "HiddenHefectsLayer",
          controlName: ["HiddenHefectsLayer"]
        },
        {
          isHover: true,
          url: require("../assets/images/ic_construction_sel.png"),
          hover: require("../assets/images/ic_construction_nor.png"),
          title: "施工现场",
          class: "build",
          layerName: "ConstructionSiteLayer",
          controlName: ["ConstructionSiteLayer", "WorkTicketLayer"]
        },
        {
          isHover: true,
          url: require("../assets/images/ic_troops_sel.png"),
          hover: require("../assets/images/ic_troops_nor.png"),
          title: "网格化运维",
          class: "personal",
          layerName: "GridPersonnelLayer",
          controlName: ["GridPersonnelLayer"]
        },
        {
          isHover: true,
          url: require("../assets/images/ic_well_sel.png"),
          hover: require("../assets/images/ic_well_nor.png"),
          title: "井盖状况",
          class: "panel",
          layerName: "IntelligentCoverYSLayer",
          controlName: ["IntelligentCoverYSLayer"]
        },
        {
          isHover: true,
          url: require("../assets/images/ic_dlzd_sel.png"),
          hover: require("../assets/images/ic_dlzd_nor.png"),
          title: "电缆震动",
          class: "cable",
          layerName: "CableVibrationLayer",
          controlName: ["CableVibrationLayer"]
        },
        {
          isHover: true,
          url: require("../assets/images/ic_zndb.png"),
          hover: require("../assets/images/ic_zndb_sel.png"),
          title: "智能电表",
          class: "cable",
          layerName: "HouseholdTableLayer",
          controlName: [""]
        }
      ],
      vmapD: "",
      mapD: "",
      BMapD: "",
      Layer: ""
    };
  },
  methods: {
    radioOne(index) {
      this.$parent.$parent.defaultBlack(index);
    },

    toggleShow() {
      this.isShow = false;
      this.show = !this.show;
    },
    // 电子图影像图切换
    addClass(index) {
      this.current = index;
      this.$parent.$parent.gogo(index);
      if (index == "0") {
        this.isShows = !this.isShows;
      } else {
        this.isShows = false;
      }
    },

    // 选中图层事件
    onOver(item, index) {
      this.controlName = null; //清空选中的图层
      if (item.controlName != null) {
        let layers = canvasRender.default.layers; //当前所有图层状态
        this.controlName = item.controlName; //当前选中的图层
        for (let i = 0; i < layers.length; i++) {
          if (layers[i].name == item.controlName[0]) {
            if (
              layers[i].minVisibleZoom == 0 &&
              layers[i].maxVisibleZoom == 10
            ) {
              //1
              this.indexType0 = false; //比例尺控制图层
              this.indexType1 = true; //比例尺控制图层
            } else {
              //0
              this.indexType0 = true; //比例尺控制图层
              this.indexType1 = false; //比例尺控制图层
            }
          }
        }
      }

      this.isShow = true;
      let box = document.getElementById("scale_tab");
      let top = box.offsetTop;
      let left = box.offsetLeft;
      if (index >= 5) {
        this.left = (index - 5) * 60 + 1300;
        this.top = 215;
      } else {
        this.left = index * 60 + 1300;
        this.top = 15;
      }
    },

    //(不)随比例尺控制图层
    changeRadio(index) {
      if (this.controlName == null) {
        return;
      }

      let layers = canvasRender.default.layers; //当前图层状态
      let controlName = this.controlName; //当前选中的图层
      let lConfig = layerConfig; //图层配置 layerConfig.js
      for (let j = 0; j < controlName.length; j++) {
        for (let i = 0; i < lConfig.length; i++) {
          if (controlName[j] == lConfig[i].name) {
            if (index == "0") {
              //随比例尺
              layers[i].minVisibleZoom = lConfig[i].minVisibleZoom;
              layers[i].maxVisibleZoom = lConfig[i].maxVisibleZoom;
            } else {
              //不随比例尺
              layers[i].minVisibleZoom = 0;
              layers[i].maxVisibleZoom = 10;
            }
          }
        }
      }
    },

    onLeave(item, index) {
      // item.isHover = true;
    },

    //图层点击事件
    onClick(item, index) {
      item.isHover = !item.isHover;
      this.eventBus = eventBus;
      if (item.layerName != "") {
        this.eventBus.emit("layer-visible-" + item.layerName, {
          //图层显示隐藏
          layer: item
        });
        if (item.layerName == "HouseholdTableLayer") {
          //智能电表
          let layers = canvasRender.default.layers;
          for (let i = 0; i < layers.length; i++) {
            if (layers[i].$data.name == "HouseholdTableLayer") {
              this.eventBus.emit("showInfo-HplcInfo", layers[i].$data.visible);
            }
          }
        }
      }
    },
    //专题控制
    switchLayer(type) {
      var piclist = this.piclist; //图层控制
      let layers = canvasRender.default.layers; //图层 121.659898,31.132255
      canvasRender.default.eventBus.emit("canvas-renderer-fly", { x: 121.659898, y: 31.132255, zoom: 13 });//定位
      if (type == "综合监控") {
        //专题1
        for (var i = 0; i < piclist.length; i++) {
          if (
            piclist[i].layerName == "PowerStationLayer" ||
            piclist[i].layerName == "HiddenHefectsLayer" ||
            piclist[i].layerName == "CableVibrationLayer" ||
            piclist[i].layerName == "IntelligentCoverYSLayer"
          ) {
            piclist[i].isHover = true; //显示图层控制
            for (var c = 0; c < piclist[i].controlName.length; c++) {
              for (var l = 0; l < layers.length; l++) {
                if (piclist[i].controlName[c] == layers[l].name) {
                  layers[l].visible = true; //显示专题图层
                }
              }
            }
          } else {
            if (piclist[i].layerName == "HouseholdTableLayer") {
              piclist[i].isHover = true; //智能表计隐藏图层控制
            } else {
              piclist[i].isHover = false; //隐藏图层控制
            }
            for (var c = 0; c < piclist[i].controlName.length; c++) {
              for (var l = 0; l < layers.length; l++) {
                if (piclist[i].controlName[c] == layers[l].name) {
                  layers[l].visible = false; //隐藏专题图层
                }
              }
            }
          }
        }
      } else {
        //专题2
        for (var i = 0; i < piclist.length; i++) {
          if (
            piclist[i].layerName == "ConstructionSiteLayer" ||
            piclist[i].layerName == "GridPersonnelLayer"
          ) {
            piclist[i].isHover = true; //显示图层控制
            for (var c = 0; c < piclist[i].controlName.length; c++) {
              for (var l = 0; l < layers.length; l++) {
                if (piclist[i].controlName[c] == layers[l].name) {
                  layers[l].visible = true; //显示专题图层
                }
              }
            }
          } else {
            if (
              piclist[i].layerName == "HouseholdTableLayer" ||
              piclist[i].layerName == ""
            ) {
              piclist[i].isHover = true; //智能表计隐藏图层控制
            } else {
              piclist[i].isHover = false; //隐藏图层控制
            }
            for (var c = 0; c < piclist[i].controlName.length; c++) {
              for (var l = 0; l < layers.length; l++) {
                if (piclist[i].controlName[c] == layers[l].name) {
                  layers[l].visible = false; //隐藏专题图层
                }
              }
            }
          }
        }
      }
    }
  },
  mounted() {
    eventBus.on("switch-switchLayer", this.switchLayer);
  }
};
</script>

<style scoped>
.classwrite {
  color: #ffffff;
}
.mapContain {
  position: relative;
}
.mapContain .scale_tab {
  position: absolute;
  /*  top: 20px;
  right: 400px; */
  color: #fff;
  width: 150px;
  height: 70px;
  background-color: rgba(20, 60, 111, 0.8);
  background-color: rgb(20, 60, 111, 0.8);
  border-radius: 5px;
  z-index: 99;
}
.mapContain .scale_tab label {
  font-weight: normal;
}
.mapContain .scale_tab .radio {
  display: inline-block;
  font-size: 14px;
  padding: 8px 5px;
}

.mapContain .electron_tab {
  position: absolute;
  top: 40px;
  right: 40px;
  color: #fff;
  width: 170px;
  height: 40px;
  line-height: 40px;
  padding: 0 15px;
  background-color: rgba(20, 60, 111, 0.8);
  background-color: rgb(20, 60, 111, 0.8);
  border-radius: 5px;
  font-size: 16px;
  color: #a7abb7;
  z-index: 99;
}

.electron_tab .electron_tab_child span:nth-child(2):after {
  display: none;
}

.electron_tab_child .line_tab {
  display: block;
}
.electron_tab_child .line_tab span {
  margin-left: 10px !important;
}

.electron_tab_child {
  width: 170px;
  background-color: rgb(20, 60, 111, 0.8);
  background-color: rgba(20, 60, 111, 0.8);
  margin-left: -14px;
  margin-top: 5px;
  padding: 0 15px;
  border-radius: 5px;
}
.electron_tab_child .line_tab {
  font-weight: normal;
  color: #fff;
}

.mapContain .electron_tab span {
  cursor: pointer;
}
.mapContain .electron_tab span:nth-child(2) {
  margin-left: 40px;
  position: relative;
}
.mapContain .electron_tab span:nth-child(2):after {
  position: absolute;
  top: 0px;
  left: -18px;
  width: 0.4px;
  height: 25px;
  content: "";
  background: #918f8f;
}

.mapContain .btn_list {
  position: absolute;
  top: 90px;
  right: 110px;
  width: 310px;
  height: 120px;
  background-color: rgba(20, 60, 111, 0.8);
  background-color: rgb(20, 60, 111, 0.8);
  border-radius: 5px;
  padding: 5px;
}

.mapContain .btn_list li {
  background: #0d2d56;
  width: 50px;
  height: 50px;
  float: left;
  margin: 2px 5px;
  border-radius: 5px;
  border: 1px solid #0d2d56;
}
.mapContain .btn_list li:hover {
  border: 1px solid #43f3f3;
}
.mapContain .btn_list li span,
.mapContain .btn_click span {
  width: 35px;
  height: 35px;
  display: block;
  margin: 7px auto;
  text-align: center;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  cursor: pointer;
}
.mapContain .btn_click {
  position: absolute;
  top: 90px;
  right: 40px;
  width: 50px;
  height: 50px;
  padding: 0 8px;
  background-color: rgba(20, 60, 111, 0.8);
  background-color: rgb(20, 60, 111, 0.8);
  border-radius: 5px;
}
.mapContain .btn_click span {
  background-image: url(../assets/images/ic_zt.png);
}
.mapContain .btn_click span:hover {
  background-image: url(../assets/images/ic_zt_sel.png);
  transition: all 0.3s;
}

.mapContain .scale_tab {
  padding: 10px;
}
.mapContain .scale_tab label {
  display: inline-block;
  font-size: 14px;
  line-height: 25px;
  cursor: pointer;
}
.mapContain .scale_tab label span {
  margin-left: 10px;
  display: inline-block;
  vertical-align: middle;
}
/* input[type="radio"] {
  width: 15px;
  height: 15px;
  appearance: none;
  position: relative;
  cursor: pointer;
}
input[type="radio"]:before {
  content: "";
  width: 15px;
  height: 15px;
  border: 1px solid #ffffff;
  display: inline-block;
  border-radius: 50%;
  vertical-align: middle;
}
input[type="radio"]:checked:after {
  content: "";
  position: absolute;
  top: 5px;
  left: 4px;
  display: block;
  width: 10px;
  height: 10px;
  background: #fff;
  text-align: center;
  border-radius: 50%;
  vertical-align: middle;
} */
</style>
