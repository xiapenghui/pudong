/** 单兵通信方法实现 */
$(function() {
  // 获得顶层通信实例
  var clientCopy = top.IndividualWebClient; // 客户端
  var winContainers = top.NPCCILY.windowContainers // 窗口缓存列表
  // 单兵定位数据，通过事件获取
  var locationData = [];
  // 当前页面对象
  var windowObj = null;
  // 演练点信息
  var exercise = top.bigScreenApp.$store.state.exerciseStore.activeExercise;
  var currentLocation = {};
  exercise.locations.forEach(function(location, index) {
    if (deviceNo === location.device.deviceNo) {
      currentLocation = location
    }
  });
  $('.video-title').text(currentLocation.name || '工作人员');

  /** *****************定位接收********************** */
  // 注册定位接收事件
  clientCopy.registerPosChgEvent(deviceNo, recieveDeviceLocation)

  /**
   * 定位接收方法
   * 
   * @param location
   *          单兵客户端返回定位数据
   */
  function recieveDeviceLocation(location) {
    locationData = [location.longitude, location.latitude]
  }

  /**
   * 获取更新的定位数据
   */
  function getDeviceLocation() {
    return locationData;
  }
  /** *****************定位接收********************** */

  /** *****************页面关闭，清除通信内容********************** */
  $(window).unload(function() {
    clearIndividual();
  });
  if (window.attachEvent) {
    window.attachEvent('onbeforeunload', function() {
      clearIndividual();
    });
  } else {
    window.addEventListener('beforeunload', function() {
      clearIndividual();
    }, false);
  }

  /**
   * 清除单兵通信
   */
  function clearIndividual() {
    clientCopy.StopVideo(videoElemId); // 停止视频
    winContainers.remove(videoElemId); // 清空窗口缓存
    clientCopy.removePosChgEvent(deviceNo, recieveDeviceLocation); // 移除定位接收事件
  }
  /** *****************页面关闭，清除通信内容********************** */

  // 创建视频，默认打开定位
  var $windowContainer = $('#' + videoElemId);
  clientCopy.createVideoWinWithOptions($windowContainer, videoCallback, {
    playLocation: true
  });

  /**
   * 通信连接成功回调
   * 
   * @param p_videoPlaySuccess
   *          视频播放成功
   * @param p_audioPlaySuccess
   *          音频播放成功
   * @param p_talkPlaySuccess
   *          对讲播放成功
   * @param p_callPlaySuccess
   *          喊话播放成功
   * @param p_locationPlaySuccess
   *          开启定位成功
   */
  function videoCallback(p_videoPlaySuccess, p_audioPlaySuccess,
          p_talkPlaySuccess, p_callPlaySuccess, p_locationPlaySuccess) {
    windowObj = winContainers.get(videoElemId).window;
    if (p_videoPlaySuccess) { // 视频连接成功，处理页面内容
      turnButtonOn('video', '关闭视频');
      // 清晰度按钮暂时没有展示
      var btn = $('.video-drop button');
      if (clientCopy.curVideoDefinition >= 50) {
        btn.text('超清');
      } else if (clientCopy.curVideoDefinition >= 20) {
        btn.text('高清');
      } else {
        btn.text('普通');
      }

      // 设置对讲状态
      if (p_talkPlaySuccess) {
        turnButtonOn('talk', '关闭对讲');
        // 设置音量
        setIndividualAudioOpen(clientCopy.curAudioVolume);
      } else if (p_audioPlaySuccess) { // 对讲未开启，判断声音是否开启
        setIndividualAudioOpen(clientCopy.curAudioVolume);
      } else if (p_callPlaySuccess) {
        // 设置喊话状态
        turnButtonOn('call', '关闭喊话');
        // 喊话状态下音量不打开
        setIndividualAudioClose();
      }
    }
  }

  // 添加按钮响应事件
  $('.audio-icon').click(function(event) {
    var $btn = $(event.currentTarget);
    var isSuccess = clientCopy.PlayOrStopAudio($btn.data('videoId'));
    if (isSuccess) {
      if ($('.audio-icon i').hasClass('icon-yinliangdaxiao')) {
        setIndividualAudioClose();
      } else {
        setIndividualAudioOpen(clientCopy.curAudioVolume);
      }
    }
  });
  // 添加按钮点击事件
  $('.video-video').click(videoClick);
  $('.video-laba').click(callClick);
  $('.video-dianhua').click(talkClick);
  $('.video-location').click(locationClick);
  $('.progress.audio-volume').click(volumeProgressClick);

  /**
   * 视频按钮点击事件
   * 
   * @param event
   */
  function videoClick(event) {
    var $btn = $(event.currentTarget);
    var $callBtn = $('.video-video a');
    // 如果视频正在播放
    if (windowObj.status.playvideoing) {
      // 关闭视频
      var isSuccess = clientCopy.StopVideo($btn.data('videoId'));
      if (isSuccess) { // 如果成功，则视频，对讲，喊话，音量，定位均被关闭
        turnButtonOff('video', '打开视频');
        turnButtonOff('talk', '打开对讲');
        turnButtonOff('call', '打开对讲');
        setIndividualAudioClose();
      }
    } else {
      // 开启视频
      var isSuccess = clientCopy.PlayVideo($btn.data('videoId'));
      if (isSuccess) {
        turnButtonOn('video', '关闭视频');
      }
    }
  }

  /**
   * 喊话按钮点击事件，开启/关闭视频墙所有喊话
   * 
   * @param event
   */
  function callClick(event) {
    var $btn = $(event.currentTarget);
    var $callBtn = $('.video-laba a');
    if (windowObj.status.playvideoing) {
      // 如果正在喊话
      if (windowObj.status.playcalling) {
        clientCopy.closeAllScreenCall($btn.data('videoId'));
      } else {
        clientCopy.openAllScreenCall($btn.data('videoId'));
      }
    }
  }

  /**
   * 对讲，开启当前对讲，关闭其他所有对讲/喊话，关闭当前对讲
   * 
   * @param event
   */
  function talkClick(event) {
    var $btn = $(event.currentTarget);
    var $callBtn = $('.video-dianhua a');
    // 如果当前窗口没有对讲，则即将打开对讲，先把所有喊话和对讲关闭
    if (windowObj.status.playvideoing) {
      if (!windowObj.status.playtalking) {
        // 关闭其他所有喊话
        clientCopy.closeAllScreenCall($btn.data('videoId'));
        // 关闭其他所有对讲
        clientCopy.closeAllScreenTalk($btn.data('videoId'));
      }
      var isSuccess = clientCopy.PlayOrStopTalk($btn.data('videoId'));
      if (windowObj.status.playtalking) {
        // 对讲已打开
        turnButtonOn('talk', '关闭对讲');
        // 设置音量
        setIndividualAudioOpen(clientCopy.curAudioVolume);
      } else {
        // 对讲已关闭
        turnButtonOff('talk', '打开对讲');
        // 关闭音量
        setIndividualAudioClose();
      }
    }
  }

  /**
   * 定位点击事件
   * 
   * @param event
   */
  function locationClick(event) {
    var $btn = $(event.currentTarget);
    // 获取单兵定位数据，并通过百度地图获取地图位置
    var locationStr = locationData.join(",");
    var result = $.ajax({
      url: "./getBaiduCoordinate?data=" + locationStr,
      async: false
    });
    var located = false;
    if (result.status === 200) {
      var transResult = JSON.parse(result.responseText);
      if (transResult.status === 0) {
        // 转换成功，在地图上定位
        located = true;
        var baiduData = transResult.result[0]
        top.bigScreenApp.flyOnTheMap({}, {
          data: [Number(baiduData.x), Number(baiduData.y)]
        });
      }
    }
    // 如果定位失败，采用模拟数据，即预先写入的演练点的坐标
    if (!located) {
      if (currentLocation) {
        top.bigScreenApp.flyOnTheMap({}, {
          data: [currentLocation.longitude, currentLocation.latitude]
        });
      }
//      var mockData = {
//        "501000000000000051": [121.526755, 31.223536],
//        "501000000000000005": [121.595304, 31.210866],
//        "501000000000000013": [121.595304, 31.210866],
//        "501000000000000018": [121.515557, 31.238511],
//        "501000000000000021": [121.515557, 31.238511],
//        "501000000000000012": [121.502676, 31.147782],
//        "501000000000000023": [121.502676, 31.147782],
//        "501000000000000011": [121.594285, 31.217855],
//        "501000000000000020": [121.594285, 31.217855],
//        "501000000000000017": [121.554899, 31.22776]
//      }
    }
    top.bigScreenApp.$store.dispatch('setShowIndividualScreen', false)
  }

  /**
   * 音量条点击事件
   * 
   * @param event
   */
  function volumeProgressClick(event) {
    var $btn = $(event.currentTarget);
    var clickPosition = event.offsetX;
    var barWidth = $btn.width();
    var volume = Math.round(100 * clickPosition / barWidth);
    if (volume > 95) {
      volume = 100;
    }
    if (clientCopy.SetAudVolume($btn.data('videoId'), volume)) {
      setIndividualAudioOpen(volume);
    }
  }

  // 云台按钮暂未展示
  $('.fangxiang a').mousedown(function(event) {
    var $btn = $(event.currentTarget);
    var type = null;
    if ($btn.hasClass('left')) {
      type = clientCopy.PtzTureType.PTZ_TURN_LEFT;
    } else if ($btn.hasClass('right')) {
      type = clientCopy.PtzTureType.PTZ_TURN_RIGHT;
    } else if ($btn.hasClass('up')) {
      type = clientCopy.PtzTureType.PTZ_TURN_UP;
    } else if ($btn.hasClass('down')) {
      type = clientCopy.PtzTureType.PTZ_TURN_DOWN;
    }
    clientCopy.StartTurePtz($btn.parent().data('videoId'), type);
  });
  $('.fangxiang a').mouseup(function(event) {
    var $btn = $(event.currentTarget);
    clientCopy.StopTurePtz($btn.parent().data('videoId'));
  });

  $(".definition").click(function() {
    var $btn = $(event.currentTarget);
    clientCopy.SetDefinition($btn.data('videoId'), $btn.data('definition'));
    var btn = $('.video-drop button').text($btn.text());
  });

  function setIndividualAudioOpen(p_volume) {
    $('.audio-volume .progress-bar').css('width', p_volume + '%');
    $('.audio-icon i').addClass('icon-yinliangdaxiao').removeClass(
            'icon-guanbiyinliang').attr('title', '关闭音频');
  }
});

/**
 * 关闭音量
 * 
 * @returns
 */
function setIndividualAudioClose() {
  $('.audio-volume .progress-bar').css('width', '0%');
  $('.audio-icon i').addClass('icon-guanbiyinliang').removeClass(
          'icon-yinliangdaxiao').attr('title', '打开音频');
}

/**
 * 将按钮置为打开状态
 * 
 * @param btnName
 *          按钮名称
 * @param btnText
 *          按钮提示信息
 */
function turnButtonOn(btnName, btnText) {
  var $btnIns = getBtnIns(btnName)
  if ($btnIns) {
    $btnIns.removeClass('btn-success').addClass('btn-danger').attr('title',
            btnText);
  }
}

/**
 * 将按钮置为关闭状态
 * 
 * @param btnName
 *          按钮名称
 * @param btnText
 *          按钮提示信息
 */
function turnButtonOff(btnName, btnText) {
  var $btnIns = getBtnIns(btnName)
  if ($btnIns) {
    $btnIns.removeClass('btn-danger').addClass('btn-success').attr('title',
            btnText);
  }
}

/**
 * 获取按钮
 * 
 * @param btnName
 *          按钮名称
 */
function getBtnIns(btnName) {
  var $btnIns = null;
  switch (btnName) {
  case 'video':
    $btnIns = $('.video-video a');
    break;
  case 'call':
    $btnIns = $('.video-laba a');
    break;
  case 'talk':
    $btnIns = $('.video-dianhua a');
    break;
  }
  return $btnIns
}