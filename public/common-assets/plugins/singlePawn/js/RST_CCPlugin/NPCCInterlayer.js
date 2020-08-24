/**
 * @file RST_WebSDK中间层封装，调用NPCCInterface.js文件NPCCIF中的方法
 */

// ----------------------------------------------------------------------------------------------------------------
//     修改记录
// ----------------------------------------------------------------------------------------------------------------

/**
 * 修改记录
 * 20180607：
 *  1、新增方法NPCCILY.GetUID(connectId); // 获取当前登录用户ID
 *  2、新增方法NPCCILY.GetUserList(connectId); // 获取所有子用户信息
 *  3、新增方法NPCCILY.AddUser(connectId); // 添加新的用户
 *  4、新增方法NPCCILY.ModifyUser(connectId); // 修改用户
 *  5、新增方法NPCCILY.DeleteUser(connectId); // 删除用户
 *  6、新增方法NPCCILY.GetUserRes(connectId); // 获取用户资源
 *  7、新增方法NPCCILY.AddUserRes(connectId); // 添加用户资源
 *  8、新增方法NPCCILY.RemoveUserRes(connectId); // 删除用户资源
 */

// ----------------------------------------------------------------------------------------------------------------
//     接口调用流程
// ----------------------------------------------------------------------------------------------------------------

/**
 * RST_WebSDK中间层方法调用主要流程
 * 1、初始化RST_WebSDK
 *      NPCCILY.Init();
 * 2、登录平台
 *      NPCCILY.Login();
 * 3、获取子域
 *      NPCCILY.ForkDomainList(connectId);
 * 4、获取设备
 *      NPCCILY.ForkPUList(connectId);
 * 5、获取子资源
 *      NPCCILY.ForkResList(connectId);
 * 6、功能模块
 *  1）、启动音视频、喊话和对讲模块
 *  2）、定位功能模块
 *  3）、参数配置模块
 *  4）、云台控制模块
 *  5）、添加子用户并分配资源模块
 * 7、退出平台
 *      NPCCILY.Logout();
 * 8、释放RST_WebSDK资源
 *      NPCCILY.Free();
 */

/**
 * 获取域、设备和子资源流程
 * 1、初始化RST_WebSDK
 *      NPCCILY.Init()
 * 2、登录平台
 *      NPCCILY.Login()
 * 3、根域名称
 *      NPCCILY.GetRootDomainName(connectId);
 * 4、获取子域
 *      NPCCILY.ForkDomainList(connectId);
 * 5、获取设备
 *      NPCCILY.ForkPUList(connectId);
 * 6、获取子资源
 *      1）、NPCCILY.ForkResList(connectId);
 *      2）、NPCCILY.GetAllResList(connectId)或NPCCILY.GetResList(connectId);
 * 7、退出平台
 *      NPCCILY.Logout();
 * 8、释放RST_WebSDK资源
 *      NPCCILY.Free();
 */

/**
 * 启动音视频、喊话和对讲模块的流程
 * 1、初始化RST_WebSDK
 *      NPCCILY.Init();
 * 2、登录平台
 *      NPCCILY.Login();
 * 3、创建窗口句柄、添加、删除窗口事件（本接口只支持左键单击事件）：参考index.js文件中WebClient.CreateVideoWindow()
 *      NPCCILY.CreateWindow();
 *      NPCCILY.WindowAttachEvent.Init(window, windowEvent);
 * 4、添加、删除CC插件事件回调：参考index,js文件中WebClient.AddCCEvent()
 *      需要注册的事件有：NPCCEnum.CCObjectNotify.event_notify、NPCCEnum.CCObjectNotify.stream_status_notify、NPCCEnum.CCObjectNotify.call_stream_status_notify
 *      NPCCILY.CCNotifyManager.Add(eventName, eventCallBack);
 *      NPCCILY.CCNotifyManager.Remove(eventName, eventCallBack);
 * 5、获取子域
 *      NPCCILY.ForkDomainList(connectId);
 * 6、获取设备
 *      NPCCILY.ForkPUList(connectId);
 * 7、获取子资源
 *      NPCCILY.ForkResList(connectId);
 * 8、启动、停止视频
 *      NPCCILY.StartPreview(winObj, NPCCEnum.StopRealtimePreviewType.SREP_VIDEO);
 *      NPCCILY.StopPreview(winObj, NPCCEnum.StopRealtimePreviewType.SREP_VIDEO);
 * 9、启动、停止音频
 *      NPCCILY.StartPreview(winObj, NPCCEnum.StopRealtimePreviewType.SREP_AUDIO);
 *      NPCCILY.StopPreview(winObj, NPCCEnum.StopRealtimePreviewType.SREP_AUDIO);
 * 10、启动、停止喊话：与对讲是互斥的即启动喊话，需要停止对讲
 *      NPCCILY.StartCall(winObj)
 *      NPCCILY.StopCall(winObj)
 * 11、启动、停止对讲：与喊话是互斥的即启动对讲，需要停止喊话
 *      NPCCILY.StartTalk(winObj);
 *      NPCCILY.StopTalk(winObj);
 * 12、退出平台
 *      NPCCILY.Logout();
 * 13、释放RST_WebSDK资源
 *      NPCCILY.Free();
 */

/**
 * 定位功能模块的流程
 * 1、初始化RST_WebSDK
 *      NPCCILY.Init();
 * 2、登录平台
 *      NPCCILY.Login();
 * 3、获取子域
 *      NPCCILY.ForkDomainList(connectId);
 * 4、获取设备
 *      NPCCILY.ForkPUList(connectId);
 * 5、获取子资源
 *      NPCCILY.ForkResList(connectId);
 * 6、添加、删除CC插件事件回调：参考index,js文件中WebClient.AddCCEvent()
 *      定位回调事件：NPCCEnum.CCObjectNotify.location_data_notify
 *      NPCCILY.CCNotifyManager.Add(eventName, eventCallBack);
 *      NPCCILY.CCNotifyManager.Remove(eventName, eventCallBack);
 * 7、启动停止定位：第6步如果不执行，调用启动定位方法成功后是获取不到平台返回的定位数据的
 *      NPCCILY.StartLocation(winObj);
 *      NPCCILY.StopLocation(winObj);
 * 8、退出平台
 *      NPCCILY.Logout();
 * 9、释放RST_WebSDK资源
 *      NPCCILY.Free();
 */

/**
 * 参数配置模块的流程
 * 1、初始化RST_WebSDK
 *      NPCCILY.Init();
 * 2、登录平台
 *      NPCCILY.Login();
 * 3、获取子域
 *      NPCCILY.ForkDomainList(connectId);
 * 4、获取设备
 *      NPCCILY.ForkPUList(connectId);
 * 5、获取子资源
 *      NPCCILY.ForkResList(connectId);
 * 6、获取、设置视频清晰度
 *      NPCCILY.CAM_GetDefinition(winObj);
 *      NPCCILY.CAM_SetDefinition(winObj, definition);
 * 7、获取、设置音频、对讲音量
 *      NPCCILY.AUD_GetVolume(winObj);
 *      NPCCILY.AUD_SetVolume(winObj, volume);
 *      NPCCILY.TBK_SetInputVolume(winObj);
 *      NPCCILY.TBK_SetInputVolume(winObj, volume);
 *      NPCCILY.TBK_GetOutputVolume(winObj);
 *      NPCCILY.TBK_SetOutputVolume(winObj, volume);
 * 8、退出平台
 *      NPCCILY.Logout();
 * 9、释放RST_WebSDK资源
 *      NPCCILY.Free();
 */

/**
 * 云台控制模块流程
 * 1、初始化RST_WebSDK
 *      NPCCILY.Init();
 * 2、登录平台
 *      NPCCILY.Login();
 * 3、获取子域
 *      NPCCILY.ForkDomainList(connectId);
 * 4、获取设备
 *      NPCCILY.ForkPUList(connectId);
 * 5、获取子资源
 *      NPCCILY.ForkResList(connectId);
 * 6、控制云台
 *      NPCCILY.PTZ_StartTurnLeft(winObj); // 向左转动
 *      NPCCILY.PTZ_StartTurnRight(winObj); // 向右转动
 *      NPCCILY.PTZ_StartTurnUp(winObj); // 向上转动
 *      NPCCILY.PTZ_StartTurnDown(winObj); // 向下转动
 *      NPCCILY.PTZ_StopTurn(winObj); // 停止转动
 * 7、退出平台
 *      NPCCILY.Logout();
 * 8、释放RST_WebSDK资源
 *      NPCCILY.Free();
 */

/**
 * 添加子用户、给用户分配资源模块的流程
 * 1、初始化RST_WebSDK
 *      NPCCILY.Init();
 * 2、登录平台
 *      NPCCILY.Login();
 * 3、获取子域
 *      NPCCILY.ForkDomainList(connectId);
 * 4、获取设备
 *      NPCCILY.ForkPUList(connectId);
 * 5、获取子资源
 *      NPCCILY.ForkResList(connectId);
 * 6、获取登录用户ID
 *      NPCCILY.GetUID(connectId);
 * 7、获取当前登录用户下的所有子用户
 *      NPCCILY.GetUserList(connectId);
 * 8、添加子用户
 *      NPCCILY.AddUser(connectId, uiParentIndex, username, password, ucUserType, desc);
 * 9、修改子用户
 *      NPCCILY.ModifyUser(connectId, uiIndex, username, password, desc);
 * 10、删除子用户
 *      NPCCILY.DeleteUser(connectId, uiIndex);
 * 11、获取分配给当前登录用户资源
 *      NPCCILY.GetUserRes(connectId, uiIndex);
 * 12、给子用户分配资源
 *      NPCCILY.AddUserRes(connectId, uiIndex, resIDList);
 * 13、删除子用户分配的资源
 *      NPCCILY.RemoveUserRes(connectId, uiIndex, resIDList);
 * 14、退出平台
 *      NPCCILY.Logout();
 * 15、释放RST_WebSDK资源
 *      NPCCILY.Free();
 */

/**
 * RST_WebSDK中间层封装，调用NPCCInterface.js文件NPCCIF中的方法
 * @class NPCCILY
 * @autho shaosy
 */
var NPCCILY = {
    /** @property {string} 浏览器信息 */
    age: navigator.userAgent.toLocaleLowerCase(),
    /** @property {string} 浏览器类型 */
    browserType : "IE", // IE | Chrome | FireFox | Other
    /** @property {string} 语种 */
    language: NPCCEnum.LanguageType.zh_CN,
    /** @property {NPCCUtils.Hash} 存储所有登录平台信息， key为连接ID， value为NPCCStruct.InitGlobalDataStruct*/
    serverMap: new NPCCUtils.Hash(),
    /** @property {NPCCUtils.Hash} 存储所有窗口信息 */
    windowContainers : new NPCCUtils.Hash(),
    /** @property {number} 整数 reg */
    intRex: /^-?\d+$/,

    Plug :
    {
        /** @property {bool} 是否加载 */
        inited : false,
        /** @property {Object} cc插件 */
        ccPlugin : null,
        /** @property {Object} pw插件 */
        pwPlugin : null,
        /** @property {string}  */
        boxDomId : "NPP_nppluginsbox",
        Html :
            {
                ccPlugin : "<OBJECT id=\"@id\" name=\"@name\" type=\"application/x-ccplugin\" style=\"width:0px;height:0px;border:0px solid red;\">" +
                "<param name=\"onload\" value=\"pluginLoaded\" /></OBJECT>",
                pwPlugin : "<OBJECT id=\"@id\" name=\"@name\" type=\"application/x-pwplugin\" style=\"width:0px;height:0px;border:0px solid #FFFFFF;\" " +
                "wmode=\"transparent\"></OBJECT>",

                get : function (objName)
                {
                    switch (objName)
                    {
                        case NPCCEnum.PluginType.CC:
                            return this.ccPlugin;
                            break;
                        case NPCCEnum.PluginType.PW:
                            return this.pwPlugin;
                            break;
                        default:
                            return "";
                            break;
                    }
                },
                end : true
            },
        end : true
    },

    /**
     * 初始化RST_WebSDK，在调用NPCCILY其他方法之前调用
     * @param initParam {NPCCStruct.InitParamStruct} [in] 初始化参数
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示初始化失败
     * @see 一般在应用程序初始化时调用或在使用NPCCILY其他方法之前调用，该方法只要调用一次。
     *          不建议用户在使用NPCCILY方法期间多次调用该方法和NPCCILY.Free方法。
     */
    Init: function (initParam)
    {
        try {
            if (NPCCILY.Plug.inited != false) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
            }

            if (!initParam || !initParam instanceof NPCCStruct.InitParamStruct) {
                initParam = new NPCCStruct.InitParamStruct();
            }

            // 判断浏览器类型
            var _agt = NPCCILY.agt || navigator.userAgent.toLowerCase();
            if (_agt.search("msie") != - 1 || _agt.search("trident") != - 1) {
                NPCCILY.browserType = NPCCEnum.BrowserType.IE;
            }
            else if (_agt.search("chrome") != - 1) {
                NPCCILY.browserType = NPCCEnum.BrowserType.Chrome;
            }
            else if (_agt.search("firefox") != - 1) {
                NPCCILY.browserType = NPCCEnum.BrowserType.FireFox;
            }
            else {
                NPCCILY.browserType = NPCCEnum.BrowserType.Other;
            }

            // 语言风格
            var _language = initParam.language || NPCCILY.language;
            if (!NPCCEnum.LanguageType[_language]) {
                _language = NPCCEnum.LanguageType.zh_CN;
            }
            ErrorCode.language = NPCCILY.language = _language;

            // 检测插件是否加载完成
            var ccPlugin = NPCCILY.Plug.Html.get(NPCCEnum.PluginType.CC).replace(/(@id)|(@name)/g, "NPCCILY");
            if (!document.getElementById(NPCCILY.Plug.boxDomId)) {
                var _objn3box = document.createElement("DIV");
                _objn3box.setAttribute("id", NPCCILY.Plug.boxDomId);
                _objn3box.setAttribute("attention", "For np sdk private using, be sure won't remove it manually...");
                document.getElementsByTagName("body").item(0).appendChild(_objn3box);
            }
            else {
                var _objn3box = document.getElementById(NPCCILY.Plug.boxDomId);
            }

            var plugins = [ccPlugin];
            _objn3box.innerHTML = plugins.join("");
            if (typeof document.getElementById("NPCCILY").Initialize == "undefined") {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_LOADPLUG_CC);
            }

            NPCCILY.Plug.ccPlugin = document.getElementById("NPCCILY");
            var operator = NPCCIF.Initialize(NPCCILY.Plug.ccPlugin);
            if (operator.errorCode == ErrorCode.NP_E_OK) {
                NPCCILY.Plug.inited = true;
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
            }
            else {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_UNINITIALIZED);
            }
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
        }
        catch (e) {
            alert("excp error = " + e.message + "::" + e.name);
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPPLUG_THREAD);
        }
    },

    /**
     * 清空RST_WebSDK, 释放占用的资源，在NPCCILY所有的方法之后调用
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示清空失败
     * @see 一般在应用程序关闭时调用，清理并释放资源。不建议用户在没使用完NPCCILY方法期间多次调用该方法和NPCCILY.Free方法。
     */
    Free: function ()
    {
        try {
            if (NPCCILY.Plug.inited == true) {
                if (typeof NPCCUtils.Timer != 'undefined' && typeof NPCCUtils.Timer.Stop != 'undefined') {
                    NPCCUtils.Timer.Stop();
                }

                var _connKeys = [];
                if (NPCCILY.serverMap && typeof NPCCILY.serverMap.keys == 'function') {
                    _connKeys = NPCCILY.serverMap.keys();
                }
                for (var i = 0; i < _connKeys.length; i++) {
                    // 断开连接
                    NPCCILY.Logout(_connKeys[i]);
                }

                if (NPCCILY.Plug.ccPlugin) {
                    NPCCILY.CCNotifyManager.Clear();
                    NPCCIF.Terminate(NPCCILY.Plug.ccPlugin);
                    NPCCILY.Plug.ccPlugin = null;
                    NPCCILY.Plug.pwPlugin = null;
                    NPCCILY.windowContainers = new NPCCUtils.Hash();
                }
                if (document.getElementById(NPCCILY.Plug.boxDomId)) {
                    document.getElementById(NPCCILY.Plug.boxDomId).innerHTML = '';
                }
                NPCCILY.Plug.inited = false;
            }
            else {
                // NPCCILY not inited
            }
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_UNLOAD_CCPLUG_FAILED);
        }
    },

    /**
     * 登录平台，建议用阻塞方式登录
     * @param loginParam {NPCCStruct.LoginParamStruct} [in] 登录参数
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value为连接ID(连接ID是随机生成的，作为唯一标识用)，否则表示登录失败
     * @see 连接ID是登录平台成功后，本地随机生成的一个不重复的ID，用来作为hashmap的key值保存在本地的，通过这个连接ID可以获取到登录成功后返回的服务句柄和登录信息
     */
    Login: function (loginParam) {
        debugger
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }
            if (!loginParam || !loginParam instanceof NPCCStruct.LoginParamStruct) {
                loginParam = new NPCCStruct.LoginParamStruct();
            }

            // 检测当前平台是否已经登录过了
            NPCCILY.serverMap = NPCCILY.serverMap || new NPCCUtils.Hash();
            var _connKeys = NPCCILY.serverMap.keys();
            for (var i = 0; i < _connKeys.length; i++) {
                var _connId = _connKeys[i],  _globalData = NPCCILY.serverMap.get(_connId);
                if (_globalData.serverIP == loginParam.ip && _globalData.serverPort == loginParam.port) {
                    // 已经登录过了
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTIONID_ALREADY);
                }
            }

            var operator = NPCCIF.Open(NPCCILY.Plug.ccPlugin, loginParam);
            if (operator.errorCode == ErrorCode.NP_E_OK) {
                var hServer = operator.value;
                if(loginParam.block) {
                    // 阻塞登录
                    var connectId = new Date().getTime() + "" + parseInt(Math.random() * (9999 - 1000 + 1) + 1000);
                    var globalData = new NPCCStruct.InitGlobalDataStruct(hServer, loginParam);

                    var operator = NPCCIF.IsPlatform(NPCCILY.Plug.ccPlugin, hServer);
                    if (operator.errorCode == ErrorCode.NP_E_OK) {
                        globalData.bPlatform = operator.value == 1 ? true : false;
                    }

                    NPCCILY.serverMap.set(connectId, globalData);
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK, connectId);
                }
                else {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
                }
            }
            else {
                return new NPCCStruct.ReturnValueStruct(operator.errorCode);
            }
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 退出平台
     * @param connectId {string} [in] 连接ID，登录平台时返回的
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功；其他表示退出平台失败。
     */
    Logout: function (connectId) {
        try
        {
            if (!NPCCILY.Plug.inited)
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }
            if (!connectId || !NPCCILY.serverMap.get(connectId))
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
            else
            {
                var globalData = NPCCILY.serverMap.get(connectId);
                if (globalData instanceof NPCCStruct.InitGlobalDataStruct)
                {
                    // 停止视频
                    if(NPCCILY.windowContainers instanceof NPCCUtils.Hash)
                    {
                        NPCCILY.windowContainers.each
                        (
                            function(item)
                            {
                                var winObj = item.value.window;

                                if(winObj && winObj instanceof NPCCStruct.WindowStruct)
                                {
                                    if (winObj.status.playvideoing)
                                    {
                                        NPCCILY.StopPreview(winObj);
                                    }
                                }
                            }
                        );
                    }

                    var operator =  NPCCIF.Close(NPCCILY.Plug.ccPlugin, globalData.hServer);
                    if (operator.errorCode == ErrorCode.NP_E_OK)
                    {
                        NPCCILY.serverMap.unset(connectId);
                    }
                    else
                    {
                        return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                    }
                }
            }

            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     *  获取根域名称
     * @param connectId {string} [in] 连接ID
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value为根域名称；其他表示获取失败。
     * @see 调用NPCCILY.ForkDomainList方法只能获取子域信息，想要知道根域名称，需要调用该方法
     */
    GetRootDomainName: function (connectId) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }
            if (!connectId || !NPCCILY.serverMap.get(connectId)) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
            else {
                var globalData = NPCCILY.serverMap.get(connectId);
                if (globalData instanceof NPCCStruct.InitGlobalDataStruct) {
                    var operator = NPCCIF.COMMON_GetName(NPCCILY.Plug.ccPlugin, globalData.hServer);
                    if (ErrorCode.CLIENT_SUCCEEDED(operator.errorCode) && operator.value) {
                        return new NPCCStruct.ReturnValueStruct(operator.errorCode, operator.value);
                    }
                    else {
                        return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                    }
                }
            }
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 获取所有子域
     * @param connectId {string} [in] 连接ID
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是所有子域详细信息，否则表示获取失败
     * @see 获取成功后，value返回的是个数组(Array)，数据类型为NPCCStruct.DomainStruct，如果没有子域，则返回空数组
     */
    ForkDomainList: function (connectId) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }
            if (!connectId || !NPCCILY.serverMap.get(connectId)) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
            else {
                var globalData = NPCCILY.serverMap.get(connectId);
                if (globalData instanceof NPCCStruct.InitGlobalDataStruct) {
                    var operator = NPCCIF.ForkDomainList(NPCCILY.Plug.ccPlugin, globalData.hServer);
                    if (operator.errorCode == ErrorCode.NP_E_OK && operator.value) {
                        if (operator.value.constructor != Array) {
                            operator.value = [operator.value];
                        }

                        var domainList = new Array();
                        for (var i = 0; i < operator.value.length; i++) {
                            var domainHandle = operator.value[i];
                            var domain = NPCCIF.NPCCSDKCommon.GetDomainInfoByDomainHandle(connectId, domainHandle);
                            if (domain && domain instanceof NPCCStruct.DomainStruct) {
                                domainList.push(domain);
                            }
                        }
                        return new NPCCStruct.ReturnValueStruct(operator.errorCode, domainList || new Array());
                    }
                    else {
                        return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                    }
                }
            }
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 获取所有设备
     * @param connectId {string} [in] 连接ID
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是所有设备详细信息，否则表示获取失败
     * @see 获取成功后，value返回的是个数组(Array)，数据类型为NPCCStruct.DeviceStruct，如果没有设备，则返回空数组
     */
    ForkPUList: function (connectId) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }
            if (!connectId || !NPCCILY.serverMap.get(connectId)) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
            else {
                var globalData = NPCCILY.serverMap.get(connectId);
                if (globalData instanceof NPCCStruct.InitGlobalDataStruct) {
                    var operator = NPCCIF.ForkPUList(NPCCILY.Plug.ccPlugin, globalData.hServer);
                    if (operator.errorCode == ErrorCode.NP_E_OK && operator.value) {
                        if (operator.value.constructor != Array) {
                            operator.value = [operator.value];
                        }

                        var deviceList = new Array();
                        for (var i = 0; i < operator.value.length; i++) {
                            var deviceHandle = operator.value[i];
                            var device = NPCCILY.NPCCSDKCommon.GetDeviceInfoByDeviceHandle(connectId, deviceHandle);
                            if (device && device instanceof NPCCStruct.DeviceStruct)
                            {
                                deviceList.push(device);
                            }
                        }
                        return new NPCCStruct.ReturnValueStruct(operator.errorCode, deviceList || new Array());
                    }
                    else {
                        return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                    }
                }
            }
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 获取所有设备下的子资源
     * @param connectId {string} [in] 连接ID
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示获取失败
     * @see 调用该方法，调用成功后不返回任何值，只是将平台数据获取到本地缓存，后续还需要继续调用NPCCILY.GetAllResList或NPCCILY.GetResList方法来获取子资源
     */
    ForkResList: function (connectId) {
        try
        {
            if (!NPCCILY.Plug.inited)
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }
            if (!connectId || !NPCCILY.serverMap.get(connectId))
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
            else
            {
                var globalData = NPCCILY.serverMap.get(connectId);
                if (globalData instanceof NPCCStruct.InitGlobalDataStruct)
                {
                    var operator = NPCCIF.ForkResList(NPCCILY.Plug.ccPlugin, globalData.hServer);
                    if (operator.errorCode == ErrorCode.NP_E_OK)
                    {
                        // 获取所有子资源成功
                    }
                    else
                    {
                        // 获取所有子资源失败
                    }
                    return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                }
            }
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 获取所有设备下的子资源
     * @param connectId {string} [in] 连接ID
     * @param deviceList {Object[]} [in] 设备列表，是个数组，数据类型为NPCCStruct.DeviceStruct，即调用NPCCILY.ForkPUList方法返回的值
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示获取失败
     */
    GetAllResList: function (connectId, deviceList) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }
            if (!connectId || !NPCCILY.serverMap.get(connectId)) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
            else {
                var globalData = NPCCILY.serverMap.get(connectId);
                if (globalData instanceof NPCCStruct.InitGlobalDataStruct) {
                    for (var i = 0; i < deviceList.length; i++) {
                        var device = deviceList[i];
                        if (device instanceof NPCCStruct.DeviceStruct) {
                            var operator = NPCCILY.GetResList(connectId, deviceList[i]);
                            if (operator.errorCode != ErrorCode.NP_E_OK) {
                                return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                            }
                        }
                    }
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
                }
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_RES_ILLEGAL);
            }
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 获取指定设备的子资源
     * @param connectId {string} [in] 连接ID
     * @param device {NPCCStruct.DeviceStruct} [in] 设备资源
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示获取失败
     * @see 该方法调用成功且该设备下分配有子资源，则device.resList会有值
     */
    GetResList: function (connectId, device) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }
            if (!connectId || !NPCCILY.serverMap.get(connectId)) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
            else {
                var globalData = NPCCILY.serverMap.get(connectId);
                if (globalData instanceof NPCCStruct.InitGlobalDataStruct) {
                    if (device instanceof NPCCStruct.DeviceStruct) {
                        var operator = NPCCIF.COMMON_GetChildren(NPCCILY.Plug.ccPlugin, device.handle);
                        if (operator.errorCode == ErrorCode.NP_E_OK && operator.value) {
                            if (operator.value.constructor != Array) {
                                operator.value = [operator.value];
                            }
                            var resList = new Array();
                            for (var i = 0; i < operator.value.length; i++) {
                                var resHandle = operator.value[i];
                                var res = NPCCILY.NPCCSDKCommon.GetResInfoByResHandle(connectId, resHandle);
                                if (res) {
                                    if (res instanceof NPCCStruct.CameraStruct) {
                                        resList.push(res);
                                    }
                                    else if (res instanceof NPCCStruct.AudioStruct) {
                                        resList.push(res);
                                    }
                                    else if (res instanceof NPCCStruct.TalkbackStruct) {
                                        resList.push(res);
                                    }
                                    else if (res instanceof NPCCStruct.LocationStruct) {
                                        resList.push(res);
                                    }
                                    else if (res instanceof NPCCStruct.PTZStruct) {
                                        resList.push(res);
                                    }
                                }
                            }
                            device.resList = resList;
                            return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                        }
                        else {
                            return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                        }
                    }
                }
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_RES_ILLEGAL);
            }
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 获取一个设备
     * @param connectId {string} [in] 连接ID
     * @param did {string} [in] 域id
     * @param puid {string} [in] 设备puid
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是设备详细信息，看NPCCStruct.DeviceStruct，否则表示获取失败
     */
    ForkOnePU: function (connectId, did, puid) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }
            if (!connectId || !NPCCILY.serverMap.get(connectId)) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
            else {
                var globalData = NPCCILY.serverMap.get(connectId);
                if (globalData instanceof NPCCStruct.InitGlobalDataStruct) {
                    var operator = NPCCIF.ForkOnePU(NPCCILY.Plug.ccPlugin, globalData.hServer, did, puid);
                    if (operator.errorCode == ErrorCode.NP_E_OK) {
                        var deviceHandle = operator.value;
                        var device = NPCCILY.NPCCSDKCommon.GetDeviceInfoByDeviceHandle(connectId, deviceHandle);
                        if (device && device instanceof NPCCStruct.DeviceStruct) {
                            NPCCILY.GetResList(connectId, device);
                        }
                        return new NPCCStruct.ReturnValueStruct(operator.errorCode, device);
                    }
                    else {
                        return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                    }
                }
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_RES_ILLEGAL);
            }
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 获取当前用户的ID
     * @param connectId {string} [in] 连接ID
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是用户ID，否则表示获取失败
     */
    GetUID: function (connectId) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }
            if (!connectId || !NPCCILY.serverMap.get(connectId)) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
            else {
                var globalData = NPCCILY.serverMap.get(connectId);
                if (globalData instanceof NPCCStruct.InitGlobalDataStruct) {
                    var operator = NPCCIF.GetUID(NPCCILY.Plug.ccPlugin, globalData.hServer);
                    if (ErrorCode.CLIENT_SUCCEEDED(operator.errorCode) && operator.value) {
                        return new NPCCStruct.ReturnValueStruct(operator.errorCode, operator.value);
                    }
                    else {
                        return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                    }
                }
            }
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 获取当前用户下的所有子用户信息
     * @param connectId connectId {string} [in] 连接ID
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是子用户数组，否则表示获取失败
     * @see 获取成功后，value返回的是所有子用户信息，是个数组，数据类型为NPCCStruct.UserDetailInfoStruct
     */
    GetUserList: function (connectId) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }
            if (!connectId || !NPCCILY.serverMap.get(connectId)) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
            else {
                var globalData = NPCCILY.serverMap.get(connectId);
                if (globalData instanceof NPCCStruct.InitGlobalDataStruct) {
                    var operator = NPCCIF.GetUserList(NPCCILY.Plug.ccPlugin, globalData.hServer);
                    if (operator.errorCode == ErrorCode.NP_E_OK && operator.value) {
                        if (operator.value.constructor != Array)
                        {
                            operator.value = [operator.value];
                        }

                        var userList = new Array();
                        for (var i = 0; i < operator.value.length; i++)
                        {
                            var user = operator.value[i];
                            userList.push(user);
                        }
                        return new NPCCStruct.ReturnValueStruct(operator.errorCode, userList || new Array());
                    }
                    else {
                        return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                    }
                }
            }
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 添加一个新的用户
     * @param connectId {string} [in] 连接ID
     * @param uiParentIndex{string} [in] 父用户ID
     * @param username {string} [in] 用户名
     * @param password {string} [in] 用户登录密码
     * @param ucUserType {int} [in] 用户类型，可以取值NPCCEnum.UserType.UserType_Normal和NPCCEnum.UserType.UserType_Group
     * @param desc {string} [in] 用户描述
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的新加的用户ID，否则表示添加失败
     * @see 该方法添加的用户一律为当前登录用户的子用户，当前登录用户可以为这个子用户分配设备
     */
    AddUser: function (connectId, uiParentIndex, username, password, ucUserType, desc) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }
            if (!connectId || !NPCCILY.serverMap.get(connectId)) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
            else {
                var globalData = NPCCILY.serverMap.get(connectId);
                if (globalData instanceof NPCCStruct.InitGlobalDataStruct) {
                    var operator = NPCCIF.AddUser(NPCCILY.Plug.ccPlugin, globalData.hServer, uiParentIndex, username, password,
                        ucUserType, desc);
                    if (ErrorCode.CLIENT_SUCCEEDED(operator.errorCode) && operator.value){
                        return new NPCCStruct.ReturnValueStruct(operator.errorCode, operator.value);
                    }
                    return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                }
            }
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 修改用户信息
     * @param connectId {string} [in] 连接ID
     * @param uiIndex {int} [in] 用户ID
     * @param username {string} [in] 用户名
     * @param password {string} [in] 用户登录密码
     * @param desc {string} [in] 用户描述
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示修改失败
     */
    ModifyUser: function (connectId, uiIndex, username, password, desc) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }
            if (!connectId || !NPCCILY.serverMap.get(connectId)) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
            else {
                var globalData = NPCCILY.serverMap.get(connectId);
                if (globalData instanceof NPCCStruct.InitGlobalDataStruct) {
                    var operator = NPCCIF.ModifyUser(NPCCILY.Plug.ccPlugin, globalData.hServer, uiIndex,
                        username, password, desc);
                    return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                }
            }
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 删除用户
     * @param connectId {string} [in] 连接ID
     * @param uiIndex {int} [in] 用户ID
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示删除失败
     */
    DeleteUser: function (connectId, uiIndex) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }
            if (!connectId || !NPCCILY.serverMap.get(connectId)) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
            else {
                var globalData = NPCCILY.serverMap.get(connectId);
                if (globalData instanceof NPCCStruct.InitGlobalDataStruct) {
                    var operator = NPCCIF.DeleteUser(NPCCILY.Plug.ccPlugin, globalData.hServer, uiIndex);
                    return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                }
            }
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 获取用户资源
     * @param connectId {string} [in] 连接ID
     * @param uiIndex {int} [in] 用户ID
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是资源ID数组（包括设备ID和子资源ID），否则表示获取失败
     */
    GetUserRes: function (connectId, uiIndex) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }
            if (!connectId || !NPCCILY.serverMap.get(connectId)) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
            else {
                var globalData = NPCCILY.serverMap.get(connectId);
                if (globalData instanceof NPCCStruct.InitGlobalDataStruct) {
                    var operator = NPCCIF.GetUserRes(NPCCILY.Plug.ccPlugin, globalData.hServer, uiIndex);
                    if (ErrorCode.CLIENT_SUCCEEDED(operator.errorCode) && operator.value){
                        return new NPCCStruct.ReturnValueStruct(operator.errorCode, operator.value);
                    }
                    return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                }
            }
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 添加用户资源
     * @param connectId {string} [in] 连接ID
     * @param resIDList {Array} [in] 设备资源ID数组，底层会自动添加子资源，注意是设备资源ID非子资源ID
     * @param uiIndex {int} [in] 用户ID
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示添加失败
     */
    AddUserRes: function (connectId, uiIndex, resIDList) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }
            if (!connectId || !NPCCILY.serverMap.get(connectId)) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
            else {
                var globalData = NPCCILY.serverMap.get(connectId);
                if (globalData instanceof NPCCStruct.InitGlobalDataStruct) {
                    var operator = NPCCIF.AddUserRes(NPCCILY.Plug.ccPlugin, globalData.hServer, uiIndex, resIDList);
                    return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                }
            }
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 删除用户资源
     * @param connectId {string} [in] 连接ID
     * @param resIDList {Array} [in] 设备资源ID数组，底层会自动删除子资源，注意：设备资源ID非子资源ID
     * @param uiIndex {int} [in] 用户ID
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示删除失败
     */
    RemoveUserRes: function (connectId, uiIndex, resIDList) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }
            if (!connectId || !NPCCILY.serverMap.get(connectId)) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
            else {
                var globalData = NPCCILY.serverMap.get(connectId);
                if (globalData instanceof NPCCStruct.InitGlobalDataStruct) {
                    var operator = NPCCIF.RemoveUserRes(NPCCILY.Plug.ccPlugin, globalData.hServer, uiIndex, resIDList);
                    return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                }
            }
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * CC插件事件管理
     * @constructor
     */
    CCNotifyManager : {
        Store : new NPCCUtils.Hash(),
        /**
         * 清空事件, NPCCILY.Free时调用一次即可
         * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示清空失败
         */
        Clear : function () {
            try {
                if (!NPCCILY.Plug.inited) {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
                }
                if (NPCCILY.CCNotifyManager.Store && NPCCILY.CCNotifyManager.Store instanceof NPCCUtils.Hash) {
                    NPCCILY.CCNotifyManager.Store.each
                    (
                        function(item, index) {
                            if (NPCCILY.Plug.ccPlugin != null) {
                                NPCCIF.DetachObjectEvent(NPCCILY.Plug.ccPlugin, item.value.name, item.value.callback);
                            }
                        }
                    );
                    NPCCILY.CCNotifyManager.Store = new NPCCUtils.Hash();
                }
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
            }
            catch(e) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
            }
        },

        /**
         * 添加绑定事件
         * @param name {NPCCEnum.CCObjectNotify} [in] 事件名称，跟底层插件方法名必须保持一致，不得私自修改
         * @param callback {function} [in] 回调函数
         * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示添加失败
         */
        Add : function (name, callback) {
            try {
                if (!NPCCILY.Plug.inited) {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
                }

                if (!callback || typeof callback != "function") {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
                }
                var found = false;
                for (var key in NPCCEnum.CCObjectNotify) {
                    var node = NPCCEnum.CCObjectNotify[key];
                    if (node == name) {
                        found = true;
                        break;
                    }
                }
                if (!name || !found) {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
                }
                if (!NPCCILY.CCNotifyManager.Store.get(name)) {
                    var evtCallBack = function(args1, args2, args3, args4) {
                        try {
                            var _ncnStruct;
                            switch(name) {
                                case NPCCEnum.CCObjectNotify.event_notify :
                                    _ncnStruct = new NPCCStruct.NotifyStruct
                                    (
                                        name, // 事件方法名
                                        args1, // 流句柄
                                        null,
                                        args2, // 错误码
                                        (args3 ? eval("("+args3+")") : "") // 事件信息
                                    );
                                    break;
                                case NPCCEnum.CCObjectNotify.stream_status_notify :
                                    _ncnStruct = new NPCCStruct.NotifyStruct
                                    (
                                        name, // 事件方法名
                                        args1, // 流句柄
                                        args2, // 流进度
                                        args3, // 错误码
                                        null
                                    );
                                    break;
                                case NPCCEnum.CCObjectNotify.call_stream_status_notify :
                                    _ncnStruct = new NPCCStruct.NotifyStruct
                                    (
                                        name, // 事件方法名
                                        args1, // 流句柄
                                        null,
                                        args3, // 错误码
                                        {
                                            type: args2, // 类型(CALL = 1, TALK=2)
                                        }
                                    );
                                    break;
                                case NPCCEnum.CCObjectNotify.location_data_notify :
                                    _ncnStruct = new NPCCStruct.NotifyStruct
                                    (
                                        name, // 事件方法名
                                        args1, // 流句柄
                                        null,
                                        null,
                                        (args2 ? eval("("+args2+")") : "") // 定位数据
                                    );
                                    break;
                            }
                            if (typeof _ncnStruct != "undefined") {
                                callback(_ncnStruct);
                            }
                        }
                        catch(ee) {
                            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
                        }
                    };
                    var operator = NPCCIF.AttachObjectEvent(NPCCILY.Plug.ccPlugin, name, evtCallBack);
                    if (operator.errorCode == ErrorCode.NP_E_OK) {
                        // 把绑定的信息记录下来
                        NPCCILY.CCNotifyManager.Store.set
                        (
                            name,
                            {
                                key : name,
                                callback : evtCallBack || function() {},
                                active : true
                            }
                        );
                    }
                    else {
                        return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
                    }
                }
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
            }
            catch(e) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
            }
        },

        /**
         * 移除绑定事件
         * @param name {NPCCEnum.CCObjectNotify} [in] 事件名称
         * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示移除失败
         */
        Remove : function (name /*, callback */) {
            try {
                if (!NPCCILY.Plug.inited) {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
                }

                var found = false;
                for (var key in NPCCEnum.CCObjectNotify) {
                    var node = NPCCEnum.CCObjectNotify[key];
                    if (node == name) {
                        found = true;
                        break;
                    }
                }

                if (!name || !found) {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
                }

                if (NPCCILY.CCNotifyManager.Store.get(name)) {
                    var _ncevtNode = NPCCILY.CCNotifyManager.Store.get(name);
                    if (_ncevtNode.key == name && typeof _ncevtNode.callback == "function") {
                        var operator = NPCCIF.DetachObjectEvent(NPCCILY.Plug.ccPlugin, name, _ncevtNode.callback);
                        if (operator.errorCode == ErrorCode.NP_E_OK) {
                            // 把绑定的信息移除
                            NPCCILY.CCNotifyManager.Store.remove(name);
                        }
                        else {
                            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
                        }
                    }
                }
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
            }
            catch(e) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
            }
        },

        /**
         * 更新绑定事件
         * @param name {NPCCEnum.CCObjectNotify} [in] 事件名称
         * @param callback {function} [in] 回调函数
         * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示更新失败
         */
        Update : function (name, callback) {
            try {
                var operator = NPCCILY.CCNotifyManager.Remove(name);
                if (operator.errorCode != ErrorCode.NP_E_OK) {
                    return operator;
                }
                return NPCCILY.CCNotifyManager.Add(name, callback);
            }
            catch(e) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
            }
        },

        end : true
    },

    /**
     * 内部公共方法
     * @hideconstructor
     */
    NPCCSDKCommon: {
        /**
         * 根据域句柄获取域基本信息
         * @param connectId {string} [in] 连接ID
         * @param domainHandle {Object} [in] 域句柄
         * @returns {NPCCStruct.ReturnValueStruct}
         */
        GetDomainInfoByDomainHandle: function (connectId, domainHandle) {
            try {
                if (!connectId || !NPCCILY.serverMap.get(connectId)) {
                    return null;
                }

                if(!domainHandle) {
                    return null;
                }
                else {
                    var _infors = [
                        {
                            _method: "DOMAIN_GetID", _property: "id", _value: ""
                        },
                        {
                            _method: "DOMAIN_GetDID", _property: "did", _value: ""
                        },
                        {
                            _method: "DOMAIN_GetName", _property: "name", _value: ""
                        },
                        {
                            _method: "DOMAIN_GetParentID", _property: "parentID", _value: ""
                        },
                        {
                            _method: "DOMAIN_GetDesc", _property: "desc", _value: ""
                        },
                        {
                            _method: "", _property: "handle", _value: domainHandle, _active: false
                        }
                    ];

                    var globalData = NPCCILY.serverMap.get(connectId),
                        domainStruct = new NPCCStruct.DomainStruct(),
                        _errorFlag = false;

                    for(var i = 0; i < _infors.length; i++) {
                        var _infor = _infors[i];

                        if(_infor._active !== false) {
                            if(typeof NPCCIF[_infor._method] != "undefined") {
                                var operator = NPCCIF[_infor._method](NPCCILY.Plug.ccPlugin, domainHandle);
                                if(ErrorCode.CLIENT_SUCCEEDED(operator.errorCode)) {
                                    _infor._value = operator.value;
                                }
                                else {
                                    _errorFlag = true;
                                    break;
                                }
                            }
                        }
                        if(typeof domainStruct[_infor._property] != "undefined") {
                            domainStruct[_infor._property] = _infor._value;
                        }
                    }

                    return _errorFlag == true ? null : domainStruct;
                }
            }
            catch(e) {
                return null;
            }
        },

        /**
         * 根据设备资源句柄获取设备资源基本信息
         * @param connectId {string} [in] 连接ID
         * @param deviceHandle {Object} [in] 设备资源句柄
         * @returns {NPCCStruct.ReturnValueStruct}
         */
        GetDeviceInfoByDeviceHandle: function (connectId, deviceHandle) {
            try {
                if (!connectId || !NPCCILY.serverMap.get(connectId)) {
                    return null;
                }

                if(!deviceHandle) {
                    return null;
                }
                else {
                    var _infors = [
                        {
                            _method: "COMMON_GetDID", _property: "did", _value: ""
                        },
                        {
                            _method: "COMMON_GetResID", _property: "resID", _value: ""
                        },
                        {
                            _method: "COMMON_GetPUID", _property: "puid", _value: ""
                        },
                        {
                            _method: "COMMON_GetResType", _property: "resType", _value: ""
                        },
                        {
                            _method: "COMMON_GetResIdx", _property: "resIdx", _value: ""
                        },
                        {
                            _method: "COMMON_IsOnline", _property: "bOnline", _value: ""
                        },
                        {
                            _method: "COMMON_GetName", _property: "name", _value: ""
                        },
                        {
                            _method: "COMMON_GetDesc", _property: "desc", _value: ""
                        },
                        {
                            _method: "COMMON_IsEnable", _property: "bEnable", _value: ""
                        },
                        {
                            _method: "COMMON_GetModelType", _property: "modelType", _value: ""
                        },
                        {
                            _method: "DEV_GetModel", _property: "modelName", _value: ""
                        },
                        {
                            _method: "DEV_GetSoftwareVersion", _property: "softwareVersion", _value: ""
                        },
                        {
                            _method: "DEV_GetHardwareVersion", _property: "hardwareVersion", _value: ""
                        },
                        {
                            _method: "COMMON_GetLongitude", _property: "longitude", _value: ""
                        },
                        {
                            _method: "COMMON_GetLatitude", _property: "latitude", _value: ""
                        },
                        {
                            _method: "DEV_GetDeviceSN", _property: "deviceID", _value: ""
                        },
                        {
                            _method: "", _property: "handle", _value: deviceHandle, _active: false
                        }
                    ];
                    var globalData = NPCCILY.serverMap.get(connectId),
                        deviceStruct = new NPCCStruct.DeviceStruct(),
                        _errorFlag = false;
                    for(var i = 0; i < _infors.length; i++) {
                        var _infor = _infors[i];

                        if(_infor._active !== false) {
                            if(typeof NPCCIF[_infor._method] != "undefined") {
                                var operator = NPCCIF[_infor._method](NPCCILY.Plug.ccPlugin, deviceHandle);
                                if(ErrorCode.CLIENT_SUCCEEDED(operator.errorCode)) {
                                    _infor._value = operator.value;
                                }
                                else {
                                    _errorFlag = true;
                                    break;
                                }
                            }
                        }
                        if(typeof deviceStruct[_infor._property] != "undefined") {
                            deviceStruct[_infor._property] = _infor._value;
                        }
                    }
                    return _errorFlag == true ? null : deviceStruct;
                }
            }
            catch(e) {
                return null;
            }
        },

        /**
         * 根据子资源句柄获取子资源基本信息
         * @param connectId {string} [in] 连接ID
         * @param resHandle {Object} [in] 子资源句柄
         * @returns {NPCCStruct.ReturnValueStruct}
         */
        GetResInfoByResHandle: function (connectId, resHandle) {
            try {
                if (!connectId || !NPCCILY.serverMap.get(connectId)) {
                    return null;
                }

                if(!resHandle) {
                    return null;
                }
                else {
                    var _infors = [
                        {
                            _method: "COMMON_GetResType", _property: "resType", _value: "" // 放在第一个，下面需要这个值
                        },
                        {
                            _method: "COMMON_GetDID", _property: "did", _value: ""
                        },
                        {
                            _method: "COMMON_GetResID", _property: "resID", _value: ""
                        },
                        {
                            _method: "COMMON_GetPUID", _property: "puid", _value: ""
                        },
                        {
                            _method: "COMMON_GetResIdx", _property: "resIdx", _value: ""
                        },
                        {
                            _method: "COMMON_IsOnline", _property: "bOnline", _value: ""
                        },
                        {
                            _method: "COMMON_GetName", _property: "name", _value: ""
                        },
                        {
                            _method: "COMMON_GetDesc", _property: "desc", _value: ""
                        },
                        {
                            _method: "COMMON_IsEnable", _property: "bEnable", _value: ""
                        },
                        {
                            _method: "", _property: "handle", _value: resHandle, _active: false
                        }
                    ];
                    var globalData = NPCCILY.serverMap.get(connectId),
                        _errorFlag = false;

                    var resStruct = null;
                    for(var i = 0; i < _infors.length; i++) {
                        var _infor = _infors[i];
                        if(_infor._active !== false) {
                            if(typeof NPCCIF[_infor._method] != "undefined") {
                                var operator = NPCCIF[_infor._method](NPCCILY.Plug.ccPlugin, resHandle);
                                if(ErrorCode.CLIENT_SUCCEEDED(operator.errorCode)) {
                                    _infor._value = operator.value;
                                }
                                else {
                                    _errorFlag = true;
                                    break;
                                }
                            }
                        }

                        if (i == 0) {
                            if (Number(_infor._value) == NPCCEnum.ResType.RES_TYPE_CAM) {
                                resStruct = new NPCCStruct.CameraStruct();
                            }
                            else if (Number(_infor._value) == NPCCEnum.ResType.RES_TYPE_AUD) {
                                resStruct = new NPCCStruct.AudioStruct();
                            }
                            else if (Number(_infor._value) == NPCCEnum.ResType.RES_TYPE_TBK) {
                                resStruct = new NPCCStruct.TalkbackStruct();
                            }
                            else if (Number(_infor._value) == NPCCEnum.ResType.RES_TYPE_LOC) {
                                resStruct = new NPCCStruct.LocationStruct();
                            }
                            else if (Number(_infor._value) == NPCCEnum.ResType.RES_TYPE_PTZ) {
                                resStruct = new NPCCStruct.PTZStruct();
                            }
                            else {
                                ;
                            }
                        }

                        if(typeof resStruct[_infor._property] != "undefined") {
                            resStruct[_infor._property] = _infor._value;
                        }
                    }
                    return _errorFlag == true ? null : resStruct;
                }
            }
            catch(e) {
                // var name = e.name;
                // var message = e.message;
                return null;
            }
        },

        /**
         * 获取CC响应
         * @param connectId {string} [in] 连接ID
         * @param _method {string} [in] 方法名称
         * @param resHandle {Object} [in] 资源句柄
         * @returns {NPCCStruct.ReturnValueStruct}
         */
        GetCCResponse : function (connectId, _method , resHandle/* , ?... */ )
        {
            try {
                if (!NPCCILY.Plug.inited) {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
                }

                if (!connectId || !NPCCILY.serverMap.get(connectId)) {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECT_FAILED);
                }
                if (!_method) {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
                }

                var globalData = NPCCILY.serverMap.get(connectId);
                var _argsArr = new Array(_method, NPCCILY.Plug.ccPlugin, resHandle);
                var _args = arguments || [],
                    _argslen = _args.length;
                if (_argslen >= 3) {
                    // 资源是否在线
                    var isOnline_operator = NPCCIF.COMMON_IsOnline(NPCCILY.Plug.ccPlugin, resHandle);
                    if (isOnline_operator.errorCode == ErrorCode.NP_E_OK) {
                        if (isOnline_operator.value == 0) {
                            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_PU_OFFLINE);
                        }
                    }
                    else {
                        return isOnline_operator;
                    }
                }

                for (var i = 3; i < _argslen; i++) {
                    if (typeof _args[i] != "object") {
                        _argsArr.push(_args[i]);
                    }
                }

                var operator = new NPCCStruct.ReturnValueStruct();
                // 如果NPCCIF中没有对应接口，那么使用公共接口
                if (typeof NPCCIF[_argsArr[0]] != "undefined") {
                    operator =  NPCCIF[_argsArr[0]].apply(NPCCIF[_argsArr[0]], _argsArr.slice(1));
                }
                else {
                    // 获取CC响应
                    operator = NPCCIF.Common.GetCCResponse.apply(NPCCIF.Common.GetCCResponse,_argsArr);
                }

                // if (ErrorCode.CLIENT_SUCCEEDED(operator.errorCode))
                // {
                //     if (typeof _customParams == "object" && typeof _customParams.returnType != "undefined" && _customParams.returnType.toLowerCase() == "json")
                //     {
                //         if (typeof XML != "undefined" && typeof XML.ObjTree != "undefined")
                //         {
                //             operator.value = (new XML.ObjTree()).parseXML(operator.value);
                //         }
                //     }
                // }
                return operator;
            }
            catch(e) {
                console.log(e.message);
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
            }
        }
    },

    /**
     * 绑定窗口事件
     * @constructor
     */
    WindowAttachEvent: {
        /**
         *
         * @param winObj {NPCCStruct.WindowStruct} 窗口信息对象
         * @param windowEvent {NPCCStruct.WindowEventStruct} 窗口绑定事件对象
         * @constructor
         */
        Init:function (winObj, windowEvent) {
            try
            {
                if (!winObj || !winObj instanceof NPCCStruct.WindowStruct || typeof winObj.pwPlugin == "undefined")
                {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
                }

                if (!windowEvent || !windowEvent instanceof NPCCStruct.WindowEventStruct)
                {
                    windowEvent = new NPCCStruct.WindowEventStruct();
                }

                var _SELF = NPCCILY.WindowAttachEvent;

                // 注册绑定的事件
                var _DW_ATTACH_EVENT = function (_evtObjItem, _evt_cb)
                {
                    if (_evtObjItem.status == true)
                    {
                        var name = _evtObjItem.name;
                        var callback = _evt_cb || _evtObjItem.callback;

                        var _name = "_" + name.toUpperCase();
                        var _callback = function ()
                        {
                            switch(name)
                            {
                                case "lbtn_click" :
                                    if (typeof callback == "function")
                                    {
                                        var notify = new NPCCStruct.NotifyStruct
                                        (
                                            name, // 事件方法名
                                            winObj, // 窗口对象
                                            null,
                                            null,
                                            null
                                        );
                                        callback(notify);
                                    }
                                    break;
                            }
                        };

                        if (typeof winObj.pwPlugin[_name] != "undefined") {
                            // 移除已经注册的事件
                            NPCCIF.DetachObjectEvent(winObj.pwPlugin, name, winObj.pwPlugin[_name]);
                        }

                        // 绑定事件
                        NPCCIF.AttachObjectEvent(winObj.pwPlugin, name, _callback);

                        winObj.pwPlugin[_name] = _callback;
                    }
                };

                for (var _key in windowEvent)
                {
                    (function(key) {
                        if (typeof windowEvent[key] != "undefined")
                        {
                            _DW_ATTACH_EVENT(windowEvent[key]);
                            winObj.pwPlugin["NPP_b_MENU_COMMAND"] = 0;
                        }
                    })(_key);
                }

                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
            }
            catch(e) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
            }
        },

        end : true
    },

    /**
     * 创建窗口
     * @param connectId {string} [in] 连接ID
     * @param containerOrId {string} [in] 窗口插件容器或ID
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value为窗口句柄，否则表示执行失败
     */
    CreateWindow : function(connectId, containerOrId)
    {
        try
        {
            if (!connectId || !NPCCILY.serverMap.get(connectId))
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }

            var container = null;
            if (typeof containerOrId == "object" && typeof containerOrId.id != "undefined")
            {
                container = containerOrId;
            }
            else
            {
                if (typeof containerOrId == "undefined" || containerOrId == null || !document.getElementById(containerOrId))
                {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
                }
                container = document.getElementById(containerOrId);
            }

            var t_wndname = container.id + "_pw";
            container.innerHTML = NPCCILY.Plug.Html.get(NPCCEnum.PluginType.PW).replace(/(@id)|(@name)/g, t_wndname);
            if (!container.firstChild && container.firstChild.id != t_wndname && !document.getElementById(t_wndname))
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
            }

            var pwPlugin = container.firstChild || document.getElementById(t_wndname);
            var options = {
                container : container,
                pwPlugin :  pwPlugin,
                connectId : connectId,
            };

            var winObj = new NPCCStruct.WindowStruct(options);
            pwPlugin.style.border = '0';
            pwPlugin.style.width = '100%';
            pwPlugin.style.height = '100%';

            // 获取窗口插件句柄
            var operator = NPCCIF.GetWindowHandle(winObj.pwPlugin);
            if (operator.errorCode == ErrorCode.NP_E_OK)
            {
                winObj.pwHandle = operator.value;
            }

            if (!winObj || !winObj instanceof NPCCStruct.WindowStruct)
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_WINDOW_FAILED);
            }

            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK, winObj);
        }
        catch (e) {
            var msg = e.message;
            var name = e.name;
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    // ----------------------------------------------------------------------------------------------------------------
    //     Get、Set配置相关
    // ----------------------------------------------------------------------------------------------------------------
    /**
     * 获取视频清晰度
     * @param objWnd {NPCCStruct.WindowStruct} [in] 窗口信息对象
     * @returns {*} (NPCCStruct.ReturnValueStruct) errorCode为0表示成功，value返回的是视频清晰度，否则表示获取失败
     */
    CAM_GetDefinition: function (winObj) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "CAM_GetDefinition", winObj.params.cameraResHandle, NPCCEnum.StreamType.ST_SubStream);
    },

    /**
     * 设置视频清晰度
     * @param objWnd {NPCCStruct.WindowStruct} [in] 窗口信息对象
     * @param definition {int} [in] 清晰度（范围0-100）
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示设置失败
     */
    CAM_SetDefinition: function (winObj, definition) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "CAM_SetDefinition", winObj.params.cameraResHandle, definition,NPCCEnum.StreamType.ST_SubStream);
    },

    /**
     * 获取音频音量
     * @param objWnd {NPCCStruct.WindowStruct} [in] 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是音频音量，否则表示获取失败
     */
    AUD_GetVolume: function (winObj) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "AUD_GetVolume", winObj.params.audioResHandle);
    },

    /**
     * 设置音频音量
     * @param objWnd {NPCCStruct.WindowStruct} [in] 窗口信息对象
     * @param volume {int} [in] 音量（范围0-100）
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功；否则表示设置失败
     */
    AUD_SetVolume: function (winObj, volume) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "AUD_SetVolume", winObj.params.audioResHandle, volume);
    },

    // ----------------------------------------------------------------------------------------------------------------
    //     Exec控制相关
    // ----------------------------------------------------------------------------------------------------------------

    /**
     * 获取对讲资源输入音量
     * @param objWnd {NPCCStruct.WindowStruct} [in] 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是输入音量，否则表示获取失败
     */
    TBK_GetInputVolume: function (winObj) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "TBK_GetInputVolume", winObj.params.talkbackResHandle);
    },

    /**
     * 获取对讲资源输出音量
     * @param objWnd {NPCCStruct.WindowStruct} [in] 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是输出音量，否则表示获取失败
     */
    TBK_GetOutputVolume: function (winObj) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "TBK_GetOutputVolume", winObj.params.talkbackResHandle);
    },

    /**
     * 设置对讲资源输入音量
     * @param objWnd {NPCCStruct.WindowStruct} [in] 窗口信息对象
     * @param volume {int} 音量
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功；否则表示设置失败
     */
    TBK_SetInputVolume: function (winObj, volume) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "TBK_SetInputVolume", winObj.params.talkbackResHandle, volume);
    },

    /**
     * 设置对讲资源输出音量
     * @param objWnd {NPCCStruct.WindowStruct} [in] 窗口信息对象
     * @param volume {int} 音量
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功；否则表示设置失败
     */
    TBK_SetOutputVolume: function (winObj, volume) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "TBK_SetOutputVolume",
            winObj.params.talkbackResHandle, volume);
    },

    /**
     * 云台控制，开始向左转
     * @param objWnd {NPCCStruct.WindowStruct} [in] 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功；否则表示执行失败
     */
    PTZ_StartTurnLeft: function (winObj) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "PTZ_StartTurnLeft", winObj.params.ptzResHandle);
    },

    /**
     * 云台控制，开始向右转
     * @param objWnd {NPCCStruct.WindowStruct} [in] 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功；否则表示执行失败
     */
    PTZ_StartTurnRight: function (winObj) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "PTZ_StartTurnRight", winObj.params.ptzResHandle);
    },

    /**
     * 云台控制，开始向上转
     * @param objWnd {NPCCStruct.WindowStruct} [in] 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功；否则表示执行失败
     */
    PTZ_StartTurnUp: function (winObj) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "PTZ_StartTurnUp", winObj.params.ptzResHandle);
    },

    /**
     * 云台控制，开始向下转
     * @param objWnd {NPCCStruct.WindowStruct} [in] 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功；否则表示执行失败
     */
    PTZ_StartTurnDown: function (winObj) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "PTZ_StartTurnDown", winObj.params.ptzResHandle);
    },

    /**
     * 云台控制，停止转动
     * @param objWnd {NPCCStruct.WindowStruct} [in] 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功；否则表示执行失败
     */
    PTZ_StopTurn: function (winObj) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "PTZ_StopTurn", winObj.params.ptzResHandle);
    },

    // ----------------------------------------------------------------------------------------------------------------
    //     音视频相关
    // ----------------------------------------------------------------------------------------------------------------

    /**
     * 自适应视频窗口
     * @param objWnd {NPCCStruct.WindowStruct} [in] 窗口信息对象
     * @param width {int} [in] 自适应窗口宽度，单位px，或者百分比
     * @param height {int} [in] 自适应窗口高度，单位px，或者百分比
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功；否则表示设置失败
     */
    ResizeWindowDimension : function (objWnd, width, height)
    {
        try {
            if (objWnd && objWnd.pwPlugin) {
                var width = String(width || 0).toLowerCase(),
                    height = String(height || 0).toLowerCase();

                if (width.search("%") == -1 && width.search("px") == -1 && width.search("em") == -1) {
                    width += "px";
                }
                if (height.search("%") == -1 && height.search("px") == -1 && height.search("em") == -1) {
                    height += "px";
                }

                objWnd.pwPlugin.style.width = width;
                objWnd.pwPlugin.style.height = height;

                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
            }
            else {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_WINDOW_NOTEXIST);
            }
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 启动音视频
     * @param winObj {NPCCStruct.WindowStruct} [in] 窗口信息对象
     * @param type {NPCCEnum.StopRealtimePreviewType} [in] 流类型
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功；否则表示启动失败
     */
    StartPreview: function (winObj, type) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }

            if (winObj && winObj.pwHandle) {
                if (isNaN(winObj.params.resIdx) || !NPCCILY.intRex.test(winObj.params.resIdx)) {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INDEX_ERROR);
                }

                var operator = '';
                if (type == NPCCEnum.StopRealtimePreviewType.SREP_VIDEO || type == NPCCEnum.StopRealtimePreviewType.SREP_ALL) {
                    operator = NPCCIF.StartCameraPreview(NPCCILY.Plug.ccPlugin, winObj.params.cameraResHandle, winObj.pwHandle,
                        NPCCEnum.StreamType.ST_SubStream);
                    if (operator.errorCode == ErrorCode.NP_E_OK) {
                        winObj.status.playvideoing = true;
                        winObj.params.mediaHandle = operator.value; // 媒体句柄
                        // 设置是否重绘背景标志
                      // NPCCIF.SetEraseBkgndFlag(winObj.pwPlugin, 1);
                    }
                }

                if (type == NPCCEnum.StopRealtimePreviewType.SREP_AUDIO || type == NPCCEnum.StopRealtimePreviewType.SREP_ALL) {
                    operator = NPCCIF.StartAudioPreview(NPCCILY.Plug.ccPlugin, winObj.params.mediaHandle, winObj.params.audioResHandle);
                    if (operator.errorCode == ErrorCode.NP_E_OK) {
                        winObj.status.playaudioing = true;
                        // NPCCIF.RefreshImage(NPCCILY.Plug.ccPlugin, winObj.params.mediaHandle);
                    }
                }

                return new NPCCStruct.ReturnValueStruct(operator.errorCode);
            }
            else {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_WINDOW_NOTEXIST);
            }
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 停止音视频播放
     * @param winObj {NPCCStruct.WindowStruct} [in] 窗口信息对象
     * @param type {NPCCEnum.StopRealtimePreviewType} [in] 流类型
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功；否则表示停止失败
     */
    StopPreview: function (winObj, type) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }

            if (winObj && winObj.pwHandle) {
                var connectId = winObj.connectId;
                if (connectId && NPCCILY.serverMap.get(connectId)) {
                    if (type == NPCCEnum.StopRealtimePreviewType.SREP_AUDIO) {
                        if (winObj.status.playaudioing) {
                            var operator = NPCCIF.StopPreview(NPCCILY.Plug.ccPlugin, winObj.params.mediaHandle,
                                NPCCEnum.StopRealtimePreviewType.SREP_AUDIO);
                            if (operator.errorCode == ErrorCode.NP_E_OK) {
                                winObj.status.playaudioing = false;
                            }
                            else {
                                return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                            }
                        }
                    }
                    else {
                        if (winObj.status.playvideoing) {
                            var operator = NPCCIF.StopPreview(NPCCILY.Plug.ccPlugin, winObj.params.mediaHandle,
                                NPCCEnum.StopRealtimePreviewType.SREP_VIDEO);
                            if (operator.errorCode == ErrorCode.NP_E_OK) {
                                winObj.status.playvideoing = false;
                                if (winObj.status.isfullscreening) {
                                    NPCCIF.ExitFullScreen(winObj.pwPlugin);
                                }

                                if (winObj.status.playaudioing) {
                                    operator = NPCCIF.StopPreview(NPCCILY.Plug.ccPlugin, winObj.params.mediaHandle,
                                        NPCCEnum.StopRealtimePreviewType.SREP_AUDIO);
                                    if (operator.errorCode == ErrorCode.NP_E_OK) {
                                        winObj.status.playaudioing = false;
                                    }
                                    else {
                                        return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                                    }
                                }
                            }
                            else {
                                return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                            }
                        }

                        // 设置是否重绘背景标志
                        NPCCIF.SetEraseBkgndFlag(winObj.pwPlugin, 0);
                    }
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
                }
                else {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
                }
            }
            else {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_WINDOW_NOTEXIST);
            }
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 开启对讲
     * @param winObj {NPCCStruct.WindowStruct} [in] 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功；否则表示开启失败
     */
    StartTalk : function (winObj) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }

            var connectId = winObj.connectId;
            if (connectId && NPCCILY.serverMap.get(connectId)) {
                if (!winObj.status.playtalking) {
                    // 如果伴音和喊话，则需要全部停止
                    if (winObj.status.playaudioing) {
                        NPCCILY.StopPreview(winObj, NPCCEnum.StopRealtimePreviewType.SREP_AUDIO);
                    }
                    if (winObj.status.playcalling) {
                        NPCCILY.StopCall(winObj);
                    }

                    var operator = NPCCIF.StartTalkPreview(NPCCILY.Plug.ccPlugin, winObj.params.mediaHandle,
                        winObj.params.talkbackResHandle);
                    if (operator.errorCode == ErrorCode.NP_E_OK) {
                        winObj.status.playtalking = true;
                    }
                    return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                }
                else {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_TALK_EXISTED);
                }
            }
            else {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 停止对讲
     * @param winObj {NPCCStruct.WindowStruct} [in] 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功；否则表示停止失败
     */
    StopTalk : function (winObj) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }

            var connectId = winObj.connectId;
            if (connectId && NPCCILY.serverMap.get(connectId)) {
                if (winObj.status.playtalking) {
                    var operator = NPCCIF.StopTalkPreview(NPCCILY.Plug.ccPlugin, winObj.params.mediaHandle,
                        winObj.params.talkbackResHandle);
                    if (operator.errorCode == ErrorCode.NP_E_OK) {
                        winObj.status.playtalking = false;
                    }
                    return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                }
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
            }
            else {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 开启喊话
     * @param winObj {NPCCStruct.WindowStruct} [in] 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功；否则表示开启失败
     */
    StartCall : function (winObj) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }

            var connectId = winObj.connectId;
            if (connectId && NPCCILY.serverMap.get(connectId)) {
                if (!winObj.status.playcalling) {
                    // 如果对讲，需要停止
                    if (winObj.status.playtalking) {
                        NPCCILY.StopTalk(winObj);
                    }

                    var operator = NPCCIF.StartCallPreview(NPCCILY.Plug.ccPlugin, winObj.params.mediaHandle,
                        winObj.params.talkbackResHandle);
                    if (operator.errorCode == ErrorCode.NP_E_OK) {
                        winObj.status.playcalling = true;
                    }
                    return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                }
                else {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CALL_EXISTED);
                }
            }
            else {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 停止喊话
     * @param winObj {NPCCStruct.WindowStruct} [in] 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功；否则表示停止失败
     */
    StopCall : function (winObj) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }

            var connectId = winObj.connectId;
            if (connectId && NPCCILY.serverMap.get(connectId)) {
                if (winObj.status.playcalling) {
                    var operator = NPCCIF.StopCallPreview(NPCCILY.Plug.ccPlugin, winObj.params.mediaHandle,
                        winObj.params.talkbackResHandle);
                    if (operator.errorCode == ErrorCode.NP_E_OK) {
                        winObj.status.playcalling = false;
                    }
                    return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                }

                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
            }
            else {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 启动定位
     * @param winObj(NPCCStruct.WindowStruct) [in] 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功；否则表示启动失败
     */
    StartLocation: function (winObj) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }

            var connectId = winObj.connectId;
            if (connectId && NPCCILY.serverMap.get(connectId)) {
                if (!winObj.status.playlocation) {
                    var operator = NPCCIF.StartLocationPreview(NPCCILY.Plug.ccPlugin, winObj.params.locationResHandle);
                    if (operator.errorCode == ErrorCode.NP_E_OK) {
                        winObj.status.playlocation = true;
                    }
                    return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                }
                else {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_LOCATION_EXISTED);
                }
            }
            else {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 停止定位
     * @param winObj {NPCCStruct.WindowStruct} [in] 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功；否则表示停止失败
     */
    StopLocation: function (winObj) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }

            var connectId = winObj.connectId;
            if (connectId && NPCCILY.serverMap.get(connectId)) {
                if (winObj.status.playlocation) {
                    var operator = NPCCIF.StopLocationPreview(NPCCILY.Plug.ccPlugin, winObj.params.locationResHandle);
                    if (operator.errorCode == ErrorCode.NP_E_OK) {
                        winObj.status.playlocation = false;
                    }
                    return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                }
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
            }
            else {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 全屏显示
     * @param winObj {NPCCStruct.WindowStruct} [in] 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功；否则表示执行失败
     */
    FullScreen: function (winObj) {
        try {
            if (winObj && winObj.pwPlugin) {
                if (winObj.status.playvideoing) {
                    NPCCIF.FullScreen(winObj.pwPlugin);
                    winObj.status.isfullscreening = true;
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
                }
                else {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_WINDOW_NOPLAY);
                }
            }
            else {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_WINDOW_NOTEXIST);
            }
        }
        catch(e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);

        }
    },

    /**
     * 退出全屏
     * @param winObj {NPCCStruct.WindowStruct} [in] 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功；否则表示执行失败
     */
    ExitFullScreen: function (winObj) {
        try {
            if (winObj && winObj.pwPlugin) {
                if (winObj.status.playvideoing) {
                    NPCCIF.ExitFullScreen(winObj.pwPlugin);
                    winObj.status.isfullscreening = false;
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
                }
                else {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_WINDOW_NOPLAY);
                }
            }
            else {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_WINDOW_NOTEXIST);
            }
        }
        catch(e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },
};