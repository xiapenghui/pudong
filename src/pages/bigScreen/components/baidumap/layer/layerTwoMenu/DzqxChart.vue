<template>
  <div>
    <div class="boxmune" :style="{width:'670px',height:'330px',top:'270px'}" v-show="isShow==true">
      <h4>
        {{title}}
        <i @click="closeFn"></i>
      </h4>
      <div class="coverCss">
        <template v-for="(item,index) in dataList">
          <li :class="{'active':activeIndex == index}">
            <a @click="liAClick(item.name,index)">{{item.name}}</a>
          </li>
        </template>
      </div>
      <div id="dzqxChart"></div>
    </div>
  </div>
</template>

<script>
import eventBus from "../../base/EventBus";
import Console from "../../support/Console";

export default {
  props: {
    width: {
      type: Number,
      default: 375
    },
    height: {
      type: Number,
      default: 247
    },
    top: {
      type: Number,
      default: 200
    },
    left: {
      type: Number,
      default: 200
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeIndex: 0,
      dataList: [{ name: "温度" }, { name: "油位" }, { name: "局放" }],
      //井盖曲线
      coverOption: {
        //backgroundColor: "#394056",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: "#57617B"
            }
          }
        },
        color: ["#0455C3", "#fc0c09"],
        grid: {
          left: "2%",
          right: "3%",
          top: "13%",
          bottom: "2%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#FFFFFF"
              }
            },
            data: [
              "13:00",
              "13:05",
              "13:10",
              "13:15",
              "13:20",
              "13:25",
              "13:30"
            ]
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "",
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#FFFFFF"
              }
            },
            // axisLabel: {
            //   margin: 10,
            //   textStyle: {
            //     fontSize: 10
            //   }
            // },
            splitLine: {
              show: false,
              lineStyle: {
                color: "#F03738"
              }
            }
          }
        ],
        series: [
          {
            name: "",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                //color:'rgba(71, 255, 255, 1)',
                width: 0.1
              }
            },
            areaStyle: {
              normal: {
                //this.$
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(4, 85, 195, 1)"
                    },
                    {
                      offset: 0.7,
                      color: "rgba(4, 85, 195, 0.1)"
                    }
                  ],
                  false
                ),
                shadowColor: "rgba(8, 85, 195, 0.5)",
                shadowBlur: 10
              }
            },
            data: [20, 15, 25, 22, 18, 26, 19]
          }
        ]
      },
      isShow: false, //tips显示隐藏
      title: "", //标题
      itmeData: "", //当前井盖信息
      nameType: "温度" //当前选中类型
    };
  },
  methods: {
    //关闭tips
    closeFn() {
      this.isShow = false;
      this.$emit("close", false);
    },
    //井盖曲线
    clickMenuTips({ itme }) {
      this.isShow = true;
      this.title = "监测曲线";
      this.itmeData = itme;
      this.createChrat(); //渲染图表
    },
    createChrat() {
      var xData = []; //时间
      var sData1 = []; //series1数据

      var data = this.itmeData.chartData;//曲线数据

      for (var i = 0; i < data.length; i++) {
        xData.push(data[i].sj);
        if (this.nameType == "温度") {
          this.coverOption.yAxis[0].name = "单位：℃";
          sData1.push(data[i].wd)
        }
        if (this.nameType == "油位") {
          this.coverOption.yAxis[0].name = "单位：%";
          sData1.push(data[i].yw)
        }
        if (this.nameType == "局放") {
          this.coverOption.yAxis[0].name = "单位：mV";
          sData1.push(data[i].jf)
        }
      }

      this.coverOption.xAxis[0].data = xData; //x时间
      this.coverOption.series[0].data = sData1; //series1
      this.coverOption.series[0].name = this.nameType;

      //鼠标移动显示
      this.coverOption.tooltip.formatter = function(params, ticket, callback) {
        let val =
          "<p><span  id='echarSPAN'>时间：" +
          params[0].axisValue +
          "</span></p><p><span  id='echarSPAN'>" +
          params[0].seriesName +
          "：" +
          params[0].value +
          "</span></p>";
        return val;
      };

      let myChart = this.$echarts.init(document.getElementById("dzqxChart"));
      myChart.setOption(this.coverOption);
    },
    liAClick(type, index) {
      this.nameType = type;
      this.activeIndex = index;
      this.createChrat();
    }
  },
  computed: {},
  watch: {
    show(newVal) {
      this.isShow = newVal;
    }
  },
  mounted() {
    eventBus.on("graphic-clickTwoMenu-ProtectionDsdLayer", this.clickMenuTips); //监听图层tips按钮
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
  background-image: url(../../assets/images/menuTips/pop_2.png);
  background-repeat: no-repeat;
  background-size: contain;
  z-index: 999;
}
.boxmune h4 {
  position: relative;
  width: 100%;
  margin-bottom: 15px;
  font-size: 18px;
  color: #19b7bb;
}
.boxmune h4::after {
  content: "";
  position: absolute;
  left: -23px;
  bottom: -10px;
  width: 105%;
  height: 1px;
  background-color: #03c6cc;
}
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
.boxmune .coverCss {
  width: 100%;
  height: 35px;
  line-height: 40px;
  margin-bottom: 10px;
}
.boxmune .coverCss li {
  list-style: none;
  float: left;
  margin-right: 20px;
}
.boxmune .coverCss li a {
  font-size: 14px;
  color: #fff;
  text-align: center;
}
.boxmune .coverCss li.active {
  opacity: 1;
  border-bottom: solid 1px #40d4ff;
}
.boxmune #dzqxChart {
  width: 637px;
  height: 220px;
}
</style>
