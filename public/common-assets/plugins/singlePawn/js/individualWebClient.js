var IndividualWebClient = {
  runningNormally: false,
  connectId: null,
  resource: new NPCCUtils.Hash(),
  puResList: null,
  rootDomainName: null,
  curVideoDefinition: 100,
  curAudioVolume: 100,
  duringCalling: [],
  duringLocating: {},
  positionChangedEvent: {},
  PtzTureType: {
    PTZ_TURN_UP: 1,
    PTZ_TURN_DOWN: 2,
    PTZ_TURN_LEFT: 3,
    PTZ_TURN_RIGHT: 4,
  },
  registerPosChgEvent: function (puid, p_func) {
    var eventArr = IndividualWebClient.positionChangedEvent[puid] || [];
    if (typeof p_func === 'function' && eventArr.indexOf(p_func) === -1) {
      eventArr.push(p_func)
      IndividualWebClient.positionChangedEvent[puid] = eventArr
      return true
    }
    return false
  },
  removePosChgEvent: function (puid, p_func) {
    var eventArr = IndividualWebClient.positionChangedEvent[puid] || [];
    var funcIndex = eventArr.indexOf(p_func);
    if (funcIndex !== -1) {
      eventArr.splice(funcIndex, 1);
      IndividualWebClient.positionChangedEvent[puid] = eventArr
    }
  },
  clearPosChgEvent: function (puid) {
    IndividualWebClient.positionChangedEvent[puid] = []
    return false
  },
  load: function () {
    // debugger
    if (!(window.ActiveXObject || "ActiveXObject" in window)) {
      console.warn("当前浏览器不支持Active插件，4G单兵功能无法使用。");
      return;
    }
    try {
      // 首先初始化NPCCILY，加载插件
      var operator = NPCCILY.Init(new NPCCStruct.InitParamStruct(false, null,
        null));
      if (operator.errorCode != ErrorCode.NP_E_OK) {
        // 初始化不成功
        showTip("error", "4G单兵插件初始化失败。", '单兵插件初始化失败：'
          + ErrorCode.Error2Desc(operator.errorCode))
        return;
      }
      // 大屏默认登录
      // if (window.location.href.indexOf('bigScreen') != -1) {
      //loginIndividualSys();
      // }
    } catch (e) {
      showTip("error", "4G单兵插件初始化异常。", '单兵插件初始化异常：' + e.name + '::' + e.message);
      return;
    }
  },
  Free: function () {// 释放插件
    NPCCILY.Free();
    IndividualWebClient.duringCalling = [];
  },
  isLogin: function () {
    var connectId = IndividualWebClient.connectId;
    return !!connectId && NPCCILY.serverMap.get(connectId);
  },
  getExtraInfoFromDesc: function (p_desc) {
    if (p_desc) {
      var extra = p_desc.split('_'); // 格式"系统编号_姓名"
      var originSys = extra[0];
      // 如果账号来源不是已有系统列表，后期若有其他系统使用单兵，需修改此处代码
      if ('_01_02_03_'.indexOf('_' + originSys + '_') == -1) {
        originSys = "";
      }
      var userName = "";
      if (extra.length > 1) {
        userName = extra[1];
      }
      // 用户姓名不能太长
      if (userName && userName.length > 100) {
        userName = userName.substr(0, 101);
      }
      return {
        userName: userName,
        originSystem: originSys
      };
    }
    return {
      userName: null,
      originSystem: null
    };
  },
  login: function (p_userName, p_password) {
    // debugger
    if (!(window.ActiveXObject || "ActiveXObject" in window)) { return false; }
    if (!individualPlatformIP || !individualPlatformPort) {
      showTip("error", "4G单兵平台登录失败。", '单兵平台登录失败，平台IP或端口为空。');
      return false;
    }
    var operator = NPCCILY.Login(new NPCCStruct.LoginParamStruct(
      individualPlatformIP, individualPlatformPort, 'root',
      // "70646764313233",
      NPCCUtils.encodeUnicode(NPCCUtils.UnicodetoUTF8(p_userName)),
      p_password, true));
    if (operator.errorCode == ErrorCode.NP_E_OK) {
      IndividualWebClient.connectId = operator.value;
      var connectId = IndividualWebClient.connectId;
      if (!IndividualWebClient.isLogin()) {
        showTip("error", "4G单兵平台登录失败。", '连接信息不存在，获取资源失败');
        return false;
      }
      // 初始化事件监听
      NPCCILY.CCNotifyManager.Add(NPCCEnum.CCObjectNotify.event_notify,
        function (notify) {
          IndividualWebClient.ReceiveEvent(notify);
        });
      NPCCILY.CCNotifyManager.Add(NPCCEnum.CCObjectNotify.stream_status_notify,
        function (notify) {
          IndividualWebClient.ReceiveStreamStatus(notify);
        });
      NPCCILY.CCNotifyManager.Add(
        NPCCEnum.CCObjectNotify.call_stream_status_notify, function (
          notify) {
        IndividualWebClient.ReceiveStreamStatus(notify);
      });
      NPCCILY.CCNotifyManager.Add(NPCCEnum.CCObjectNotify.location_data_notify,
        function (notify) {
          IndividualWebClient.ReceiveLocationData(notify);
        });
      // 获取设备列表，初始化设备状态
      operator = NPCCILY.ForkPUList(connectId);
      if (operator.errorCode == ErrorCode.NP_E_OK) {
        var puResList = operator.value;
        IndividualWebClient.puResList = puResList;
        // 获取设备资源列表
        operator = NPCCILY.ForkResList(connectId);
        if (operator.errorCode == ErrorCode.NP_E_OK) {
          operator = NPCCILY.GetAllResList(connectId, puResList);
          // 将设备状态持久化到数据库
          if (puResList && puResList.length > 0) {
            // var deviceList = [];
            // $.each(puResList, function(i, item) {
            //   var extra = IndividualWebClient.getExtraInfoFromDesc(item.desc);
            //   var camera = IndividualWebClient.findDeviceResource(item.puid, NPCCEnum.ResType.RES_TYPE_CAM)
            //   var name = ''
            //   if (camera && camera.name) {
            //     name = camera.name
            //   }
            //   deviceList.push({
            //     deviceNo: item.puid,
            //     userAccount: item.name,
            //     name: name,
            //     userName: extra.userName || null,
            //     originSystem: extra.originSystem,
            //     loginTime: NPCCUtils
            //             .DateFormat('yyyy-MM-dd HH:mm:ss', new Date()),
            //     status: item.bOnline == "1" ? '01' : '02',
            //     deviceType: '01',
            //   });
            // });

            return puResList;
            // $.ajax(ctx + '/set/individual/saveAll', {
            //   data: {
            //     deviceInfos: JSON.stringify(deviceList)
            //   },
            //   traditional: true,
            //   type: 'POST',
            // });
          }
          // 设备及资源全部加载成功，才能够正常使用
          IndividualWebClient.runningNormally = true;
          return true;
        }
      }
      if (operator.errorCode != ErrorCode.NP_E_OK) {
        showTip('error', '4G单兵平台获取设备信息列表失败。 ', '获取4G单兵平台设备信息列表失败 '
          + ErrorCode.Error2Desc(operator.errorCode));
        IndividualWebClient.Logout();
        return false;
      }
    } else {
      showTip('error', '登录4G单兵平台失败。 ', '登录4G单兵平台失败。 '
        + ErrorCode.Error2Desc(operator.errorCode));
      return false;
    }
    return false;
  },
  getDevListInCalling: function () { // 获取通信中的设备列表
    return IndividualWebClient.duringCalling;
  },
  removeCalling: function (p_puid) { // 异常通信中的设备列表中的指定设备
    var list = IndividualWebClient.duringCalling;
    var index = list.indexOf(p_puid);
    if (index >= 0) {
      list.splice(index, 1);
    }
  },
  createVideoWinWithOptions: function ($container, p_callback, options) {
    var defaultOpts = $.extend({}, {
      playAudio: false,
      playTalk: false,
      playCall: false,
      playLocation: false
    }, options);
    IndividualWebClient.createVideoWin($container, p_callback,
      defaultOpts.playAudio, defaultOpts.playTalk, defaultOpts.playCall,
      defaultOpts.playLocation)
  },
  createVideoWin: function ($container, p_callback, playAudio, playTalk,
    playCall, playLocation) {// 创建视频容器
    if (!(window.ActiveXObject || "ActiveXObject" in window)) { return false; }
    var videoElemId = $container[0].id;
    // 将正在通信中的设备放入缓存
    var puid = videoElemId.split("vIndividual")[1];
    var win_operator = NPCCILY.CreateWindow(IndividualWebClient.connectId,
      $container[0]);
    if (win_operator.errorCode == ErrorCode.NP_E_OK) {
      // 创建成功则将窗口容器对象添加到缓存
      NPCCILY.windowContainers.set(videoElemId,
        new NPCCStruct.WindowContainerStruct($container[0], true,
          win_operator.value, null));
      // 延时2秒后开始播放视频，防止出现视频无法自适应窗口大小的问题
      setTimeout(
        function () {
          var videoPlaySuccess = IndividualWebClient
            .PlayVideo(videoElemId);
          var audioPlaySuccess = false;
          var talkPlaySuccess = false;
          var callPlaySuccess = false;
          var locationPlaySuccess = false;
          // 视频播放失败则无需再请求音频
          if (videoPlaySuccess) {
            IndividualWebClient.duringCalling.push(puid);
            // 优先打开对讲，对讲包含声音和喊话两种
            if (playTalk) {
              talkPlaySuccess = IndividualWebClient
                .PlayOrStopTalk(videoElemId);
            } else if (playAudio) { // 单独打开声音
              audioPlaySuccess = IndividualWebClient
                .PlayOrStopAudio(videoElemId);
            } else if (playCall) { // 单独打开对讲
              callPlaySuccess = IndividualWebClient
                .startOrStopCall(videoElemId);
            }
          }
          // 独立启用定位
          if (playLocation) {
            locationPlaySuccess = IndividualWebClient.playLocation(puid);
          }
          p_callback(videoPlaySuccess, audioPlaySuccess, talkPlaySuccess,
            callPlaySuccess, locationPlaySuccess);
        }, 2000);
    }
  },
  RemoveCCEvent: function () {
    NPCCILY.CCNotifyManager.Remove(NPCCEnum.CCObjectNotify.event_notify);
    NPCCILY.CCNotifyManager
      .Remove(NPCCEnum.CCObjectNotify.stream_status_notify);
    NPCCILY.CCNotifyManager
      .Remove(NPCCEnum.CCObjectNotify.call_stream_status_notify);
    NPCCILY.CCNotifyManager
      .Remove(NPCCEnum.CCObjectNotify.location_data_notify);
  },
  Logout: function () {
    try {
      var containers = NPCCILY.windowContainers;
      var keys = containers.keys();
      // 停止所有播放中的视频
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var winObj = containers.get(key).window;
        if (winObj && winObj.status.playvideoing) {
          IndividualWebClient.StopVideo(key);
        }
      }
      // 清空监听事件
      IndividualWebClient.RemoveCCEvent();
      // 清空窗口容器
      containers.clear();
      // 清空通信缓存
      IndividualWebClient.duringCalling = [];
      // 关闭打开的通话窗口
      var layerInstance = $('.layui-layer.vIndividual-layer');
      $.each(layerInstance, function (i, item) {
        layer.close(item.id.split("layui-layer")[1]);
      });

      var operator = NPCCILY.Logout(IndividualWebClient.connectId);
      if (operator.errorCode == ErrorCode.NP_E_OK) {
        IndividualWebClient.connectId = null;
        IndividualWebClient.runningNormally = false;

        return true;
      } else {
        showTip("error", "4G单兵平台退出登录失败。", "4G单兵退出平台失败： "
          + ErrorCode.Error2Desc(operator.errorCode));
        return false;
      }
    } catch (e) {
      showTip("error", "4G单兵平台退出登录异常。", "退出平台异常: " + e.name + "::" + e.message);
      return false;
    }
  },
  FindPuResByPUID: function (p_puid) { // 根据设备编号获取设备
    var puRes = null;
    if (IndividualWebClient.puResList
      && IndividualWebClient.puResList.length > 0) {
      $.each(IndividualWebClient.puResList, function (puIdx, device) {
        if (device.puid == p_puid) {
          puRes = device;
          return false;
        }
      });
    }
    return puRes;
  },
  FindPuResByName: function (p_name) { // 根据设备名称，即对应系统的用户登录账号，获取设备
    var puRes = null;
    if (IndividualWebClient.puResList
      && IndividualWebClient.puResList.length > 0) {
      $.each(IndividualWebClient.puResList, function (puIdx, device) {
        if (device.name == p_name) {
          puRes = device;
          return false;
        }
      });
    }
    return puRes;
  },
  setDeviceOnlineStatus: function (p_puid, p_status) {
    $.each(IndividualWebClient.puResList, function (puResIdx, puResItem) {
      if (puResItem.puid == p_puid) {
        puResItem.bOnline = p_status;
        $.each(puResItem.resList, function (listResIdx, listResItem) {
          listResItem.bOnline = p_status;
        })
        return false;
      }
    })
  },
  findDeviceResource: function (p_puid, p_resourceType) { // 根据设备编号获取设备资源
    var resource = null;
    $.each(IndividualWebClient.puResList, function (puIdx, device) {
      if (device.puid == p_puid) {
        $.each(device.resList, function (resIdx, res) {
          if (res.resType == p_resourceType) {
            resource = res;
            return false;
          }
        });
        return false;
      }
    });
    return resource;
  },
  PlayVideo: function (p_videoId) {
    if (!(window.ActiveXObject || "ActiveXObject" in window)) { return false; }
    try {
      var puid = p_videoId.split("vIndividual")[1];
      var deviceInfo = IndividualWebClient.FindPuResByPUID(puid);
      if (deviceInfo.bOnline == 0) {
        toastr.error('指定单兵设备不在线，播放视频失败。');
        return false;
      }
      var windowContainerStruct = NPCCILY.windowContainers.get(p_videoId);
      // 获取指定设备摄像头
      var deviceCamera = IndividualWebClient.findDeviceResource(puid,
        NPCCEnum.ResType.RES_TYPE_CAM);
      if (windowContainerStruct && deviceCamera) {
        var winObj = windowContainerStruct.window;
        if (winObj) {
          if (winObj.status.playvideoing) {
            if (winObj.params.puid == deviceCamera.puid
              && winObj.params.resIdx == deviceCamera.resIdx) {
              toastr.warning('指定单兵设备的视频已经在播放中。');
              return false;
            }
            // 正在预览其他视频
            if (!IndividualWebClient.StopVideo(p_videoId)) {
              toastr.error('指定窗口正在播放其他设备视频，且停止该视频失败，无法启动新的视频播放。');
              return false;
            }
          }
          winObj.params.puid = deviceCamera.puid;
          winObj.params.resIdx = deviceCamera.resIdx;
          winObj.params.cameraResHandle = deviceCamera.handle;
          var operator = NPCCILY.StartPreview(winObj,
            NPCCEnum.StopRealtimePreviewType.SREP_VIDEO);
          if (operator.errorCode == ErrorCode.NP_E_OK) {
            NPCCILY.ResizeWindowDimension(winObj, '100%', '100%');
            operator = NPCCILY.CAM_GetDefinition(winObj);
            if (operator.errorCode == ErrorCode.NP_E_OK) {
              IndividualWebClient.curVideoDefinition = operator.value;
            } else {
              console.error('获取视频清晰度失败：'
                + ErrorCode.Error2Desc(operator.errorCode));
              IndividualWebClient.curVideoDefinition = 50;
            }
            return true;
          } else {
            showTip("error", "指定设备的视频播放失败。",
              '4G单兵平台开启视频失败：StartPreview返回异常！窗口ID为' + p_videoId
              + "，错误信息为："
              + ErrorCode.Error2Desc(operator.errorCode));
            return false;
          }
        } else {
          showTip("error", "指定设备的视频播放失败。", '4G单兵平台开启视频失败：未找到对应视频窗口！窗口ID为'
            + p_videoId);
          return false;
        }
      } else {
        showTip("error", "指定设备的视频播放失败。", '4G单兵平台开启视频失败：未找到对应摄像头资源！窗口ID为'
          + p_videoId);
        return false;
      }
    } catch (e) {
      showTip("error", "指定设备的视频播放异常。", '4G单兵平台启动视频异常： ' + e.name + '::'
        + e.message + "，窗口ID为" + p_videoId);
      return false;
    }
  },
  StopVideo: function (p_videoId) {
    if (!(window.ActiveXObject || "ActiveXObject" in window)) { return false; }
    try {
      var windowContainerStruct = NPCCILY.windowContainers.get(p_videoId);
      if (windowContainerStruct) {
        var winObj = windowContainerStruct.window;
        var puid = winObj.params.puid;
        // 逐个将音频、对讲停止
        if (winObj.status.playaudioing) {
          if (!IndividualWebClient.PlayOrStopAudio(p_videoId)) { return false; }
        }
        if (winObj.status.playtalking) {
          if (!IndividualWebClient.PlayOrStopTalk(p_videoId)) { return false; }
        }
        if (winObj.status.playlocation) {
          if (!IndividualWebClient.stopLocation(puid)) { return false; }
        }
        if (winObj.status.playcalling) {
          if (!IndividualWebClient.startOrStopCall(p_videoId)) { return false; }
        }
        if (winObj.status.playvideoing) {
          var operator = NPCCILY.StopPreview(winObj,
            NPCCEnum.StopRealtimePreviewType.SREP_VIDEO);
          if (operator.errorCode == ErrorCode.NP_E_OK) {
            NPCCIF.RefreshImage(NPCCILY.Plug.ccPlugin,
              winObj.params.mediaHandle);
            winObj.params.cameraResHandle = null;
            IndividualWebClient.removeCalling(puid);
            return true;
          }
          showTip("error", "停止视频播放失败。", '4G单兵平台停止视频失败：'
            + ErrorCode.Error2Desc(operator.errorCode) + "，窗口ID为"
            + p_videoId);
          return false;
        } else {
          // toastr.warning("视频已经停止播放。");
          IndividualWebClient.removeCalling(puid);
          return true;
        }
      }
    } catch (e) {
      showTip("error", "停止视频播放出现异常。", '4G单兵平台停止视频异常：' + e.name + '::'
        + e.message + "，窗口ID为" + p_videoId);
      return false;
    }
  },
  SetDefinition: function (p_videoId, p_definition) {
    if (!(window.ActiveXObject || "ActiveXObject" in window)) { return false; }
    try {
      var windowContainerStruct = NPCCILY.windowContainers.get(p_videoId);
      if (windowContainerStruct && windowContainerStruct.window) {
        var winObj = windowContainerStruct.window;
        if (winObj.status.playvideoing) {
          var puid = winObj.params.puid;
          var operator = NPCCILY.CAM_SetDefinition(winObj, p_definition);
          if (operator.errorCode == ErrorCode.NP_E_OK) {
            IndividualWebClient.curVideoDefinition = p_definition;
            return true;
          } else {
            showTip("error", "设备视频清晰度设置失败。", '4G单兵平台设置视频清晰度失败，'
              + ErrorCode.Error2Desc(operator.errorCode) + "，窗口ID为"
              + p_videoId);
            return false;
          }
        } else {
          showTip("error", "当前窗口没有正在播放的视频，无法设置视频清晰度。",
            '4G单兵平台设置视频清晰度失败，指定的窗口没有正在播放的视频' + "，窗口ID为" + p_videoId);
        }
      } else {
        showTip("error", "设备视频清晰度设置失败。", '4G单兵平台设置视频清晰度失败，指定的窗口没有在缓存中找到'
          + "，窗口ID为" + p_videoId);
      }
      return false;
    } catch (e) {
      showTip("error", "设备视频清晰度设置异常。", '4G单兵平台设置视频清晰度失败，' + '设置视频清晰度异常：'
        + e.name + '::' + e.message + "，窗口ID为" + p_videoId);
      return false;
    }
  },
  PlayOrStopAudio: function (p_videoId) {
    if (!(window.ActiveXObject || "ActiveXObject" in window)) { return false; }
    try {
      var windowContainerStruct = NPCCILY.windowContainers.get(p_videoId);
      if (windowContainerStruct && windowContainerStruct.window) {
        var winObj = windowContainerStruct.window;
        if (winObj.status.playvideoing) {
          var puid = winObj.params.puid;
          // 获取指定设备音频
          var deviceAudio = IndividualWebClient.findDeviceResource(puid,
            NPCCEnum.ResType.RES_TYPE_AUD);
          if (!!deviceAudio) {
            winObj.params.puid = deviceAudio.puid;
            winObj.params.resIdx = deviceAudio.resIdx;
            winObj.params.audioResHandle = deviceAudio.handle;

            // 如果正在播放则停止
            if (winObj.status.playaudioing) {
              var operator = NPCCILY.StopPreview(winObj,
                NPCCEnum.StopRealtimePreviewType.SREP_AUDIO);
              if (operator.errorCode == ErrorCode.NP_E_OK) {
                winObj.params.audioResHandle = null;
                IndividualWebClient.curAudioVolume = 0;
                return true;
              }
              showTip("error", "停止音频播放失败。", '4G单兵平台停止音频播放失败，'
                + ErrorCode.Error2Desc(operator.errorCode) + "，窗口ID为"
                + p_videoId);
              return false;
            } else {
              if (winObj.status.playtalking) {
                if (!IndividualWebClient.PlayOrStopTalk(p_videoId)) {
                  winObj.params.audioResHandle = null;
                  IndividualWebClient.curAudioVolume = 0;
                  return false;
                }
              }

              var operator = NPCCILY.StartPreview(winObj,
                NPCCEnum.StopRealtimePreviewType.SREP_AUDIO);
              if (operator.errorCode == ErrorCode.NP_E_OK) {
                // 获取音频已经成功，尝试获取音量，若获取失败则将音量设置为最大
                operator = NPCCILY.AUD_GetVolume(winObj);
                if (operator.errorCode == ErrorCode.NP_E_OK) {
                  IndividualWebClient.curAudioVolume = operator.value;
                } else {
                  showTip("warning", "获取音频音量失败。", '4G单兵平台获取音频音量失败，'
                    + ErrorCode.Error2Desc(operator.errorCode) + "，窗口ID为"
                    + p_videoId);
                  IndividualWebClient.curAudioVolume = 100;
                }
                return true;
              } else {
                winObj.params.audioResHandle = null;
                showTip("error", "开启音频播放失败。", '4G单兵平台请求音频失败，'
                  + ErrorCode.Error2Desc(operator.errorCode) + "，窗口ID为"
                  + p_videoId);
              }
            }
          } else {
            IndividualWebClient.curAudioVolume = 0;
            showTip("error", "开启音频播放失败。", '4G单兵平台请求音频失败，当前设备无音频资源' + "，窗口ID为"
              + p_videoId);
          }
        } else {
          showTip("error", "当前窗口没有正在播放的视频，无法请求音频。", '4G单兵平台请求音频失败，窗口没有正在播放的视频'
            + "，窗口ID为" + p_videoId);
        }
      } else {
        showTip("error", "未找到对应窗口，无法请求音频。", '4G单兵平台请求音频失败，指定的窗口没有在缓存中找到'
          + "，窗口ID为" + p_videoId);
      }
      return false;
    } catch (e) {
      showTip("error", "切换音频播放出现异常。", '4G单兵平台切换设备音频异常，' + e.name + '::'
        + e.message + "，窗口ID为" + p_videoId);
      return false;
    }
  },
  SetAudVolume: function (p_videoId, p_volume) {
    if (!(window.ActiveXObject || "ActiveXObject" in window)) { return false; }
    try {
      var windowContainerStruct = NPCCILY.windowContainers.get(p_videoId);
      if (windowContainerStruct && windowContainerStruct.window) {
        var winObj = windowContainerStruct.window;
        if (winObj.status.playvideoing) {
          if (winObj.params.audioResHandle == null) {
            var puid = p_videoId.split("vIndividual")[1];
            // 获取指定设备音频
            var deviceAudio = IndividualWebClient.findDeviceResource(puid,
              NPCCEnum.ResType.RES_TYPE_AUD);
            if (!deviceAudio) {
              showTip("error", "设置音频音量失败。", '4G单兵平台设置音频音量失败，指定设备不存在或无音频资源'
                + "，窗口ID为" + p_videoId);
            }
            winObj.params.audioResHandle = deviceAudio.handle;
          }

          // 如果没有在播放音频，打开音频
          if (!winObj.status.playaudioing && !winObj.status.playtalking) {
            if (!IndividualWebClient.PlayOrStopAudio(p_videoId)) { return false; }
          }

          var operator = NPCCILY.AUD_SetVolume(winObj, p_volume);
          if (operator.errorCode == ErrorCode.NP_E_OK) {
            IndividualWebClient.curAudioVolume = p_volume;
            return true;
          } else {
            showTip("error", "设置音频音量失败。", '4G单兵平台设置音频音量失败，'
              + ErrorCode.Error2Desc(operator.errorCode) + "，窗口ID为"
              + p_videoId);
          }
        } else {
          showTip("error", "当前窗口没有正在播放的视频，无法设置音频音量。",
            '4G单兵平台设置音频音量失败，窗口没有正在播放的视频' + "，窗口ID为" + p_videoId);
        }
      } else {
        showTip("error", "设置音频音量失败。", '4G单兵平台设置音频音量失败，获取窗口对象失败' + "，窗口ID为"
          + p_videoId);
      }
      return false;
    } catch (e) {
      showTip("error", "设置音频音量异常。", '4G单兵平台设置音频音量异常，获取窗口对象失败' + e.name + '::'
        + e.message + "，窗口ID为" + p_videoId);
      return false;
    }
  },
  PlayOrStopTalk: function (p_videoId) {
    if (!(window.ActiveXObject || "ActiveXObject" in window)) { return false; }
    try {
      var windowContainerStruct = NPCCILY.windowContainers.get(p_videoId);
      if (windowContainerStruct && windowContainerStruct.window) {
        var winObj = windowContainerStruct.window;
        if (winObj.status.playvideoing) {
          var puid = winObj.params.puid;
          var deviceTalk = IndividualWebClient.findDeviceResource(puid,
            NPCCEnum.ResType.RES_TYPE_TBK);
          if (deviceTalk) {
            winObj.params.talkbackResHandle = deviceTalk.handle;
            winStatus = winObj.status;
            if (winStatus.playtalking) {
              var operator = NPCCILY.StopTalk(winObj);
              if (operator.errorCode == ErrorCode.NP_E_OK) {
                winObj.params.talkbackResHandle = null;
                winObj.status.playaudioing = false;
                return true;
              } else {
                showTip("error", "停止对讲失败。", '4G单兵平台停止对讲失败，'
                  + ErrorCode.Error2Desc(operator.errorCode) + "，窗口ID为"
                  + p_videoId);
                return false;
              }
            } else {
              if (winStatus.playaudioing) {
                if (!IndividualWebClient.PlayOrStopAudio(p_videoId)) { return false; }
              }
              if (winStatus.playcalling) {
                if (!IndividualWebClient.startOrStopCall(p_videoId)) { return false; }
              }

              var operator = NPCCILY.StartTalk(windowContainerStruct.window);
              if (operator.errorCode != ErrorCode.NP_E_OK) {
                showTip("error", "开启对讲失败。", '4G单兵平台开启对讲失败，'
                  + ErrorCode.Error2Desc(operator.errorCode) + "，窗口ID为"
                  + p_videoId);
                return false;
              }
              winObj.status.playaudioing = true;
              // 获取音频已经成功，尝试获取音量，若获取失败则将音量设置为最大
              var deviceAudio = IndividualWebClient.findDeviceResource(puid,
                NPCCEnum.ResType.RES_TYPE_AUD);
              winObj.params.audioResHandle = deviceAudio.handle;
              operator = NPCCILY.AUD_GetVolume(winObj);
              if (operator.errorCode == ErrorCode.NP_E_OK) {
                IndividualWebClient.curAudioVolume = operator.value;
              } else {
                showTip("warning", "获取音频音量失败。", '4G单兵平台开启对讲后获取音频音量失败，'
                  + ErrorCode.Error2Desc(operator.errorCode) + "，窗口ID为"
                  + p_videoId);
                IndividualWebClient.curAudioVolume = 100;
              }
              return true;
            }
          } else {
            showTip("error", "开启对讲失败。", '4G单兵平台开启对讲失败，指定设备没有对讲资源' + "，窗口ID为"
              + p_videoId);
          }
        } else {
          showTip("error", "切换对讲状态失败。", '4G单兵平台切换对讲状态失败，当前窗口没有正在播放的视频'
            + "，窗口ID为" + p_videoId);
        }
      } else {
        showTip("error", "切换对讲状态失败。", '4G单兵平台切换对讲状态失败，获取窗口对象失败' + "，窗口ID为"
          + p_videoId);
      }
      return false;
    } catch (e) {
      showTip("error", "切换对讲状态异常。", '4G单兵平台切换对讲状态异常，' + e.name + "::"
        + e.message + "，窗口ID为" + p_videoId);
      return false;
    }
  },
  stopTalk: function (puid) {
    if (!(window.ActiveXObject || "ActiveXObject" in window)) { return false; }
    try {
      var p_videoId = 'vIndividual' + puid;
      var windowContainerStruct = NPCCILY.windowContainers.get(p_videoId);
      if (windowContainerStruct && windowContainerStruct.window) {
        var winObj = windowContainerStruct.window;
        if (winObj.status.playvideoing) {
          var deviceTalk = IndividualWebClient.findDeviceResource(puid,
            NPCCEnum.ResType.RES_TYPE_TBK);
          if (deviceTalk) {
            winObj.params.talkbackResHandle = deviceTalk.handle;
            winStatus = winObj.status;
            if (winStatus.playtalking) {
              var operator = NPCCILY.StopTalk(winObj);
              if (operator.errorCode == ErrorCode.NP_E_OK) {
                winObj.params.talkbackResHandle = null;
                winObj.status.playaudioing = false;
                return true;
              } else {
                showTip("error", "停止对讲失败。", '4G单兵平台停止对讲失败，'
                  + ErrorCode.Error2Desc(operator.errorCode) + "，窗口ID为"
                  + p_videoId);
                return false;
              }
            }
          } else {
            showTip("error", "停止对讲失败。", '4G单兵平台停止对讲失败，指定设备没有对讲资源' + "，窗口ID为"
              + p_videoId);
          }
        }
      }
      return false;
    } catch (e) {
      showTip("error", "停止对讲失败。", '4G单兵平台停止对讲异常，' + e.name + "::" + e.message
        + "，窗口ID为" + p_videoId);
      return false;
    }
  },
  StartTurePtz: function (p_videoId, ptzTureType) {
    if (!(window.ActiveXObject || "ActiveXObject" in window)) { return false; }
    try {
      var windowContainerStruct = NPCCILY.windowContainers.get(p_videoId);
      if (windowContainerStruct && windowContainerStruct.window) {
        var winObj = windowContainerStruct.window;
        if (winObj.status.playvideoing) {
          var puid = winObj.params.puid;
          var deviceTalk = IndividualWebClient.findDeviceResource(puid,
            NPCCEnum.ResType.RES_TYPE_PTZ);
          if (deviceTalk) {
            switch (ptzTureType) {
              case IndividualWebClient.PtzTureType.PTZ_TURN_UP:
                var operator = NPCCILY
                  .PTZ_StartTurnUp(windowContainerStruct.window);
                if (operator.errorCode == ErrorCode.NP_E_OK) {
                  console.log("设备云台正在向上移动" + new Date());
                } else {
                  showTip("error", "云台向上移动失败。", '4G单兵平台开启云台向上移动失败：'
                    + ErrorCode.Error2Desc(operator.errorCode) + "，窗口ID为"
                    + p_videoId);
                }
                break;
              case IndividualWebClient.PtzTureType.PTZ_TURN_DOWN:
                var operator = NPCCILY
                  .PTZ_StartTurnDown(windowContainerStruct.window);
                if (operator.errorCode == ErrorCode.NP_E_OK) {
                  console.log("设备云台正在向下移动" + new Date());
                } else {
                  showTip("error", "云台向下移动失败。", '4G单兵平台开启云台向下移动失败：'
                    + ErrorCode.Error2Desc(operator.errorCode) + "，窗口ID为"
                    + p_videoId);
                }
                break;
              case IndividualWebClient.PtzTureType.PTZ_TURN_LEFT:
                var operator = NPCCILY
                  .PTZ_StartTurnLeft(windowContainerStruct.window);
                if (operator.errorCode == ErrorCode.NP_E_OK) {
                  console.log("设备云台正在向左移动" + new Date());
                } else {
                  showTip("error", "云台向左移动失败。", '4G单兵平台开启云台向左移动失败：'
                    + ErrorCode.Error2Desc(operator.errorCode) + "，窗口ID为"
                    + p_videoId);
                  return false;
                }
                break;
              case IndividualWebClient.PtzTureType.PTZ_TURN_RIGHT:
                var operator = NPCCILY
                  .PTZ_StartTurnRight(windowContainerStruct.window);
                if (operator.errorCode == ErrorCode.NP_E_OK) {
                  console.log("设备云台正在向右移动" + new Date());
                } else {
                  showTip("error", "云台向右移动失败。", '4G单兵平台开启云台向右移动失败：'
                    + ErrorCode.Error2Desc(operator.errorCode) + "，窗口ID为"
                    + p_videoId);
                  return false;
                }
                break;
              default:
                toastr.warning('指定的云台移动方向错误。');
                break;
            }
            return true;
          }
          toastr.warning('当前设备无云台资源。');
          return false;
        }
        toastr.error('当前窗口没有正在播放的视频，无法请求云台操作。');
        return false;
      }
      toastr.error('启动云台移动失败，窗口对象不存在。');
      return false;
    } catch (e) {
      showTip("error", "启动云台移动异常。", '4G单兵平台启动云台移动异常：' + e.name + '::'
        + e.message + "，窗口ID为" + p_videoId);
      return false;
    }
  },
  StopTurePtz: function (p_videoId) {
    if (!(window.ActiveXObject || "ActiveXObject" in window)) { return false; }
    try {
      var windowContainerStruct = NPCCILY.windowContainers.get(p_videoId);
      if (windowContainerStruct && windowContainerStruct.window) {
        if (windowContainerStruct.window.params.ptzResHandle) {
          var operator = NPCCILY.PTZ_StopTurn(windowContainerStruct.window);
          if (operator.errorCode == ErrorCode.NP_E_OK) {
            console.log("设备云台停止移动" + new Date());
          } else {
            showTip("error", "停止云台移动失败。", '4G单兵平台停止云台移动失败：'
              + ErrorCode.Error2Desc(operator.errorCode) + "，窗口ID为"
              + p_videoId);
          }
        }
      }
    } catch (e) {
      showTip("error", "停止云台移动异常。", '4G单兵平台停止云台移动异常常：' + e.name + '::'
        + e.message + "，窗口ID为" + p_videoId);
    }
  },
  playLocation: function (puid) {
    var deviceIndex = Object.keys(IndividualWebClient.duringLocating).indexOf(
      puid);
    if (deviceIndex === -1) {
      var deviceLocate = IndividualWebClient.findDeviceResource(puid,
        NPCCEnum.ResType.RES_TYPE_LOC);
      if (deviceLocate) {
        var winObj = {
          connectId: IndividualWebClient.connectId,
          status: {
            playlocation: false
          },
          params: {
            locationResHandle: deviceLocate.handle
          }
        };
        var operator = NPCCILY.StartLocation(winObj);
        if (operator.errorCode != ErrorCode.NP_E_OK) {
          showTip("error", "开启定位失败。", '4G单兵平台开启定位失败，'
            + ErrorCode.Error2Desc(operator.errorCode) + "，设备ID为" + puid);
          return false;
        }
        IndividualWebClient.duringLocating[puid] = deviceLocate.handle;
        var windowContainerStruct = NPCCILY.windowContainers.get('vIndividual'
          + puid);
        if (windowContainerStruct && windowContainerStruct.window) {
          windowContainerStruct.window.status.playlocation = true;
        }
        return true;
      }
      showTip("error", "开启定位失败。", '4G单兵平台开启定位失败，指定设备没有定位资源' + "，设备ID为" + puid);
      return false;
    }
    return true;
  },
  stopLocation: function (puid) {
    var deviceIndex = Object.keys(IndividualWebClient.duringLocating).indexOf(
      puid);
    if (deviceIndex !== -1) {
      var deviceLocate = IndividualWebClient.findDeviceResource(puid,
        NPCCEnum.ResType.RES_TYPE_LOC);
      if (deviceLocate) {
        var winObj = {
          connectId: IndividualWebClient.connectId,
          status: {
            playlocation: true
          },
          params: {
            locationResHandle: deviceLocate.handle
          }
        };
        var operator = NPCCILY.StopLocation(winObj);
        if (operator.errorCode == ErrorCode.NP_E_OK) {
          delete IndividualWebClient.duringLocating[puid];
          var windowContainerStruct = NPCCILY.windowContainers
            .get('vIndividual' + puid);
          if (windowContainerStruct && windowContainerStruct.window) {
            windowContainerStruct.window.status.playlocation = false;
          }
        } else {
          showTip("error", "停止定位失败。", '4G单兵平台停止定位失败，'
            + ErrorCode.Error2Desc(operator.errorCode) + "，窗口ID为"
            + p_videoId);
          return false;
        }
      }
      delete IndividualWebClient.duringLocating[puid];
    }
    return true;
  },
  startOrStopCall: function (p_videoId) {
    if (!(window.ActiveXObject || "ActiveXObject" in window)) { return false; }
    try {
      var windowContainerStruct = NPCCILY.windowContainers.get(p_videoId);
      if (windowContainerStruct && windowContainerStruct.window) {
        var winObj = windowContainerStruct.window;
        if (winObj.status.playvideoing) {
          var puid = winObj.params.puid;
          var deviceTalk = IndividualWebClient.findDeviceResource(puid,
            NPCCEnum.ResType.RES_TYPE_TBK);
          if (deviceTalk) {
            winObj.params.talkbackResHandle = deviceTalk.handle;
            winStatus = winObj.status;
            if (winStatus.playcalling) {
              var operator = NPCCILY.StopCall(winObj);
              if (operator.errorCode == ErrorCode.NP_E_OK) {
                winObj.params.talkbackResHandle = null;
                return true;
              } else {
                showTip("error", "停止喊话失败。", '4G单兵平台停止喊话失败，'
                  + ErrorCode.Error2Desc(operator.errorCode) + "，窗口ID为"
                  + p_videoId);
                return false;
              }
            } else {
              if (winStatus.playtalking) {
                if (!IndividualWebClient.PlayOrStopTalk(p_videoId)) { return false; }
              }

              var operator = NPCCILY.StartCall(windowContainerStruct.window);
              if (operator.errorCode != ErrorCode.NP_E_OK) {
                showTip("error", "开启喊话失败。", '4G单兵平台开启喊话失败，'
                  + ErrorCode.Error2Desc(operator.errorCode) + "，窗口ID为"
                  + p_videoId);
                return false;
              }
              return true;
            }
          } else {
            showTip("error", "开启喊话失败。", '4G单兵平台开启喊话失败，指定设备没有对讲资源' + "，窗口ID为"
              + p_videoId);
          }
        } else {
          showTip("error", "切换喊话状态失败。", '4G单兵平台切换喊话状态失败，当前窗口没有正在播放的视频'
            + "，窗口ID为" + p_videoId);
        }
      } else {
        showTip("error", "切换喊话状态失败。", '4G单兵平台切换喊话状态失败，获取窗口对象失败' + "，窗口ID为"
          + p_videoId);
      }
      return false;
    } catch (e) {
      showTip("error", "切换喊话状态异常。", '4G单兵平台切换喊话状态异常，' + e.name + "::"
        + e.message + "，窗口ID为" + p_videoId);
      return false;
    }
  },
  stopCall: function (puid) {
    if (!(window.ActiveXObject || "ActiveXObject" in window)) { return false; }
    try {
      var p_videoId = 'vIndividual' + puid;
      var windowContainerStruct = NPCCILY.windowContainers.get(p_videoId);
      if (windowContainerStruct && windowContainerStruct.window) {
        var winObj = windowContainerStruct.window;
        if (winObj.status.playvideoing) {
          var deviceTalk = IndividualWebClient.findDeviceResource(puid,
            NPCCEnum.ResType.RES_TYPE_TBK);
          if (deviceTalk) {
            winObj.params.talkbackResHandle = deviceTalk.handle;
            winStatus = winObj.status;
            if (winStatus.playcalling) {
              var operator = NPCCILY.StopCall(winObj);
              if (operator.errorCode == ErrorCode.NP_E_OK) {
                winObj.params.talkbackResHandle = null;
                return true;
              } else {
                showTip("error", "停止喊话失败。", '4G单兵平台停止喊话失败，'
                  + ErrorCode.Error2Desc(operator.errorCode) + "，窗口ID为"
                  + p_videoId);
                return false;
              }
            }
          } else {
            showTip("error", "关闭喊话失败。", '4G单兵平台关闭喊话失败，指定设备没有对讲资源' + "，窗口ID为"
              + p_videoId);
          }
        }
      }
      return false;
    } catch (e) {
      showTip("error", "关闭喊话状态异常。", '4G单兵平台关闭喊话状态异常，' + e.name + "::"
        + e.message + "，窗口ID为" + p_videoId);
      return false;
    }
  },
  startCall: function (puid) {
    if (!(window.ActiveXObject || "ActiveXObject" in window)) { return false; }
    try {
      var p_videoId = 'vIndividual' + puid;
      var windowContainerStruct = NPCCILY.windowContainers.get(p_videoId);
      if (windowContainerStruct && windowContainerStruct.window) {
        var winObj = windowContainerStruct.window;
        if (winObj.status.playvideoing) {
          var deviceTalk = IndividualWebClient.findDeviceResource(puid,
            NPCCEnum.ResType.RES_TYPE_TBK);
          if (deviceTalk) {
            winObj.params.talkbackResHandle = deviceTalk.handle;
            winStatus = winObj.status;
            if (!winStatus.playcalling) {
              if (winStatus.playtalking) {
                if (!IndividualWebClient.PlayOrStopTalk(p_videoId)) { return false; }
              }

              var operator = NPCCILY.StartCall(windowContainerStruct.window);
              if (operator.errorCode != ErrorCode.NP_E_OK) {
                showTip("error", "开启喊话失败。", '4G单兵平台开启喊话失败，'
                  + ErrorCode.Error2Desc(operator.errorCode) + "，窗口ID为"
                  + p_videoId);
                return false;
              }
              return true
            }
          } else {
            showTip("error", "开启喊话失败。", '4G单兵平台开启喊话失败，指定设备没有对讲资源' + "，窗口ID为"
              + p_videoId);
          }
        }
      }
      return false;
    } catch (e) {
      showTip("error", "开启喊话状态异常。", '4G单兵平台开启换喊话状态异常，' + e.name + "::"
        + e.message + "，窗口ID为" + p_videoId);
      return false;
    }
  },
  closeAllScreenCall: function () {
    var $iframes = $("#individualScreen .splitScreen iframe");
    $.each($iframes, function (index, iframe) {
      var puid = iframe.id.split('iframe')[1]
      var winObj = NPCCILY.windowContainers.get('vIndividual' + puid).window
      if (winObj.status.playvideoing) {
        IndividualWebClient.stopCall(puid)
        iframe.contentWindow.turnButtonOff('call', '打开喊话');
      }
    })
  },
  openAllScreenCall: function () {
    var $iframes = $("#individualScreen .splitScreen iframe");
    var canOpenCall = true;
    $.each($iframes, function (index, iframe) {
      var puid = iframe.id.split('iframe')[1]
      var winObj = NPCCILY.windowContainers.get('vIndividual' + puid).window
      if (winObj.status.playtalking || winObj.status.playaudioing) {
        canOpenCall = false;
        var tipMsg = '有窗口正在对讲或者播放声音，请关闭后再开启喊话!';
        showTip("error", tipMsg, tipMsg + '设备ID为：' + puid);
        return false;
      }
    });
    if (canOpenCall) {
      $.each($iframes, function (index, iframe) {
        var puid = iframe.id.split('iframe')[1]
        var winObj = NPCCILY.windowContainers.get('vIndividual' + puid).window
        if (winObj.status.playvideoing) {
          IndividualWebClient.startCall(puid)
          iframe.contentWindow.turnButtonOn('call', '关闭喊话');
        }
      })
    }
  },
  closeAllScreenTalk: function () {
    var $iframes = $("#individualScreen .splitScreen iframe");
    $.each($iframes, function (index, iframe) {
      var puid = iframe.id.split('iframe')[1]
      IndividualWebClient.stopTalk(puid)
      iframe.contentWindow.turnButtonOff('talk', '打开对讲');
      iframe.contentWindow.setIndividualAudioClose();
    })
  },
  // 接收事件
  ReceiveEvent: function (notify) {
    var globalData = NPCCILY.serverMap.get(IndividualWebClient.connectId);
    if (globalData instanceof NPCCStruct.InitGlobalDataStruct) {
      var hServer = globalData.hServer;
      if (hServer == notify.handle) {
        if (notify.errorCode == ErrorCode.NP_E_OK) {
          var eventID = notify.keyData.ID; // 事件ID
          switch (Number(eventID)) {
            case NPCCEnum.Notification.RST_EVT_SERVER_ConnectionBreak: {
              // 与平台连接断开，需要主动断开与平台之间的连接
              toastr.warning('与4G单兵平台的连接已断开，请刷新页面重连。');
              IndividualWebClient.Logout();
              break;
            }
            case NPCCEnum.Notification.RST_EVT_PU_Online:
            // 设备上线
            case NPCCEnum.Notification.RST_EVT_PU_Offline:
              // 设备下线
              {
                var utcTime = notify.keyData.T; // 事件时间
                var eventTime = NPCCUtils.DateFormat('yyyy-MM-dd HH:mm:ss',
                  new Date(parseInt(utcTime) * 1000));

                var dID = notify.keyData.DID; // 域的DID
                var puid = notify.keyData.SID; // 设备的PUID
                var resType = notify.keyData.RT; // 设备类型
                var resIdx = notify.keyData.RC; // 设备索引
                var puRes = IndividualWebClient.FindPuResByPUID(puid);
                if (Number(eventID) == NPCCEnum.Notification.RST_EVT_PU_Online) {
                  if (puRes == null) {
                    // 设备首次登录 更新列表
                    var operator = NPCCILY.ForkOnePU(IndividualWebClient.connectId,
                      dID, puid);
                    if (operator.errorCode == ErrorCode.NP_E_OK) {
                      puRes = operator.value;
                      IndividualWebClient.puResList = IndividualWebClient.puResList
                        .concat(puRes);
                    } else {
                      console.log('获取新设备信息失败: %s', ErrorCode
                        .Error2Desc(operator.errorCode));
                    }
                  } else {
                    // 更新设备状态
                    IndividualWebClient.setDeviceOnlineStatus(puid, "1");
                  }
                  // 将设备持久化到数据库
                  var extra = IndividualWebClient.getExtraInfoFromDesc(puRes.desc);
                  var camera = IndividualWebClient.findDeviceResource(item.puid, NPCCEnum.ResType.RES_TYPE_CAM)
                  var name = ''
                  if (camera && camera.name) {
                    name = camera.name
                  }
                  $.ajax(ctx + '/set/individual/save', {
                    data: {
                      deviceNo: puid,
                      userAccount: puRes.name,
                      name: name,
                      userName: extra.userName,
                      originSystem: extra.originSystem,
                      loginTime: eventTime,
                      status: '01',
                      deviceType: '01',
                    },
                    type: 'POST',
                  });

                  console.info(puRes.desc + '于' + eventTime + '在单兵设备平台上线');
                } else {
                  $.ajax(ctx + '/set/individual/save', {
                    data: {
                      deviceNo: puid,
                      userAccount: puRes.name,
                      status: '02',
                      deviceType: '01',
                    },
                    type: 'POST',
                  });
                  var videoElemId = "vIndividual" + puid;
                  if (IndividualWebClient.duringCalling.indexOf(puid) !== -1) {
                    // 停止视频播放
                    IndividualWebClient.StopVideo(videoElemId);
                    // 移除窗口容器
                    //                NPCCILY.windowContainers.remove(videoElemId);
                    // 关闭打开的通话窗口
                    var layerInstance = $('.layui-layer.vIndividual-layer.'
                      + videoElemId);
                    if (layerInstance && layerInstance.length > 0) {
                      layer.close(layerInstance[0].id.split("layui-layer")[1]);
                    }
                    // 当前设备是否在视频墙打开
                    var $iframes = $("#individualScreen .splitScreen #iframe"
                      + puid);
                    if ($iframes.length > 0) {
                      // 还原所有按钮
                      var iframeWin = $iframes[0].contentWindow;
                      iframeWin.setIndividualAudioClose();
                      iframeWin.turnButtonOff('video', '打开视频');
                      iframeWin.turnButtonOff('talk', '打开对讲');
                      iframeWin.turnButtonOff('call', '打开喊话');
                    }
                  }
                  // 更新设备状态
                  IndividualWebClient.setDeviceOnlineStatus(puid, "0");
                  console.info(puRes.desc + '于' + eventTime + '从单兵设备平台下线');
                }
                break;
              }
          }
        }
      }
    }
  },
  // 接收流状态的通知
  ReceiveStreamStatus: function (notify) {
    try {
      if (notify && notify.handle) {
        NPCCILY.windowContainers
          .each(function (item) {
            var windowContainerStruct = item.value;
            var winObj = windowContainerStruct.window;
            if (winObj && winObj.status.playvideoing) {
              // 根据句柄匹配
              if (winObj.params.cameraResHandle == notify.handle) {
                if (notify.eventName == NPCCEnum.CCObjectNotify.stream_status_notify) {
                  if (notify.errorCode == ErrorCode.NP_E_OK) {
                    if (typeof notify.statusDesc != 'undefined'
                      && notify.statusDesc != '') {
                      // alert('视频播放状态:' + notify.statusDesc);
                    }
                  } else {
                    showTip("error", "视频播放错误。", '4G单兵平台视频播放错误：'
                      + ErrorCode.Error2Desc(notify.errorCode));
                  }
                }
              } else if (winObj.params.audioResHandle == notify.handle) {
                if (notify.eventName == NPCCEnum.CCObjectNotify.stream_status_notify) {
                  if (notify.errorCode == ErrorCode.NP_E_OK) {
                    if (typeof notify.statusDesc != 'undefined'
                      && notify.statusDesc != '') {
                      // alert('音频播放状态:' + notify.statusDesc);
                    }
                  } else {
                    showTip("error", "视频播放错误。", '4G单兵平台视频播放错误：'
                      + ErrorCode.Error2Desc(notify.errorCode));
                  }
                }
              } else if (winObj.params.talkbackResHandle == notify.handle) {
                if (notify.eventName == NPCCEnum.CCObjectNotify.call_stream_status_notify) {
                  if (notify.errorCode == ErrorCode.NP_E_OK) {
                    if (notify.keyData.type == 1) {
                      // alert('喊话成功');
                    } else if (notify.keyData.type == 2) {
                      // alert('对讲成功');
                    }
                  } else {
                    if (notify.keyData.type == 1) {
                      // alert('喊话错误:'
                      // + ErrorCode.Error2Desc(notify.errorCode));
                    } else if (notify.keyData.type == 2) {
                      // alert('对讲错误:'
                      // + ErrorCode.Error2Desc(notify.errorCode));
                    }
                  }
                }
              }
            }
          });
      }
    } catch (e) {
      showTip("error", "更新视频流状态失败。", '更新视频流状态失败，请参考：' + e.message + '::'
        + e.name);
    }
  },
  ReceiveLocationData: function (notify) {
    try {
      if (notify && notify.handle) {
        Object
          .keys(IndividualWebClient.duringLocating)
          .forEach(
            function (key) {
              if (IndividualWebClient.duringLocating[key] === notify.handle) {
                var puid = key;
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
                    var locationTime = NPCCUtils.DateFormat(
                      'yyyy-MM-dd HH:mm:ss', new Date(
                        parseInt(UTCTime) * 1000));
                    var eventArr = IndividualWebClient.positionChangedEvent[puid]
                      || [];
                    eventArr.forEach(function (event) {
                      if (typeof event === "function") {
                        event({
                          puid: puid,
                          locationStatus: locationStatus,
                          latitude: Latitude,
                          longitude: Longitude,
                          bearing: Bearing,
                          speed: Speed,
                          altitude: Altitude,
                          locationTime: locationTime
                        });
                      }
                    });
                    break;
                  default:
                    break;
                }
              }
            })
      }
    } catch (e) {
      showTip("error", "获取设备位置信息失败。", '获取设备位置信息失败，请参考：' + e.message + '::'
        + e.name);
    }
  }
};

/**
 * 大屏使用默认账户自动登录到单兵系统
 *
 * @returns
 */
function loginIndividualSys() {
  var result = $.parseJSON($.ajax({
    url: ctx + '/bigScreen/getCryptosInfos',
    type: 'POST',
    async: false,
  }).responseText);
  if (!!result && result.type == '0') {
    // 加密密码
    var aes = new AesUtil();
    var formfillkey = result.data.formfillkey;
    var key = result.data.key;
    var iv = result.data.iv;
    var plainKey = aes.aesDecrypt(key, formfillkey, formfillkey);
    var plainIv = aes.aesDecrypt(iv, formfillkey, formfillkey);
    return IndividualWebClient.login(devicePlatformUser, aes.aesDecrypt(
      devicePlatformPWD, plainKey, plainIv));
  } else {
    showTip("error", '单兵设备平台登录失败!', "4G单兵平台登录失败，获取账号加密信息失败。");
    return false;
  }
}

/**
 * 展示提示信息，并在指定日志信息时，打印在控制台中
 *
 * @param p_type
 *          toastr消息类型
 * @param p_msg
 *          消息内容
 * @param p_logMsg
 *          日志信息
 */
function showTip(p_type, p_msg, p_logMsg) {
  //toastr[p_type](p_msg);
  if (p_logMsg) {
    console.log(p_logMsg);
  }
}