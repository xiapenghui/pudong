var Log = function(){
  console.log.apply(console , arguments);
};


var getDefaultHandler = function(){
  return function(data){
    Log(data);
  };
};
// debugger
var WebClient = {
  domId: null,
  connectId: null,
  resource: new NPCCUtils.Hash(),
  puResList: null,
  onlineResList : null,
  rootDomainName: null,
  def: 75,//当前播放视频的清晰度
  vol: 75,//当前播放音频的声音大小,

  current : null,
  isMock : false,
  Log: Log,



  defaultHandler: getDefaultHandler(),

  loadHandler: getDefaultHandler(),
  loginHandler: getDefaultHandler(),
  logoutHandler: getDefaultHandler(),

  cameraHander : getDefaultHandler(),
  playVideoHandler: getDefaultHandler(),
  stopVideoHandler: getDefaultHandler(),

  audioHandler : getDefaultHandler(),
  talkbackHandler : getDefaultHandler(),
  locationHandler : getDefaultHandler(),

  playLocationHandler : getDefaultHandler(),
  stopLocationHandler : getDefaultHandler(),
  playAudioHandler : getDefaultHandler(),
  stopAudioHandler : getDefaultHandler(),
  playTalkHandler : getDefaultHandler(),
  stopTalkHandler : getDefaultHandler(),

  playOrStopAudioHandler: getDefaultHandler(),
  playOrStopTalkHandler: getDefaultHandler(),
  playOrStopLocationHandler: getDefaultHandler(),

  startTurePtzHandler : getDefaultHandler(),
  stopTurePtzHandler :getDefaultHandler(),

  setDefinitionHandler : getDefaultHandler(),
  setAudioVolumeHandler : getDefaultHandler(),

  receiveStreamStatusHandler: getDefaultHandler(),
  receiveLocationHandler: getDefaultHandler(),
  receiveHandler: getDefaultHandler(),


  PtzTureType: {
    PTZ_TURN_UP: 1,
    PTZ_TURN_DOWN: 2,
    PTZ_TURN_LEFT: 3,
    PTZ_TURN_RIGHT: 4
  },


  // 初始化，加载插件
  Load: function (domId) {
    WebClient.domId = domId;

    var handlerData = {
      success: true,
      message: "",
      errorCode: 0
    };

    try {
      // 首先初始化NPCCILY，加载插件
      var operator = NPCCILY.Init(new NPCCStruct.InitParamStruct(false, null, null));
      if (operator.errorCode != ErrorCode.NP_E_OK) {
        // 初始化不成功
        WebClient.Log(ErrorCode.Error2Desc(operator.errorCode));
        WebClient.SetHandlerDataError(handlerData , operator.errorCode);
        WebClient.loadHandler(handlerData);
        return false;
      } else {
        // 存储窗口容器信息
        // 存放窗口容器信息，只有一个窗口
        NPCCILY.windowContainers.set(WebClient.domId, new NPCCStruct.WindowContainerStruct($('#' + WebClient.domId)[0], true, null, null));
      }
      WebClient.loadHandler(handlerData);
      return true;
    } catch (e) {
      WebClient.Log('Load exception: ' + e.name + '::' + e.message);
      WebClient.SetHandlerDataError(handlerData , null, e.name + "::" + e.message);
      WebClient.loadHandler(handlerData);
      return false;
    }
  },

  // 释放插件
  Free: function () {
    NPCCILY.Free();
  },

  // 建立连接
  Login: function (ip, port, userName, pwd) {
    // debugger
    var ipVal = ip;
    var portVal = port;
    var userNameVal = userName;
    var pwdVal = pwd;
    var root = 'root';

    var handlerData = {
      eventType : "Login",
      success: true,
      message: "",
      errorCode: 0,
      data : {
      }
    };

    // 调用建立登录函数
    var operator = NPCCILY.Login(new NPCCStruct.LoginParamStruct(ipVal, portVal, root, userNameVal, pwdVal, true));
    WebClient.Log(operator);
    if (operator.errorCode == ErrorCode.NP_E_OK) {
      // 此即是当前连接ID，记录下来
      WebClient.connectId = operator.value;

      var windowContainerStruct = NPCCILY.windowContainers.get(WebClient.domId);
      if (windowContainerStruct) {
        // 创建窗口
        var window = NPCCILY.CreateWindow(WebClient.connectId, windowContainerStruct.container);
        if (window.errorCode == ErrorCode.NP_E_OK) {
          windowContainerStruct.window = window.value;
        }
      }

      {
        NPCCILY.CCNotifyManager.Add(
          NPCCEnum.CCObjectNotify.event_notify,
          function (notify) {
            WebClient.ReceiveEvent(notify);
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
      }

      if (!WebClient.connectId || !NPCCILY.serverMap.get(WebClient.connectId)) {
        WebClient.Log('连接信息不存在，获取资源失败');
        WebClient.SetHandlerDataError(handlerData , operator.errorCode);
        WebClient.loginHandler(handlerData);
        return false;
      }

      // 获取域以及子域信息
      operator = NPCCILY.ForkDomainList(WebClient.connectId);
      if (operator.errorCode == ErrorCode.NP_E_OK) {
        WebClient.Log('获取域信息成功');
        // 获取服务器名称功能
        operator = NPCCILY.GetRootDomainName(WebClient.connectId);
        if (operator.errorCode == ErrorCode.NP_E_OK) {
          var rootDomainName = operator.value || '网络视频监控系统';
          WebClient.rootDomainName = rootDomainName;
          WebClient.Log('服务器名称：%s', rootDomainName);

          // 开始获取设备列表
          operator = NPCCILY.ForkPUList(WebClient.connectId);
          if (operator.errorCode == ErrorCode.NP_E_OK) {
            WebClient.Log(operator);
            WebClient.Log('获取设备列表成功');
            var puResList = operator.value;
            // 开始获取所有子资源
            operator = NPCCILY.ForkResList(WebClient.connectId);
            if (operator.errorCode == ErrorCode.NP_E_OK) {
              WebClient.Log('获取所有子资源成功');
              // 将子资源添加到对应的设备里
              operator = NPCCILY.GetAllResList(WebClient.connectId, puResList);
            }
// debugger
            WebClient.puResList = puResList;
            var onlineArr = [];
            var len = puResList.length;
            for(var i = 0 ; i < len;i++){
              if(1 === parseInt( puResList[i].bOnline ) ){
                onlineArr.push(puResList[i]);
              }
            }
            WebClient.onlineResList = onlineArr;
            handlerData.data = puResList;
            if (operator.errorCode == ErrorCode.NP_E_OK) {
              //WebClient.message(WebClient.puResList, WebClient.rootDomainName);

            } else {
              WebClient.Log('获取子资源失败: %s', ErrorCode.Error2Desc(operator.errorCode));
              WebClient.SetHandlerDataError(handlerData , operator.errorCode);
            }
          } else {
            WebClient.Log('获取设备列表失败: %s', ErrorCode.Error2Desc(operator.errorCode));
            WebClient.SetHandlerDataError(handlerData , operator.errorCode);
          }
        } else {
          WebClient.Log('获取服务器名称失败: %s', ErrorCode.Error2Desc(operator.errorCode));
          WebClient.SetHandlerDataError(handlerData , operator.errorCode);
        }
      }
      else {
        WebClient.Log('获取域信息失败: %s', ErrorCode.Error2Desc(operator.errorCode));
        WebClient.SetHandlerDataError(handlerData , operator.errorCode);
      }

      if (operator.errorCode != ErrorCode.NP_E_OK) {
        // 以上操作失败需要退出平台
        WebClient.Logout();
      }
    } else {
      WebClient.Log('登录失败: %s', ErrorCode.Error2Desc(operator.errorCode));
      WebClient.Log('登录失败: ' + ErrorCode.Error2Desc(operator.errorCode));
      WebClient.SetHandlerDataError(handlerData , operator.errorCode);
    }

    WebClient.loginHandler(handlerData);
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
    var handlerData = {
      eventType : "Logout",
      success: true,
      message: "",
      errorCode: 0,
      data : {
      }
    };

    try {
      var windowContainerStruct = NPCCILY.windowContainers.get(WebClient.domId);
      if (windowContainerStruct) {
        var winObj = windowContainerStruct.window;
        if (winObj && winObj.status.playvideoing) {
          // 原先有播放的就先停止播放
          if (!WebClient.StopVideo()) {
            handlerData.success = false;
            handlerData.message = ErrorCode.Error2Desc(operator.errorCode);
            handlerData.errorCode = operator.errorCode;
            WebClient.Log('停止视频出错，退出平台失败:  ' + ErrorCode.Error2Desc(operator.errorCode));
            WebClient.logoutHandler(handlerData);
            return false;
          }
        }
      }

      var operator = NPCCILY.Logout(WebClient.connectId);
      if (operator.errorCode == ErrorCode.NP_E_OK) {
        windowContainerStruct.window = null;
        WebClient.connectId = null;
      } else {
        handlerData.success = false;
        handlerData.message = ErrorCode.Error2Desc(operator.errorCode);
        handlerData.errorCode = operator.errorCode;
        WebClient.Log('退出平台失败: ' + ErrorCode.Error2Desc(operator.errorCode));
      }
    } catch (e) {
      handlerData.success = false;
      handlerData.message = e.name + '::' + e.message;
      handlerData.errorCode = -1;
      WebClient.Log('Logout exception: ' + e.name + '::' + e.message);
    }

    WebClient.logoutHandler(handlerData);
  },

  // 点击播放视频
  Camera: function (puid, resIdx) {

    var handlerData = {
      eventType : "Camera",
      success: true,
      message: "",
      errorCode: 0,
      data: {
        def: null
      }
    };

    $.each(WebClient.puResList, function (puResIdx, puRes) {
      if (puRes.puid == puid) {
        $.each(puRes.resList, function (baseResIdx, baseRes) {
          if (baseRes.resType == NPCCEnum.ResType.RES_TYPE_CAM && baseRes.bOnline == 0) {
            WebClient.Log('播放视频失败，设备不在线');
            WebClient.SetHandlerDataError(handlerData , null , "播放视频失败，设备不在线");
            return;
          }

          if (baseRes.resType == NPCCEnum.ResType.RES_TYPE_CAM && baseRes.resIdx == resIdx && baseRes.bOnline == 1) {
            WebClient.PlayVideo(baseRes, handlerData, getDefaultHandler());
            return;
          }
        });
        return;
      }
    });

    WebClient.cameraHander(handlerData);
  },

  /**
   * 启动视屏
   *
   * @param cameraRes
   * @param errorHandler 错误处理函数
   * @param successHandler 成功处理函数
   * @returns {boolean}
   * @constructor
   */
  PlayVideo: function (cameraRes , handlerData , handler) {
    if (!handlerData) {
      handlerData = {
        eventType : "PlayVideo",
        success: true,
        message: "",
        errorCode: 0,
        data: {
          def : null
        }
      };
    }

    if (!handler) {
      handler = WebClient.playVideoHandler;
    }


    if (cameraRes.resType == NPCCEnum.ResType.RES_TYPE_CAM && cameraRes.bOnline == 0) {
      WebClient.Log('播放视频失败，设备不在线');
      WebClient.SetHandlerDataError(handlerData , null ,"播放视频失败，设备不在线");
    } else {
      try {
        var windowContainerStruct = NPCCILY.windowContainers.get(WebClient.domId);
        if (windowContainerStruct) {
          var winObj = windowContainerStruct.window;
          if (winObj) {
            if (winObj.status.playvideoing) {
              // 正在预览的就是当前选中的摄像头
              if (winObj.params.puid == cameraRes.puid && winObj.params.resIdx == cameraRes.resIdx) {
                WebClient.Log('视频已经在播放了');
                WebClient.SetHandlerDataError(handlerData , null ,"视频已经在播放了");
                WebClient.playVideoHandler(handlerData);
                return false;
              }

              // 正在预览其他视频
              if (!WebClient.StopVideo()) {
                WebClient.Log('正在预览其他视频信息，切换失败');
                WebClient.SetHandlerDataError(handlerData , null ,"正在预览其他视频信息，切换失败");
                WebClient.playVideoHandler(handlerData);
                return false;
              }
            }

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
                // $('#def').val(operator.value);
                WebClient.Log('获取清晰度成功:' + operator.value);
                WebClient.def = operator.value;
                handlerData.data.def = operator.value;
              } else {
                WebClient.Log('获取清晰度失败：' + ErrorCode.Error2Desc(operator.errorCode));
                WebClient.SetHandlerDataError(handlerData , operator.errorCode);
              }
            } else {
              WebClient.Log('开启视频失败：' + ErrorCode.Error2Desc(operator.errorCode));
              WebClient.SetHandlerDataError(handlerData , operator.errorCode);
              WebClient.playVideoHandler(handlerData);
              return false;
            }

            WebClient.playVideoHandler(handlerData);
            return true;
          }
          WebClient.Log('开启视频失败，视频播放窗口还没有创建');
          WebClient.SetHandlerDataError(handlerData , null , "开启视频失败，视频播放窗口还没有创建");
          WebClient.playVideoHandler(handlerData);
          return false;
        }
      } catch (e) {
        WebClient.Log('启动视频异常：' + e.name + ', ' + e.message);
        WebClient.SetHandlerDataError(handlerData , null , "e.name + ', ' + e.message");
        WebClient.playVideoHandler(handlerData);
        return false;
      }
    }


  },

  // 关闭视频
  StopVideo: function () {
    var handlerData = {
      eventType : "StopVideo",
      success: true,
      message: "",
      errorCode: 0,
      data: {}
    };

    try {
      var windowContainerStruct = NPCCILY.windowContainers.get(WebClient.domId);
      if (windowContainerStruct) {
        var winObj = windowContainerStruct.window;
        if (winObj.status.playaudioing) {
          if (!WebClient.PlayOrStopAudio(winObj, handlerData , getDefaultHandler())) {
            WebClient.stopVideoHandler(handlerData);
            return false;
          }
        }

        if (winObj.status.playtalking) {
          if (!WebClient.PlayOrStopTalk(winObj,handlerData , getDefaultHandler())) {
            WebClient.stopVideoHandler(handlerData);
            return false;
          }
        }

        if (winObj.status.playlocation) {
          if (!WebClient.PlayOrStopLocation(winObj,handlerData,getDefaultHandler())) {
            WebClient.stopVideoHandler(handlerData);
            return false;
          }
        }

        if (winObj.status.playvideoing) {
          var operator = NPCCILY.StopPreview(winObj, NPCCEnum.StopRealtimePreviewType.SREP_VIDEO);
          if (operator.errorCode == ErrorCode.NP_E_OK) {
            WebClient.def = null;
            WebClient.vol = null;
            NPCCIF.RefreshImage(NPCCILY.Plug.ccPlugin, winObj.params.mediaHandle);
            winObj.params.cameraResHandle = null;
          } else {
            WebClient.Log('停止视频失败：' + ErrorCode.Error2Desc(operator.errorCode));
            WebClient.SetHandlerDataError(handlerData , operator.errorCode);
            WebClient.stopVideoHandler(handlerData);
            return false;
          }
        }
      }
      WebClient.stopVideoHandler(handlerData);
      return true;
    } catch (e) {
      WebClient.Log('停止失败异常: ' + e.name + ', ' + e.message);
      WebClient.SetHandlerDataError(handlerData , null , e.name + ', ' + e.message);
      WebClient.stopVideoHandler(handlerData);
      return false;
    }
  },

  // 音频
  Audio: function () {
    var handlerData = {
      eventType : "Audio",
      success: true,
      message: "",
      errorCode: 0,
      data: {
        vol : null
      }
    };

    try {
      var windowContainerStruct = NPCCILY.windowContainers.get(WebClient.domId);
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
              });
              if (bFind) {
                WebClient.PlayOrStopAudio(windowContainerStruct.window , handlerData , getDefaultHandler());
              }else {
                WebClient.Log('没有音量资源');
                WebClient.SetHandlerDataError(handlerData , null , "没有音量资源");
              }
              return;
            }
          });
        } else {
          WebClient.Log('请先选择一个视频播放');
          WebClient.SetHandlerDataError(handlerData , null , "请先选择一个视频播放");
        }
      }
    }catch (e) {
      WebClient.Log('开启或停止音频异常：' + e.name + '::' + e.message);
      WebClient.SetHandlerDataError(handlerData , null , "e.name + '::' + e.message");
    }

    WebClient.audioHandler(handlerData);
  },


  // 对讲
  Talkback: function () {
    var handlerData = {
      eventType : "Talkback",
      success: true,
      message: "",
      errorCode: 0,
      data: {
        vol : null
      }
    };

    try {
      var windowContainerStruct = NPCCILY.windowContainers.get('video');
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
              });
              if (bFind) {
                WebClient.PlayOrStopTalk(windowContainerStruct.window,handlerData,getDefaultHandler());
              }
              else {
                WebClient.Log('没有对讲资源');
                WebClient.SetHandlerDataError(handlerData , null ,"没有对讲资源");
              }

              return;
            }
          });
        }else {
          WebClient.Log('请先选择一个视频播放');
          WebClient.SetHandlerDataError(handlerData , null ,"请先选择一个视频播放");
        }
      }
    }catch (e) {
      WebClient.Log('开启或停止对讲异常：' + e.name + '::' + e.message);
      WebClient.SetHandlerDataError(handlerData , null ,e.name + '::' + e.message);
    }

    WebClient.talkbackHandler(handlerData);
  },


  // 定位
  Location: function () {
    var handlerData = {
      eventType : "Location",
      success: true,
      message: "",
      errorCode: 0,
      data: {
      }
    };


    try {
      var windowContainerStruct = NPCCILY.windowContainers.get(WebClient.domId);
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
              });

              if (bFind) {
                WebClient.PlayOrStopLocation(windowContainerStruct.window , handlerData, getDefaultHandler());
              }else {
                WebClient.Log('没有定位资源');
                WebClient.SetHandlerDataError(handlerData , null,"没有定位资源");
              }
              return;
            }
          });
        } else {
          WebClient.Log('请先选择一个视频播放');
          WebClient.SetHandlerDataError(handlerData , null,"请先选择一个视频播放");
        }
      }
    } catch (e) {
      WebClient.Log('开启或停止定位异常：' + e.name + '::' + e.message);
      WebClient.SetHandlerDataError(handlerData , null,e.name + '::' + e.message);
    }

    WebClient.locationHandler(handlerData);
  },

  SetHandlerDataError: function (handlerData, errorCode, message) {
    if (null === errorCode
      || undefined === errorCode) {
      errorCode = ErrorCode.NP_E_UNKNOWN;
    }

    if (null == message
      || undefined === message) {
      message = ErrorCode.Error2Desc(errorCode);
    }

    if (!handlerData) {
      handlerData = {
        success: false,
        errorCode: errorCode,
        message: message,
        data: {}
      };
    } else {
      handlerData.success = false;
      handlerData.errorCode = errorCode;
      handlerData.message = message;

      if (undefined !== handlerData.data) {
        if (undefined !== handlerData.data.errorCode) {
          handlerData.data.errorCode = errorCode;
        }

        if (undefined !== handlerData.data.message) {
          handlerData.data.message = message;
        }
      }
    }

    return handlerData;
  },

  // 添加事件
  AddCCEvent: function () {
    NPCCILY.CCNotifyManager.Add(
      NPCCEnum.CCObjectNotify.event_notify,
      function (notify) {
        WebClient.ReceiveEvent(notify);
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

  PlayAudio : function(winObj, handlerData, handler){
    if (!handlerData) {
      handlerData = {
        eventType : "PlayAudio",
        success: true,
        message: "",
        errorCode: 0,
        data: {
          vol : null
        }
      };
    }

    if (!handler) {
      handler = WebClient.playAudioHandler;
    }

    if (winObj.status.playaudioing) {
      return true;
    }

    if (winObj.status.playtalking) {
      if (!WebClient.StopTalk(winObj , handlerData , null)) {
        winObj.params.audioResHandle = null;
        handler(handlerData);
        return false;
      }
    }

    var operator = NPCCILY.StartPreview(winObj, NPCCEnum.StopRealtimePreviewType.SREP_AUDIO);
    if (operator.errorCode == ErrorCode.NP_E_OK) {
      operator = NPCCILY.AUD_GetVolume(winObj);
      if (operator.errorCode == ErrorCode.NP_E_OK) {
        WebClient.Log('获取音频音量成功:' + operator.value);
        handlerData.data.vol = operator.value;
        WebClient.vol = operator.value;
      } else {
        WebClient.Log('获取音频音量失败：' + ErrorCode.Error2Desc(operator.errorCode));
        if(WebClient.SetAudVolume(WebClient.vol)){
          handlerData.data.vol = WebClient.vol;
        }else{
          handlerData.data.vol = null;
        }
      }
    } else {
      winObj.params.audioResHandle = null;
      WebClient.Log('开启音频失败：' + ErrorCode.Error2Desc(operator.errorCode));
      handlerData = WebClient.SetHandlerDataError(handlerData, operator.errorCode);
      handler(handlerData);
      return false;
    }

    handler(handlerData);
    return true;
  },

  StopAudio : function(winObj, handlerData, handler){
    if (!handlerData) {
      handlerData = {
        eventType : "StopAudio",
        success: true,
        message: "",
        errorCode: 0,
        data: {
          vol : null
        }
      };
    }

    if (!handler) {
      handler = WebClient.stopAudioHandler;
    }

    if (!winObj.status.playaudioing) {
      return true;
    }

    var operator = NPCCILY.StopPreview(winObj, NPCCEnum.StopRealtimePreviewType.SREP_AUDIO);
    if (operator.errorCode == ErrorCode.NP_E_OK) {
      winObj.params.audioResHandle = null;
    } else {
      WebClient.Log('停止音频失败：' + ErrorCode.Error2Desc(operator.errorCode));
      handlerData = WebClient.SetHandlerDataError(handlerData, operator.errorCode);
      handler(handlerData);
      return false;
    }

    if (winObj.status.playtalking) {
      if (!WebClient.StopTalk(winObj , handlerData , null)) {
        winObj.params.audioResHandle = null;
        handler(handlerData);
        return false;
      }
    }

    handler(handlerData);
    return true;
  },

  // 启动/关闭音频
  PlayOrStopAudio: function (winObj, handlerData, handler) {
    if (!handlerData) {
      handlerData = {
        eventType : "PlayOrStopAudio",
        success: true,
        message: "",
        errorCode: 0,
        data: {
          vol : null
        }
      };
    }

    if (!handler) {
      handler = WebClient.playOrStopAudioHandler;
    }

    var success = false;
    if (winObj.status.playaudioing) {
      success = WebClient.StopAudio(winObj , handlerData , null);
    }else{
      success = WebClient.PlayAudio(winObj , handlerData , null);
    }

    handler(handlerData);
    return true;
  },

  PlayTalk : function(winObj, handlerData, handler){
    //设置handlerData
    if (!handlerData) {
      handlerData = {
        eventType : "PlayTalk",
        success: true,
        message: "",
        errorCode: 0,
        data: {}
      };
    }

    //设置handler
    if (!handler) {
      handler = WebClient.playTalkHandler;
    }

    if (winObj.status.playtalking) {
      return true;
    }

    //声音
    if (winObj.status.playaudioing) {
      if(! WebClient.StopAudio(winObj , handlerData , null)){
        handler(handlerData);
        return false;
      }
    }

    //尚未开启对讲
    var operator = NPCCILY.StartTalk(winObj);
    if (operator.errorCode != ErrorCode.NP_E_OK) {
      winObj.params.talkbackResHandle = null;
      WebClient.Log('开启对讲失败：' + ErrorCode.Error2Desc(operator.errorCode));
      handlerData = WebClient.SetHandlerDataError(handlerData, operator.errorCode);
      handler(handlerData);
      return false;
    }

    operator = NPCCILY.AUD_GetVolume(winObj);
    if (operator.errorCode == ErrorCode.NP_E_OK) {
      WebClient.Log('获取音频音量成功:' + operator.value);
      handlerData.data.vol = operator.value;
      WebClient.vol = operator.value;
    } else {
      WebClient.Log('获取音频音量失败：' + ErrorCode.Error2Desc(operator.errorCode));
      handlerData.data.vol = null;
      if(WebClient.SetAudVolume(WebClient.vol)){
        handlerData.data.vol = WebClient.vol;
      }
    }

    handler(handlerData);
    return true;
  },

  StopTalk : function(winObj, handlerData, handler){
    //设置handlerData
    if (!handlerData) {
      handlerData = {
        eventType : "StopTalk",
        success: true,
        message: "",
        errorCode: 0,
        data: {}
      };
    }

    //设置handler
    if (!handler) {
      handler = WebClient.stopTalkHandler;
    }

    if(!winObj.status.playtalking) {
      return true;
    }

    //声音
    if (winObj.status.playaudioing) {
      if(!WebClient.StopAudio(winObj , handlerData , null)){
        handler(handlerData);
        return false;
      }
    }

    var operator = NPCCILY.StopTalk(winObj);
    if (operator.errorCode == ErrorCode.NP_E_OK) {
      winObj.params.talkbackResHandle = null;
      handler(handlerData);
      return true;
    } else {
      WebClient.Log('停止对讲失败：' + ErrorCode.Error2Desc(operator.errorCode));
      handlerData = WebClient.SetHandlerDataError(handlerData, operator.errorCode);
      handler(handlerData);
      return false;
    }

  },

  /**
   * 启动和关闭对讲
   *
   * 外部调用该函数时，不需要传递事件数据及事件处理函数
   *
   * @param winObj 当前对象
   * @param handlerData {null|Object} 事件数据
   * @param handler {null|function} 事件处理函数
   * @returns {boolean}
   */
  PlayOrStopTalk: function (winObj, handlerData, handler) {
    //设置handlerData
    if (!handlerData) {
      handlerData = {
        eventType : "PlayOrStopTalk",
        success: true,
        message: "",
        errorCode: 0,
        data: {}
      };
    }

    //设置handler
    if (!handler) {
      handler = WebClient.playOrStopTalkHandler;
    }

    var success = false;
    if (winObj.status.playtalking) {//对讲中
      success = WebClient.StopTalk(winObj , handlerData , null);
    }else{
      success = WebClient.PlayTalk(winObj , handlerData , null);
    }

    handler(handlerData);
    return success;
  },

  PlayLocation : function(winObj , handlerData , handler){
    //设置handlerData
    if (!handlerData) {
      handlerData = {
        eventType : "PlayLocation",
        success: true,
        message: "",
        errorCode: 0,
        data: {}
      };
    }

    //设置handler
    if (!handler) {
      handler = WebClient.playLocationHandler;
    }

    if(winObj.status.playlocation){
      return true;
    }

    //开启定位
    var operator = NPCCILY.StartLocation(winObj);
    if (operator.errorCode != ErrorCode.NP_E_OK) {
      winObj.params.locationResHandle = null;
      WebClient.Log('开启定位失败：' + ErrorCode.Error2Desc(operator.errorCode));
      handlerData = WebClient.SetHandlerDataError(handlerData, operator.errorCode);
      handler(handlerData);
      return false;
    }

    handler(handlerData);
    return true;
  },

  StopLocation : function(winObj , handlerData , handler){
    //设置handlerData
    if (!handlerData) {
      handlerData = {
        eventType : "StopLocation",
        success: true,
        message: "",
        errorCode: 0,
        data: {}
      };
    }

    //设置handler
    if (!handler) {
      handler = WebClient.stopLocationHandler;
    }

    if(!winObj.status.playlocation){
      return true;
    }

    var operator = NPCCILY.StopLocation(winObj);
    if (operator.errorCode == ErrorCode.NP_E_OK) {
      winObj.params.locationResHandle = null;
      handler(handlerData);
      return true;
    } else {
      WebClient.Log('停止定位失败：' + ErrorCode.Error2Desc(operator.errorCode));
      handlerData = WebClient.SetHandlerDataError(handlerData, operator.errorCode);
      handler(handlerData);
      return false;
    }
  },


  /**
   * 启动和关闭定位
   *
   * 外部调用该函数时，不需要传递事件数据及事件处理函数
   *
   * @param winObj 当前对象
   * @param handlerData {null|Object} 事件数据
   * @param handler {null|function} 事件处理函数
   * @returns {boolean}
   */
  PlayOrStopLocation: function (winObj, handlerData, handler) {
    //设置handlerData
    if (!handlerData) {
      handlerData = {
        eventType : "PlayOrStopLocation",
        success: true,
        message: "",
        errorCode: 0,
        data: {}
      };
    }

    //设置handler
    if (!handler) {
      handler = WebClient.playOrStopLocationHandler;
    }

    //正在定位中
    var success = false;
    if (winObj.status.playlocation) {
      success = WebClient.StopLocation(winObj , handlerData , null);
    }else{
      success = WebClient.PlayLocation(winObj , handlerData , null);
    }
    handler(handlerData);
    return success;
  },

  // 启动云台移动
  StartTurePtz: function (ptzTureType) {
    var handlerData = {
      eventType : "StartTurePtz",
      success : true,
      message : "",
      errorCode : 0,
      data : {}
    };

    try {
      var windowContainerStruct = NPCCILY.windowContainers.get(WebClient.domId);
      if (windowContainerStruct && windowContainerStruct.window) {
        if (windowContainerStruct.window.status.playvideoing) {
          var puid = windowContainerStruct.window.params.puid;
          $.each(WebClient.puResList, function (puResIdx, puRes) {
            //查找到当前展示的设备
            if (puRes.puid == puid) {
              var bFind = false;
              $.each(puRes.resList, function (baseResIdx, baseRes) {
                //查找当前展示的设备是否有PTZ操作
                if (baseRes.resType == NPCCEnum.ResType.RES_TYPE_PTZ) {
                  windowContainerStruct.window.params.ptzResHandle = baseRes.handle;
                  bFind = true;
                  return;
                }
              });

              if (bFind) {
                if (ptzTureType == WebClient.PtzTureType.PTZ_TURN_UP) {
                  var operator = NPCCILY.PTZ_StartTurnUp(windowContainerStruct.window);
                  if (operator.errorCode == ErrorCode.NP_E_OK) {
                    WebClient.Log('开启云台向上移动成功');
                    handlerData.message = "开启云台向上移动成功";
                  }else {
                    WebClient.Log('开启云台向上移动失败：' + ErrorCode.Error2Desc(operator.errorCode));
                    WebClient.SetHandlerDataError(handlerData , operator.errorCode);
                  }
                }else if (ptzTureType == WebClient.PtzTureType.PTZ_TURN_DOWN) {
                  var operator = NPCCILY.PTZ_StartTurnDown(windowContainerStruct.window);
                  if (operator.errorCode == ErrorCode.NP_E_OK) {
                    WebClient.Log('开启云台向下移动成功');
                    handlerData.message = "开启云台向下移动成功";
                  }else {
                    WebClient.Log('开启云台向下移动失败：' + ErrorCode.Error2Desc(operator.errorCode));
                    WebClient.SetHandlerDataError(handlerData , operator.errorCode);
                  }
                }else if (ptzTureType == WebClient.PtzTureType.PTZ_TURN_LEFT) {
                  var operator = NPCCILY.PTZ_StartTurnLeft(windowContainerStruct.window);
                  if (operator.errorCode == ErrorCode.NP_E_OK) {
                    WebClient.Log('开启云台向左移动成功');
                    handlerData.message = "开启云台向左移动成功";
                  }else {
                    WebClient.Log('开启云台向左移动失败：' + ErrorCode.Error2Desc(operator.errorCode));
                    WebClient.SetHandlerDataError(handlerData , operator.errorCode);
                  }
                }else if (ptzTureType == WebClient.PtzTureType.PTZ_TURN_RIGHT) {
                  var operator = NPCCILY.PTZ_StartTurnRight(windowContainerStruct.window);
                  if (operator.errorCode == ErrorCode.NP_E_OK) {
                    WebClient.Log('开启云台向右移动成功');
                    handlerData.message = "开启云台向右移动成功";
                  } else {
                    WebClient.Log('开启云台向右移动失败：' + ErrorCode.Error2Desc(operator.errorCode));
                    WebClient.SetHandlerDataError(handlerData , operator.errorCode);
                  }
                }else {
                  WebClient.Log('传入的云台类型参数不存在');
                  WebClient.SetHandlerDataError(handlerData , null,"传入的云台类型参数不存在");
                }
              }else {
                WebClient.Log('该设备没有云台资源');
                WebClient.SetHandlerDataError(handlerData , null,"该设备没有云台资源");
              }

              return;
            }
          });
        } else {
          WebClient.Log('请先选择一个视频播放');
          WebClient.SetHandlerDataError(handlerData , null,"请先选择一个视频播放");
        }
      }
    } catch (e) {
      WebClient.Log('启动云台移动异常：' + e.name + '::' + e.message);
      WebClient.SetHandlerDataError(handlerData , null,e.name + '::' + e.message);
    }

    WebClient.startTurePtzHandler(handlerData);
  },

  // 停止云台移动
  StopTurePtz: function () {
    var handlerData = {
      eventType : "StopTurePtz",
      success : true,
      message : "",
      errorCode : 0,
      data : {}
    };

    try {
      var windowContainerStruct = NPCCILY.windowContainers.get(WebClient.domId);
      if (windowContainerStruct && windowContainerStruct.window) {
        if (windowContainerStruct.window.params.ptzResHandle) {
          var operator = NPCCILY.PTZ_StopTurn(windowContainerStruct.window);
          if (operator.errorCode == ErrorCode.NP_E_OK) {
            WebClient.Log('停止云台移动成功');
            handlerData.message = "停止云台移动成功";
          }
          else {
            WebClient.Log('停止云台移动失败：' + ErrorCode.Error2Desc(operator.errorCode));
            WebClient.SetHandlerDataError(handlerData , operator.errorCode);
          }
        }
      }
    } catch (e) {
      WebClient.Log('停止云台移动异常: ' + e.name + ', ' + e.message);
      WebClient.SetHandlerDataError(handlerData , null,e.name + ', ' + e.message);
    }

    WebClient.stopTurePtzHandler(handlerData);
  },

  // 设置清晰度
  SetDefinition: function (def) {
    var handlerData = {
      eventType : "SetDefinition",
      success : true,
      message : "",
      errorCode : 0,
      data : {def : null}
    };

    try {
      var windowContainerStruct = NPCCILY.windowContainers.get(WebClient.domId);
      if (windowContainerStruct && windowContainerStruct.window) {
        if (windowContainerStruct.window.status.playvideoing) {
          var puid = windowContainerStruct.window.params.puid;
          $.each(WebClient.puResList, function (puResIdx, puRes) {
            if (puRes.puid == puid) {
              $.each(puRes.resList, function (baseResIdx, baseRes) {
                if (baseRes.resType == NPCCEnum.ResType.RES_TYPE_CAM) {
                  var definition = def;
                  if (!WebClient.validateInput(definition)) {
                    WebClient.Log('设置清晰度值错误');
                    WebClient.SetHandlerDataError(handlerData , null , "设置清晰度值错误");
                    return;
                  }

                  var operator = NPCCILY.CAM_SetDefinition(windowContainerStruct.window, definition);
                  if (operator.errorCode == ErrorCode.NP_E_OK) {
                    WebClient.def = definition;
                    WebClient.Log('设置清晰度成功');
                    handlerData.message = "设置清晰度成功";
                    handlerData.data.def = definition;
                  }
                  else {
                    WebClient.Log('设置清晰度失败：' + ErrorCode.Error2Desc(operator.errorCode));
                    WebClient.SetHandlerDataError(handlerData , operator.errorCode);
                    return false;
                  }
                  return;
                }
              });
              return;
            }
          });
        } else {
          WebClient.Log('请先选择一个视频播放');
          WebClient.SetHandlerDataError(handlerData , null , "请先选择一个视频播放");
        }
      }
    } catch (e) {
      WebClient.Log('设置清晰度异常：' + e.name + '::' + e.message);
      WebClient.SetHandlerDataError(handlerData , null , e.name + '::' + e.message);
    }

    WebClient.setDefinitionHandler(handlerData);
  },

  // 设置音频音量
  SetAudVolume: function (vol) {
    var handlerData = {
      eventType : "SetAudionVolume",
      success : true,
      message : "",
      errorCode : 0,
      data : {vol : null}
    };

    try {
      var windowContainerStruct = NPCCILY.windowContainers.get(WebClient.domId);
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
                });

                return;
              }
            });
          }

          var volume = vol;
          if (!WebClient.validateInput(volume)) {
            WebClient.Log('设置音频音量值错误');
            WebClient.SetHandlerDataError(handlerData , null , "设置音频音量值错误");
            return;
          }
          var operator = NPCCILY.AUD_SetVolume(windowContainerStruct.window, volume);
          if (operator.errorCode == ErrorCode.NP_E_OK) {
            WebClient.vol = volume;
            WebClient.Log('设置音频音量成功');
            handlerData.message = "设置音频音量成功";
            handlerData.data.vol = volume;
          } else {
            WebClient.Log('设置音频音量失败：' + ErrorCode.Error2Desc(operator.errorCode));
            WebClient.SetHandlerDataError(handlerData , operator.errorCode);
          }
        } else {
          WebClient.Log('请先选择一个视频播放');
          WebClient.SetHandlerDataError(handlerData , null , "请先选择一个视频播放");
        }
      }
    } catch (e) {
      WebClient.Log('设置音频音量异常：' + e.name + '::' + e.message);
      WebClient.SetHandlerDataError(handlerData , null , e.name + '::' + e.message);
    }

    WebClient.setAudioVolumeHandler(handlerData);
  },

  validateInput: function (val) {
    var value = String(val);
    value = value.replace(/[^0-9-]+/, '');
    var min = 1;
    var max = 100;
    if (parseInt(value) < min || parseInt(value) > max) {
      WebClient.Log('请输入1-100之间的数字');
      return false;
    }
    return true;
  },


  // 通过puid查找设备
  FindPuResByPUID: function (puid) {
    var puRes = null;
    $.each(WebClient.puResList, function (puIdx, device) {
      if (device.puid == puid) {
        puRes = device;
        return;
      }
    });
    return puRes;
  },

  // 接收事件
  ReceiveEvent: function (notify) {
    var globalData = NPCCILY.serverMap.get(WebClient.connectId);
    if (globalData instanceof NPCCStruct.InitGlobalDataStruct) {
      var hServer = globalData.hServer;
      if (hServer == notify.handle) {
        var handlerData = {
          success: true,
          message: "",
          errorCode: notify.errorCode,
          data: {
            message: "",
            errorCode: notify.errorCode
          }
        };

        if (notify.errorCode == ErrorCode.NP_E_OK) {
          var eventID = notify.keyData.ID; // 事件ID
          eventID = Number(eventID);
          if (eventID === NPCCEnum.Notification.RST_EVT_SERVER_ConnectionBreak) {
            // 与平台连接断开，需要主动断开与平台之间的连接
            WebClient.Log('与平台连接断开');
            WebClient.SetHandlerDataError(handlerData , null , "设备断线");
            WebClient.Logout();
          } else if (eventID === NPCCEnum.Notification.RST_EVT_PU_Online// 设备上线
            || eventID === NPCCEnum.Notification.RST_EVT_PU_Offline// 设备下线
          ) {
            var utcTime = notify.keyData.T; // 事件时间
            var eventTime = NPCCUtils.DateFormat('yyyy-MM-dd HH:mm:ss', new Date(parseInt(utcTime) * 1000));
            var dID = notify.keyData.DID; // 域的DID
            var puid = notify.keyData.SID; // 设备的PUID
            var resType = notify.keyData.RT; // 设备类型
            var resIdx = notify.keyData.RC; // 设备索引
            var puRes = WebClient.FindPuResByPUID(puid);

            if (eventID == NPCCEnum.Notification.RST_EVT_PU_Online) {
              handlerData.message = "设备上线";
              handlerData.data.message = "设备上线";
              if (puRes == null) {
                // 设备首次登录 更新列表
                var operator = NPCCILY.ForkOnePU(WebClient.connectId, dID, puid);
                if (operator.errorCode == ErrorCode.NP_E_OK) {
                  WebClient.Log(operator);
                  WebClient.Log('获取平台下的新设备信息成功');
                  puRes = operator.value;
                  WebClient.puResList = WebClient.puResList.concat(puRes);
                } else {
                  WebClient.Log('获取新设备信息失败: %s', ErrorCode.Error2Desc(operator.errorCode));
                  WebClient.Log('获取新设备信息失败: ' + ErrorCode.Error2Desc(operator.errorCode));
                }

                WebClient.Log(puRes.name + '在' + eventTime + '上线了');
              } else {
                WebClient.Log(puRes.name + '在' + eventTime + '上线了');
                // 列表中设备已存在  更新列表
                $.each(WebClient.puResList, function (puResIdx, puResItem) {
                  if (puResItem.puid == puRes.puid) {
                    puResItem.bOnline = 1;
                    $.each(puResItem.resList, function (listResIdx, listResItem) {
                      listResItem.bOnline = 1;
                    });

                    return;
                  }
                  return;
                });
              }

              //WebClient.message(WebClient.puResList, WebClient.rootDomainName);
            } else {
              handlerData.message = "设备下线";
              handlerData.data.message = "设备下线";

              WebClient.Log(puRes.name + '在' + eventTime + '下线了');
              // 如果该设备视频正在播放，就停止视频后刷新列表
              var windowContainerStruct = NPCCILY.windowContainers.get('video');
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
                  });
                  return;
                }
                return;
              });

              // WebClient.message(WebClient.puResList, WebClient.rootDomainName);
            }
          }
        }

        WebClient.receiveHandler(handlerData);
      }
    }
  },

  // 接收定位数据
  ReceiveLocationData: function (notify) {
    var handlerData = {
      success: true,
      message: message,
      errorCode: null,
      data: {
        errorCode: notify.errorCode,
        message: message
      }
    };

    try {
      if (notify && notify.handle) {
        NPCCILY.windowContainers.each(function (item) {
          var windowContainerStruct = item.value;
          var winObj = windowContainerStruct.window;
          if (winObj && winObj.status.playvideoing) {
            var message = null;
            if (typeof notify.statusDesc != 'undefined' && notify.statusDesc != '') {
              message = notify.statusDesc;
            }

            if (winObj.params.locationResHandle == notify.handle && winObj.status.playlocation) {
              // unsigned char 状态: 0表示无模块;1表示无信号;2表示正常
              var State = notify.keyData.State;
              State = Number(State);
              if (State === NPCCEnum.LocationStatus.LocationStatus_NoModule) {
                var locationStatus = '无模块';
                WebClient.SetHandlerDataError(handlerData , State , locationStatus);
              } else if (State === NPCCEnum.LocationStatus.LocationStatus_NoSignal) {
                var locationStatus = '无信号';
                WebClient.SetHandlerDataError(handlerData , State , locationStatus);
              } else if (State === NPCCEnum.LocationStatus.LocationStatus_HasSignal) {
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

                handlerData.success = true;
                handlerData.errorCode = State;
                handlerData.message = locationStatus;
                handlerData.data.errorCode = State;
                handlerData.data.message = locationStatus;
                handlerData.data.latitude = Latitude;//纬度
                handlerData.data.longitude = Longitude;//经度
                handlerData.data.bearing = Bearing;//方向
                handlerData.data.speed = Speed;//速度
                handlerData.data.altitude = Altitude;//海拔
                handlerData.data.utcTime = UTCTime;//UTC时间
                handlerData.data.locationTime = locationTime;//时间
              }
            }


          }
        });
      }
    }catch (e) {
      WebClient.Log('ReceiveLocationData exception：' + e.message + ', ' + e.name);
      WebClient.SetHandlerDataError(handlerData , null , e.message + ', ' + e.name);
    }

    WebClient.receiveLocationHandler(handlerData);
  },

  // 接收流状态的通知
  ReceiveStreamStatus: function (notify) {
    var handlerData = {
      success: true,
      message: message,
      errorCode: null,
      data: {
        type: null,
        eventName: null,
        errorCode: notify.errorCode,
        message: message
      }
    };


    try {
      if (notify && notify.handle) {
        NPCCILY.windowContainers.each(
          function (item) {
            var windowContainerStruct = item.value;
            var winObj = windowContainerStruct.window;
            if (winObj && winObj.status.playvideoing) {
              var message = null;
              if (typeof notify.statusDesc != 'undefined' && notify.statusDesc != '') {
                message = notify.statusDesc;
              }


              // 根据句柄匹配
              if (winObj.params.cameraResHandle == notify.handle) {
                handlerData.data.type = "video";
                if (notify.eventName == NPCCEnum.CCObjectNotify.stream_status_notify) {
                  handlerData.data.eventName = NPCCEnum.CCObjectNotify.stream_status_notify;
                  if (notify.errorCode != ErrorCode.NP_E_OK) {
                    handlerData.success = false;
                    handlerData.message = ErrorCode.Error2Desc(notify.errorCode);
                    handlerData.errorCode = notify.errorCode;
                    handlerData.message = ErrorCode.Error2Desc(notify.errorCode);
                    handlerData.data.errorCode = notify.errorCode;
                  }
                }
              } else if (winObj.params.audioResHandle == notify.handle) {
                handlerData.data.type = "audio";
                if (notify.eventName == NPCCEnum.CCObjectNotify.stream_status_notify) {
                  handlerData.data.eventName = NPCCEnum.CCObjectNotify.stream_status_notify;
                  if (notify.errorCode != ErrorCode.NP_E_OK) {
                    handlerData.success = false;
                    handlerData.message = ErrorCode.Error2Desc(notify.errorCode);
                    handlerData.errorCode = notify.errorCode;
                    handlerData.message = ErrorCode.Error2Desc(notify.errorCode);
                    handlerData.data.errorCode = notify.errorCode;
                  }
                }
              } else if (winObj.params.talkbackResHandle == notify.handle) {
                handlerData.data.type = "talkback";
                if (notify.eventName == NPCCEnum.CCObjectNotify.call_stream_status_notify) {
                  handlerData.data.eventName = NPCCEnum.CCObjectNotify.call_stream_status_notify;
                  if (notify.errorCode == ErrorCode.NP_E_OK) {
                    if (notify.keyData.type == 1) {
                      handlerData.data.type = "talkback_say";
                    } else if (notify.keyData.type == 2) {
                      handlerData.data.type = "talkback_talk";
                    }
                  } else {
                    handlerData.success = false;
                    handlerData.message = ErrorCode.Error2Desc(notify.errorCode);
                    handlerData.errorCode = notify.errorCode;
                    handlerData.message = ErrorCode.Error2Desc(notify.errorCode);
                    handlerData.data.errorCode = notify.errorCode;
                    if (notify.keyData.type == 1) {
                      handlerData.data.type = "talkback_say";
                    } else if (notify.keyData.type == 2) {
                      handlerData.data.type = "talkback_talk";
                    }
                  }
                }
              }


            }
          }
        );
      }
    } catch (e) {
      WebClient.Log('ReceiveStreamStatus exception：' + e.message + ', ' + e.name);
      WebClient.SetHandlerDataError(handlerData , null ,e.message + ', ' + e.name);
    }

    WebClient.receiveStreamStatusHandler(handlerData);
  },

  end: true
};