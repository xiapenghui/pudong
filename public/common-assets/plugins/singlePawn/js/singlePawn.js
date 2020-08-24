var individualPlatformIP = "116.247.116.44";
var individualPlatformPort = "7178";
//var devicePlatformUser="pdgd123";
var devicePlatformUser = "pdgd123";
var devicePlatformPWD = "RjmIiRy/qSIS7C6ktCQotQ==";


function alertProxy(msg) {
    console.log(msg);
}


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

var isMock = false;
var videoId = "vIndividual" + new Date().getTime();
var current = null;
var currentVol = 0;
var currentDef = 50;
var urlInfo = null;
var EnumDef = {
    NORMAL: 50,
    HIGH: 75,
    SUPER: 100,

    getDefLabel: function (def) {
        if (EnumDef.NORMAL === def) {
            return {
                dom: $("#defNormal"),
                labelDom: $("a[data-attr-btn='defLabel']"),
                label: "标清"
            };
        }

        if (EnumDef.HIGH === def) {
            return {
                dom: $("#defHigh"),
                labelDom: $("a[data-attr-btn='defLabel']"),
                label: "高清"
            };
        }

        if (EnumDef.SUPER === def) {
            return {
                dom: $("#defSuper"),
                labelDom: $("a[data-attr-btn='defLabel']"),
                label: "超清"
            };
        }

        return {
            dom: $("#defNormal"),
            labelDom: $("a[data-attr-btn='defLabel']"),
            label: "标清"
        };
    },

    getDefVal: function (labelOrId) {
        if (!labelOrId) {
            return EnumDef.NORMAL;
        }

        labelOrId = labelOrId.toLowerCase();
        if (labelOrId.indexOf("normal") >= 0) {
            return EnumDef.NORMAL;
        }

        if (labelOrId.indexOf("high") >= 0) {
            return EnumDef.HIGH;
        }

        if (labelOrId.indexOf("super") >= 0) {
            return EnumDef.SUPER;
        }

        return EnumDef.NORMAL;
    }

};
// 页面加载
//$(document).ready(function () {
window.onload = function () {
    debugger
    $("a[data-attr-btn='refreshBtn']").click(function () {
        window.location.href = window.location.href;
    });

    var href = window.location.href;
    urlInfo = parseURI(href);
    if (!urlInfo
        || !urlInfo.query
        || !urlInfo.query.deviceNo) {
        alertProxy("device no is empty");
        return;
    }


    videoId = "vIndividual" + urlInfo.query.deviceNo;
    //videoId = "vIndividual501000000000000036";
    $(".video").attr("id", videoId);

    if (isMock) {
        initDefUi();
        initVolUi();
        initPtz();
        initTalk();
        setTimeout(function () {
            createVideoWinCallhack(true, true);
        }, 1000);
        return;
    }

    $(window).unload(function () {
        if (WebClient) {
            WebClient.StopVideo(videoId);// 停止视频
            wtnc.remove(videoId);// 清空窗口缓存
            WebClient.removeCalling(urlInfo.query.deviceNo);
            WebClient.clearPosChgEvent(urlInfo.query.deviceNo);
            // WebClient.removeCalling("501000000000000036");
            // WebClient.clearPosChgEvent("501000000000000036");

            /*WebClient.resource.remove(videoId);
             WebClient.resource.remove(urlInfo.query.deviceNo);
             WebClient.resource.remove(WebClient.connectId);
             wtnc.remove(videoId);
             WebClient.StopVideo(videoId);
             WebClient.removeCalling(urlInfo.query.deviceNo);
             WebClient.clearPosChgEvent(urlInfo.query.deviceNo);*/
        }
    });

    //wtnc = window.top.NPCCILY.windowContainers;//关闭窗口前调用remove
    //WebClient = window.top.IndividualWebClient;
    wtnc = NPCCILY.windowContainers;//关闭窗口前调用remove
    WebClient = IndividualWebClient;



    var callingArr = WebClient.getDevListInCalling();
    var found = false;
    $.each(callingArr, function (i, item) {
        if (item === urlInfo.query.deviceNo) {
            found = true;
        }
        // if (item === "501000000000000036") {
        //     found = true;
        // }
    });
    if (found) {
        //window.top.showTip("info", "设备正在通信中", "设备正在通信中，无法打开播放窗口");
        console.log("info", "设备正在通信中", "设备正在通信中，无法打开播放窗口");
        return;
    }

    console.log(WebClient.puResList);
    if (!WebClient) {
        alertProxy("web client is empty");
        return;
    }

    var deviceNo = urlInfo.query.deviceNo; //"501000000000000036";//
    current = WebClient.FindPuResByPUID(deviceNo);
    if (!current) {
        alertProxy("device pu res is empty");
        // window.top.showTip("error", "无法找到设备信息", "无法找到设备信息 " + deviceNo);
        console.log("error", "无法找到设备信息", "无法找到设备信息 " + deviceNo);
        return;
    }

    if (0 === parseInt(current.bOnline)) {
        alertProxy("device is offline");
        //window.top.showTip("error", "设备未在线", "设备未在线 " + deviceNo);
        console.log("error", "设备未在线", "设备未在线 " + deviceNo);
        return;
    }

    initDefUi();
    initVolUi();
    initPtz();
    initTalk();
    WebClient.registerPosChgEvent(urlInfo.query.deviceNo, onPositionChange);
    //WebClient.registerPosChgEvent("501000000000000036", onPositionChange);
    WebClient.createVideoWin($(".video"), createVideoWinCallhack, false, false);

};

function onPositionChange(event) {
    console.log(event);
}

function createVideoWinCallhack(videoSuccess, audioSuccess) {
    if (videoSuccess) {
        var defInfo = EnumDef.getDefLabel(currentDef);
        onSelectRadioClickHandler.call(defInfo.dom[0]);
    }

    if (audioSuccess) {
        onRangeChange.call($("#volRange")[0]);
    }
}


function initVolUi() {
    setVolRangeVal(currentVol);
    setVolRange();
    $("#volRange").change(onRangeChange);
}


/**
 * 设置音量滑块的位置
 */
function setVolRange() {
    var wrap = $("#but_yl_top");
    var volDom = wrap.find("#volRange");
    var slideDom = wrap.find("a");

    slideDom.width(volDom.val() + "%");
}

/**
 * 设置音量输入框的值
 * @param {int} vol
 */
function setVolRangeVal(vol) {
    $("#volRange").val(vol);
}


function onRangeChange() {
    $(this).parent().find("a").width($(this).val() + "%");
    var val = parseInt($("#volRange").val());
    alertProxy("set vol : " + val);

    if (isMock) {
        currentVol = val;
        return;
    }

    if (currentVol === 0) {
        //音频尚未打开，打开音频，在打开音频成功的回调中设置音量
        WebClient.PlayOrStopAudio(videoId);
        setTimeout(function () {
            WebClient.SetAudVolume(videoId, val);
        }, 500);
    } else if (0 === val) {
        //音量设置为0的情况下关闭音频
        WebClient.PlayOrStopAudio(videoId);
    } else {
        //设置音量
        WebClient.SetAudVolume(videoId, val);
    }

    currentVol = val;
}


function initDefUi() {
    setSelectDefLabel(currentDef);
    setSelectDefRadio(currentDef);

    $("a[data-attr-btn='defLabel']").click(onSelectLabelClickHandler);
    $("a[data-attr-btn='defBtn']").change(onSelectRadioClickHandler);
}


function clearSelectStatus() {
    $("a[data-attr-btn='defBtn']").find("input").removeAttr("checked");
}

function setSelectDefRadio(def) {
    var defInfo = EnumDef.getDefLabel(def);
    clearSelectStatus();
    defInfo.dom.prop("checked", true);
}

function setSelectDefLabel(def) {
    var defInfo = EnumDef.getDefLabel(def);
    defInfo.labelDom.html(defInfo.label);
}

function openSelectGroup() {
    $("div[data-attr-group='defBtnGroup']").addClass("active");
}

function hideSelectGroup() {
    $("div[data-attr-group='defBtnGroup']").removeClass("active");
}

function onSelectLabelClickHandler() {
    if ($(this).parent().find("div[data-attr-group='defBtnGroup']").attr("class") == "but_more") {
        openSelectGroup();
    } else {
        hideSelectGroup();
    }
}

function onSelectRadioClickHandler() {
    var id = $(this).find("input").attr("id");
    var def = EnumDef.getDefVal(id);
    alertProxy("set def : " + def);

    setSelectDefRadio(def);
    setSelectDefLabel(def);
    hideSelectGroup();

    if (isMock) {
        return;
    }
    WebClient.SetDefinition(videoId, def);
    currentDef = def;
}


function initPtz() {
    $("span[data-attr-btn='ptzBtn']")
        .mousedown(onPtzMouseDown)
        .mouseup(onPtzMouseUp);
}

function onPtzMouseDown() {
    var type = $(this).attr("data-attr-type");
    alertProxy("start ptz : " + "up,down,left,right".split(",")[parseInt(type) - 1]);
    if (isMock) {
        return;
    }

    WebClient.StartTurePtz(videoId, type);
}

function onPtzMouseUp() {
    var type = $(this).attr("data-attr-type");
    alertProxy("stop ptz : " + "up,down,left,right".split(",")[parseInt(type) - 1]);
    if (isMock) {
        return;
    }
    WebClient.StopTurePtz(videoId);
}

function initTalk() {//展示通话按钮 隐藏挂断按钮
    toggleHangUpBtn(false);

    $("div[data-attr-btn$='Talk']").click(onTalkClickHandler);
}

function onTalkClickHandler() {
    if (!isTalking()) {
        alertProxy("start talk ");
        toggleHangUpBtn(true);
        setVolRangeVal(100);
    } else {
        alertProxy("stop talk ");
        toggleHangUpBtn(false);
    }

    if (isMock) {
        return;
    }
    WebClient.PlayOrStopTalk(videoId);
}

function isTalking() {
    return "stopTalk" === $("div[data-attr-btn$='Talk']:visible").attr("data-attr-btn");
}

function toggleHangUpBtn(isTalk) {// 通话 挂断
    if (isTalk) {
        $("div[data-attr-btn='playTalk']").hide();
        $("div[data-attr-btn='stopTalk']").show();
    } else {
        $("div[data-attr-btn='playTalk']").show();
        $("div[data-attr-btn='stopTalk']").hide();
    }
}
