var urlInfo = {};

$(window).unload(function () {
  WebClient.RemoveCCEvent();
  logoutVideoSys();
  freeVideoActiveX();
});

$(document).ready(function () {
  var href = window.location.href;
  urlInfo = parseURI(href);
  if (urlInfo
    && urlInfo.query
    && urlInfo.query.deviceNo) {
    $("#puid").val(urlInfo.query.deviceNo);
    $("#resIdx").val(0);
  } else {
    return;
  }

  $.getScript("../../conf/singlePawn.js")
    .done(function( script, textStatus){

      $("#ip").val(singlePawnConf.host);
      $("#port").val(singlePawnConf.port);
      $("#username").val(singlePawnConf.un);
      $("#pwd").val(singlePawnConf.pwd);

      WebClient.isMock = false;
      WebClient.def = 50;
      WebClient.vol = 0;
      $("#def").val(WebClient.def);
      $("#vol").val(WebClient.vol)
        .change(onRangeChange);
      changeVolSlidePos();
      sharpness();
      toggleHangUpBtn(false);

      loadVideoActiveX();
      loginVideoSys();


      $("#btnPtzUp").mousedown(onPtzUpMouseDown).mouseup(onPtzUpMouseUp);
      $("#btnPtzDown").mousedown(onPtzDownMouseDown).mouseup(onPtzDownMouseUp);
      $("#btnPtzLeft").mousedown(onPtzLeftMouseDown).mouseup(onPtzLeftMouseUp);
      $("#btnPtzRight").mousedown(onPtzRightMouseDown).mouseup(onPtzRightMouseUp);
    });

});

function parseURI(url) {
  url = String(url);
  var m = url.replace(/^\s+|\s+$/g, '').match(/^([^:\/?#]+:)?(\/\/(?:[^:@]*(?::[^:@]*)?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
  // authority = '//' + user + ':' + pass '@' + hostname + ':' port
  var result = (m ? {
    href: m[0] || '',
    protocol: m[1] || '',
    authority: m[2] || '',
    host: m[3] || '',
    hostname: m[4] || '',
    port: m[5] || '',
    pathname: m[6] || '',
    search: m[7] || '',
    hash: m[8] || ''
  } : null);

  if (!result) {
    return null;
  }

  //获取系统的运行上下文目录
  var hostUrl = result.protocol + "//" + result.host;
  var subUrl = url.replace(hostUrl, "");
  var matched = subUrl.match(/^\/[^\/]*/);
  var domainName = "";
  if (matched) {
    domainName = matched[0];
  }
  var ctx = hostUrl + domainName;
  result.ctx = ctx;

  //解析url传参
  var queryParam = {};
  var queryString = result.search.slice(1);
  var matched = queryString.match(/[^=&]*=[^&]*/g);
  if (matched) {
    var len = matched.length;
    if (0 !== len) {
      var pairSplits = [];
      for (var i = 0; i < len; i++) {
        var pair = matched[i];
        pairSplits = pair.split("=");
        if (pairSplits.length === 2) {
          queryParam[pairSplits[0]] = pairSplits[1];
        } else {
          queryParam[pairSplits[0]] = null;
        }
      }
    }
  }
  result.query = queryParam;

  return result;
}

function change(obj) {
  $(obj).parent().find("a").width($(obj).val() + "%");
  // setVolVal();
}


function onRangeChange(event){
  $(this).parent().find("a").width($(this).val() + "%");
  var val = $(this).val();

  if(WebClient.vol === 0){
    //音频尚未打开，打开音频，在打开音频成功的回调中设置音量
    toggleAudioStatus();
  }else if( 0 === parseInt($("#vol").val())){
    //音量设置为0的情况下关闭音频
    toggleAudioStatus();
  }else{
    //设置音量
    setVolVal();
  }
}

function changeVolSlidePos() {
  var wrap = $("#but_yl_top");
  var volDom = wrap.find("#vol");
  var slideDom = wrap.find("a");

  slideDom.width(volDom.val() + "%");
}

function sharpness() {
  $(".vdbut a").click(function () {
    if ($(this).parent().find(".but_more").attr("class") == "but_more") {
      $(this).parent().find(".but_more").addClass("active");
    } else {
      $(this).parent().find(".but_more").removeClass("active");
    }

    var name = $(this).attr("data-attr-name");
    if (name === "playTalk") {
      toggleTalkStatus();
    } else if (name === "stopTalk") {
      toggleTalkStatus();
    }
  });

  $(".vdbut.sharpness input").change(function () {
    var $label = $(this).parent().find("label");

    $(".vdbut.sharpness").find("input").removeAttr("checked");
    $(this).prop("checked", true);
    $("a.sharpness").html($label.html());
    $(this).parents(".but_more").removeClass("active");

    var name = $label.attr("for");
    var setDef = -1;
    if ("defNormal" === name) {
      setDef = 50;
    } else if ("defHigh" === name) {
      setDef = 75;
    } else if ("defSuper" === name) {
      setDef = 100;
    } else {
      console.log("Error : not this def val");
    }

    if (setDef >= 0) {
      $("#def").val(setDef);
      setDefVal();
    }
  });
}

function isHangUp(){
  return $(".vdbut > .ic_hj").parent().css("display") === "none";
}

function toggleHangUpBtn(hangUp) {
  if (hangUp) {
    $(".vdbut > .ic_hj").parent().hide();
    $(".vdbut > .ic_hang_up").parent().show();
  } else {
    $(".vdbut > .ic_hj").parent().show();
    $(".vdbut > .ic_hang_up").parent().hide();
  }
}

function ptz(){
  $(".ic_yt > span").mousedown(function(){
    var type = $(this).attr("class");
    console.log(type);

    if("top" === type){
      onPtzUpMouseDown();
    }else if("bottom" === type){
      onPtzDownMouseDown();
    }else if("left" === type){
      onPtzLeftMouseDown();
    }else if("right" === type){
      onPtzRightMouseDown();
    }
  }).mouseup(function(){
    var type = $(this).attr("class");
    console.log(type);

    if("top" === type){
      onPtzUpMouseUp();
    }else if("bottom" === type){
      onPtzDownMouseUp();
    }else if("left" === type){
      onPtzLeftMouseUp();
    }else if("right" === type){
      onPtzRightMouseUp();
    }
  });
}


WebClient.loginHandler = function (data) {
  if (!data.success) {
    return;
  }

  var deviceNo = $("#puid").val();
  $.each(WebClient.onlineResList, function (idx, res) {
    if (deviceNo
      && !WebClient.current
      && deviceNo === res.puid) {
      WebClient.current = res;
      return;
    }
  });

  if (WebClient.current) {
    $("#puid").val(WebClient.current.puid);
    $("#resIdx").val(WebClient.current.resIdx);

    // setTimeout(function () {
    WebClient.AddCCEvent();
      startPlayVideo();

      // setTimeout(function () {
      //   toggleAudioStatus();
      // }, 500);

    // }, 500);
  }
};

WebClient.logoutHandler = function (data) {
  if (!data.success) {
    return;
  }

  $("#puid").val("");
  $("#resIdx").val("");
};

WebClient.playAudioHandler = function (data) {
  if (!data.success) {
    // $("#vol").val("");
    return;
  }


  setVolVal();
  // $("#btnAudio").text("Audio Stop");
  // if (data.data
  //   && null !== data.data.vol
  //   && undefined !== data.data.vol) {
  //   $("#vol").val(data.data.vol);
  // } else {
  //   $("#vol").val("");
  // }

};

WebClient.stopAudioHandler = function (data) {
  if (!data.success) {
    return;
  }

  // $("#vol").val("");
  // $("#btnAudio").text("Audio Start");
};

WebClient.playTalkHandler = function (data) {
  if (!data.success) {
    // $("#vol").val("");
    return;
  }

  toggleHangUpBtn(true);
  setVolVal();

  // $("#btnTalk").text("Talk Stop");
  // if (data.data
  //   && null !== data.data.vol
  //   && undefined !== data.data.vol) {
  //   $("#vol").val(data.data.vol);
  // } else {
  //   $("#vol").val("");
  // }
};

WebClient.stopTalkHandler = function (data) {
  if (!data.success) {
    return;
  }

  toggleHangUpBtn(false);
  startPlayVideo();

  // $("#vol").val("");
  // $("#btnTalk").text("Talk Start");
};

WebClient.playLocationHandler = function (data) {
  if (!data.success) {
    // $(".alert-info").empty();
    return;
  }

  // $("#btnLocation").text("Loc Stop");
};

WebClient.stopLocationHandler = function (data) {
  if (!data.success) {
    return;
  }

  // $(".alert-info").empty();
  // $("#btnLocation").text("Loc Start");
};

WebClient.receiveLocationHandler = function (data) {
  if (!data.success) {
    $(".alert-info").empty();
  } else {
    $(".alert-info").text(data.data.longitude + " , " + data.data.latitude);
  }
};

WebClient.playVideoHandler = function (data) {
  ptz();
  setDefVal();
  if(0 !== parseInt($("#vol").val())){
    toggleAudioStatus();
  }
  startLocation();
  // if (data.data && null !== data.data.def && undefined !== data.data.def) {
  //   $("#def").val(data.data.def);
  // } else {
  //   $("#def").val("");
  // }
};

function loadVideoActiveX() {
  WebClient.Log("load single pawn activeX control");
  if (WebClient.isMock) {
    return;
  }

  WebClient.Load("video");
}

function loginVideoSys() {
  WebClient.Log("login single pawn sys");
  if (WebClient.isMock) {
    return;
  }

  WebClient.Login(
    $("#ip").val(),
    $("#port").val(),
    $("#username").val(),
    $("#pwd").val()
  );
}

function logoutVideoSys() {
  WebClient.Log("logout single pawn sys");
  if (WebClient.isMock) {
    return;
  }

  WebClient.Logout();
}

function freeVideoActiveX() {
  WebClient.Log("free single pawn activeX control");
  if (WebClient.isMock) {
    return;
  }

  WebClient.Free();
}

function startPlayVideo() {
  WebClient.Log("start play video : " + $("#puid").val() + "::" + $("#resIdx").val());
  if (WebClient.isMock) {
    return;
  }

  WebClient.Camera(
    $("#puid").val(),
    $("#resIdx").val()
  );
}

function stopPlayVideo() {
  WebClient.Log("stop play video");
  if (WebClient.isMock) {
    return;
  }

  WebClient.StopVideo();
}


function toggleAudioStatus() {
  WebClient.Log("toggle audio status");
  if(WebClient.isMock){
    return;
  }

  WebClient.Audio();
}

function toggleTalkStatus() {
  WebClient.Log("toggle talk status");
  if (WebClient.isMock) {
    return;
  }

  WebClient.Talkback();
}

function startLocation() {
  WebClient.Location();
}

function setVolVal() {
  var vol = $("#vol").val();
  WebClient.Log("set audio vol : " + vol);

  if (WebClient.isMock) {
    return;
  }
  WebClient.SetAudVolume(vol);
}

function setDefVal() {
  var def = $("#def").val();
  WebClient.Log("set video def : " + def);

  if (WebClient.isMock) {
    return;
  }
  WebClient.SetDefinition(def);
}


function onPtzUpMouseDown() {
  WebClient.Log("start ptz move up");
  if (WebClient.isMock) {
    return;
  }

  WebClient.StartTurePtz(WebClient.PtzTureType.PTZ_TURN_UP);
}

function onPtzUpMouseUp() {
  WebClient.Log("stop ptz move up");
  if (WebClient.isMock) {
    return;
  }

  WebClient.StopTurePtz();
}

function onPtzDownMouseDown() {
  WebClient.Log("start ptz move down");
  if (WebClient.isMock) {
    return;
  }

  WebClient.StartTurePtz(WebClient.PtzTureType.PTZ_TURN_DOWN);
}

function onPtzDownMouseUp() {
  WebClient.Log("stop ptz move down");
  if (WebClient.isMock) {
    return;
  }

  WebClient.StopTurePtz();
}

function onPtzLeftMouseDown() {
  WebClient.Log("start ptz move left");
  if (WebClient.isMock) {
    return;
  }

  WebClient.StartTurePtz(WebClient.PtzTureType.PTZ_TURN_LEFT);
}

function onPtzLeftMouseUp() {
  WebClient.Log("stop ptz move left");
  if (WebClient.isMock) {
    return;
  }

  WebClient.StopTurePtz();
}

function onPtzRightMouseDown() {
  WebClient.Log("start ptz move right");
  if (WebClient.isMock) {
    return;
  }

  WebClient.StartTurePtz(WebClient.PtzTureType.PTZ_TURN_RIGHT);
}

function onPtzRightMouseUp() {
  WebClient.Log("stop ptz move right");
  if (WebClient.isMock) {
    return;
  }

  WebClient.StopTurePtz();
}