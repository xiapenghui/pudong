// 页面加载
$(document).ready(function () {
  WebClient.Load();
  $(".close").attr("disabled", true);
  $(".audio").attr("disabled", true);
  $(".talk").attr("disabled", true);
  $(".location").attr("disabled", true);
  $(".top").attr("disabled", true);
  $(".bottom").attr("disabled", true);
  $(".left").attr("disabled", true);
  $(".right").attr("disabled", true);

  $('#def').val('');
  $(".definition").attr("disabled", true);
  $('#vol').val('');
  $(".volume").attr("disabled", true);
});

$(window).unload(function () {
  WebClient.Free();
});

if (window.attachEvent) {
  window.attachEvent(
    'onbeforeunload',
    function () {
      WebClient.Free();
    }
  );
}
else {
  window.addEventListener(
    'beforeunload',
    function () {
      WebClient.Free();
    },
    false
  );
}

$('#login').click(function () {
  var res = $('#login').html();
  if (res == '登录') {
    WebClient.Login();
  }
  else {
    WebClient.Logout();
  }
})

var WebClient = {
  connectId: null,
  resource: new NPCCUtils.Hash(),
  puResList: null,
  rootDomainName: null,

  PtzTureType: {
    PTZ_TURN_UP: 1,
    PTZ_TURN_DOWN: 2,
    PTZ_TURN_LEFT: 3,
    PTZ_TURN_RIGHT: 4,
  },

  // 初始化，加载插件
  Load: function () {
    try {
      // 首先初始化NPCCILY，加载插件
      var operator = NPCCILY.Init(new NPCCStruct.InitParamStruct(false, null, null));
      if (operator.errorCode != ErrorCode.NP_E_OK) {
        // 初始化不成功
        alert(ErrorCode.Error2Desc(operator.errorCode));
        return false;
      }
      else {
        // 存储窗口容器信息
        if ($('#resourceTree')[0]) {
          // 存放窗口容器信息，总共有6个窗口
          NPCCILY.windowContainers.set('video11', new NPCCStruct.WindowContainerStruct($('#video11')[0], false, null, null));
          NPCCILY.windowContainers.set('video12', new NPCCStruct.WindowContainerStruct($('#video12')[0], false, null, null));
          NPCCILY.windowContainers.set('video13', new NPCCStruct.WindowContainerStruct($('#video13')[0], false, null, null));
          NPCCILY.windowContainers.set('video14', new NPCCStruct.WindowContainerStruct($('#video14')[0], false, null, null));

          NPCCILY.windowContainers.set('video21', new NPCCStruct.WindowContainerStruct($('#video21')[0], false, null, null));
          NPCCILY.windowContainers.set('video22', new NPCCStruct.WindowContainerStruct($('#video22')[0], false, null, null));
          NPCCILY.windowContainers.set('video23', new NPCCStruct.WindowContainerStruct($('#video23')[0], false, null, null));
          NPCCILY.windowContainers.set('video24', new NPCCStruct.WindowContainerStruct($('#video24')[0], false, null, null));

          NPCCILY.windowContainers.set('video31', new NPCCStruct.WindowContainerStruct($('#video31')[0], false, null, null));
          NPCCILY.windowContainers.set('video32', new NPCCStruct.WindowContainerStruct($('#video32')[0], false, null, null));
          NPCCILY.windowContainers.set('video33', new NPCCStruct.WindowContainerStruct($('#video33')[0], false, null, null));
          NPCCILY.windowContainers.set('video34', new NPCCStruct.WindowContainerStruct($('#video34')[0], false, null, null));
        }
      }
      return true;
    }
    catch (e) {
      alert('Load exception: ' + e.name + '::' + e.message);
      return false;
    }
  },

  // 释放插件
  Free: function () {
    NPCCILY.Free();
  },


  // 创建窗口 4x4：总共12个视频播放窗口
  CreateVideoWindow: function () {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 4; j++) {
        var key = 'video' + ((i + 1) * 10 + j + 1);
        var windowContainerStruct = NPCCILY.windowContainers.get(key);
        if (windowContainerStruct) {
          // 创建窗口
          var window = NPCCILY.CreateWindow(WebClient.connectId, windowContainerStruct.container);
          if (window.errorCode == ErrorCode.NP_E_OK) {
            windowContainerStruct.window = window.value;

            var windowEvent = new NPCCStruct.WindowEventStruct();
            // 单击事件
            windowEvent.lbtn_click.status = true;
            windowEvent.lbtn_click.callback = function (notify) {
              WebClient.ReceivePWEvent(notify);
            };
            NPCCILY.WindowAttachEvent.Init(windowContainerStruct.window, windowEvent);
          }
        }
      }
    }
  },

  // 获取空闲的视频播放窗口
  GetFreeVideoWindow: function () {
    var keys = NPCCILY.windowContainers.keys();
    if (keys.length > 0) {
      for (var i = 0; i < keys.length; i++) {
        var ws = NPCCILY.windowContainers.get(keys[i]);
        if (!ws.active) {
          return ws;
        }
      }
    }

    return null;
  },

  // 获取当前焦点的视频窗口
  GetFocusVideoWindow: function () {
    var keys = NPCCILY.windowContainers.keys();
    if (keys.length > 0) {
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var windowContainerStruct = NPCCILY.windowContainers.get(keys[i]);
        if (windowContainerStruct.focus) {
          return windowContainerStruct;
        }
      }
    }

    return null;
  },

  // 检测指定摄像头资源是否可以播放
  CheckCameraResIsCanPlay: function (cameraRes) {
    var keys = NPCCILY.windowContainers.keys();
    if (keys.length > 0) {
      for (var i = 0; i < keys.length; i++) {
        var ws = NPCCILY.windowContainers.get(keys[i]);
        if (ws.active) {
          var winObj = ws.window;
          if (winObj.status.playvideoing) {
            if (winObj.params.puid == cameraRes.puid && winObj.params.resIdx == cameraRes.resIdx) {
              alert('视频已经在播放了');
              return false;
            }
          }
        }
      }
    }

    return true;
  },

  // 建立连接
  Login: function () {
    var ipVal = $('#ip').val();
    var portVal = $('#port').val();
    var userNameVal = $('#userName').val();
    var pwdVal = $('#pwd').val();
    var root = 'root';

    // 调用建立登录函数
    var operator = NPCCILY.Login(new NPCCStruct.LoginParamStruct(ipVal, portVal, root, userNameVal, pwdVal, true));
    console.log(operator.errorCode);
    if (operator.errorCode == ErrorCode.NP_E_OK) {
      // 此即是当前连接ID，记录下来
      WebClient.connectId = operator.value;
      $('#login').html('退出');
      $(".close").attr("disabled", false);

      WebClient.CreateVideoWindow();
      WebClient.AddCCEvent();

      if (!WebClient.connectId || !NPCCILY.serverMap.get(WebClient.connectId)) {
        alert('连接信息不存在，获取资源失败');
        return false;
      }

      // 获取域以及子域信息
      operator = NPCCILY.ForkDomainList(WebClient.connectId);
      if (operator.errorCode == ErrorCode.NP_E_OK) {
        console.log('获取域信息成功');
        // 获取服务器名称功能
        operator = NPCCILY.GetRootDomainName(WebClient.connectId);
        if (operator.errorCode == ErrorCode.NP_E_OK) {
          var rootDomainName = operator.value || '网络视频监控系统';
          WebClient.rootDomainName = rootDomainName;
          console.log('服务器名称：%s', rootDomainName);

          // 开始获取设备列表
          operator = NPCCILY.ForkPUList(WebClient.connectId);
          if (operator.errorCode == ErrorCode.NP_E_OK) {
            console.log(operator);
            console.log('获取设备列表成功');
            var puResList = operator.value;
            // 开始获取所有子资源
            operator = NPCCILY.ForkResList(WebClient.connectId);
            if (operator.errorCode == ErrorCode.NP_E_OK) {
              console.log('获取所有子资源成功');
              // 将子资源添加到对应的设备里
              operator = NPCCILY.GetAllResList(WebClient.connectId, puResList);
            }

            WebClient.puResList = puResList;
            if (operator.errorCode == ErrorCode.NP_E_OK) {
              WebClient.message(WebClient.puResList, WebClient.rootDomainName);
            }
            else {
              console.log('获取子资源失败: %s', ErrorCode.Error2Desc(operator.errorCode));
              alert('获取子资源失败: ' + ErrorCode.Error2Desc(operator.errorCode));
            }
          }
          else {
            console.log('获取设备列表失败: %s', ErrorCode.Error2Desc(operator.errorCode));
            alert('获取设备列表失败: ' + ErrorCode.Error2Desc(operator.errorCode));
          }
        }
        else {
          console.log('获取服务器名称失败: %s', ErrorCode.Error2Desc(operator.errorCode));
          alert('获取服务器名称失败: ' + ErrorCode.Error2Desc(operator.errorCode));
        }
      }
      else {
        console.log('获取域信息失败: %s', ErrorCode.Error2Desc(operator.errorCode));
        alert('获取域信息失败: ' + ErrorCode.Error2Desc(operator.errorCode));
      }

      if (operator.errorCode != ErrorCode.NP_E_OK) {
        // 以上操作失败需要退出平台
        WebClient.Logout();
      }
    }
    else {
      console.log('登录失败: %s', ErrorCode.Error2Desc(operator.errorCode));
      alert('登录失败: ' + ErrorCode.Error2Desc(operator.errorCode));
    }
  },

  // 列表信息
  message: function (puResList, rootDomainName) {
    // 成功将子资源添加到对应的设备
    // 进行在线排序
    var onlines = [];
    var offlines = [];
    $.each(puResList, function (index, item) {
      if (item.bOnline == 1 && item.bEnable == 1) {
        onlines.push(item);
      }
      else {
        offlines.push(item);
      }
    });

    var puResListTemp = [];
    puResListTemp = puResListTemp.concat(onlines);
    puResListTemp = puResListTemp.concat(offlines);

    var html = [];
    if ($('#resourceTree')[0]) {
      var lastnode = '';
      var rootDomain = 'RootDomain';
      html.push('<div id="' + rootDomain + '" style="display: flex; flex-direction: column; margin-top:2px; margin-bottom: 5px; " >');
      html.push('<a href="javascript:void(0);" onclick="WebClient.ExpandsionEx($(\'#PuResListBox\')[0]);" >' + rootDomainName + '</a>');
      html.push('</div>');

      html.push('<div id="PuResListBox" class="PuResListBox" style="display: flex;flex-direction: column;margin-left:20px;margin-top:12px;">');
      $.each(puResListTemp, function (puResIdx, puRes) {
        if (puRes.modelType != NPCCEnum.ModelType.MODEL_TYPE_OSS) {
          html.push('<div>');
          html.push('<a href="javascript:void(0);" onclick="WebClient.ExpandsionEx($(\'#' + puRes.puid + '_ResListBox\')[0]);" >' + puRes.name + '</a>');
          html.push('</div>');

          lastnode = puRes.puid + '_ResListBox';
          html.push('<div id="' + puRes.puid + '_ResListBox" style="display: flex;flex-direction: column;padding-left:15px;">');
          $.each(puRes.resList, function (baseResIdx, baseRes) {
            html.push('<div>');
            if (baseRes.resType == NPCCEnum.ResType.RES_TYPE_CAM) {
              html.push('<a href="javascript:void(0);" onclick="WebClient.ClickCameraRes(\'' + baseRes.puid + '\', \'' + baseRes.resIdx + '\')" >' + baseRes.name + '</a>');
            }
            else {
              html.push('<a href="javascript:void(0);">' + baseRes.name + '</a>');
            }

            html.push('</div>');
          });
          html.push('</div>');
        }
      });

      html.push('</div>');
      $('#resourceTree')
        .html(html.join(''))
        .find('#' + lastnode)
        .attr('class', 'PuResListBox');
    }
  },

  // 退出平台
  Logout: function () {
    try {
      var keys = NPCCILY.windowContainers.keys();
      if (keys.length > 0) {
        for (var i = 0; i < keys.length; i++) {
          var windowContainerStruct = NPCCILY.windowContainers.get(keys[i]);
          $('#' + keys[i]).css("border", "1px solid grey");
          if (windowContainerStruct && windowContainerStruct.active) {
            WebClient.StopVideoByWindowObj(windowContainerStruct);
          }
        }
      }

      WebClient.RemoveCCEvent();

      var operator = NPCCILY.Logout(WebClient.connectId);
      if (operator.errorCode == ErrorCode.NP_E_OK) {
        windowContainerStruct.window = null;
        WebClient.connectId = null;
        $('#resourceTree').html('');
        $('#login').html('登录');
        $('#location_info').html('');

        $(".audio").attr("disabled", true);
        $(".talk").attr("disabled", true);
        $(".location").attr("disabled", true);
        $(".top").attr("disabled", true);
        $(".bottom").attr("disabled", true);
        $(".left").attr("disabled", true);
        $(".right").attr("disabled", true);

        $('#def').val('');
        $(".definition").attr("disabled", true);
        $('#vol').val('');
        $(".volume").attr("disabled", true);
      }
      else {
        alert('退出平台失败: ' + ErrorCode.Error2Desc(operator.errorCode));
      }
    }
    catch (e) {
      alert('Logout exception: ' + e.name + '::' + e.message);
    }
  },

  // 添加事件
  AddCCEvent: function () {
    NPCCILY.CCNotifyManager.Add(
      NPCCEnum.CCObjectNotify.event_notify,
      function (notify) {
        WebClient.ReceiveCCEvent(notify);
      }
    );

    NPCCILY.CCNotifyManager.Add(
      NPCCEnum.CCObjectNotify.stream_status_notify,
      function (notify) {
        WebClient.ReceiveStreamStatus(notify);
      }
    );

    NPCCILY.CCNotifyManager.Add(
      NPCCEnum.CCObjectNotify.call_stream_status_notify,
      function (notify) {
        WebClient.ReceiveStreamStatus(notify);
      }
    );

    NPCCILY.CCNotifyManager.Add(
      NPCCEnum.CCObjectNotify.location_data_notify,
      function (notify) {
        WebClient.ReceiveLocationData(notify);
      }
    );
  },

  // 移除事件
  RemoveCCEvent: function () {
    NPCCILY.CCNotifyManager.Remove(NPCCEnum.CCObjectNotify.event_notify);
    NPCCILY.CCNotifyManager.Remove(NPCCEnum.CCObjectNotify.stream_status_notify);
    NPCCILY.CCNotifyManager.Remove(NPCCEnum.CCObjectNotify.call_stream_status_notify);
    NPCCILY.CCNotifyManager.Remove(NPCCEnum.CCObjectNotify.location_data_notify);
  },

  // 点击播放视频
  ClickCameraRes: function (puid, resIdx) {
    $.each(WebClient.puResList, function (puResIdx, puRes) {
      if (puRes.puid == puid) {
        $.each(puRes.resList, function (baseResIdx, baseRes) {
          if (baseRes.resType == NPCCEnum.ResType.RES_TYPE_CAM && baseRes.bOnline == 0) {
            alert('播放视频失败，设备不在线');
            return;
          }

          if (baseRes.resType == NPCCEnum.ResType.RES_TYPE_CAM && baseRes.resIdx == resIdx && baseRes.bOnline == 1) {
            WebClient.PlayVideo(baseRes);
            return;
          }
        })
        return;
      }
    })
  },

  // 启动视频
  PlayVideo: function (cameraRes) {
    try {
      if (WebClient.CheckCameraResIsCanPlay(cameraRes)) {
        var windowContainerStruct = WebClient.GetFreeVideoWindow();
        if (windowContainerStruct) {
          var winObj = windowContainerStruct.window;
          if (winObj) {
            // 开始预览视频
            winObj.params.puid = cameraRes.puid;
            winObj.params.resIdx = cameraRes.resIdx;
            winObj.params.cameraResHandle = cameraRes.handle;
            var operator = NPCCILY.StartPreview(winObj, NPCCEnum.StopRealtimePreviewType.SREP_VIDEO);
            if (operator.errorCode == ErrorCode.NP_E_OK) {
              WebClient.name = cameraRes.name;
              NPCCILY.ResizeWindowDimension(winObj, '100%', '100%');
              operator = NPCCILY.CAM_GetDefinition(winObj);
              if (operator.errorCode == ErrorCode.NP_E_OK) {
                $('#def').val(operator.value);
                // alert('获取清晰度成功');
              }
              else {
                alert('获取清晰度失败：' + ErrorCode.Error2Desc(operator.errorCode));
              }
            }
            else {
              alert('开启视频失败：' + ErrorCode.Error2Desc(operator.errorCode));
              return false;
            }

            WebClient.ClickVideoWindow(winObj);
            windowContainerStruct.active = true;
            return true;
          }
          else {
            alert('开启视频失败，视频播放窗口还没有创建');
            return false;
          }
        }
        else {
          alert('启动视频失败，没有空闲的视频窗口');
          return false;
        }
      }
    }
    catch (e) {
      alert('启动视频异常：' + e.name + ', ' + e.message);
      return false;
    }
  },

  // 关闭视频
  StopVideo: function () {
    try {
      var windowContainerStruct = WebClient.GetFocusVideoWindow();
      if (windowContainerStruct) {
        return WebClient.StopVideoByWindowObj(windowContainerStruct);
      }
      return false;
    }
    catch (e) {
      alert('停止失败异常: ' + e.name + ', ' + e.message);
      return false;
    }
  },

  // 关闭指定窗口的视频
  StopVideoByWindowObj: function (windowContainerStruct) {
    var winObj = windowContainerStruct.window;
    if (winObj) {
      if (winObj.status.playaudioing) {
        if (!WebClient.PlayOrStopAudio(winObj)) {
          return false;
        }
      }

      if (winObj.status.playtalking) {
        if (!WebClient.PlayOrStopTalk(winObj)) {
          return false;
        }
      }

      if (winObj.status.playlocation) {
        if (!WebClient.PlayOrStopLocation(winObj)) {
          return false;
        }
      }

      if (winObj.status.playvideoing) {
        var operator = NPCCILY.StopPreview(winObj, NPCCEnum.StopRealtimePreviewType.SREP_VIDEO);
        if (operator.errorCode == ErrorCode.NP_E_OK) {
          $('#def').val('');
          $('#vol').val('');
          NPCCIF.RefreshImage(NPCCILY.Plug.ccPlugin, winObj.params.mediaHandle);
          winObj.params.cameraResHandle = null;
          windowContainerStruct.active = false;
        }
        else {
          alert('停止视频失败：' + ErrorCode.Error2Desc(operator.errorCode));
          return false;
        }
      }
      return true;
    }
    return false;
  },

  // 点击视频窗口
  ClickVideoWindow: function (window) {
    var keys = NPCCILY.windowContainers.keys();
    if (keys.length > 0) {
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var windowContainerStruct = NPCCILY.windowContainers.get(keys[i]);
        if (windowContainerStruct && windowContainerStruct.window) {
          if (windowContainerStruct.window == window) {
            windowContainerStruct.focus = true;
            if (windowContainerStruct.window.status.playvideoing) {
              $(".audio").attr("disabled", false);
              $(".talk").attr("disabled", false);
              $(".location").attr("disabled", false);
              $(".top").attr("disabled", false);
              $(".bottom").attr("disabled", false);
              $(".left").attr("disabled", false);
              $(".right").attr("disabled", false);

              $(".definition").attr("disabled", false);
              $(".volume").attr("disabled", false);

              var operator = NPCCILY.CAM_GetDefinition(windowContainerStruct.window);
              if (operator.errorCode == ErrorCode.NP_E_OK) {
                $('#def').val(operator.value);
              }
              else {
                alert('获取清晰度失败：' + ErrorCode.Error2Desc(operator.errorCode));
              }

              if (windowContainerStruct.window.status.playaudioing) {
                $('.audio').val('停止音频');
                operator = NPCCILY.AUD_GetVolume(windowContainerStruct.window);
                if (operator.errorCode == ErrorCode.NP_E_OK) {
                  $('#vol').val(operator.value);
                }
                else {
                  alert('获取音频音量失败：' + ErrorCode.Error2Desc(operator.errorCode));
                }
              }
              else {
                $('.audio').val('音频');
                $('#vol').val('');
              }

              if (windowContainerStruct.window.status.playtalking) {
                $('.talk').val('停止对讲');
              }
              else {
                $('.talk').val('对讲');
              }

              if (windowContainerStruct.window.status.playlocation) {
                $('.location').val('停止定位');
              }
              else {
                $('.location').val('定位');
              }
            }
            else {
              $(".audio").attr("disabled", true);
              $('.audio').val('音频');
              $(".talk").attr("disabled", true);
              $('.talk').val('对讲');
              $(".location").attr("disabled", true);
              $('.location').val('定位');
              $(".top").attr("disabled", true);
              $(".bottom").attr("disabled", true);
              $(".left").attr("disabled", true);
              $(".right").attr("disabled", true);

              $('#def').val('');
              $(".definition").attr("disabled", true);
              $('#vol').val('');
              $(".volume").attr("disabled", true);
            }
            $('#' + key).css("border", "1px solid red");
          }
          else {
            windowContainerStruct.focus = false;
            $('#' + key).css("border", "1px solid grey");
          }
        }
      }
    }
  },

  // 音频
  ClickAudioRes: function () {
    try {
      var windowContainerStruct = WebClient.GetFocusVideoWindow();
      if (windowContainerStruct && windowContainerStruct.window) {
        if (windowContainerStruct.window.status.playvideoing) {
          var puid = windowContainerStruct.window.params.puid;
          $.each(WebClient.puResList, function (puResIdx, puRes) {
            if (puRes.puid == puid) {
              var bFind = false;
              $.each(puRes.resList, function (baseResIdx, baseRes) {
                if (baseRes.resType == NPCCEnum.ResType.RES_TYPE_AUD) {
                  windowContainerStruct.window.params.audioResHandle = baseRes.handle;
                  bFind = true;
                  return;
                }
              })
              if (bFind) {
                WebClient.PlayOrStopAudio(windowContainerStruct.window);
              }
              else {
                alert('没有音量资源');
              }
              return;
            }
          })
        }
        else {
          alert('请先选择一个视频播放');
        }
      }
    }
    catch (e) {
      alert('开启或停止音频异常：' + e.name + '::' + e.message);
    }
  },

  // 启动/关闭音频
  PlayOrStopAudio: function (winObj) {
    if (winObj.status.playaudioing) {
      var operator = NPCCILY.StopPreview(winObj, NPCCEnum.StopRealtimePreviewType.SREP_AUDIO);
      if (operator.errorCode == ErrorCode.NP_E_OK) {
        $('#vol').val('');
        $('.audio').val('音频');
        winObj.params.audioResHandle = null;
      }
      else {
        alert('停止音频失败：' + ErrorCode.Error2Desc(operator.errorCode));
        return false;
      }
    }
    else {
      if (winObj.status.playtalking) {
        if (!WebClient.PlayOrStopTalk(winObj)) {
          winObj.params.audioResHandle = null;
          return false;
        }
      }

      var operator = NPCCILY.StartPreview(winObj, NPCCEnum.StopRealtimePreviewType.SREP_AUDIO);
      if (operator.errorCode == ErrorCode.NP_E_OK) {
        operator = NPCCILY.AUD_GetVolume(winObj);
        if (operator.errorCode == ErrorCode.NP_E_OK) {
          $('#vol').val(operator.value);
          // alert('获取音频音量成功');
        }
        else {
          alert('获取音频音量失败：' + ErrorCode.Error2Desc(operator.errorCode));
        }

        $('.audio').val('停止音频');
      }
      else {
        winObj.params.audioResHandle = null;
        alert('开启音频失败：' + ErrorCode.Error2Desc(operator.errorCode));
        return false;
      }
    }
    return true;
  },

  // 对讲
  ClickTalkbackRes: function () {
    try {
      var windowContainerStruct = WebClient.GetFocusVideoWindow();
      if (windowContainerStruct && windowContainerStruct.window) {
        if (windowContainerStruct.window.status.playvideoing) {
          var puid = windowContainerStruct.window.params.puid;
          $.each(WebClient.puResList, function (puResIdx, puRes) {
            if (puRes.puid == puid) {
              var bFind = false;
              $.each(puRes.resList, function (baseResIdx, baseRes) {
                if (baseRes.resType == NPCCEnum.ResType.RES_TYPE_TBK) {
                  windowContainerStruct.window.params.talkbackResHandle = baseRes.handle;
                  bFind = true;
                  return;
                }
              })
              if (bFind) {
                WebClient.PlayOrStopTalk(windowContainerStruct.window);
              }
              else {
                alert('没有对讲资源');
              }

              return;
            }
          })
        }
        else {
          alert('请先选择一个视频播放');
        }
      }
    }
    catch (e) {
      alert('开启或停止对讲异常：' + e.name + '::' + e.message);
    }
  },

  // 启动和关闭对讲
  PlayOrStopTalk: function (winObj) {
    if (winObj.status.playtalking) {
      var operator = NPCCILY.StopTalk(winObj);
      if (operator.errorCode == ErrorCode.NP_E_OK) {
        $('.talk').val('对讲');
        winObj.params.talkbackResHandle = null;
      }
      else {
        alert('停止对讲失败：' + ErrorCode.Error2Desc(operator.errorCode));
        return false;
      }
    }
    else {
      if (winObj.status.playaudioing) {
        if (!WebClient.PlayOrStopAudio(winObj)) {
          winObj.params.talkbackResHandle = null;
          return false;
        }
      }

      var operator = NPCCILY.StartTalk(winObj);
      if (operator.errorCode == ErrorCode.NP_E_OK) {
        $('.talk').val('停止对讲');
      }
      else {
        winObj.params.talkbackResHandle = null;
        alert('开启对讲失败：' + ErrorCode.Error2Desc(operator.errorCode));
        return false;
      }
    }
    return true;
  },

  // 定位
  ClickLocationRes: function () {
    try {
      var windowContainerStruct = WebClient.GetFocusVideoWindow();
      if (windowContainerStruct && windowContainerStruct.window) {
        if (windowContainerStruct.window.status.playvideoing) {
          var puid = windowContainerStruct.window.params.puid;
          $.each(WebClient.puResList, function (puResIdx, puRes) {
            if (puRes.puid == puid) {
              var bFind = false;
              $.each(puRes.resList, function (baseResIdx, baseRes) {
                if (baseRes.resType == NPCCEnum.ResType.RES_TYPE_LOC) {
                  windowContainerStruct.window.params.locationResHandle = baseRes.handle;
                  bFind = true;
                  return;
                }
              })

              if (bFind) {
                WebClient.PlayOrStopLocation(windowContainerStruct.window);
              }
              else {
                alert('没有定位资源');
              }
              return;
            }
          })
        }
        else {
          alert('请先选择一个视频播放');
        }
      }
    }
    catch (e) {
      alert('开启或停止定位异常：' + e.name + '::' + e.message);
    }
  },

  // 启动和关闭定位
  PlayOrStopLocation: function (winObj) {
    if (winObj.status.playlocation) {
      var operator = NPCCILY.StopLocation(winObj);
      if (operator.errorCode == ErrorCode.NP_E_OK) {
        $('.location').val('定位');
        // $('#location_info').html('');
        winObj.params.locationResHandle = null;
      }
      else {
        alert('停止定位失败：' + ErrorCode.Error2Desc(operator.errorCode));
        return false;
      }
    }
    else {
      var operator = NPCCILY.StartLocation(winObj);
      if (operator.errorCode == ErrorCode.NP_E_OK) {
        $('.location').val('停止定位');
      }
      else {
        winObj.params.locationResHandle = null;
        alert('开启定位失败：' + ErrorCode.Error2Desc(operator.errorCode));
        return false;
      }
    }

    return true;
  },

  // 启动云台移动
  StartTurePtz: function (ptzTureType) {
    try {
      var windowContainerStruct = WebClient.GetFocusVideoWindow();
      if (windowContainerStruct && windowContainerStruct.window) {
        if (windowContainerStruct.window.status.playvideoing) {
          var puid = windowContainerStruct.window.params.puid;
          $.each(WebClient.puResList, function (puResIdx, puRes) {
            if (puRes.puid == puid) {
              var bFind = false;
              $.each(puRes.resList, function (baseResIdx, baseRes) {
                if (baseRes.resType == NPCCEnum.ResType.RES_TYPE_PTZ) {
                  windowContainerStruct.window.params.ptzResHandle = baseRes.handle;
                  bFind = true;
                  return;
                }
              })

              if (bFind) {
                if (ptzTureType == WebClient.PtzTureType.PTZ_TURN_UP) {
                  var operator = NPCCILY.PTZ_StartTurnUp(windowContainerStruct.window);
                  if (operator.errorCode == ErrorCode.NP_E_OK) {
                    // alert('开启云台向上移动成功');
                  }
                  else {
                    alert('开启云台向上移动失败：' + ErrorCode.Error2Desc(operator.errorCode));
                  }
                }
                else if (ptzTureType == WebClient.PtzTureType.PTZ_TURN_DOWN) {
                  var operator = NPCCILY.PTZ_StartTurnDown(windowContainerStruct.window);
                  if (operator.errorCode == ErrorCode.NP_E_OK) {
                    // alert('开启云台向下移动成功');
                  }
                  else {
                    alert('开启云台向下移动失败：' + ErrorCode.Error2Desc(operator.errorCode));
                  }
                }
                else if (ptzTureType == WebClient.PtzTureType.PTZ_TURN_LEFT) {
                  var operator = NPCCILY.PTZ_StartTurnLeft(windowContainerStruct.window);
                  if (operator.errorCode == ErrorCode.NP_E_OK) {
                    // alert('开启云台向左移动成功');
                  }
                  else {
                    alert('开启云台向左移动失败：' + ErrorCode.Error2Desc(operator.errorCode));
                    return false;
                  }
                }
                else if (ptzTureType == WebClient.PtzTureType.PTZ_TURN_RIGHT) {
                  var operator = NPCCILY.PTZ_StartTurnRight(windowContainerStruct.window);
                  if (operator.errorCode == ErrorCode.NP_E_OK) {
                    // alert('开启云台向右移动成功');
                  }
                  else {
                    alert('开启云台向右移动失败：' + ErrorCode.Error2Desc(operator.errorCode));
                    return false;
                  }
                }
                else {
                  console.log('传入的云台类型参数不存在');
                }
              }
              else {
                alert('该设备没有云台资源');
              }

              return;
            }
          })
        }
        else {
          alert('请先选择一个视频播放');
        }
      }
    }
    catch (e) {
      alert('启动云台移动异常：' + e.name + '::' + e.message);
    }
  },

  // 停止云台移动
  StopTurePtz: function () {
    try {
      var windowContainerStruct = WebClient.GetFocusVideoWindow();
      if (windowContainerStruct && windowContainerStruct.window) {
        if (windowContainerStruct.window.params.ptzResHandle) {
          var operator = NPCCILY.PTZ_StopTurn(windowContainerStruct.window);
          if (operator.errorCode == ErrorCode.NP_E_OK) {
            // alert('停止云台移动成功');
          }
          else {
            alert('停止云台移动失败：' + ErrorCode.Error2Desc(operator.errorCode));
          }
        }
      }
    }
    catch (e) {
      alert('停止云台移动异常: ' + e.name + ', ' + e.message);
    }
  },

  // 设置清晰度
  SetDefinition: function () {
    try {
      var windowContainerStruct = WebClient.GetFocusVideoWindow();
      if (windowContainerStruct && windowContainerStruct.window) {
        if (windowContainerStruct.window.status.playvideoing) {
          var puid = windowContainerStruct.window.params.puid;
          $.each(WebClient.puResList, function (puResIdx, puRes) {
            if (puRes.puid == puid) {
              $.each(puRes.resList, function (baseResIdx, baseRes) {
                if (baseRes.resType == NPCCEnum.ResType.RES_TYPE_CAM) {
                  var definition = $('#def').val();
                  var operator = NPCCILY.CAM_SetDefinition(windowContainerStruct.window, definition);
                  if (operator.errorCode == ErrorCode.NP_E_OK) {
                    alert('设置清晰度成功');
                  }
                  else {
                    alert('设置清晰度失败：' + ErrorCode.Error2Desc(operator.errorCode));
                    $('#def').val('');
                    return false;
                  }
                  return;
                }
              })
              return;
            }
          })
        }
        else {
          $('#def').val('');
          alert('请先选择一个视频播放');
        }
      }
    }
    catch (e) {
      alert('设置清晰度异常：' + e.name + '::' + e.message);
    }
  },

  // 设置音频音量
  SetAudVolume: function () {
    try {
      var windowContainerStruct = WebClient.GetFocusVideoWindow();
      if (windowContainerStruct && windowContainerStruct.window) {
        if (windowContainerStruct.window.status.playvideoing) {
          if (windowContainerStruct.window.params.audioResHandle == null) {
            var puid = windowContainerStruct.window.params.puid;
            $.each(WebClient.puResList, function (puResIdx, puRes) {
              if (puRes.puid == puid) {
                $.each(puRes.resList, function (baseResIdx, baseRes) {
                  if (baseRes.resType == NPCCEnum.ResType.RES_TYPE_AUD) {
                    windowContainerStruct.window.params.audioResHandle = baseRes.handle;
                    return;
                  }
                })

                return;
              }
            })
          }

          var volume = $('#vol').val();
          var operator = NPCCILY.AUD_SetVolume(windowContainerStruct.window, volume);
          if (operator.errorCode == ErrorCode.NP_E_OK) {
            alert('设置音频音量成功');
          }
          else {
            $('#vol').val('');
            alert('设置音频音量失败：' + ErrorCode.Error2Desc(operator.errorCode));
          }
        }
        else {
          $('#vol').val('');
          alert('请先选择一个视频播放');
        }
      }
    }
    catch (e) {
      alert('设置音频音量异常：' + e.name + '::' + e.message);
    }
  },

  //清晰度音量条件控制
  limitInput: function (o) {
    o.value = o.value.replace(/[^0-9-]+/, '');
    var value = o.value;
    var min = 1;
    var max = 100;
    if (parseInt(value) < min || parseInt(value) > max) {
      alert('请输入1-100之间的数字');
      o.value = '';
    }
  },

  // 资源树控制
  ExpandsionEx: function (obj) {
    if (obj) {
      if (obj.style.display == 'none') {
        if (obj.innerHTML == '') return;
        obj.style.display = 'flex';
      }
      else {
        obj.style.display = 'none';
      }
    }
  },

  // 通过puid查找设备
  FindPuResByPUID: function (puid) {
    var puRes = null;
    $.each(WebClient.puResList, function (puIdx, device) {
      if (device.puid == puid) {
        puRes = device;
        return;
      }
    })
    return puRes;
  },

  // 接收CC插件事件
  ReceiveCCEvent: function (notify) {
    var globalData = NPCCILY.serverMap.get(WebClient.connectId);
    if (globalData instanceof NPCCStruct.InitGlobalDataStruct) {
      var hServer = globalData.hServer;
      if (hServer == notify.handle) {
        if (notify.errorCode == ErrorCode.NP_E_OK) {
          var eventID = notify.keyData.ID; // 事件ID
          switch (Number(eventID)) {
            case NPCCEnum.Notification.RST_EVT_SERVER_ConnectionBreak:
              // 与平台连接断开，需要主动断开与平台之间的连接
              alert('与平台连接断开');
              WebClient.Logout();
              break;
            case NPCCEnum.Notification.RST_EVT_PU_Online:
            // 设备上线
            case NPCCEnum.Notification.RST_EVT_PU_Offline:
              // 设备下线
              var utcTime = notify.keyData.T; // 事件时间
              var eventTime = NPCCUtils.DateFormat('yyyy-MM-dd HH:mm:ss', new Date(parseInt(utcTime) * 1000));
              var dID = notify.keyData.DID; // 域的DID
              var puid = notify.keyData.SID; // 设备的PUID
              var resType = notify.keyData.RT; // 设备类型
              var resIdx = notify.keyData.RC; // 设备索引
              var puRes = WebClient.FindPuResByPUID(puid);
              if (Number(eventID) == NPCCEnum.Notification.RST_EVT_PU_Online) {
                if (puRes == null) {
                  // 设备首次登录 更新列表
                  var operator = NPCCILY.ForkOnePU(WebClient.connectId, dID, puid);
                  if (operator.errorCode == ErrorCode.NP_E_OK) {
                    console.log(operator);
                    console.log('获取平台下的新设备信息成功');
                    puRes = operator.value;
                    WebClient.puResList = WebClient.puResList.concat(puRes);
                  }
                  else {
                    console.log('获取新设备信息失败: %s', ErrorCode.Error2Desc(operator.errorCode));
                    alert('获取新设备信息失败: ' + ErrorCode.Error2Desc(operator.errorCode));
                  }

                  alert(puRes.name + '在' + eventTime + '上线了');
                }
                else {
                  alert(puRes.name + '在' + eventTime + '上线了');
                  // 列表中设备已存在  更新列表
                  $.each(WebClient.puResList, function (puResIdx, puResItem) {
                    if (puResItem.puid == puRes.puid) {
                      puResItem.bOnline = 1;
                      $.each(puResItem.resList, function (listResIdx, listResItem) {
                        listResItem.bOnline = 1;
                      })

                      return;
                    }
                    return;
                  })
                }

                WebClient.message(WebClient.puResList, WebClient.rootDomainName);
              }
              else {
                alert(puRes.name + '在' + eventTime + '下线了');
                // 如果该设备视频正在播放，就停止视频后刷新列表
                var windowContainerStruct = WebClient.GetFocusVideoWindow();
                if (windowContainerStruct) {
                  var winObj = windowContainerStruct.window;
                  if (winObj && winObj.status.playvideoing) {
                    // 正在预览的就是当前选中的摄像头
                    if (winObj.params.puid == puRes.puid && winObj.params.resIdx == puRes.resIdx) {
                      WebClient.StopVideo();
                    }
                  }
                }

                // 更新列表
                $.each(WebClient.puResList, function (puResIdx, puResItem) {
                  if (puResItem.puid == puRes.puid) {
                    puResItem.bOnline = 0;
                    $.each(puResItem.resList, function (listResIdx, listResItem) {
                      listResItem.bOnline = 0;
                    })
                    return;
                  }
                  return;
                })

                WebClient.message(WebClient.puResList, WebClient.rootDomainName)
              }
              break;
            default:
              break;
          }
        }

      }
    }
  },

  // 接收定位数据
  ReceiveLocationData: function (notify) {
    try {
      if (notify && notify.handle) {
        NPCCILY.windowContainers.each(function (item) {
          var windowContainerStruct = item.value;
          var winObj = windowContainerStruct.window;
          if (winObj && winObj.status.playvideoing) {
            if (winObj.params.locationResHandle == notify.handle && winObj.status.playlocation) {
              // unsigned char 状态: 0表示无模块;1表示无信号;2表示正常
              var State = notify.keyData.State;
              switch (Number(State)) {
                case NPCCEnum.LocationStatus.LocationStatus_NoModule:
                  var locationStatus = '无模块';
                  break;
                case NPCCEnum.LocationStatus.LocationStatus_NoSignal:
                  var locationStatus = '无信号';
                  break;
                case NPCCEnum.LocationStatus.LocationStatus_HasSignal:
                  var locationStatus = '正常';
                  // double 纬度,取值范围[-90,90],北纬为正,南纬为负
                  var Latitude = notify.keyData.Latitude;
                  // double 经度,现在取值是[-180,180),东经为正,西经为负
                  var Longitude = notify.keyData.Longitude;
                  // float 方向,[0,360),正北为0,正东为90,依次类推
                  var Bearing = notify.keyData.Bearing;
                  // float 速度,单位km/h
                  var Speed = notify.keyData.Speed;
                  // float 海拔,单位m,小于等于-50000表示无效
                  var Altitude = notify.keyData.Altitude;
                  // unsigned int 时间,单位秒,UTC时间
                  var UTCTime = notify.keyData.UTCTime;
                  var locationTime = NPCCUtils.DateFormat('yyyy-MM-dd HH:mm:ss', new Date(parseInt(UTCTime) * 1000));

                  var value = $('#location_info').val()
                  if (value === '') {
                    $('#location_info').val('时间:' + locationTime + ' 纬度: ' + Latitude + ' 经度:' + Longitude + ' 方向:' + Bearing
                      + ' 速度:' + Speed + ' 海拔:' + Altitude);
                  }
                  else {
                    $('#location_info').val(value + '\n时间:' + locationTime + ' 纬度: ' + Latitude + ' 经度:' + Longitude + ' 方向:' + Bearing
                      + ' 速度:' + Speed + ' 海拔:' + Altitude);
                  }

                  break;
                default:
                  break;
              }
            }
          }
        });
      }
    }
    catch (e) {
      alert('ReceiveLocationData exception：' + e.message + ', ' + e.name);
    }
  },

  // 接收流状态的通知
  ReceiveStreamStatus: function (notify) {
    try {
      if (notify && notify.handle) {
        NPCCILY.windowContainers.each(
          function (item) {
            var windowContainerStruct = item.value;
            var winObj = windowContainerStruct.window;
            if (winObj && winObj.status.playvideoing) {
              // 根据句柄匹配
              if (winObj.params.cameraResHandle == notify.handle) {
                if (notify.eventName == NPCCEnum.CCObjectNotify.stream_status_notify) {
                  if (notify.errorCode == ErrorCode.NP_E_OK) {
                    if (typeof notify.statusDesc != 'undefined' && notify.statusDesc != '') {
                      alert('视频播放状态：' + notify.statusDesc);
                    }
                  }
                  else {
                    alert('视频播放错误：' + ErrorCode.Error2Desc(notify.errorCode));
                  }
                }
              }
              else if (winObj.params.audioResHandle == notify.handle) {
                if (notify.eventName == NPCCEnum.CCObjectNotify.stream_status_notify) {
                  if (notify.errorCode == ErrorCode.NP_E_OK) {
                    if (typeof notify.statusDesc != 'undefined' && notify.statusDesc != '') {
                      alert('音频播放状态：' + notify.statusDesc);
                    }
                  }
                  else {
                    alert('音频播放错误：' + ErrorCode.Error2Desc(notify.errorCode));
                  }
                }
              }
              else if (winObj.params.talkbackResHandle == notify.handle) {
                if (notify.eventName == NPCCEnum.CCObjectNotify.call_stream_status_notify) {
                  if (notify.errorCode == ErrorCode.NP_E_OK) {
                    if (notify.keyData.type == 1) {
                      alert('喊话成功');
                    }
                    else if (notify.keyData.type == 2) {
                      alert('对讲成功');
                    }
                  }
                  else {
                    if (notify.keyData.type == 1) {
                      alert('喊话错误：' + ErrorCode.Error2Desc(notify.errorCode));
                    }
                    else if (notify.keyData.type == 2) {
                      alert('对讲错误：' + ErrorCode.Error2Desc(notify.errorCode));
                    }
                  }
                }
              }
            }
          }
        );
      }
    }
    catch (e) {
      alert('ReceiveStreamStatus exception：' + e.message + ', ' + e.name);
    }
  },

  // 接受PW插件事件
  ReceivePWEvent: function (notify) {
    if (notify.eventName == "lbtn_click") {
      WebClient.ClickVideoWindow(notify.handle);
    }

  },

  end: true
}
