$(document).ready(function () {
  $("#btnLoad").click(loadVideoActiveX);
  $("#btnLogin").click(loginVideoSys);
  $("#btnLogout").click(onLogoutClick);
  $("#btnFree").click(onFreeClick);

  $("#btnPlay").click(onPlayClick);
  $("#btnStop").click(onStopClick);

  $("#btnAudio").click(onAudioClick);
  $("#btnTalk").click(onTalkClick);
  $("#btnSetDef").click(onDefSetClick);
  $("#btnSetVol").click(onVolSetClick);
  $("#btnLocation").click(onLocationClick);

  $("#btnPtzUp").mousedown(onPtzUpMouseDown).mouseup(onPtzUpMouseUp);
  $("#btnPtzDown").mousedown(onPtzDownMouseDown).mouseup(onPtzDownMouseUp);
  $("#btnPtzLeft").mousedown(onPtzLeftMouseDown).mouseup(onPtzLeftMouseUp);
  $("#btnPtzRight").mousedown(onPtzRightMouseDown).mouseup(onPtzRightMouseUp);
});


$(window).unload(function () {
  // alert("unload");
  onLogoutClick();
  onFreeClick();
});

var currentPuRes = null;
WebClient.loginHandler = function (data) {
  if (!data.success) {
    return;
  }

  $.each(data.data, function (idx, res) {
    if (!currentPuRes && parseInt(res.bOnline) === 1) {
      currentPuRes = res;
      return;
    }
  });

  if (currentPuRes) {
    $("#puid").val(currentPuRes.puid);
    $("#resIdx").val(currentPuRes.resIdx);

    setTimeout(function () {
      onPlayClick();

      setTimeout(function () {
        onAudioClick();
      }, 500);

    }, 500);
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
    $("#vol").val("");
    return;
  }

  $("#btnAudio").text("Audio Stop");
  if (data.data
    && null !== data.data.vol
    && undefined !== data.data.vol) {
    $("#vol").val(data.data.vol);
  } else {
    $("#vol").val("");
  }

};

WebClient.stopAudioHandler = function (data) {
  if (!data.success) {
    return;
  }

  $("#vol").val("");
  $("#btnAudio").text("Audio Start");
};

WebClient.playTalkHandler = function (data) {
  if (!data.success) {
    $("#vol").val("");
    return;
  }

  $("#btnTalk").text("Talk Stop");
  if (data.data
    && null !== data.data.vol
    && undefined !== data.data.vol) {
    $("#vol").val(data.data.vol);
  } else {
    $("#vol").val("");
  }
};

WebClient.stopTalkHandler = function (data) {
  if (!data.success) {
    return;
  }

  $("#vol").val("");
  $("#btnTalk").text("Talk Start");
};

WebClient.playLocationHandler = function (data) {
  if (!data.success) {
    $(".alert-info").empty();
    return;
  }

  $("#btnLocation").text("Loc Stop");
};

WebClient.stopLocationHandler = function (data) {
  if (!data.success) {
    return;
  }

  $(".alert-info").empty();
  $("#btnLocation").text("Loc Start");
};

WebClient.receiveLocationHandler = function (data) {
  if (!data.success) {
    $(".alert-info").empty();
  } else {
    $(".alert-info").text(data.data.longitude + " , " + data.data.latitude);
  }
};

WebClient.playVideoHandler = function (data) {
  if (data.data && null !== data.data.def && undefined !== data.data.def) {
    $("#def").val(data.data.def);
  } else {
    $("#def").val("");
  }
};

function loadVideoActiveX() {
  if (WebClient.isMock) {
    return;
  }


  WebClient.Load("video");
}

function loginVideoSys() {
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

function onLogoutClick() {
  WebClient.Logout();
}

function onFreeClick() {
  WebClient.Free();
}

function onPlayClick() {
  WebClient.Camera(
    $("#puid").val(),
    $("#resIdx").val()
  );
}

function onStopClick() {
  WebClient.StopVideo();
}


function onAudioClick() {
  WebClient.Audio();
}

function onTalkClick() {
  WebClient.Talkback();
}

function onLocationClick() {
  WebClient.Location();
}

function onVolSetClick() {
  var vol = $("#vol").val();
  WebClient.SetAudVolume(vol);
}

function onDefSetClick() {
  var def = $("#def").val();
  WebClient.SetDefinition(def);
}


function onPtzUpMouseDown() {
  WebClient.StartTurePtz(WebClient.PtzTureType.PTZ_TURN_UP);
}

function onPtzUpMouseUp() {
  WebClient.StopTurePtz();
}

function onPtzDownMouseDown() {
  WebClient.StartTurePtz(WebClient.PtzTureType.PTZ_TURN_DOWN);
}

function onPtzDownMouseUp() {
  WebClient.StopTurePtz();
}

function onPtzLeftMouseDown() {
  WebClient.StartTurePtz(WebClient.PtzTureType.PTZ_TURN_LEFT);
}

function onPtzLeftMouseUp() {
  WebClient.StopTurePtz();
}

function onPtzRightMouseDown() {
  WebClient.StartTurePtz(WebClient.PtzTureType.PTZ_TURN_RIGHT);
}

function onPtzRightMouseUp() {
  WebClient.StopTurePtz();
}