/**
 * @file 封装所有结构体
 */

/**
 * @class NPCCStruct
 * @autho shaosy
 */
var NPCCStruct = {
    /**
     *******************************************************************************************************************
     **************************************************NPCCInterlayer.js************************************************
     *******************************************************************************************************************
     */

    /**
     * 初始化NPCCILY对象参数结构
     * @param debug {bool} 是否开始调试状态
     * @param cb {function} 调试信息输出回调函数
     * @param extraParams {object} 其他参数
     * @param extraParams.language {NPCCEnum.LanguageType} 语言对象
     * @param extraParams.warmTip {object}
     * @param extraParams.warmTip.active {object} 是否使能未加载插件时内部温馨提示
     * @param extraParams.warmTip.pluginFile {object} 插件绝对地址或网络地址
     * @param extraParams.warmTip.html {object} 自定义网页提示代码
     * @constructor
     */
    InitParamStruct : function (debug, cb, extraParams)
    {
        this.debug = (typeof debug != 'undefined' && debug === true ? true : false);
        this.callback = (typeof cb != 'undefined' ? cb : null);
        var extraParams = extraParams || {};
        this.language = extraParams.language || NPCCEnum.LanguageType.zh_CN;

        var _wt = extraParams.warmTip = extraParams.warmTip || {};
        this.warmTip = {
            active : typeof _wt.active == 'undefined' ? false : (_wt.active || false),
            pluginFile : _wt.pluginFile || 'MediaPlugin7.exe',
            html : _wt.html || ""
        };
    },

    /**
     * 成功登录平台后全局数据结构
     * @param hServer {Object} 服务句柄
     * @param loginParam {NPCCStruct.LoginParamStruct} 登录参数
     * @constructor
     */
    InitGlobalDataStruct: function (hServer, loginParam) {
        this.hServer = hServer;
        this.serverIP = loginParam.ip || '';
        this.serverPort = loginParam.port || 7178;
        this.password = loginParam.password || '';
        this.userName = loginParam.username || '';
        this.domain = loginParam.domain || 'root';
    },

    /**
     * 域信息
     * @param id {string} 唯一号
     * @param did {string} 域id
     * @param name {string} 域名称
     * @param parentID {string} 父域唯一号
     * @param desc {string} 描述
     * @param handle {Object} 域句柄
     * @constructor
     */
    DomainStruct: function (id, did, name, parentID, desc, handle)
    {
        this.id = (typeof id != 'undefined' ? id : '-1');
        this.did = (typeof did != 'undefined' ? did : '');
        this.name = (typeof name != 'undefined' ? name : '');
        this.parentID = (typeof parentID != 'undefined' ? parentID : '');
        this.desc = (typeof desc != 'undefined' ? desc : '');
        this.handle = (typeof handle != 'undefined' ? handle : '');
    },

    /**
     * 设备资源信息
     * @param did {string} 域id
     * @param resID {int} 资源id
     * @param puid {string} puid
     * @param resType {int} 资源类型
     * @param resIdx {int} 资源索引
     * @param bOnline {bool} 是否在线
     * @param name {string} 名称
     * @param desc {string} 描述
     * @param bEnable {bool} 是否可用
     * @param modelType {int} 型号类型
     * @param modelName {string} 型号
     * @param softwareVersion {string} 软件版本号
     * @param hardwareVersion {string} 硬件版本号
     * @param longitude {double} 纬度
     * @param latitude {double} 经度
     * @param deviceID {string} 设备id
     * @param resList {Object} 子资源信息
     * @param handle {Object} 资源句柄
     * @constructor
     */
    DeviceStruct: function (did /* = 0 */, resID, puid, resType, resIdx, bOnline, name, desc, bEnable,
                            modelType /* = DEVICE_TYPE_ENC */, modelName /* = NULL */, softwareVersion /* = NULL */,
                            hardwareVersion /* = NULL */, longitude /* = 0 */, latitude /* = 0 */,
                            deviceID, resList, handle)
    {
        this.did = (typeof did != 'undefined' ? did : '');
        this.resID = (typeof resID != 'undefined' ? resID : -1);
        this.puid = (typeof puid != 'undefined' ? puid : '');
        this.resType = (typeof resType != 'undefined' ? resType : NPCCEnum.ResType.RES_TYPE_DEV);
        this.resIdx = (typeof resIdx != 'undefined' ? resIdx : 0);
        this.bOnline = (typeof bOnline != 'undefined' ? bOnline : 0);
        this.name = (typeof name != 'undefined' ? name : '');
        this.desc = (typeof desc != 'undefined' ? desc : '');
        this.bEnable = (typeof bEnable != 'undefined' ? bEnable : 0);
        this.modelType = (typeof modelType != 'undefined' ? modelType : NPCCEnum.ModelType.MODEL_TYPE_ENC);
        this.modelName = (typeof modelName != 'undefined' ? modelName : '');
        this.softwareVersion = (typeof softwareVersion != 'undefined' ? softwareVersion : '');
        this.hardwareVersion = (typeof hardwareVersion != 'undefined' ? hardwareVersion : '');
        this.longitude = (typeof longitude != 'undefined' ? longitude : 0.0);
        this.latitude = (typeof latitude != 'undefined' ? latitude : 0.0);
        this.deviceID = (typeof deviceID != 'undefined' ? deviceID : '');
        this.resList = resList || [];
        this.handle = (typeof handle != 'undefined' ? handle : '');
    },

    /**
     * 摄像头资源信息
     * @param did {string} 域id
     * @param resID {int} 资源id
     * @param puid {string} puid
     * @param resType {int} 资源类型
     * @param resIdx {int} 资源索引
     * @param bOnline {bool} 是否在线
     * @param name {string} 名称
     * @param desc {string} 描述
     * @param bEnable {bool} 是否可用
     * @param handle {Object} 资源句柄
     * @constructor
     */
    CameraStruct: function (did, resID, puid, resType, resIdx, bOnline, name, desc, bEnable, handle) {
        this.did = (typeof did != 'undefined' ? did : '');
        this.resID = (typeof resID != 'undefined' ? resID : -1);
        this.puid = (typeof puid != 'undefined' ? puid : '');
        this.resType = (typeof resType != 'undefined' ? resType : NPCCEnum.ResType.RES_TYPE_CAM);
        this.resIdx = (typeof resIdx != 'undefined' ? resIdx : 0);
        this.bOnline = (typeof bOnline != 'undefined' ? bOnline : 0);
        this.name = (typeof name != 'undefined' ? name : '');
        this.desc = (typeof desc != 'undefined' ? desc : '');
        this.bEnable = (typeof bEnable != 'undefined' ? bEnable : 0);
        this.handle = (typeof handle != 'undefined' ? handle : '');
    },

    /**
     * 音频资源信息
     * @param did {string} 域id
     * @param resID {int} 资源id
     * @param puid {string} puid
     * @param resType {int} 资源类型
     * @param resIdx {int} 资源索引
     * @param bOnline {bool} 是否在线
     * @param name {string} 名称
     * @param desc {string} 描述
     * @param bEnable {bool} 是否可用
     * @param handle {Object} 资源句柄
     * @constructor
     */
    AudioStruct: function (did, resID, puid, resType, resIdx, bOnline, name, desc, bEnable, handle) {
        this.did = (typeof did != 'undefined' ? did : '');
        this.resID = (typeof resID != 'undefined' ? resID : -1);
        this.puid = (typeof puid != 'undefined' ? puid : '');
        this.resType = (typeof resType != 'undefined' ? resType : NPCCEnum.ResType.RES_TYPE_AUD);
        this.resIdx = (typeof resIdx != 'undefined' ? resIdx : 0);
        this.bOnline = (typeof bOnline != 'undefined' ? bOnline : 0);
        this.name = (typeof name != 'undefined' ? name : '');
        this.desc = (typeof desc != 'undefined' ? desc : '');
        this.bEnable = (typeof bEnable != 'undefined' ? bEnable : 0);
        this.handle = (typeof handle != 'undefined' ? handle : '');
    },

    /**
     * 对讲资源信息
     * @param did {string} 域id
     * @param resID {int} 资源id
     * @param puid {string} puid
     * @param resType {int} 资源类型
     * @param resIdx {int} 资源索引
     * @param bOnline {bool} 是否在线
     * @param name {string} 名称
     * @param desc {string} 描述
     * @param bEnable {bool} 是否可用
     * @param handle {Object} 资源句柄
     * @constructor
     */
    TalkbackStruct: function (did, resID, puid, resType, resIdx, bOnline, name, desc, bEnable, handle) {
        this.did = (typeof did != 'undefined' ? did : '');
        this.resID = (typeof resID != 'undefined' ? resID : -1);
        this.puid = (typeof puid != 'undefined' ? puid : '');
        this.resType = (typeof resType != 'undefined' ? resType : NPCCEnum.ResType.RES_TYPE_TBK);
        this.resIdx = (typeof resIdx != 'undefined' ? resIdx : 0);
        this.bOnline = (typeof bOnline != 'undefined' ? bOnline : 0);
        this.name = (typeof name != 'undefined' ? name : '');
        this.desc = (typeof desc != 'undefined' ? desc : '');
        this.bEnable = (typeof bEnable != 'undefined' ? bEnable : 0);
        this.handle = (typeof handle != 'undefined' ? handle : '');
    },

    /**
     * 定位资源信息
     * @param did {string} 域id
     * @param resID {int} 资源id
     * @param puid {string} puid
     * @param resType {int} 资源类型
     * @param resIdx {int} 资源索引
     * @param bOnline {bool} 是否在线
     * @param name {string} 名称
     * @param desc {string} 描述
     * @param bEnable {bool} 是否可用
     * @param handle {Object} 资源句柄
     * @constructor
     */
    LocationStruct: function (did, resID, puid, resType, resIdx, bOnline, name, desc, bEnable, handle) {
        this.did = (typeof did != 'undefined' ? did : '');
        this.resID = (typeof resID != 'undefined' ? resID : -1);
        this.puid = (typeof puid != 'undefined' ? puid : '');
        this.resType = (typeof resType != 'undefined' ? resType : NPCCEnum.ResType.RES_TYPE_LOC);
        this.resIdx = (typeof resIdx != 'undefined' ? resIdx : 0);
        this.bOnline = (typeof bOnline != 'undefined' ? bOnline : 0);
        this.name = (typeof name != 'undefined' ? name : '');
        this.desc = (typeof desc != 'undefined' ? desc : '');
        this.bEnable = (typeof bEnable != 'undefined' ? bEnable : 0);
        this.handle = (typeof handle != 'undefined' ? handle : '');
    },

    /**
     * 云台资源信息
     * @param did {string} 域id
     * @param resID {int} 资源id
     * @param puid {string} puid
     * @param resType {int} 资源类型
     * @param resIdx {int} 资源索引
     * @param bOnline {bool} 是否在线
     * @param name {string} 名称
     * @param desc {string} 描述
     * @param bEnable {bool} 是否可用
     * @param handle {Object} 资源句柄
     * @constructor
     */
    PTZStruct: function (did, resID, puid, resType, resIdx, bOnline, name, desc, bEnable, handle) {
        this.did = (typeof did != 'undefined' ? did : '');
        this.resID = (typeof resID != 'undefined' ? resID : -1);
        this.puid = (typeof puid != 'undefined' ? puid : '');
        this.resType = (typeof resType != 'undefined' ? resType : NPCCEnum.ResType.RES_TYPE_PTZ);
        this.resIdx = (typeof resIdx != 'undefined' ? resIdx : 0);
        this.bOnline = (typeof bOnline != 'undefined' ? bOnline : 0);
        this.name = (typeof name != 'undefined' ? name : '');
        this.desc = (typeof desc != 'undefined' ? desc : '');
        this.bEnable = (typeof bEnable != 'undefined' ? bEnable : 0);
        this.handle = (typeof handle != 'undefined' ? handle : '');
    },

    /**
     * 视频播放窗口容器信息
     * @param container {string} 容器ID获取容器对象
     * @param active {bool} 窗口是否激活
     * @param _window {NPCCStruct.WindowStruct} 播放窗口
     * @param description {string}
     * @constructor
     */
    WindowContainerStruct : function (container, active, _window, description)
    {
        this.container = (container && typeof container != "undefined" ? container : "");
        this.active = !!(active == true);
        this.focus = false;
        this.window = (_window && typeof _window != "undefined" ? _window : null);
        this.description = (typeof description != "undefined" ? description : {});
    },

    /**
     *******************************************************************************************************************
     **************************************************NPCCInterface.js*************************************************
     *******************************************************************************************************************
     */

    /**
     * 返回值结构
     * @param errorCode {int} 错误码
     * @param value {string} 返回值
     * @constructor
     */
    ReturnValueStruct : function (errorCode, value)
    {
        this.errorCode = errorCode;
        if (typeof value != 'undefined')
        {
            this.value =  value;
        }
    },

    /**
     * 初始化登录平台参数结构
     * @param ip {string} 地址, 如rst.pw
     * @param port {short} 端口, 如7178
     * @param domain {string} 域
     * @param username {string} 用户名
     * @param password {string} 用户密码
     * @param block {bool} 是否阻塞登录（1/true是，0/false否）
     * @constructor
     */
    LoginParamStruct : function (ip, port, domain, username, password, block)
    {
        this.ip = ip || 'rst.pw';
        this.port = port || 7178;
        this.domain = (typeof domain != 'undefined' && domain != null ? domain : 'root');
        this.username = (typeof username != 'undefined' && username != null ? username : '');
        this.password = (typeof password != 'undefined' && password != null ? password : '');
        this.block = (typeof block != 'undefined' && block != null ? block : 0);
    },

    /**
     * 事件信息结构
     * @param eventName{string} 事件方法名，必须跟插件里定义的一致
     * @param handle{Object} 流句柄
     * @param status{int} 音视频流的状态
     * @param errorCode{int} 错误码
     * @param keyData{string} 其他信息 json格式
     * @constructor
     */
    NotifyStruct : function(eventName, handle, status, errorCode, keyData)
    {
        this.eventName = eventName || '';
        this.handle = handle || '';
        if (typeof status != 'undefined' && status != null && status !== '')
        {
            this.status = status || '0';
            this.statusDesc = '';
            if (NPCCEnum.StreamStatusDesc[this.status])
            {
                this.statusDesc = NPCCEnum.StreamStatusDesc[this.status][NPPILY.language] || '';
            }
        }
        this.errorCode = typeof errorCode != 'undefined' ? (errorCode || '0') : '0';
        this.keyData =  typeof keyData != 'undefined' ? (keyData || {}) : {};
    },

    /**
     * 窗口信息结构
     * @param options{Object} 可选参数
     * @param options.container{Object} 窗口插件容器，优先判断container，其次containerId
     * @param options.containerId{string} 窗口插件容器ID
     * @param options.pwPlugin{Object} 窗口插件实例，优先判断pwPlugin，其次pwPluginName
     * @param options.pwPluginName{string} 窗口插件实例ID
     * @param options.connectId{string} 连接ID
     * @param options.pwHandle{Object} 窗口句柄
     * @param options.status{Object} 视频状态参数
     * @constructor
     */
    WindowStruct : function (options)
    {
        var _SELF = this;
        var options = options || {};

        this.container =
            (
                function()
                {
                    if (typeof options.container != "undefined" && typeof options.container.id != "undefined")
                    {
                        _SELF.containerId = options.container.id || document.getElementById(options.containerId || "");
                        return options.container;
                    }
                    else
                    {
                        _SELF.containerId = options.containerId || "";
                        return document.getElementById(_SELF.options.containerId);
                    }
                }
            )();

        this.pwPlugin =
            (
                function()
                {
                    if (typeof options.pwPlugin != "undefined" && typeof options.pwPlugin.id != "undefined")
                    {
                        _SELF.pwPluginName = options.pwPlugin.id || document.getElementById(options.pwPluginName || "");
                        return options.pwPlugin;
                    }
                    else
                    {
                        _SELF.pwPluginName = options.pwPluginName || "";
                        return document.getElementById(_SELF.options.pwPluginName);
                    }
                }
            )();

        this.pwHandle = options.pwHandle || "";

        this.connectId = options.connectId || "";

        this.params =
            {
                puid : "", // 设备PUID
                resIdx : "", // 资源索引
                cameraResHandle : "" , // 视频流句柄
                audioResHandle : "" , // 音频流句柄
                talkbackResHandle: '', // 对讲流句柄
                locationResHandle: '', // 定位流句柄
                ptzResHandle: '', // 云台流句柄
                mediaHandle: '', // 媒体句柄
            };

        this.status =
            {
                playvideoing : (options.status ? !!(options.status.playvideoing == true) : false),
                playaudioing : (options.status ? !!(options.status.playaudioing == true) : false),
                playcalling : (options.status ? !!(options.status.playcalling == true) : false),
                playtalking : (options.status ? !!(options.status.playtalking == true) : false),
                playlocation : (options.status ? !!(options.status.playlocation == true) : false),
                isfullscreening: (options.status ? !!(options.status.isfullscreening == true) : false)
            };
    },

    /**
     * 窗口事件信息结构
     * @constructor
     */
    WindowEventStruct : function()
    {
        // - 鼠标左键点击
        this.lbtn_click = {
            name : "lbtn_click",
            status : (typeof lbtn_click != "undefined" && typeof lbtn_click.status != "undefined" ? !!
                (lbtn_click.status == true) : false),
            callback : (typeof lbtn_click != "undefined" && typeof lbtn_click.callback != "undefined" &&
                lbtn_click.callback.constructor == Function ? lbtn_click.callback : function(){})
        }

    },

    end : true
};