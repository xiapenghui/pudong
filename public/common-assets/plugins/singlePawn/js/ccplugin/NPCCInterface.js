/**
 * @file RST_WebSdk底层封装，直接调用插件(CC+PW)的方法
 */

/**
 * @class NPCCIF
 * @autho shaosy
 */
var NPCCIF = {
    /** @property {string} 浏览器信息 */
    age: navigator.userAgent.toLocaleLowerCase(),

    /**
     *******************************************************************************************************************
     **************************************************CC插件方法********************************************************
     *******************************************************************************************************************
     */

    /**
     * 初始化CC插件
     * @param ccPlugin {Object} cc插件句柄
     * @returns {NPCCStruct.ReturnValueStruct}
     */
    Initialize: function (ccPlugin) {
        try {
            if (ccPlugin && typeof ccPlugin.Initialize != 'undefined')
            {
                var operator = ccPlugin.Initialize();
                operator = eval("(" + operator + ")");
                return new NPCCStruct.ReturnValueStruct(Number(operator.E));
            }
            else
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_LOADPLUG_CC);
            }
        }
        catch (e)
        {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 清除CC插件
     * @param ccPlugin {Object} cc插件句柄
     * @returns {NPCCStruct.ReturnValueStruct}
     */
    Terminate : function (ccPlugin) {
        try {
            if (ccPlugin && typeof ccPlugin.Terminate != 'undefined')
            {
                ccPlugin.Terminate();
            }
            else
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_LOADPLUG_NC);
            }
        }
        catch (e)
        {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 登录平台
     * @param ccPlugin {Object} cc插件句柄
     * @param loginParam {NPCCStructLoginParamStruct} 登录参数
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码+服务句柄{Object}
     */
    Open: function (ccPlugin, loginParam) {
        try {
            if (ccPlugin && typeof ccPlugin.Open != 'undefined')
            {
                if (!loginParam || !loginParam instanceof  NPCCStruct.LoginParamStruct)
                {
                    loginParam = new NPCCStruct.LoginParamStruct();
                }
                var operator = ccPlugin.Open(loginParam.ip, loginParam.port, loginParam.username, loginParam.password,
                    loginParam.domain, '', 10, loginParam.block == 1 ? true : false, true,
                    NPCCEnum.ProxyType.ProxyType_NONE, '0.0.0.0', 0, '', '');

                operator = eval("(" + operator + ")") || {};

                return new NPCCStruct.ReturnValueStruct(Number(operator.E), operator.V);
            }
            else
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_LOADPLUG_NC);
            }
        }
        catch (e)
        {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 获取登录状态，如果是阻塞登录，就不需要调用该方法
     * @param ccPlugin {Object} cc插件句柄
     * @param hserver {Object} 服务句柄
     */
    GetConnectStatus: function (ccPlugin, hServer) {
        try {
            if (ccPlugin && typeof ccPlugin.GetConnectStatus != 'undefined')
            {
                if (hServer != "" && hServer != null && typeof hServer != "undefined")
                {
                    var operator =  ccPlugin.GetConnectStatus(hServer);
                    operator = eval("(" + operator + ")") || {};
                    return new NPCCStruct.ReturnValueStruct(Number(operator.E));
                }
                else
                {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_C_E_INVALID_COMMAND);
                }
            }
            else
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_LOADPLUG_NC);
            }
        }
        catch (e)
        {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 退出平台
     * @param ccPlugin {Object} cc插件句柄
     * @param hserver {Object} 服务句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    Close: function (ccPlugin, hServer) {
        try {
            if (ccPlugin && typeof ccPlugin.Close != 'undefined')
            {
                if (hServer != "" && hServer != null && typeof hServer != "undefined")
                {
                    var operator =  ccPlugin.Close(hServer);
                    operator = eval("(" + operator + ")") || {};
                    return new NPCCStruct.ReturnValueStruct(Number(operator.E));
                }
                else
                {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_C_E_INVALID_COMMAND);
                }
            }
            else
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_LOADPLUG_NC);
            }
        }
        catch (e)
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 内部公共方法
     * @constructor
     */
    Common:
    {
        /**
         * 判断接口是否存在
         * @param objectType {NPCCEnum.PluginType} 属于插件类型
         * @param object {Object} 插件句柄
         * @param _method {string} object方法名称
         * @returns {NPCCStruct.ReturnValueStruct}
         */
        CheckObjectInterface : function (objectType, object, _method)
        {
            try
            {
                var objectType = objectType || NPCCEnum.PluginType.CC;
                if (!object)
                {
                    switch (objectType)
                    {
                        case NPCCEnum.PluginType.CC :
                            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_LOADPLUG_CC);
                            break;
                        case NPCCEnum.PluginType.PW :
                            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_LOADPLUG_PW);
                            break;
                    }
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
                }
                if (typeof object[_method] == "undefined")
                {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INTERFACE_UNDEFINED || ErrorCode.NP_E_ERROR);
                }
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
            }
            catch (e) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
            }
        },

        /**
         * 内部使用的方法
         * @private
         */
        __Response : function(_objType, _method, _obj)
        {
            try
            {
                var _minArgsCount = 3;
                switch(_objType)
                {
                    case NPCCEnum.PluginType.CC :
                        _minArgsCount = 3;
                        break;
                    case NPCCEnum.PluginType.PW :
                        _minArgsCount = 2;
                        break;
                }

                var _args = arguments,
                    _argslen = _args.length;

                if (!_method || _argslen < (_minArgsCount + 1))
                {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
                }
                else {
                    var _argsArr = new Array();
                    for (var i = 3; i < _argslen; i++)
                    {
                        _argsArr.push(_args[i]);
                    }

                    var chk_operator = NPCCIF.Common.CheckObjectInterface(_objType, _obj, _method);
                    if (chk_operator.errorCode != ErrorCode.NP_E_OK)
                    {
                        return chk_operator;
                    }

                    var operator = _obj[_method].apply(_obj[_method], _argsArr);
                    if (!operator || typeof operator == "undefined")
                    {
                        return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
                    }

                    switch(_objType)
                    {
                        case NPCCEnum.PluginType.CC :
                            operator = eval("(" + operator + ")") || {};
                            if (operator.E == ErrorCode.NP_E_OK)
                            {
                                if (typeof operator.V == "string")
                                {
                                    operator.V = NPCCUtils.UTF8toUnicode(operator.V);
                                }
                                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK, operator.V);
                            }
                            else
                            {
                                return new NPCCStruct.ReturnValueStruct(Number(operator.E) || ErrorCode.NP_E_ERROR);
                            }
                            break;
                        case NPCCEnum.PluginType.PW :
                            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK, operator);
                            break;
                    }
                }
            }
            catch(e) {
                NPCCUtils.Log(fn, "excp error = " + e.message + "::" + e.name);
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
            }
        },

        /**
         * 获取CC响应
         * @param _method {string} cc插件方法名称
         * @param cc  {Object} cc插件句柄
         * @param handle {Object} 句柄对象，可以为hServer或hRes等
         */
        GetCCResponse : function(_method, cc, handle)
        {
            var _argsArr = [NPCCEnum.PluginType.CC];
            for (var i = 0; i < arguments.length; i++)
            {
                _argsArr.push(arguments[i]);
            }
            return NPCCIF.Common.__Response.apply(this, _argsArr);
        },

        /**
         * 获取PW响应
         * @param _method {string} pw方法名称
         * @param pw {Object} 插件句柄
         */
        GetPWResponse : function(_method, pw)
        {
            var _argsArr = [NPCCEnum.PluginType.PW];
            for (var i = 0; i < arguments.length; i++)
            {
                _argsArr.push(arguments[i]);
            }
            return NPCCIF.Common.__Response.apply(this, _argsArr);
        },

        end : true
    },

    /**
     * 当前登录的是否为平台
     * @param ccPlugin {Object} cc插件句柄
     * @param hServer {Object} 服务句柄
     * @returns {NPCCStruct.ReturnValueStruct}
     */
    IsPlatform: function (ccPlugin, hServer) {
        return NPCCIF.Common.GetCCResponse("IsPlatform", ccPlugin, hServer);
    },

    /**
     * 获取平台的所有域，当前域和所有子域
     * @param ccPlugin {Object} cc插件句柄
     * @param hServer {Object} 服务句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + 子域域列表
     */
    ForkDomainList: function (ccPlugin, hServer) {
        return NPCCIF.Common.GetCCResponse("ForkDomainList", ccPlugin, hServer);
    },

    /**
     * 获取平台下的设备列表
     * @param ccPlugin {Object} cc插件句柄
     * @param hServer {Object} 服务句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + 设备列表
     */
    ForkPUList: function (ccPlugin, hServer) {
        return NPCCIF.Common.GetCCResponse("ForkPUList", ccPlugin, hServer);
    },

    /**
     * 获取平台下的资源列表
     * @param ccPlugin {Object} cc插件句柄
     * @param hServer {Object} 服务句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + 资源列表
     */
    ForkResList: function (ccPlugin, hServer) {
        return NPCCIF.Common.GetCCResponse("ForkResList", ccPlugin, hServer);
    },

    /**
     * 获取平台下的一个设备
     * @param ccPlugin {Object} cc插件句柄
     * @param hServer {Object} 服务句柄
     * @param did {string} 域id
     * @param puid {string} 设备puid
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + 设备句柄
     */
    ForkOnePU: function (ccPlugin, hServer, did , puid) {
        return NPCCIF.Common.GetCCResponse("ForkOnePU", ccPlugin, hServer, did, puid);
    },

    /**
     * 获取域的唯一号
     * @param ccPlugin {Object} cc插件句柄
     * @param hDomain {Object} 域句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + id
     */
    DOMAIN_GetID: function (ccPlugin, hDomain) {
        return NPCCIF.Common.GetCCResponse("DOMAIN_GetID", ccPlugin, hDomain);
    },

    /**
     * 获取域ID
     * @param ccPlugin {Object} cc插件句柄
     * @param hDomain {Object} 域句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + did
     */
    DOMAIN_GetDID: function (ccPlugin, hDomain) {
        return NPCCIF.Common.GetCCResponse("DOMAIN_GetDID", ccPlugin, hDomain);
    },

    /**
     * 获取域名称
     * @param ccPlugin {Object} cc插件句柄
     * @param hDomain {Object} 域句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + name
     */
    DOMAIN_GetName: function (ccPlugin, hDomain) {
        return NPCCIF.Common.GetCCResponse("DOMAIN_GetName", ccPlugin, hDomain);
    },

    /**
     * 获取父域的ID
     * @param ccPlugin {Object} cc插件句柄
     * @param hDomain {Object} 域句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + parentID
     */
    DOMAIN_GetParentID: function (ccPlugin, hDomain) {
        return NPCCIF.Common.GetCCResponse("DOMAIN_GetParentID", ccPlugin, hDomain);
    },

    /**
     * 获取域描述
     * @param ccPlugin {Object} cc插件句柄
     * @param hDomain {Object} 域句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + desc
     */
    DOMAIN_GetDesc: function (ccPlugin, hDomain) {
        return NPCCIF.Common.GetCCResponse("DOMAIN_GetDesc", ccPlugin, hDomain);
    },

    /**
     * 获取指定资源的子资源
     * @param ccPlugin {Object} cc插件句柄
     * @param hRes {Object} 资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + 子资源列表
     */
    COMMON_GetChildren : function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_GetChildren", ccPlugin, hRes);
    },

    /**
     * 获取资源名称
     * @param ccPlugin {Object} cc插件句柄
     * @param hRes {Object} 资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + name
     */
    COMMON_GetName: function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_GetName", ccPlugin, hRes);
    },

    /**
     * 获取资源描述
     * @param ccPlugin {Object} cc插件句柄
     * @param hRes {Object} 资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + desc
     */
    COMMON_GetDesc: function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_GetDesc", ccPlugin, hRes);
    },

    /**
     * 资源是都可用
     * @param ccPlugin {Object} cc插件句柄
     * @param hRes {Object} 资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + bEnable
     */
    COMMON_IsEnable: function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_IsEnable", ccPlugin, hRes);
    },

    /**
     * 获取资源PUID
     * @param ccPlugin {Object} cc插件句柄
     * @param hRes {Object} 资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码+puid
     */
    COMMON_GetPUID: function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_GetPUID", ccPlugin, hRes);
    },

    /**
     * 获取资源ID
     * @param ccPlugin {Object} cc插件句柄
     * @param hRes {Object} 资源句柄
     * @returns {NPCCStruct.ReturnValueStruct}  返回值：错误码+ResID
     */
    COMMON_GetResID: function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_GetResID", ccPlugin, hRes);
    },

    /**
     * 获取资源类型
     * @param ccPlugin {Object} cc插件句柄
     * @param hRes {Object} 资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码+ResType
     */
    COMMON_GetResType: function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_GetResType", ccPlugin, hRes);
    },

    /**
     * 获取资源索引
     * @param ccPlugin {Object} cc插件句柄
     * @param hRes {Object} 资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码+ResIdx
     */
    COMMON_GetResIdx: function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_GetResIdx", ccPlugin, hRes);
    },

    /**
     * 资源是否在线
     * @param ccPlugin {Object} cc插件句柄
     * @param hRes {Object} 资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码+bOnline
     */
    COMMON_IsOnline: function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_IsOnline", ccPlugin, hRes);
    },

    /**
     * 资源所在的域ID
     * @param ccPlugin {Object} 插件句柄
     * @param hRes {Object} 资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码+DID
     */
    COMMON_GetDID: function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_GetDID", ccPlugin, hRes);
    },

    /**
     * 资源型号类型
     * @param ccPlugin {Object} cc插件句柄
     * @param hRes {Object} 资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码+modelType(NPCCEnum.ModelType)
     */
    COMMON_GetModelType: function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_GetModelType", ccPlugin, hRes);
    },

    /**
     * 获取资源所在的纬度
     * @param ccPlugin {Object} cc插件句柄
     * @param hRes {Object} 资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + longitude
     */
    COMMON_GetLongitude: function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_GetLongitude", ccPlugin, hRes);
    },

    /**
     * 获取资源所在的经度
     * @param ccPlugin {Object} cc插件句柄
     * @param hRes {Object} 资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + latitude
     */
    COMMON_GetLatitude: function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_GetLatitude", ccPlugin, hRes);
    },

    /**
     * 获取设备型号
     * @param ccPlugin {Object} cc插件句柄
     * @param hPuRes {Object} 设备句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + modelName
     */
    DEV_GetModel: function (ccPlugin, hPuRes) {
        return NPCCIF.Common.GetCCResponse("DEV_GetModel", ccPlugin, hPuRes);
    },

    /**
     * 获取设备的软件版本号
     * @param ccPlugin {Object} cc插件句柄
     * @param hPuRes {Object} 设备句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + softwareVersion
     */
    DEV_GetSoftwareVersion: function (ccPlugin, hPuRes) {
        return NPCCIF.Common.GetCCResponse("DEV_GetSoftwareVersion", ccPlugin, hPuRes);
    },

    /**
     * 获取设备的硬件版本号
     * @param ccPlugin {Object} cc插件句柄
     * @param hPuRes {Object} 设备句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + hardwareVersion
     */
    DEV_GetHardwareVersion: function (ccPlugin, hPuRes) {
        return NPCCIF.Common.GetCCResponse("DEV_GetHardwareVersion", ccPlugin, hPuRes);
    },

    /**
     * 获取设备的唯一ID
     * @param ccPlugin {Object} cc插件句柄
     * @param hPuRes {Object} 设备句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + deviceID
     */
    DEV_GetDeviceSN: function (ccPlugin, hPuRes) {
        return NPCCIF.Common.GetCCResponse("DEV_GetDeviceSN", ccPlugin, hPuRes);
    },

    /**
     * 获取视频清晰度
     * @param ccPlugin {Object} cc插件句柄
     * @param hCameraRes {Object} 摄像头句柄
     * @param streamType {int} 流类型
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + definition
     */
    CAM_GetDefinition: function (ccPlugin, hCameraRes, streamType) {
        return NPCCIF.Common.GetCCResponse("CAM_GetDefinition", ccPlugin, hCameraRes, streamType);
    },

    /**
     * 设置视频清晰度
     * @param ccPlugin {Object} cc插件句柄
     * @param hCameraRes {Object} 摄像头句柄
     * @param definition {int} 清晰度（范围0-100）
     * @param streamType {int} 流类型
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + 音量
     */
    CAM_SetDefinition: function (ccPlugin, hCameraRes, definition, streamType) {
        return NPCCIF.Common.GetCCResponse("CAM_SetDefinition", ccPlugin, hCameraRes, definition, streamType);
    },

    /**
     * 获取音频音量
     * @param ccPlugin {Object} cc插件句柄
     * @param hAudioRes {Object} 音频句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    AUD_GetVolume: function (ccPlugin, hAudioRes) {
        return NPCCIF.Common.GetCCResponse("AUD_GetVolume", ccPlugin, hAudioRes);
    },

    /**
     * 设置音频音量
     * @param ccPlugin {Object} cc插件句柄
     * @param hAudioRes {Object} 音频句柄
     * @param volume {int} 音量（范围0-100）
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    AUD_SetVolume: function (ccPlugin, hAudioRes, volume) {
        return NPCCIF.Common.GetCCResponse("AUD_SetVolume", ccPlugin, hAudioRes, volume);
    },

    /**
     * 获取对讲资源输入音量
     * @param ccPlugin {Object} cc插件句柄
     * @param hTalkbackRes {Object} 对讲句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + 音量
     */
    TBK_GetInputVolume: function (ccPlugin, hTalkbackRes) {
        return NPCCIF.Common.GetCCResponse("TBK_GetInputVolume", ccPlugin, hTalkbackRes);
    },

    /**
     * 获取对讲资源输出音量
     * @param ccPlugin {Object} cc插件句柄
     * @param hTalkbackRes {Object} 对讲句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + 音量
     */
    TBK_GetOutputVolume: function (ccPlugin, hTalkbackRes) {
        return NPCCIF.Common.GetCCResponse("TBK_GetOutputVolume", ccPlugin, hTalkbackRes);
    },

    /**
     * 设置对讲资源输入音量
     * @param ccPlugin {Object} cc插件句柄
     * @param hTalkbackRes {Object} 对讲句柄
     * @param volume {int} 音量（范围0-100）
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    TBK_SetInputVolume: function (ccPlugin, hTalkbackRes, volume) {
        return NPCCIF.Common.GetCCResponse("TBK_SetInputVolume", ccPlugin, hTalkbackRes, volume);
    },

    /**
     * 设置对讲资源输出音量
     * @param ccPlugin {Object} cc插件句柄
     * @param hTalkbackRes {Object} 对讲句柄
     * @param volume {int} 音量（范围0-100）
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    TBK_SetOutputVolume: function (ccPlugin, hTalkbackRes, volume) {
        return NPCCIF.Common.GetCCResponse("TBK_SetOutputVolume", ccPlugin, hTalkbackRes, volume);
    },

    /**
     * 云台控制，开始向左转
     * @param ccPlugin {Object} cc插件句柄
     * @param hPtzRes {Object} 云台句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    PTZ_StartTurnLeft: function (ccPlugin, hPtzRes) {
        return NPCCIF.Common.GetCCResponse("PTZ_StartTurnLeft", ccPlugin, hPtzRes);
    },

    /**
     * 云台控制，开始向右转
     * @param ccPlugin {Object} cc插件句柄
     * @param hPtzRes {Object} 云台句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    PTZ_StartTurnRight: function (ccPlugin, hPtzRes) {
        return NPCCIF.Common.GetCCResponse("PTZ_StartTurnRight", ccPlugin, hPtzRes);
    },

    /**
     * 云台控制，开始向上转
     * @param ccPlugin {Object} cc插件句柄
     * @param hPtzRes {Object} 云台句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    PTZ_StartTurnUp: function (ccPlugin, hPtzRes) {
        return NPCCIF.Common.GetCCResponse("PTZ_StartTurnUp", ccPlugin, hPtzRes);
    },

    /**
     * 云台控制，开始向下转
     * @param ccPlugin {Object} cc插件句柄
     * @param hPtzRes {Object} 云台句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    PTZ_StartTurnDown: function (ccPlugin, hPtzRes) {
        return NPCCIF.Common.GetCCResponse("PTZ_StartTurnDown", ccPlugin, hPtzRes);
    },

    /**
     * 云台控制，停止转动
     * @param ccPlugin {Object} cc插件句柄
     * @param hPtzRes {Object} 云台句柄
     * @returns {NPCCStruct.ReturnValueStruct}  返回值：错误码
     */
    PTZ_StopTurn: function (ccPlugin, hPtzRes) {
        return NPCCIF.Common.GetCCResponse("PTZ_StopTurn", ccPlugin, hPtzRes);
    },

     // ----------------------------------------------------------------------------------------------------------------
     // 音视频相关
     // ----------------------------------------------------------------------------------------------------------------
    /**
     * 启动视频预览
     * @param ccPlugin {Object} cc插件句柄
     * @param hCameraRes {Object} 摄像头资源句柄
     * @param hWnd {Object} 窗口句柄
     * @param streamType {int} 流类型，取值参照NPCCEnum.StreamType
     * @param alg {int} 视频算法，取值参照NPCCEnum.StreamVideoAlg，只有转码流时有效
     * @param width {int} 视频宽度，只有转码流时有效
     * @param height {int} 视频高度，只有转码流时有效
     * @param frameRate {int} 帧率，只有转码流时有效
     * @param bitRate {int} 码率，只有转码流时有效
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + 媒体库句柄
     */
    StartCameraPreview: function (ccPlugin, hCameraRes, hWnd, streamType, alg, width, height, frameRate, bitRate) {
        return NPCCIF.Common.GetCCResponse("StartCameraPreview", ccPlugin, hCameraRes, hWnd, false,
            (typeof streamType != 'undefined' ? streamType : 1), (typeof alg != 'undefined' ? alg : 1),
            (typeof width != 'undefined' ? width : 0), (typeof height != 'undefined' ? height : 0),
            (typeof frameRate != 'undefined' ? frameRate : 0), (typeof bitRate != 'undefined' ? bitRate : 0), 0, false, 0, 3000);
    },

    /**
     * 启动音频
     * @param ccPlugin {Object} cc插件句柄
     * @param hMedia {Object} 媒体库句柄
     * @param hAudioRes {Object} 音频资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    StartAudioPreview: function (ccPlugin, hMedia, hAudioRes)
    {
        return NPCCIF.Common.GetCCResponse("StartAudioPreview", ccPlugin, hMedia, hAudioRes);
    },

    /**
     * 停止音视频预览
     * @param ccPlugin {Object} cc插件句柄
     * @param hMedia {Object} 媒体库句柄
     * @param type {NPCCEnum.StopRealtimePreviewType} 停止流类型
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    StopPreview: function (ccPlugin, hMedia, type) {
        return NPCCIF.Common.GetCCResponse("StopPreview", ccPlugin, hMedia, type);
    },

    /**
     * 设置播放窗口
     * @param ccPlugin {Object} cc插件句柄
     * @param hMedia {Object} 媒体库句柄
     * @param hWnd {Object} 窗口句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    SetRenderWnd: function (ccPlugin, hMedia, hWnd) {
        return NPCCIF.Common.GetCCResponse("SetRenderWnd", ccPlugin, hMedia, hWnd);
    },

    /**
     * 刷新最后一帧画面
     * @param ccPlugin {Object} cc插件句柄
     * @param hMedia {Object} 媒体库句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    RefreshImage: function (ccPlugin, hMedia) {
        return NPCCIF.Common.GetCCResponse("RefreshImage", ccPlugin, hMedia);
    },

    /**
     * 启动对讲
     * @param ccPlugin {Object} cc插件句柄
     * @param hMedia {Object} 媒体库句柄
     * @param hTalkRes {Object} 对讲资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    StartTalkPreview: function (ccPlugin, hMedia, hTalkRes) {
        return NPCCIF.Common.GetCCResponse("StartTalkPreview", ccPlugin, hMedia, hTalkRes);
    },

    /**
     * 停止对讲
     * @param ccPlugin {Object} cc插件句柄
     * @param hMedia {Object} 媒体库句柄
     * @param hTalkRes {Object} 对讲资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    StopTalkPreview: function (ccPlugin, hMedia, hTalkRes) {
        return NPCCIF.Common.GetCCResponse("StopTalkPreview", ccPlugin, hMedia, hTalkRes);
    },

    /**
     * 启动喊话
     * @param ccPlugin {Object} cc插件句柄
     * @param hMedia {Object} 媒体库句柄
     * @param hTalkRes {Object} 对讲资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    StartCallPreview: function (ccPlugin, hMedia, hTalkRes) {
        return NPCCIF.Common.GetCCResponse("StartCallPreview", ccPlugin, hMedia, hTalkRes);
    },

    /**
     * 停止喊话
     * @param ccPlugin {Object} cc插件句柄
     * @param hMedia {Object} 媒体库句柄
     * @param hTalkRes {Object} 对讲资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    StopCallPreview: function (ccPlugin, hMedia, hTalkRes) {
        return NPCCIF.Common.GetCCResponse("StopCallPreview", ccPlugin, hMedia, hTalkRes);
    },

    /**
     * 启动定位
     * @param ccPlugin {Object} cc插件句柄
     * @param hLocationRes {Object} 定位资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    StartLocationPreview: function (ccPlugin, hLocationRes) {
        return NPCCIF.Common.GetCCResponse("StartLocationPreview", ccPlugin, hLocationRes);
    },

    /**
     * 停止定位
     * @param ccPlugin {Object} cc插件句柄
     * @param hLocationRes {Object} 定位资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    StopLocationPreview: function (ccPlugin, hLocationRes) {
        return NPCCIF.Common.GetCCResponse("StopLocationPreview", ccPlugin, hLocationRes);
    },

    /**
     * 绑定事件
     * @param ccPlugin {Object} cc插件句柄
     * @param eventMethodName {string} 事件方法名，必须跟插件里定义的一致
     * @param callback {function} 回调函数，参数必须跟插件定义的一致
     * @returns {NPCCStruct.ReturnValueStruct} 返回值： 错误码
     */
    AttachObjectEvent : function (ccPlugin, eventMethodName, callback)
    {
        try
        {
            if (ccPlugin && eventMethodName)
            {
                if(typeof callback != "function")
                {
                    callback = function() {};
                }

                var is_ie_11 = (NPCCIF.age.search("msie") == -1 && NPCCIF.age.search("trident") != -1 ? true : false);

                if (ccPlugin.attachEvent && typeof ccPlugin.attachEvent == "function")
                {
                    ccPlugin.attachEvent("on" + eventMethodName, callback);
                }
                else if (ccPlugin.addEventListener && typeof ccPlugin.addEventListener == "function")
                {
                    if (is_ie_11)
                    {
                        ccPlugin["on" + eventMethodName] = callback;
                    }
                    else
                    {
                        ccPlugin.addEventListener(eventMethodName, callback, false);
                    }
                }
                else {
                    ccPlugin["on" + eventMethodName] = callback;
                }
            }
            else
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
            }

            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 移除事件
     * @param ccPlugin {Object} cc插件句柄
     * @param eventMethodName {string} 事件方法名，必须跟插件里定义的一致
     * @param callback {function} 回调函数，参数必须跟插件定义的一致
     * @returns {NPCCStruct.ReturnValueStruct} 返回值： 错误码
     */
    DetachObjectEvent : function (ccPlugin, eventMethodName, callback)
    {
        try
        {
            if (ccPlugin && eventMethodName)
            {
                if(typeof callback != "function")
                {
                    callback = function() {};
                }

                var is_ie_11 = (NPCCIF.agt.search("msie") == -1 && NPCCIF.agt.search("trident") != -1 ? true : false);
                if (ccPlugin.detachEvent && typeof ccPlugin.detachEvent == "function")
                {
                    ccPlugin.detachEvent("on" + eventMethodName, callback);
                }
                else if (ccPlugin.removeEventListener && typeof ccPlugin.removeEventListener == "function")
                {
                    if (is_ie_11)
                    {
                        if (typeof ccPlugin["on" + eventMethodName] != "undefined") {
                            ccPlugin["on" + eventMethodName] = "";
                            delete ccPlugin["on" + eventMethodName];
                        }
                    }
                    else
                    {
                        ccPlugin.removeEventListener(eventMethodName, callback, false);
                    }
                }
                else
                {
                    if (typeof ccPlugin["on" + eventMethodName] != "undefined")
                    {
                        ccPlugin["on" + eventMethodName] = "";
                        delete ccPlugin["on" + eventMethodName];
                    }
                }
            }
            else
            {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
            }
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
        }
        catch (e)
        {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     *******************************************************************************************************************
     **************************************************PW插件方法********************************************************
     *******************************************************************************************************************
     */
    /**
     * 获取窗口句柄
     * @param pw {Object} pw插件句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码 + 窗口句柄
     */
    GetWindowHandle : function(pw)
    {
        return NPCCIF.Common.GetPWResponse("GetWindow", pw);
    },

    /**
     * 全屏
     * @param pw {Object} pw插件句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    FullScreen : function(pw)
    {
        return NPCCIF.Common.GetPWResponse("FullScreen", pw);
    },

    /**
     * 退出全屏
     * @param pw {Object} pw插件句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    ExitFullScreen : function(pw)
    {
        return NPCCIF.Common.GetPWResponse("ExitFullScreen", pw);
    },

    /**
     * 设置是否重绘背景标志
     * @param pw {Object} pw插件句柄
     * @param value {int} 0为不重绘，1为重绘，当视频开始播放时应设为0，否则设为1
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    SetEraseBkgndFlag : function(pw, value)
    {
        return NPCCIF.Common.GetPWResponse("SetEraseBkgndFlag", pw, value);
    },

    /**
     * 设置控制模式
     * @param pw {Object} pw插件句柄
     * @param mode {int} 0表示拖拽，1表示框选，框选模式时不会全屏
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    SetControlMode : function(pw, mode)
    {
        return NPCCIF.Common.GetPWResponse("SetControlMode", pw, mode);
    },

    /**
     * 添加右键菜单项
     * @param pw {Object} pw插件句柄
     * @param mode {int} 表示菜单类型，0为字符串，0x800为横线
     * @param itemID {string} 表示该菜单项ID
     * @param itemText {string} 表示该菜单文本
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    AppendMenuItem : function(pw, mode, itemID, itemText)
    {
        return NPCCIF.Common.GetPWResponse("AppendMenuItem", pw, mode, keyCode, text);
    },

    /**
     *  移除所有的右键菜单项
     * @param pw {Object} pw插件句柄
     * @returns {NPCCStruct.ReturnValueStruct} 返回值：错误码
     */
    DeleteAllMenuItem : function(pw)
    {
        return NPCCIF.Common.GetPWResponse("DeleteAllMenuItem", pw);
    },
};