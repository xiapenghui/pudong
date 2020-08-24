/**
 * @file RST_WebSdk中间层封装，调用NPCCIF中的方法
 */

/**
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
    /** @property {NPCCUtils.Hash} 存储所有登录平台信息 */
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
     * 初始化插件
     * @param initParam {NPCCStruct.InitParamStruct} 初始化参数
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    Init: function (initParam)
    {
        try
        {
            if (NPCCILY.Plug.inited != false)
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
            }

            if (!initParam || !initParam instanceof NPCCStruct.InitParamStruct)
            {
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
            if (!document.getElementById(NPCCILY.Plug.boxDomId))
            {
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
            if (operator.errorCode == ErrorCode.NP_E_OK)
            {
                NPCCILY.Plug.inited = true;
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
            }
            else
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_UNINITIALIZED);
            }
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
        }
        catch (e)
        {
            alert("excp error = " + e.message + "::" + e.name);
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPPLUG_THREAD);
        }
    },

    /**
     * 释放插件
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    Free: function ()
    {
        try
        {
            if (NPCCILY.Plug.inited == true)
            {
                if (typeof NPCCUtils.Timer != 'undefined' && typeof NPCCUtils.Timer.Stop != 'undefined')
                {
                    NPCCUtils.Timer.Stop();
                }

                var _connKeys = [];
                if (NPCCILY.serverMap && typeof NPCCILY.serverMap.keys == 'function')
                {
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
                if (document.getElementById(NPCCILY.Plug.boxDomId))
                {
                    document.getElementById(NPCCILY.Plug.boxDomId).innerHTML = '';
                }
                NPCCILY.Plug.inited = false;
            }
            else {
                // NPCCILY not inited
            }
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
        }
        catch (e)
        {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_UNLOAD_CCPLUG_FAILED);
        }
    },

    /**
     * 登录平台
     * @param loginParam {NPCCStruct.LoginParamStruct} 登录参数
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + 连接ID
     */
    Login: function (loginParam) {
        try
        {
            if (!NPCCILY.Plug.inited)
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }
            if (!loginParam || !loginParam instanceof NPCCStruct.LoginParamStruct)
            {
                loginParam = new NPCCStruct.LoginParamStruct();
            }

            // 检测当前平台是否已经登录过了
            NPCCILY.serverMap = NPCCILY.serverMap || new NPCCUtils.Hash();
            var _connKeys = NPCCILY.serverMap.keys();
            for (var i = 0; i < _connKeys.length; i++)
            {
                var _connId = _connKeys[i],  _globalData = NPCCILY.serverMap.get(_connId);
                if (_globalData.serverIP == loginParam.ip && _globalData.serverPort == loginParam.port)
                {
                    // 已经登录过了
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTIONID_ALREADY);
                }
            }

            var operator = NPCCIF.Open(NPCCILY.Plug.ccPlugin, loginParam);
            if (operator.errorCode == ErrorCode.NP_E_OK)
            {
                var hServer = operator.value;
                if(loginParam.block)
                {
                    var connectId = new Date().getTime() + "" + parseInt(Math.random() * (9999 - 1000 + 1) + 1000);
                    var globalData = new NPCCStruct.InitGlobalDataStruct(hServer, loginParam);

                    var operator = NPCCIF.IsPlatform(NPCCILY.Plug.ccPlugin, hServer);;
                    if (operator.errorCode == ErrorCode.NP_E_OK)
                    {
                        globalData.bPlatform = operator.value == 1 ? true : false;
                    }

                    NPCCILY.serverMap.set(connectId, globalData);
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK, connectId);
                }
                else
                {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
                }
            }
            else
            {
                return new NPCCStruct.ReturnValueStruct(operator.errorCode);
            }
        }
        catch (e)
        {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 退出平台
     * @param connectId {string} 连接ID，登录平台时返回的
     * @returns {NPCCStruct.ReturnValueStruct} 返回值： 错误码
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
     * @param connectId {string} 连接ID
     * @returns {NPCCStruct.ReturnValueStruct} 返回值： 错误码 + 根域名称
     */
    GetRootDomainName: function (connectId) {
        try
        {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }
            if (!connectId || !NPCCILY.serverMap.get(connectId)) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
            else {
                var globalData = NPCCILY.serverMap.get(connectId);
                if (globalData instanceof NPCCStruct.InitGlobalDataStruct)
                {
                    var operator = NPCCIF.COMMON_GetName(NPCCILY.Plug.ccPlugin, globalData.hServer);
                    if (ErrorCode.CLIENT_SUCCEEDED(operator.errorCode) && operator.value)
                    {
                        return new NPCCStruct.ReturnValueStruct(operator.errorCode, operator.value);
                    }
                    else
                    {
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
     * 获取域
     * @param connectId {string} 连接ID
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + 子域列表
     */
    ForkDomainList: function (connectId) {
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
                    var operator = NPCCIF.ForkDomainList(NPCCILY.Plug.ccPlugin, globalData.hServer);
                    if (operator.errorCode == ErrorCode.NP_E_OK && operator.value)
                    {
                        if (operator.value.constructor != Array)
                        {
                            operator.value = [operator.value];
                        }

                        var domainList = new Array();
                        for (var i = 0; i < operator.value.length; i++)
                        {
                            var domainHandle = operator.value[i];
                            var domain = NPCCIF.NPCCSDKCommon.GetDomainInfoByDomainHandle(connectId, domainHandle);
                            if (domain && domain instanceof NPCCStruct.DomainStruct)
                            {
                                domainList.push(domain);
                            }
                        }
                        return new NPCCStruct.ReturnValueStruct(operator.errorCode, domainList || new Array());
                    }
                    else
                    {
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
     * @param connectId {string} 连接ID
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + 设备列表
     */
    ForkPUList: function (connectId) {
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
                    var operator = NPCCIF.ForkPUList(NPCCILY.Plug.ccPlugin, globalData.hServer);
                    if (operator.errorCode == ErrorCode.NP_E_OK && operator.value)
                    {
                        if (operator.value.constructor != Array)
                        {
                            operator.value = [operator.value];
                        }

                        var deviceList = new Array();
                        for (var i = 0; i < operator.value.length; i++)
                        {
                            var deviceHandle = operator.value[i];
                            var device = NPCCILY.NPCCSDKCommon.GetDeviceInfoByDeviceHandle(connectId, deviceHandle);
                            if (device && device instanceof NPCCStruct.DeviceStruct)
                            {
                                deviceList.push(device);
                            }
                        }
                        return new NPCCStruct.ReturnValueStruct(operator.errorCode, deviceList || new Array());
                    }
                    else
                    {
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
     * 获取所有子资源
     * @param connectId {string} 连接ID
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
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
     * @param connectId {string} 连接ID
     * @param deviceList {Object[]} 设备列表
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    GetAllResList: function (connectId, deviceList) {
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
                    for (var i = 0; i < deviceList.length; i++)
                    {
                        var device = deviceList[i];
                        if (device instanceof NPCCStruct.DeviceStruct)
                        {
                            var operator = NPCCILY.GetResList(connectId, deviceList[i]);
                            if (operator.errorCode != ErrorCode.NP_E_OK)
                            {
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
     * 获取指定设备下的子资源
     * @param connectId {string} 连接ID
     * @param device {NPCCStruct.DeviceStruct} 设备资源
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    GetResList: function (connectId, device) {
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
                    if (device instanceof NPCCStruct.DeviceStruct)
                    {
                        var operator = NPCCIF.COMMON_GetChildren(NPCCILY.Plug.ccPlugin, device.handle);
                        if (operator.errorCode == ErrorCode.NP_E_OK && operator.value)
                        {
                            if (operator.value.constructor != Array)
                            {
                                operator.value = [operator.value];
                            }

                            var resList = new Array();
                            for (var i = 0; i < operator.value.length; i++)
                            {
                                var resHandle = operator.value[i];
                                var res = NPCCILY.NPCCSDKCommon.GetResInfoByResHandle(connectId, resHandle);
                                if (res)
                                {
                                    if (res instanceof NPCCStruct.CameraStruct)
                                    {
                                        resList.push(res);
                                    }
                                    else if (res instanceof NPCCStruct.AudioStruct)
                                    {
                                        resList.push(res);
                                    }
                                    else if (res instanceof NPCCStruct.TalkbackStruct)
                                    {
                                        resList.push(res);
                                    }
                                    else if (res instanceof NPCCStruct.LocationStruct)
                                    {
                                        resList.push(res);
                                    }
                                    else if (res instanceof NPCCStruct.PTZStruct)
                                    {
                                        resList.push(res);
                                    }
                                }
                            }

                            device.resList = resList;
                            return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                        }
                        else
                        {
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
     * 获取平台下的一个设备
     * @param connectId {string} 连接ID
     * @param did {string} 域id
     * @param puid {string} 设备puid
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + 设备资源信息{NPCCStruct.DeviceStruct}
     */
    ForkOnePU: function (connectId, did, puid) {
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
                    var operator = NPCCIF.ForkOnePU(NPCCILY.Plug.ccPlugin, globalData.hServer, did, puid);
                    if (operator.errorCode == ErrorCode.NP_E_OK)
                    {
                        var deviceHandle = operator.value;
                        var device = NPCCILY.NPCCSDKCommon.GetDeviceInfoByDeviceHandle(connectId, deviceHandle);
                        if (device && device instanceof NPCCStruct.DeviceStruct)
                        {
                            NPCCILY.GetResList(connectId, device);
                        }
                        return new NPCCStruct.ReturnValueStruct(operator.errorCode, device);
                    }
                    else
                    {
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
     * CC插件事件管理
     * @constructor
     */
    CCNotifyManager : {
        Store : new NPCCUtils.Hash(),

        /**
         * 清空事件, NPCCILY.Free时调用一次即可
         * @returns {NPCCStruct.ReturnValueStruct}
         */
        Clear : function ()
        {
            try
            {
                if (!NPCCILY.Plug.inited)
                {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
                }
                if (NPCCILY.CCNotifyManager.Store && NPCCILY.CCNotifyManager.Store instanceof NPCCUtils.Hash)
                {
                    NPCCILY.CCNotifyManager.Store.each
                    (
                        function(item, index)
                        {
                            if (NPCCILY.Plug.ccPlugin != null)
                            {
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
         * @param name {NPCCEnum.CCObjectNotify} 事件名称，跟底层插件方法名必须保持一致，不得私自修改
         * @param callback {function} 回调函数
         * @returns {NPCCStruct.ReturnValueStruct}
         */
        Add : function (name, callback)
        {
            try
            {
                if (!NPCCILY.Plug.inited)
                {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
                }

                if (!callback || typeof callback != "function")
                {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
                }

                var found = false;
                for (var key in NPCCEnum.CCObjectNotify)
                {
                    var node = NPCCEnum.CCObjectNotify[key];
                    if (node == name)
                    {
                        found = true;
                        break;
                    }
                }

                if (!name || !found)
                {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
                }

                if (!NPCCILY.CCNotifyManager.Store.get(name))
                {
                    var evtCallBack = function(args1, args2, args3, args4)
                    {
                        try
                        {
                            var _ncnStruct;
                            switch(name)
                            {
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
                    if (operator.errorCode == ErrorCode.NP_E_OK)
                    {
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
                    else
                    {
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
         * @param name {NPCCEnum.CCObjectNotify} 事件名称
         * @returns {NPCCStruct.ReturnValueStruct}
         */
        Remove : function (name /*, callback */)
        {
            try
            {
                if (!NPCCILY.Plug.inited)
                {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
                }

                var found = false;
                for (var key in NPCCEnum.CCObjectNotify)
                {
                    var node = NPCCEnum.CCObjectNotify[key];
                    if (node == name)
                    {
                        found = true;
                        break;
                    }
                }

                if (!name || !found)
                {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
                }

                if (NPCCILY.CCNotifyManager.Store.get(name))
                {
                    var _ncevtNode = NPCCILY.CCNotifyManager.Store.get(name);
                    if (_ncevtNode.key == name && typeof _ncevtNode.callback == "function")
                    {
                        var operator = NPCCIF.DetachObjectEvent(NPCCILY.Plug.ccPlugin, name, _ncevtNode.callback);
                        if (operator.errorCode == ErrorCode.NP_E_OK)
                        {
                            // 把绑定的信息移除
                            NPCCILY.CCNotifyManager.Store.remove(name);
                        }
                        else
                        {
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
         * @param name {NPCCEnum.CCObjectNotify} 事件名称
         * @param callback {function}  回调函数
         * @returns {NPCCStruct.ReturnValueStruct}
         */
        Update : function (name, callback)
        {
            try
            {
                var operator = NPCCILY.CCNotifyManager.Remove(name);
                if (operator.errorCode != ErrorCode.NP_E_OK)
                {
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
     * @constructor
     */
    NPCCSDKCommon: {
        /**
         * 根据域句柄获取域基本信息
         * @param connectId {string} 连接ID
         * @param domainHandle {Object} 域句柄
         * @returns {NPCCStruct.ReturnValueStruct}
         */
        GetDomainInfoByDomainHandle: function (connectId, domainHandle) {
            try
            {
                if (!connectId || !NPCCILY.serverMap.get(connectId))
                {
                    return null;
                }

                if(!domainHandle)
                {
                    return null;
                }
                else
                {
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

                    for(var i = 0; i < _infors.length; i++)
                    {
                        var _infor = _infors[i];

                        if(_infor._active !== false)
                        {
                            if(typeof NPCCIF[_infor._method] != "undefined")
                            {
                                var operator = NPCCIF[_infor._method](NPCCILY.Plug.ccPlugin, domainHandle);
                                if(ErrorCode.CLIENT_SUCCEEDED(operator.errorCode))
                                {
                                    _infor._value = operator.value;
                                }
                                else
                                {
                                    _errorFlag = true;
                                    break;
                                }
                            }
                        }
                        if(typeof domainStruct[_infor._property] != "undefined")
                        {
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
         * @param connectId {string} 连接ID
         * @param deviceHandle {Object} 设备资源句柄
         * @returns {NPCCStruct.ReturnValueStruct}
         */
        GetDeviceInfoByDeviceHandle: function (connectId, deviceHandle) {
            try
            {
                if (!connectId || !NPCCILY.serverMap.get(connectId))
                {
                    return null;
                }

                if(!deviceHandle)
                {
                    return null;
                }
                else
                {
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

                    for(var i = 0; i < _infors.length; i++)
                    {
                        var _infor = _infors[i];

                        if(_infor._active !== false)
                        {
                            if(typeof NPCCIF[_infor._method] != "undefined")
                            {
                                var operator = NPCCIF[_infor._method](NPCCILY.Plug.ccPlugin, deviceHandle);
                                if(ErrorCode.CLIENT_SUCCEEDED(operator.errorCode))
                                {
                                    _infor._value = operator.value;
                                }
                                else
                                {
                                    _errorFlag = true;
                                    break;
                                }
                            }
                        }
                        if(typeof deviceStruct[_infor._property] != "undefined")
                        {
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
         * @param connectId {string} 连接ID
         * @param resHandle {Object} 子资源句柄
         * @returns {NPCCStruct.ReturnValueStruct}
         */
        GetResInfoByResHandle: function (connectId, resHandle) {
            try
            {
                if (!connectId || !NPCCILY.serverMap.get(connectId))
                {
                    return null;
                }

                if(!resHandle)
                {
                    return null;
                }
                else
                {
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
                    for(var i = 0; i < _infors.length; i++)
                    {
                        var _infor = _infors[i];

                        if(_infor._active !== false)
                        {
                            if(typeof NPCCIF[_infor._method] != "undefined")
                            {
                                var operator = NPCCIF[_infor._method](NPCCILY.Plug.ccPlugin, resHandle);
                                if(ErrorCode.CLIENT_SUCCEEDED(operator.errorCode))
                                {
                                    _infor._value = operator.value;
                                }
                                else
                                {
                                    _errorFlag = true;
                                    break;
                                }
                            }
                        }

                        if (i == 0)
                        {
                            if (Number(_infor._value) == NPCCEnum.ResType.RES_TYPE_CAM)
                            {
                                resStruct = new NPCCStruct.CameraStruct();
                            }
                            else if (Number(_infor._value) == NPCCEnum.ResType.RES_TYPE_AUD)
                            {
                                resStruct = new NPCCStruct.AudioStruct();
                            }
                            else if (Number(_infor._value) == NPCCEnum.ResType.RES_TYPE_TBK)
                            {
                                resStruct = new NPCCStruct.TalkbackStruct();
                            }
                            else if (Number(_infor._value) == NPCCEnum.ResType.RES_TYPE_LOC)
                            {
                                resStruct = new NPCCStruct.LocationStruct();
                            }
                            else if (Number(_infor._value) == NPCCEnum.ResType.RES_TYPE_PTZ)
                            {
                                resStruct = new NPCCStruct.PTZStruct();
                            }
                            else
                            {
                                ;
                            }
                        }

                        if(typeof resStruct[_infor._property] != "undefined")
                        {
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
         * @param connectId {string} 连接ID
         * @param _method {string} 方法名称
         * @param resHandle {Object} 资源句柄
         * @returns {NPCCStruct.ReturnValueStruct}
         */
        GetCCResponse : function (connectId, _method , resHandle/* , ?... */ )
        {
            try
            {
                if (!NPCCILY.Plug.inited) {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
                }

                if (!connectId || !NPCCILY.serverMap.get(connectId))
                {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECT_FAILED);
                }
                if (!_method) {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
                }

                var globalData = NPCCILY.serverMap.get(connectId);
                var _argsArr = new Array(_method, NPCCILY.Plug.ccPlugin, resHandle);
                var _args = arguments || [],
                    _argslen = _args.length;

                if (_argslen >= 3)
                {
                    // 资源是否在线
                    var isOnline_operator = NPCCIF.COMMON_IsOnline(NPCCILY.Plug.ccPlugin, resHandle);
                    if (isOnline_operator.errorCode == ErrorCode.NP_E_OK)
                    {
                        if (isOnline_operator.value == 0)
                        {
                            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_PU_OFFLINE);
                        }
                    }
                    else
                    {
                        return isOnline_operator;
                    }
                }

                for (var i = 3; i < _argslen; i++)
                {
                    if (typeof _args[i] != "object")
                    {
                        _argsArr.push(_args[i]);
                    }
                }

                var operator = new NPCCStruct.ReturnValueStruct();
                // 如果NPCCIF中没有对应接口，那么使用公共接口
                if (typeof NPCCIF[_argsArr[0]] != "undefined")
                {
                    operator =  NPCCIF[_argsArr[0]].apply(NPCCIF[_argsArr[0]], _argsArr.slice(1));
                }
                else
                {
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
     * @param connectId {string} 连接ID
     * @param containerOrId {string} 窗口插件容器或ID
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + 窗口信息对象
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
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    // ----------------------------------------------------------------------------------------------------------------
    //     Get、Set配置相关
    // ----------------------------------------------------------------------------------------------------------------
    /**
     * 获取视频清晰度
     * @param objWnd {NPCCStruct.WindowStruct} 窗口信息对象
     * @returns {*} (NPCCStruct.ReturnValueStruct) 返回值：错误码 + 清晰度
     */
    CAM_GetDefinition: function (winObj) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "CAM_GetDefinition", winObj.params.cameraResHandle, NPCCEnum.StreamType.ST_SubStream);
    },

    /**
     * 设置视频清晰度
     * @param objWnd {NPCCStruct.WindowStruct} 窗口信息对象
     * @param definition {int} 清晰度（范围0-100）
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    CAM_SetDefinition: function (winObj, definition) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "CAM_SetDefinition", winObj.params.cameraResHandle, definition,NPCCEnum.StreamType.ST_SubStream);
    },

    /**
     * 获取音频音量
     * @param objWnd {NPCCStruct.WindowStruct} 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + 音量
     */
    AUD_GetVolume: function (winObj) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "AUD_GetVolume", winObj.params.audioResHandle);
    },

    /**
     * 设置音频音量
     * @param objWnd {NPCCStruct.WindowStruct} 窗口信息对象
     * @param volume {int} 音量（范围0-100）
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    AUD_SetVolume: function (winObj, volume) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "AUD_SetVolume", winObj.params.audioResHandle, volume);
    },

    // ----------------------------------------------------------------------------------------------------------------
    //     Exec控制相关
    // ----------------------------------------------------------------------------------------------------------------
    /**
     * 获取对讲资源输入音量
     * @param objWnd {NPCCStruct.WindowStruct} 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + 音量
     */
    TBK_GetInputVolume: function (winObj) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "TBK_GetInputVolume", winObj.params.talkbackResHandle);
    },

    /**
     * 获取对讲资源输出音量
     * @param objWnd {NPCCStruct.WindowStruct} 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + 音量
     */
    TBK_GetOutputVolume: function (winObj) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "TBK_GetOutputVolume", winObj.params.talkbackResHandle);
    },

    /**
     * 设置对讲资源输入音量
     * @param objWnd {NPCCStruct.WindowStruct} 窗口信息对象
     * @param volume {int} 音量
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    TBK_SetInputVolume: function (winObj, volume) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "TBK_SetInputVolume", winObj.params.talkbackResHandle, volume);
    },

    /**
     * 设置对讲资源输出音量
     * @param objWnd {NPCCStruct.WindowStruct} 窗口信息对象
     * @param volume {int} 音量
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    TBK_SetOutputVolume: function (winObj, volume) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "TBK_SetOutputVolume",
            winObj.params.talkbackResHandle, volume);
    },

    /**
     * 云台控制，开始向左转
     * @param objWnd {NPCCStruct.WindowStruct} 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    PTZ_StartTurnLeft: function (winObj) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "PTZ_StartTurnLeft", winObj.params.ptzResHandle);
    },

    /**
     * 云台控制，开始向右转
     * @param objWnd {NPCCStruct.WindowStruct} 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    PTZ_StartTurnRight: function (winObj) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "PTZ_StartTurnRight", winObj.params.ptzResHandle);
    },

    /**
     * 云台控制，开始向上转
     * @param objWnd {NPCCStruct.WindowStruct} 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    PTZ_StartTurnUp: function (winObj) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "PTZ_StartTurnUp", winObj.params.ptzResHandle);
    },

    /**
     * 云台控制，开始向下转
     * @param objWnd {NPCCStruct.WindowStruct} 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    PTZ_StartTurnDown: function (winObj) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "PTZ_StartTurnDown", winObj.params.ptzResHandle);
    },

    /**
     * 云台控制，停止转动
     * @param objWnd {NPCCStruct.WindowStruct} 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    PTZ_StopTurn: function (winObj) {
        return NPCCILY.NPCCSDKCommon.GetCCResponse(winObj.connectId, "PTZ_StopTurn", winObj.params.ptzResHandle);
    },

    // ----------------------------------------------------------------------------------------------------------------
    //     音视频相关
    // ----------------------------------------------------------------------------------------------------------------

    /**
     * 自适应视频窗口
     * @param objWnd {NPCCStruct.WindowStruct} 窗口信息对象
     * @param width {int} 自适应窗口宽度，单位px，或者百分比
     * @param height {int} 自适应窗口高度，单位px，或者百分比
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    ResizeWindowDimension : function (objWnd, width, height)
    {
        try
        {
            if (objWnd && objWnd.pwPlugin)
            {
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
            else
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_WINDOW_NOTEXIST);
            }
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 启动音视频
     * @param winObj {NPCCStruct.WindowStruct} 窗口信息对象
     * @param type {NPCCEnum.StopRealtimePreviewType} 流类型
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    StartPreview: function (winObj, type) {
        try
        {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }

            if (winObj && winObj.pwHandle)
            {
                if (isNaN(winObj.params.resIdx) || !NPCCILY.intRex.test(winObj.params.resIdx))
                {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INDEX_ERROR);
                }

                var operator = '';
                if (type == NPCCEnum.StopRealtimePreviewType.SREP_VIDEO || type == NPCCEnum.StopRealtimePreviewType.SREP_ALL)
                {
                    operator = NPCCIF.StartCameraPreview(NPCCILY.Plug.ccPlugin, winObj.params.cameraResHandle, winObj.pwHandle,
                        NPCCEnum.StreamType.ST_SubStream);
                    if (operator.errorCode == ErrorCode.NP_E_OK)
                    {
                        winObj.status.playvideoing = true;
                        winObj.params.mediaHandle = operator.value; // 媒体句柄
                        // 设置是否重绘背景标志
                      // NPCCIF.SetEraseBkgndFlag(winObj.pwPlugin, 1);
                    }
                }

                if (type == NPCCEnum.StopRealtimePreviewType.SREP_AUDIO || type == NPCCEnum.StopRealtimePreviewType.SREP_ALL)
                {
                    operator = NPCCIF.StartAudioPreview(NPCCILY.Plug.ccPlugin, winObj.params.mediaHandle, winObj.params.audioResHandle);
                    if (operator.errorCode == ErrorCode.NP_E_OK)
                    {
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
        catch (e)
        {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 停止音视频播放
     * @param winObj {NPCCStruct.WindowStruct} 窗口信息对象
     * @param type {NPCCEnum.StopRealtimePreviewType} 流类型
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    StopPreview: function (winObj, type) {
        try
        {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }

            if (winObj && winObj.pwHandle)
            {
                var connectId = winObj.connectId;
                if (connectId && NPCCILY.serverMap.get(connectId))
                {
                    if (type == NPCCEnum.StopRealtimePreviewType.SREP_AUDIO)
                    {
                        if (winObj.status.playaudioing)
                        {
                            var operator = NPCCIF.StopPreview(NPCCILY.Plug.ccPlugin, winObj.params.mediaHandle,
                                NPCCEnum.StopRealtimePreviewType.SREP_AUDIO);
                            if (operator.errorCode == ErrorCode.NP_E_OK)
                            {
                                winObj.status.playaudioing = false;
                            }
                            else
                            {
                                return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                            }
                        }
                    }
                    else
                    {
                        if (winObj.status.playvideoing)
                        {
                            var operator = NPCCIF.StopPreview(NPCCILY.Plug.ccPlugin, winObj.params.mediaHandle,
                                NPCCEnum.StopRealtimePreviewType.SREP_VIDEO);
                            if (operator.errorCode == ErrorCode.NP_E_OK)
                            {
                                winObj.status.playvideoing = false;
                                if (winObj.status.isfullscreening)
                                {
                                    NPCCIF.ExitFullScreen(winObj.pwPlugin);
                                }

                                if (winObj.status.playaudioing)
                                {
                                    operator = NPCCIF.StopPreview(NPCCILY.Plug.ccPlugin, winObj.params.mediaHandle,
                                        NPCCEnum.StopRealtimePreviewType.SREP_AUDIO);
                                    if (operator.errorCode == ErrorCode.NP_E_OK)
                                    {
                                        winObj.status.playaudioing = false;
                                    }
                                    else
                                    {
                                        return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                                    }
                                }
                            }
                            else
                            {
                                return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                            }
                        }

                        // 设置是否重绘背景标志
                        NPCCIF.SetEraseBkgndFlag(winObj.pwPlugin, 0);
                    }
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
                }
                else
                {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
                }
            }
            else
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_WINDOW_NOTEXIST);
            }
        }
        catch (e)
        {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 开启对讲
     * @param winObj {NPCCStruct.WindowStruct} 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    StartTalk : function (winObj) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }

            var connectId = winObj.connectId;
            if (connectId && NPCCILY.serverMap.get(connectId))
            {

                if (!winObj.status.playtalking)
                {
                    // 如果伴音和喊话，则需要全部停止
                    if (winObj.status.playaudioing)
                    {
                        NPCCILY.StopPreview(winObj, NPCCEnum.StopRealtimePreviewType.SREP_AUDIO);
                    }
                    if (winObj.status.playcalling)
                    {
                        NPCCILY.StopCall(winObj);
                    }

                    var operator = NPCCIF.StartTalkPreview(NPCCILY.Plug.ccPlugin, winObj.params.mediaHandle,
                        winObj.params.talkbackResHandle);
                    if (operator.errorCode == ErrorCode.NP_E_OK)
                    {
                        winObj.status.playtalking = true;
                    }
                    return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                }
                else
                {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_TALK_EXISTED);
                }
            }
            else
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
        }
        catch (e)
        {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 停止对讲
     * @param winObj {NPCCStruct.WindowStruct} 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    StopTalk : function (winObj) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }

            var connectId = winObj.connectId;
            if (connectId && NPCCILY.serverMap.get(connectId))
            {
                if (winObj.status.playtalking)
                {
                    var operator = NPCCIF.StopTalkPreview(NPCCILY.Plug.ccPlugin, winObj.params.mediaHandle,
                        winObj.params.talkbackResHandle);
                    if (operator.errorCode == ErrorCode.NP_E_OK)
                    {
                        winObj.status.playtalking = false;
                    }
                    return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                }

                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
            }
            else
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
        }
        catch (e)
        {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 开启喊话
     * @param winObj {NPCCStruct.WindowStruct} 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    StartCall : function (winObj) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }

            var connectId = winObj.connectId;
            if (connectId && NPCCILY.serverMap.get(connectId))
            {
                if (!winObj.status.playcalling)
                {
                    // 如果对讲，需要停止
                    if (winObj.status.playtalking)
                    {
                        NPCCILY.StopTalk(winObj);
                    }

                    var operator = NPCCIF.StartCallPreview(NPCCILY.Plug.ccPlugin, winObj.params.mediaHandle,
                        winObj.params.talkbackResHandle);
                    if (operator.errorCode == ErrorCode.NP_E_OK)
                    {
                        winObj.status.playcalling = true;
                    }
                    return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                }
                else
                {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CALL_EXISTED);
                }
            }
            else
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
        }
        catch (e)
        {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 停止喊话
     * @param winObj {NPCCStruct.WindowStruct} 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    StopCall : function (winObj) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }

            var connectId = winObj.connectId;
            if (connectId && NPCCILY.serverMap.get(connectId))
            {
                if (winObj.status.playcalling)
                {
                    var operator = NPCCIF.StopCallPreview(NPCCILY.Plug.ccPlugin, winObj.params.mediaHandle,
                        winObj.params.talkbackResHandle);
                    if (operator.errorCode == ErrorCode.NP_E_OK)
                    {
                        winObj.status.playcalling = false;
                    }
                    return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                }

                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
            }
            else
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
        }
        catch (e)
        {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 启动定位
     * @param winObj(NPCCStruct.WindowStruct) 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    StartLocation: function (winObj) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }

            var connectId = winObj.connectId;
            if (connectId && NPCCILY.serverMap.get(connectId))
            {
                if (!winObj.status.playlocation)
                {
                    var operator = NPCCIF.StartLocationPreview(NPCCILY.Plug.ccPlugin, winObj.params.locationResHandle);
                    if (operator.errorCode == ErrorCode.NP_E_OK)
                    {
                        winObj.status.playlocation = true;
                    }
                    return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                }
                else
                {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_LOCATION_EXISTED);
                }
            }
            else
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
        }
        catch (e)
        {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 停止定位
     * @param winObj {NPCCStruct.WindowStruct} 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    StopLocation: function (winObj) {
        try {
            if (!NPCCILY.Plug.inited) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INIT_CCPLUG_FAILED);
            }

            var connectId = winObj.connectId;
            if (connectId && NPCCILY.serverMap.get(connectId))
            {
                if (winObj.status.playlocation)
                {
                    var operator = NPCCIF.StopLocationPreview(NPCCILY.Plug.ccPlugin, winObj.params.locationResHandle);
                    if (operator.errorCode == ErrorCode.NP_E_OK)
                    {
                        winObj.status.playlocation = false;
                    }
                    return new NPCCStruct.ReturnValueStruct(operator.errorCode);
                }

                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
            }
            else
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_CONNECTID_ERROR);
            }
        }
        catch (e)
        {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 全屏显示
     * @param winObj {NPCCStruct.WindowStruct} 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    FullScreen: function (winObj) {
        try
        {
            if (winObj && winObj.pwPlugin)
            {
                if (winObj.status.playvideoing)
                {
                    NPCCIF.FullScreen(winObj.pwPlugin);
                    winObj.status.isfullscreening = true;
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
                }
                else
                {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_WINDOW_NOPLAY);
                }
            }
            else
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_WINDOW_NOTEXIST);
            }
        }
        catch(e)
        {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);

        }
    },

    /**
     * 退出全屏
     * @param winObj {NPCCStruct.WindowStruct} 窗口信息对象
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    ExitFullScreen: function (winObj) {
        try
        {
            if (winObj && winObj.pwPlugin)
            {
                if (winObj.status.playvideoing)
                {
                    NPCCIF.ExitFullScreen(winObj.pwPlugin);
                    winObj.status.isfullscreening = false;
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
                }
                else
                {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_WINDOW_NOPLAY);
                }
            }
            else
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_WINDOW_NOTEXIST);
            }
        }
        catch(e)
        {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },
};