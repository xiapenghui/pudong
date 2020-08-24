<template>
  <div>
    <div
      class="boxmune"
      :style="{width:'540px',height:'607px',top:'188px',left:'100px'}"
      v-show="isShow==true"
    >
      <div style="padding-top: 12px;width: 100%;height: 100%;">
        <iframe
          name="initZxdb"
          id="initZxdb"
          :src="singIframeUrl"
          frameborder="0"
          align="left"
          width="100%"
          height="100%"
          scrolling="no"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import MapService from "../../base/MapServiceUrl";
import eventBus from "../../base/EventBus";
import InitZxdbData from "./InitZxdbData";
///common-assets/plugins/singlePawn/initZxdb.html

export default {
  data() {
    return {
      singIframeUrl: "/common-assets/plugins/singlePawn/initZxdb.html", ///common-assets/plugins/singlePawn/singlePawn.html
      isShow: false, //tips显示隐藏
      title: "", //标题
      zxdbArr: [], //在线
      dbppryArr: [] //单兵匹配人员
    };
  },
  methods: {
    //初始化在线单兵
    zxdbInit() {
      var list = $("#initZxdb")[0].contentWindow.initLogin(); //登录
      this.zxdbList(list); //处理在线单兵
      $("#initZxdb")[0].contentWindow.initLogout(); //退出
    },
    //处理在线单兵
    zxdbList(list) {
      ///common-assets/plugins/singlePawn/initZxdb.html
      if (list.length > 0) {
        //var zxdbList = [];
        this.zxdbArr = [];
        for (var i = 0; i < list.length; i++) {
          if (list[i].bOnline == "1") {
            this.zxdbArr.push(list[i]);
          }
        }
        if (this.zxdbArr.length > 0) {
          this.matchingDbzxry(this.zxdbArr); //单兵人员匹配在线
        }
        //eventBus.emit("set.bd.zxdbList", zxdbList); //在线设备
      } else {
        eventBus.emit("set.bd.zxdbList", []); //在线设备
      }
    },
    //单兵人员匹配在线
    matchingDbzxry(dbList) {
      var staticData = InitZxdbData; //静态单兵人员数据
      var dbRyList = []; //在线单兵人员
      for (var i = 0; i < staticData.length; i++) {
        for (var j = 0; j < dbList.length; j++) {
          if (dbList[j].puid == staticData[i].dbid) {
            staticData[i].dbbh=dbList[j].name;//单兵编号
            dbRyList.push(staticData[i]);
          }
        }
      }
      if (dbRyList.length > 0) {
        this.dbppryArr = [];
        this.dbppryArr = dbRyList;
        //匹配施工管理人员
        this.$$utils
          .axiosRequest(
            MapService.getCurConstructorList + "&personType=manage",
            "施工现场-管理人员"
          )
          .then(result => {
            if (result.data.list == 0) {
              Console.debug("施工现场-管理人员数据null！");
              return;
            }
            // debugger;
            var dbList = this.dbppryArr; //单兵人
            var sgList = result.data.list; //施工人

            var list = [];

            for (var i = 0; i < sgList.length; i++) {
              for (var j = 0; j < dbList.length; j++) {
                if (dbList[j].ryxx.length > 0) {
                  var ryList = dbList[j].ryxx;
                  for (var k = 0; k < ryList.length; k++) {
                    if (sgList[i].personName == dbList[j].ryxx[k].rymc) {
                      list.push({
                        dbzh: dbList[j].dbid,
                        rymc: dbList[j].ryxx[k].rymc,
                        dbbh: dbList[j].dbbh,
                      });
                    }
                  }
                }
              }
            }
            if (list.length > 0) {
              eventBus.emit("set.bd.zxdbList", list); //在线设备
            }
          });
      }
    }
  },
  computed: {},
  watch: {},
  mounted() {
    eventBus.on("query.db.zxdbInit", this.zxdbInit); //初始化在线单兵

    setTimeout(function() {
      canvasRender.default.eventBus.emit("query.db.zxdbInit", ""); //初始化在线单兵
    }, 50000);
  }
};
</script>

<style scoped>
.mapContain {
  position: relative;
}
.boxmune {
  position: absolute;
  /* padding: 15px 15px 0 24px; */
  /* background-image: url(../../assets/images/menuTips/ic_GzUserInfo.png); */
  /* background-color: rgb(11,31,57,1); */
  background-color: #0a2e4a;
  border: 1px solid #03c6cc;
  z-index: 999;
}
.boxmune h4 {
  position: relative;
  width: 100%;
  /* margin-bottom: 15px; */
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
