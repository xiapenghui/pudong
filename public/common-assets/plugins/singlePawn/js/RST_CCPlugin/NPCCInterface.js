
/**
 * @file RST_WebSDK底层封装，直接调用插件的方法
 * 1、谷歌浏览器：chrome45（包括45）以上版本都不行，chrome42（包括42）以上版本可以，但是只支持32位的且需要手动启动npapi插件，
 *    启用方法看https://jingyan.baidu.com/article/d621e8da2969662864913f4b.html，chrome42以下版本可以直接使用。
 * 2、火狐浏览器：Firefox 52（包括）以上版本都不行，以下版本都可以，但是像51版本只支持32位的，版本越低，32位和64位都会支持，跟谷歌浏览器类似。
 * 3、IE：IE11及以下的版本，Edge不支持
 */

/**
 *******************************************************************************************************************
 ***************************************************修改记录*********************************************************
 *******************************************************************************************************************
 */

/**
 * 修改记录
 * 20180607：
 *  1、新增方法NPCCIF.GetUID(); // 获取当前登录用户ID
 *  2、新增方法NPCCIF.GetUserList(); // 获取所有子用户信息
 *  3、新增方法NPCCIF.AddUser(); // 添加新的用户
 *  4、新增方法NPCCIF.ModifyUser(); // 修改用户
 *  5、新增方法NPCCIF.DeleteUser(); // 删除用户
 *  6、新增方法NPCCIF.GetUserRes(); // 获取用户资源
 *  7、新增方法NPCCIF.AddUserRes(); // 添加用户资源
 *  8、新增方法NPCCIF.RemoveUserRes(); // 删除用户资源
 */

/**
 *******************************************************************************************************************
 *************************************************接口调用流程*******************************************************
 *******************************************************************************************************************
 */

/**
 * RST_WebSDK底层方法调用主要流程
 * 1、初始化RST_WebSDK
 *      NPCCIF.Initialize();
 * 2、登录平台
 *      NPCCIF.Open();
 * 3、获取子域
 *      NPCCIF.ForkDomainList();
 * 4、获取设备
 *      NPCCIF.ForkPUList();
 * 5、获取子资源
 *      NPCCIF.ForkResList();
 * 6、功能模块
 *  1）、启动音视频、喊话和对讲模块
 *  2）、定位功能模块
 *  3）、参数配置模块
 *  4）、云台控制模块
 *  5）、添加子用户并分配资源模块
 * 7、退出平台
 *      NPCCIF.Close();
 * 8、释放RST_WebSDK资源
 *      NPCCIF.Terminate();
 */

/**
 * 获取域、设备和子资源流程
 * 1、初始化RST_WebSDK
 *      NPCCIF.Initialize()
 * 2、登录平台
 *      NPCCIF.Open()
 * 3、根域名称
 *      NPCCIF.COMMON_GetName(ccPlugin, hServer);
 * 4、获取子域
 *      NPCCIF.ForkDomainList();
 *      NPCCIF.DOMAIN_GetID(ccPlugin, hDomain);
 *      NPCCIF.DOMAIN_GetDID(ccPlugin, hDomain);
 *      NPCCIF.DOMAIN_GetName(ccPlugin, hDomain);
 *      NPCCIF.DOMAIN_GetParentID(ccPlugin, hDomain);
 *      NPCCIF.DOMAIN_GetDesc(ccPlugin, hDomain);
 * 5、获取设备
 *      1)、NPCCIF.ForkPUList();
 *      2）、NPCCIF.COMMON_GetDID(ccPlugin, hPuRes);
 *          NPCCIF.COMMON_GetResID(ccPlugin, hPuRes);
 *          NPCCIF.COMMON_GetPUID(ccPlugin, hPuRes);
 *          NPCCIF.COMMON_GetResType(ccPlugin, hPuRes);
 *          NPCCIF.COMMON_GetResIdx(ccPlugin, hPuRes);
 *          NPCCIF.COMMON_IsEnable(ccPlugin, hPuRes);
 *          NPCCIF.COMMON_IsOnline(ccPlugin, hPuRes);
 *          NPCCIF.COMMON_GetName(ccPlugin, hPuRes);
 *          NPCCIF.COMMON_GetDesc(ccPlugin, hPuRes);
 *          NPCCIF.COMMON_GetModelType(ccPlugin, hPuRes);
 *          NPCCIF.DEV_GetModel(ccPlugin, hPuRes);
 *          NPCCIF.DEV_GetSoftwareVersion(ccPlugin, hPuRes);
 *          NPCCIF.DEV_GetHardwareVersion(ccPlugin, hPuRes);
 *          NPCCIF.COMMON_GetLongitude(ccPlugin, hPuRes);
 *          NPCCIF.COMMON_GetLatitude(ccPlugin, hPuRes);
 *          NPCCIF.DEV_GetDeviceSN(ccPlugin, hPuRes);
 * 6、获取子资源
 *      1）、NPCCIF.ForkResList();
 *      2）、NPCCIF.COMMON_GetChildren(ccPlugin, hPuRes);
 *      3）、NPCCIF.COMMON_GetDID(ccPlugin, hPuRes);
 *          NPCCIF.COMMON_GetResID(ccPlugin, hPuRes);
 *          NPCCIF.COMMON_GetPUID(ccPlugin, hPuRes);
 *          NPCCIF.COMMON_GetResType(ccPlugin, hPuRes);
 *          NPCCIF.COMMON_GetResIdx(ccPlugin, hPuRes);
 *          NPCCIF.COMMON_IsEnable(ccPlugin, hPuRes);
 *          NPCCIF.COMMON_IsOnline(ccPlugin, hPuRes);
 *          NPCCIF.COMMON_GetName(ccPlugin, hPuRes);
 *          NPCCIF.COMMON_GetDesc(ccPlugin, hPuRes);
 * 7、退出平台
 *      NPCCIF.Close();
 * 8、释放RST_WebSDK资源
 *      NPCCIF.Terminate();
 */

/**
 * 启动音视频、喊话和对讲模块的流程
 * 1、初始化RST_WebSDK
 *      NPCCIF.Initialize();
 * 2、登录平台
 *      NPCCIF.Open();
 * 3、创建窗口句柄、添加、删除窗口事件（本接口只支持左键单击事件）：参考NPCCInterlayer.js文件中NPCCILY.CreateWindow()方法和NPCCILY.WindowAttachEvent.Init()方法
 *      NPCCIF.GetWindowHandle();
 *      NPCCIF.AttachObjectEvent(pwPlugin, eventName, eventCallback);
 *      NPCCIF.DetachObjectEvent(ccPlugin, eventName, eventCallback);
 * 4、添加、删除CC插件事件回调：参考NPCCInterlayer.js文件中NPCCILY.CCNotifyManager.Add()方法
 *      需要注册的事件有：NPCCEnum.CCObjectNotify.event_notify、NPCCEnum.CCObjectNotify.stream_status_notify、NPCCEnum.CCObjectNotify.call_stream_status_notify
 *      NPCCIF.AttachObjectEvent(ccPlugin, eventName, eventCallback);
 *      NPCCIF.DetachObjectEvent(ccPlugin, eventName, eventCallback);
 * 5、获取子域
 *      NPCCIF.ForkDomainList();
 * 6、获取设备
 *      NPCCIF.ForkPUList();
 * 7、获取子资源
 *      NPCCIF.ForkResList();
 * 8、启动、停止视频
 *      NPCCIF.StartCameraPreview(ccPlugin, hCameraRes, hWnd, streamType, alg, width, height, frameRate, bitRate);
 *      NPCCIF.StopPreview(ccPlugin, hMedia, type);
 * 9、启动、停止音频
 *      NPCCIF.StartAudioPreview(ccPlugin, hMedia, hAudioRes);
 *      NPCCIF.StopPreview(ccPlugin, hMedia, type);
 * 10、启动、停止喊话：与对讲是互斥的即启动喊话，需要停止对讲
 *      NPCCIF.StartCallPreview(ccPlugin, hMedia, hTalkRes)
 *      NPCCIF.StopCallPreview(ccPlugin, hMedia, hTalkRes)
 * 11、启动、停止对讲：与喊话是互斥的即启动对讲，需要停止喊话
 *      NPCCIF.StartTalkPreview(ccPlugin, hMedia, hTalkRes);
 *      NPCCIF.StopTalkPreview(ccPlugin, hMedia, hTalkRes);
 * 12、退出平台
 *      NPCCIF.Close();
 * 13、释放RST_WebSDK资源
 *      NPCCIF.Terminate();
 */

/**
 * 定位功能模块的流程
 * 1、初始化RST_WebSDK
 *      NPCCIF.Initialize();
 * 2、登录平台
 *      NPCCIF.Open();
 * 3、获取子域
 *      NPCCIF.ForkDomainList();
 * 4、获取设备
 *      NPCCIF.ForkPUList();
 * 5、获取子资源
 *      NPCCIF.ForkResList();
 * 6、添加、删除CC插件事件回调：参考NPCCInterlayer.js文件中NPCCILY.CCNotifyManager.Add()方法
 *      定位回调事件：NPCCEnum.CCObjectNotify.location_data_notify
 *      NPCCIF.AttachObjectEvent(ccPlugin, eventName, eventCallback);
 *      NPCCIF.DetachObjectEvent(ccPlugin, eventName, eventCallback);
 * 7、启动停止定位：第6步如果不执行，调用启动定位方法成功后是获取不到平台返回的定位数据的
 *      NPCCIF.StartLocationPreview(ccPlugin, hLocationRes);
 *      NPCCIF.StopLocationPreview(ccPlugin, hLocationRes);
 * 8、退出平台
 *      NPCCIF.Close();
 * 9、释放RST_WebSDK资源
 *      NPCCIF.Terminate();
 */

/**
 * 参数配置模块的流程
 * 1、初始化RST_WebSDK
 *      NPCCIF.Initialize();
 * 2、登录平台
 *      NPCCIF.Open();
 * 3、获取子域
 *      NPCCIF.ForkDomainList();
 * 4、获取设备
 *      NPCCIF.ForkPUList();
 * 5、获取子资源
 *      NPCCIF.ForkResList();
 * 6、获取、设置视频清晰度
 *      NPCCIF.CAM_GetDefinition(ccPlugin, hCameraRes, streamType);
 *      NPCCIF.CAM_SetDefinition(ccPlugin, hCameraRes, definition, streamType);
 * 7、获取、设置音量
 *      NPCCIF.AUD_GetVolume(ccPlugin, hAudioRes);
 *      NPCCIF.AUD_SetVolume(ccPlugin, hAudioRes, volume);
 *      NPCCIF.TBK_SetInputVolume(ccPlugin, TBK_GetInputVolume);
 *      NPCCIF.TBK_SetInputVolume(ccPlugin, hTalkbackRes, volume);
 *      NPCCIF.TBK_GetOutputVolume(ccPlugin, hTalkbackRes);
 *      NPCCIF.TBK_SetOutputVolume(ccPlugin, hTalkbackRes, volume);
 * 8、退出平台
 *      NPCCIF.Close();
 * 9、释放RST_WebSDK资源
 *      NPCCIF.Terminate();
 */

/**
 * 云台控制模块流程
 * 1、初始化RST_WebSDK
 *      NPCCIF.Initialize();
 * 2、登录平台
 *      NPCCIF.Open();
 * 3、获取子域
 *      NPCCIF.ForkDomainList();
 * 4、获取设备
 *      NPCCIF.ForkPUList();
 * 5、获取子资源
 *      NPCCIF.ForkResList();
 * 6、控制云台
 *      NPCCIF.PTZ_StartTurnLeft(ccPlugin, hPtzRes); // 向左转动
 *      NPCCIF.PTZ_StartTurnRight(ccPlugin, hPtzRes); // 向右转动
 *      NPCCIF.PTZ_StartTurnUp(ccPlugin, hPtzRes); // 向上转动
 *      NPCCIF.PTZ_StartTurnDown(ccPlugin, hPtzRes); // 向下转动
 *      NPCCIF.PTZ_StopTurn(ccPlugin, hPtzRes); // 停止转动
 * 7、退出平台
 *      NPCCIF.Close();
 * 8、释放RST_WebSDK资源
 *      NPCCIF.Terminate();
 */

/**
 * 添加子用户、给用户分配资源模块的流程
 * 1、初始化RST_WebSDK
 *      NPCCIF.Initialize();
 * 2、登录平台
 *      NPCCIF.Open();
 * 3、获取子域
 *      NPCCIF.ForkDomainList();
 * 4、获取设备
 *      NPCCIF.ForkPUList();
 * 5、获取子资源
 *      NPCCIF.ForkResList();
 * 6、获取登录用户ID
 *      NPCCIF.GetUID(ccPlugin, hServer);
 * 7、获取当前登录用户下的所有子用户
 *      NPCCIF.GetUserList(ccPlugin, hServer);
 * 8、添加子用户
 *      NPCCIF.AddUser(ccPlugin, hServer, uiParentIndex, username, password, ucUserType, desc);
 * 9、修改子用户
 *      NPCCIF.ModifyUser(ccPlugin, hServer, uiIndex, username, password, desc);
 * 10、删除子用户
 *      NPCCIF.DeleteUser(ccPlugin, hServer, uiIndex);
 * 11、获取分配给当前登录用户资源
 *      NPCCIF.GetUserRes(ccPlugin, hServer, uiIndex);
 * 12、给子用户分配资源
 *      NPCCIF.AddUserRes(ccPlugin, hServer, uiIndex, resIDList);
 * 13、删除子用户分配的资源
 *      NPCCIF.RemoveUserRes(ccPlugin, hServer, uiIndex, resIDList);
 * 14、退出平台
 *      NPCCIF.Close();
 * 15、释放RST_WebSDK资源
 *      NPCCIF.Terminate();
 */

/**
 * RST_WebSDK底层封装，直接调用插件的方法
 * @class NPCCIF
 * @autho shaosy
 * @see RST_WebSDK含有两个插件的方法：CC插件和PW插件
 *          CC插件：处理与平台之间业务功能
 *          PW插件：处理视频播放窗口相关功能，目前RST_WebSDK只支持获取播放视频窗口句柄用于视频渲染，这个句柄是给CC插件用的，具体看CC插件的StartCameraPreview方法。
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
     * 初始化RST_WebSDK，在调用NPCCIF其他方法之前调用
     * @param ccPlugin {Object} [in] cc插件句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示初始化失败
     * @see 一般在应用程序初始化时调用或在使用RST_WebSDK其他方法之前调用，该方法只要调用一次。
     *          不建议用户在使用RST_WebSDK方法期间多次调用该方法和NPCCIF.Terminate方法。
     */
    Initialize: function (ccPlugin) {
        try {
            if (ccPlugin && typeof ccPlugin.Initialize != 'undefined') {
                var operator = ccPlugin.Initialize();
                operator = eval("(" + operator + ")");
                return new NPCCStruct.ReturnValueStruct(Number(operator.E));
            }
            else {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_LOADPLUG_CC);
            }
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 清空RST_WebSDK, 释放占用的资源，在NPCCIF所有的方法之后调用
     * @param ccPlugin {Object} [in] cc插件句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示清空失败
     * @see 一般在应用程序关闭时调用，清理并释放资源。不建议用户在没使用完RST_WebSDK方法期间多次调用该方法和NPCCIF.Initialize方法。
     */
    Terminate : function (ccPlugin) {
        try {
            if (ccPlugin && typeof ccPlugin.Terminate != 'undefined') {
                ccPlugin.Terminate();
            }
            else {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_LOADPLUG_CC);
            }
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 登录平台，默认采用阻塞方式登录
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param loginParam {NPCCStruct.LoginParamStruct} [in] 登录参数
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，此时value才有值，值表示的是服务句柄，下面接口会用到，否则表示登录失败
     * @see 一般在RST_WebSDK初始化后调用，与平台进行各种业务功能的前提；当前RST_WebSDK建议使用阻塞方式登录。
     */
    Open: function (ccPlugin, loginParam) {
        try {
            if (ccPlugin && typeof ccPlugin.Open != 'undefined') {
                if (!loginParam || !loginParam instanceof  NPCCStruct.LoginParamStruct) {
                    loginParam = new NPCCStruct.LoginParamStruct();
                }
                var operator = ccPlugin.Open(loginParam.ip, loginParam.port, loginParam.username, loginParam.password,
                    loginParam.domain, '', 10, loginParam.block == 1 ? true : false, true,
                    NPCCEnum.ProxyType.ProxyType_NONE, '0.0.0.0', 0, '', '');
                operator = eval("(" + operator + ")") || {};
                return new NPCCStruct.ReturnValueStruct(Number(operator.E), operator.V);
            }
            else {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_LOADPLUG_CC);
            }
        }
        catch (e) {
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 获取登录状态
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hserver {Object} [in] 服务句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，errorCode为0x0017表示登录正在进行，其他表示失败。
     * @see 如果采用非阻塞方式登录，需要不断调用该方法来判断是否登录成功，采用阻塞登录方式不需要调用该接口
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
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hserver {Object} [in] 服务句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功；其他表示失败。
     * @see 需要退出平台时调用，调用后就不能与平台进行各种业务功能，与NPCCIF.Open方法是互斥的。
     */
    Close: function (ccPlugin, hServer) {
        try {
            if (ccPlugin && typeof ccPlugin.Close != 'undefined') {
                if (hServer != "" && hServer != null && typeof hServer != "undefined") {
                    var operator =  ccPlugin.Close(hServer);
                    operator = eval("(" + operator + ")") || {};
                    return new NPCCStruct.ReturnValueStruct(Number(operator.E));
                }
                else {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_C_E_INVALID_COMMAND);
                }
            }
            else {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_LOADPLUG_CC);
            }
        }
        catch (e) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
        }
    },

    /**
     * 内部公共方法，上层不需要调用
     * @hideconstructor
     */
    Common:
    {
        /**
         * 判断插件（object）是否有方法（_method）
         * @param objectType {NPCCEnum.PluginType} [in] 插件类型，取值有NPCCEnum.PluginType.CC和NPCCEnum.PluginType.PW
         * @param object {Object} [in] 插件句柄
         * @param _method {string} [in] 对应插件方法名称
         * @returns {NPCCStruct.ReturnValueStruct} ReturnValueStruct.errorCode为0表示成功；其他表示失败。
         */
        CheckObjectMethod : function (objectType, object, _method)
        {
            try {
                var objectType = objectType || NPCCEnum.PluginType.CC;
                if (!object) {
                    switch (objectType) {
                        case NPCCEnum.PluginType.CC :
                            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_LOADPLUG_CC);
                            break;
                        case NPCCEnum.PluginType.PW :
                            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_LOADPLUG_PW);
                            break;
                    }
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_CC_E_PARAME);
                }

                if (typeof object[_method] == "undefined") {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_INTERFACE_UNDEFINED);
                }
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
            }
            catch (e) {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
            }
        },

        /**
         * 具体实现调用插件的方法并处理返回的结果
         * @private
         */
        _Response : function(_objType, _method, _obj)
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

                var _args = arguments, _argslen = _args.length;
                if (!_method || _argslen < (_minArgsCount + 1))
                {
                    return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
                }
                else {
                    var _argsArr = new Array();
                    for (var i = 3; i < _argslen; i++)
                    {
                        // if (typeof _args[i] == "object" && _args[i].constructor == Array) {
                        //     _argsArr.push(JSON.stringify(_args[i]));
                        // }
                        // else
                        // {
                            _argsArr.push(_args[i]);
                        // }
                    }

                    var chk_operator = NPCCIF.Common.CheckObjectMethod(_objType, _obj, _method);
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

                                if (_method == "GetUserList") {
                                    var userList = operator.V;
                                    var userListTemp = [];
                                    for (var i = 0; i<userList.length; i++) {
                                        var userStruct = new NPCCStruct.UserDetailInfoStruct();
                                        userStruct.id = userList[i].ID;
                                        userStruct.parentID = userList[i].ParentID;
                                        userStruct.name = NPCCUtils.UTF8toUnicode(userList[i].Name);
                                        userStruct.alias = NPCCUtils.UTF8toUnicode(userList[i].Alias);
                                        userStruct.desc = NPCCUtils.UTF8toUnicode(userList[i].Description);
                                        userStruct.deviceCount = userList[i].DeviceCount;
                                        userListTemp.push(userStruct);
                                    }

                                    operator.V = userListTemp;
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
                var msg = e.message;
                var name= e.name;
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_THREAD);
            }
        },

        /**
         * 调用CC插件的方法并处理返回的结果
         * @param _method {string} [in] cc插件方法名称
         * @param cc  {Object} [in] cc插件句柄
         * @param handle {Object} [in] 句柄对象，可以为hServer（服务句柄）或hRes（资源句柄）等
         */
        GetCCResponse : function(_method, cc, handle)
        {
            var argsArr = [NPCCEnum.PluginType.CC];
            for (var i = 0; i < arguments.length; i++)
            {
                argsArr.push(arguments[i]);
            }
            return NPCCIF.Common._Response.apply(this, argsArr);
        },

        /**
         * 调用PW插件的方法并处理返回的结果
         * @param _method {string} [in] pw方法名称
         * @param pw {Object} [in] pw插件句柄
         */
        GetPWResponse : function(_method, pw)
        {
            var argsArr = [NPCCEnum.PluginType.PW];
            for (var i = 0; i < arguments.length; i++)
            {
                argsArr.push(arguments[i]);
            }
            return NPCCIF.Common._Response.apply(this, argsArr);
        },

        end : true
    },

    /**
     * 是否是登录平台
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hServer {Object} [in] 服务句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，其他表示失败。
     * @see 调用该接口可以知道当前登录对象是平台还是设备，errorCode为0时，如果value为1表示的是登录平台，否则为直连设备。
     */
    IsPlatform: function (ccPlugin, hServer) {
        return NPCCIF.Common.GetCCResponse("IsPlatform", ccPlugin, hServer);
    },

    /**
     * 获取所有子域
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hServer {Object} [in] 服务句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是所有子域句柄，否则表示获取失败
     * @see 1、当errorCode为0时，如果value有值，说明获取到子域了，否则就是表示没有子域。
     *          2、value返回的是子域句柄，如果想获取域详细信息，需要调用下面的NPCCIF.DOMAIN_GetID、NPCCIF.DOMAIN_GetDID、NPCCIF.DOMAIN_GetName、
     *             NPCCIF.DOMAIN_GetParentID和NPCCIF.DOMAIN_GetDesc方法。
     *          3、平台默认有一个根域，域名称可以通过NPCCIF.COMMON_GetName方法获取。
     */
    ForkDomainList: function (ccPlugin, hServer) {
        return NPCCIF.Common.GetCCResponse("ForkDomainList", ccPlugin, hServer);
    },

    /**
     * 获取所有设备
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hServer {Object} [in] 服务句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是所有设备句柄，否则表示获取失败
     * @see 获取的是已分配给当前登录用户的所有设备，同NPCCIF.ForkDomainList方法类似，value返回的是设备句柄，如果想要获取设备详细信息，
     *          还需要调用NPCCIF.COMMON_GetName、NPCCIF.COMMON_GetDesc、NPCCIF.COMMON_IsEnable等方法。
     */
    ForkPUList: function (ccPlugin, hServer) {
        return NPCCIF.Common.GetCCResponse("ForkPUList", ccPlugin, hServer);
    },

    /**
     * 获取所有设备下的子资源
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hServer {Object} [in] 服务句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示获取失败
     * @see 该方法调用成功后不返回子资源句柄，但是子资源的值已经缓存在底层了，如果需要可以通过调用NPCCIF.COMMON_GetChildren方法来获取子资源。
     */
    ForkResList: function (ccPlugin, hServer) {
        return NPCCIF.Common.GetCCResponse("ForkResList", ccPlugin, hServer);
    },

    /**
     * 获取一个设备
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hServer {Object} [in] 服务句柄
     * @param did {string} [in] 域id
     * @param puid {string} [in] 设备的puid
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是设备句柄，否则表示获取失败
     */
    ForkOnePU: function (ccPlugin, hServer, did , puid) {
        return NPCCIF.Common.GetCCResponse("ForkOnePU", ccPlugin, hServer, did, puid);
    },

    /**
     * 获取当前登录用户ID
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hServer {Object} [in] 服务句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是用户ID，否则表示获取失败
     */
    GetUID: function (ccPlugin, hServer) {
        return NPCCIF.Common.GetCCResponse("GetUID", ccPlugin, hServer);
    },

    /**
     * 获取当前用户下的所有子用户信息
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hServer {Object} [in] 服务句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是子用户数组，否则表示获取失败
     * @see value返回的是所有子用户信息，是个数组，数据类型为NPCCStruct.UserDetailInfoStruct结构体
     */
    GetUserList: function (ccPlugin, hServer) {
        return NPCCIF.Common.GetCCResponse("GetUserList", ccPlugin, hServer);
    },

    /**
     * 添加新的用户
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hServer {Object} [in] 服务句柄
     * @param uiParentIndex {int} [in] 父用户ID
     * @param username {string} [in] 用户名
     * @param password {string} [in] 用户登录密码
     * @param ucUserType {int} [in] 用户类型，可以取值NPCCEnum.UserType.UserType_Normal和NPCCEnum.UserType.UserType_Group
     * @param desc {string} [in] 用户描述
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的新加的用户ID，否则表示添加失败
     * @see 该方法添加的用户一律为当前登录用户的子用户，当前登录用户可以为这个子用户分配设备
     */
    AddUser: function(ccPlugin, hServer, uiParentIndex, username, password, ucUserType, desc) {
        return NPCCIF.Common.GetCCResponse("AddUser", ccPlugin, hServer, uiParentIndex, username, password,
            ucUserType, desc);
    },

    /**
     * 修改用户
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hServer {Object} [in] 服务句柄
     * @param uiIndex {int} [in] 用户ID
     * @param username {string} [in] 用户名
     * @param password {string} [in] 用户登录密码
     * @param desc {string} [in] 用户描述
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示修改失败
     * @see 该方法可以修改用户的名称、登录密码和描述；建议自己不要修改自己，自己只修改密码即可，密码修改之后下次生效。
     */
    ModifyUser: function (ccPlugin, hServer, uiIndex, username, password, desc) {
        return NPCCIF.Common.GetCCResponse("ModifyUser", ccPlugin, hServer, uiIndex, username, password, desc);
    },

    /**
     * 删除用户
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hServer {Object} [in] 服务句柄
     * @param uiIndex {int} [in] 用户ID
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示删除失败
     * @see 建议只删除子用户，自己不要删除自己，自己由父用户来删除
     */
    DeleteUser: function (ccPlugin, hServer, uiIndex) {
        return NPCCIF.Common.GetCCResponse("DeleteUser", ccPlugin, hServer, uiIndex);
    },

    /**
     * 获取用户资源
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hServer {Object} [in] 服务句柄
     * @param uiIndex {int} [in] 用户ID
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是资源ID数组（包括设备ID和子资源ID），否则表示获取失败
     * @see 1、一般都是获取子用户分配的资源，当前用户分配的资源是在登录平台成功后调用NPCCIF.ForkPUList方法和NPCCIF.ForkResList方法就已经获取回来了
     *      2、子用户资源是由父用户分配的，所以子用户分配的资源，父用户都是有的。
     *      3、value返回的是资源ID数组，通过资源ID，我们可以从当前用户分配的资源中找到对应资源。
     */
    GetUserRes: function (ccPlugin, hServer, uiIndex) {
        return NPCCIF.Common.GetCCResponse("GetUserRes", ccPlugin, hServer, uiIndex);
    },

    /**
     * 添加用户资源
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hServer {Object} [in] 服务句柄
     * @param uiIndex {int} [in] 用户ID
     * @param resIDList {Array} [in] 设备资源ID数组，添加设备会自动添加设备下的子资源，注意是设备资源ID非子资源ID
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示添加失败
     */
    AddUserRes: function (ccPlugin, hServer, uiIndex, resIDList) {
        return NPCCIF.Common.GetCCResponse("AddUserRes", ccPlugin, hServer, uiIndex, resIDList);
    },

    /**
     * 删除用户资源
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hServer {Object} [in] 服务句柄
     * @param uiIndex {int} [in] 用户ID
     * @param resIDList {Array} [in] 设备资源ID数组，删除设备会自动删除设备下的子资源，注意是设备资源ID非子资源ID
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示删除失败
     */
    RemoveUserRes: function (ccPlugin, hServer, uiIndex, resIDList) {
        return NPCCIF.Common.GetCCResponse("RemoveUserRes", ccPlugin, hServer, uiIndex, resIDList);
    },

    /**
     * 获取域的唯一号，数据库生成的
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hDomain {Object} [in] 域句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是域的id，否则表示获取失败
     */
    DOMAIN_GetID: function (ccPlugin, hDomain) {
        return NPCCIF.Common.GetCCResponse("DOMAIN_GetID", ccPlugin, hDomain);
    },

    /**
     * 获取域ID
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hDomain {Object} [in] 域句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是域ID，否则表示获取失败
     */
    DOMAIN_GetDID: function (ccPlugin, hDomain) {
        return NPCCIF.Common.GetCCResponse("DOMAIN_GetDID", ccPlugin, hDomain);
    },

    /**
     * 获取域名称
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hDomain {Object} [in] 域句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是域名称，否则表示获取失败
     */
    DOMAIN_GetName: function (ccPlugin, hDomain) {
        return NPCCIF.Common.GetCCResponse("DOMAIN_GetName", ccPlugin, hDomain);
    },

    /**
     * 获取父域的唯一号
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hDomain {Object} [in] 域句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是父域的id，否则表示获取失败
     */
    DOMAIN_GetParentID: function (ccPlugin, hDomain) {
        return NPCCIF.Common.GetCCResponse("DOMAIN_GetParentID", ccPlugin, hDomain);
    },

    /**
     * 获取域描述
     * @param ccPlugin {Object} cc插件句柄
     * @param hDomain {Object} 域句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是域描述，否则表示获取失败
     */
    DOMAIN_GetDesc: function (ccPlugin, hDomain) {
        return NPCCIF.Common.GetCCResponse("DOMAIN_GetDesc", ccPlugin, hDomain);
    },

    /**
     * 获取指定资源的子资源
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hRes {Object} [in] 资源句柄，一般这里是设备句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是子资源句柄数组，否则表示获取失败
     * @see 返回的是子资源句柄，如果想要获取资源详细信息，还需要调用NPCCIF.COMMON_GetName、NPCCIF.COMMON_GetDesc、NPCCIF.COMMON_IsEnable等方法。
     */
    COMMON_GetChildren : function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_GetChildren", ccPlugin, hRes);
    },

    /**
     * 获取资源名称
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hRes {Object} [in] 资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是资源名称，否则表示获取失败
     */
    COMMON_GetName: function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_GetName", ccPlugin, hRes);
    },

    /**
     * 获取资源描述
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hRes {Object} [in] 资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是资源描述，否则表示获取失败
     */
    COMMON_GetDesc: function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_GetDesc", ccPlugin, hRes);
    },

    /**
     * 资源是否可用
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hRes {Object} [in] 资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是资源是否可用，1代表可用，0代表不可用，否则表示获取失败
     */
    COMMON_IsEnable: function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_IsEnable", ccPlugin, hRes);
    },

    /**
     * 获取资源PUID
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hRes {Object} [in] 资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是资源puid，否则表示获取失败
     */
    COMMON_GetPUID: function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_GetPUID", ccPlugin, hRes);
    },

    /**
     * 获取资源ID
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hRes {Object} [in] 资源句柄
     * @returns {NPCCStruct.ReturnValueStruct}  errorCode为0表示成功，value返回的是资源id，否则表示获取失败
     */
    COMMON_GetResID: function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_GetResID", ccPlugin, hRes);
    },

    /**
     * 获取资源类型
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hRes {Object} [in] 资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是资源类型，否则表示获取失败
     */
    COMMON_GetResType: function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_GetResType", ccPlugin, hRes);
    },

    /**
     * 获取资源索引
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hRes {Object} [in] 资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是资源索引，否则表示获取失败
     */
    COMMON_GetResIdx: function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_GetResIdx", ccPlugin, hRes);
    },

    /**
     * 资源是否在线
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hRes {Object} [in] 资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是资源是否在线，1代表在线，0代表不在线，否则表示获取失败
     */
    COMMON_IsOnline: function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_IsOnline", ccPlugin, hRes);
    },

    /**
     * 资源所在的域ID
     * @param ccPlugin {Object} [in] 插件句柄
     * @param hRes {Object} [in] 资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是资源所在域ID，否则表示获取失败
     */
    COMMON_GetDID: function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_GetDID", ccPlugin, hRes);
    },

    /**
     * 资源型号类型
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hRes {Object} [in] 资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是资源型号类型，否则表示获取失败
     */
    COMMON_GetModelType: function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_GetModelType", ccPlugin, hRes);
    },

    /**
     * 获取资源所在的纬度
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hRes {Object} [in] 资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是资源默认位置：纬度，否则表示获取失败
     */
    COMMON_GetLongitude: function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_GetLongitude", ccPlugin, hRes);
    },

    /**
     * 获取资源所在的经度
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hRes {Object} [in] 资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是资源默认位置：经度，否则表示获取失败
     */
    COMMON_GetLatitude: function (ccPlugin, hRes) {
        return NPCCIF.Common.GetCCResponse("COMMON_GetLatitude", ccPlugin, hRes);
    },

    /**
     * 获取设备型号
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hPuRes {Object} [in] 设备句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是设备型号，否则表示获取失败
     */
    DEV_GetModel: function (ccPlugin, hPuRes) {
        return NPCCIF.Common.GetCCResponse("DEV_GetModel", ccPlugin, hPuRes);
    },

    /**
     * 获取设备的软件版本号
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hPuRes {Object} [in] 设备句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是软件版本号，否则表示获取失败
     */
    DEV_GetSoftwareVersion: function (ccPlugin, hPuRes) {
        return NPCCIF.Common.GetCCResponse("DEV_GetSoftwareVersion", ccPlugin, hPuRes);
    },

    /**
     * 获取设备的硬件版本号
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hPuRes {Object} [in] 设备句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是硬件版本号，否则表示获取失败
     */
    DEV_GetHardwareVersion: function (ccPlugin, hPuRes) {
        return NPCCIF.Common.GetCCResponse("DEV_GetHardwareVersion", ccPlugin, hPuRes);
    },

    /**
     * 获取设备的唯一ID
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hPuRes {Object} [in] 设备句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是设备唯一ID，否则表示获取失败
     */
    DEV_GetDeviceSN: function (ccPlugin, hPuRes) {
        return NPCCIF.Common.GetCCResponse("DEV_GetDeviceSN", ccPlugin, hPuRes);
    },

    /**
     * 获取视频清晰度
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hCameraRes {Object} [in] 摄像头资源句柄
     * @param streamType {NPCCEnum.StreamType} 流类型，取值NPCCEnum.StreamType.ST_MainStream或NPCCEnum.StreamType.ST_SubStream
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是视频清晰度，否则表示获取失败
     */
    CAM_GetDefinition: function (ccPlugin, hCameraRes, streamType) {
        return NPCCIF.Common.GetCCResponse("CAM_GetDefinition", ccPlugin, hCameraRes, streamType);
    },

    /**
     * 设置视频清晰度
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hCameraRes {Object} [in] 摄像头资源句柄
     * @param definition {int} 清晰度（范围0-100）
     * @param streamType {NPCCEnum.StreamType} 流类型，取值NPCCEnum.StreamType.ST_MainStream或NPCCEnum.StreamType.ST_SubStream
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示设置失败
     */
    CAM_SetDefinition: function (ccPlugin, hCameraRes, definition, streamType) {
        return NPCCIF.Common.GetCCResponse("CAM_SetDefinition", ccPlugin, hCameraRes, definition, streamType);
    },

    /**
     * 获取音频音量
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hAudioRes {Object} [in] 音频资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是音频音量，否则表示获取失败
     */
    AUD_GetVolume: function (ccPlugin, hAudioRes) {
        return NPCCIF.Common.GetCCResponse("AUD_GetVolume", ccPlugin, hAudioRes);
    },

    /**
     * 设置音频音量
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hAudioRes {Object} [in] 音频资源句柄
     * @param volume {int} 音量（范围0-100）
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示设置失败
     */
    AUD_SetVolume: function (ccPlugin, hAudioRes, volume) {
        return NPCCIF.Common.GetCCResponse("AUD_SetVolume", ccPlugin, hAudioRes, volume);
    },

    /**
     * 获取对讲资源输入音量
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hTalkbackRes {Object} [in] 对讲资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是输入音量，否则表示获取失败
     */
    TBK_GetInputVolume: function (ccPlugin, hTalkbackRes) {
        return NPCCIF.Common.GetCCResponse("TBK_GetInputVolume", ccPlugin, hTalkbackRes);
    },

    /**
     * 获取对讲资源输出音量
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hTalkbackRes {Object} [in] 对讲资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value返回的是输出音量，否则表示获取失败
     */
    TBK_GetOutputVolume: function (ccPlugin, hTalkbackRes) {
        return NPCCIF.Common.GetCCResponse("TBK_GetOutputVolume", ccPlugin, hTalkbackRes);
    },

    /**
     * 设置对讲资源输入音量
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hTalkbackRes {Object} [in] 对讲资源句柄
     * @param volume {int} 音量（范围0-100）
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示设置失败
     */
    TBK_SetInputVolume: function (ccPlugin, hTalkbackRes, volume) {
        return NPCCIF.Common.GetCCResponse("TBK_SetInputVolume", ccPlugin, hTalkbackRes, volume);
    },

    /**
     * 设置对讲资源输出音量
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hTalkbackRes {Object} [in] 对讲资源句柄
     * @param volume {int} 音量（范围0-100）
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示设置失败
     */
    TBK_SetOutputVolume: function (ccPlugin, hTalkbackRes, volume) {
        return NPCCIF.Common.GetCCResponse("TBK_SetOutputVolume", ccPlugin, hTalkbackRes, volume);
    },

    /**
     * 云台控制，开始向左转
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hPtzRes {Object} [in] 云台资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示执行失败
     * @see 该方法调用完后，需要调用NPCCIF.PTZ_StopTurn方法来停止转动，否则云台会一直向左转
     */
    PTZ_StartTurnLeft: function (ccPlugin, hPtzRes) {
        return NPCCIF.Common.GetCCResponse("PTZ_StartTurnLeft", ccPlugin, hPtzRes);
    },

    /**
     * 云台控制，开始向右转
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hPtzRes {Object} [in] 云台资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示执行失败
     * @see 需要调用NPCCIF.PTZ_StopTurn方法来停止转动，否则云台会一直向右转
     */
    PTZ_StartTurnRight: function (ccPlugin, hPtzRes) {
        return NPCCIF.Common.GetCCResponse("PTZ_StartTurnRight", ccPlugin, hPtzRes);
    },

    /**
     * 云台控制，开始向上转
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hPtzRes {Object} [in] 云台资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示执行失败
     * @see NPCCIF.PTZ_StopTurn方法来停止转动，否则云台会一直向上转
     */
    PTZ_StartTurnUp: function (ccPlugin, hPtzRes) {
        return NPCCIF.Common.GetCCResponse("PTZ_StartTurnUp", ccPlugin, hPtzRes);
    },

    /**
     * 云台控制，开始向下转
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hPtzRes {Object} [in] 云台资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示执行失败
     * @see NPCCIF.PTZ_StopTurn方法来停止转动，否则云台会一直向下转
     */
    PTZ_StartTurnDown: function (ccPlugin, hPtzRes) {
        return NPCCIF.Common.GetCCResponse("PTZ_StartTurnDown", ccPlugin, hPtzRes);
    },

    /**
     * 云台控制，停止转动
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hPtzRes {Object} [in] 云台资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示执行失败
     */
    PTZ_StopTurn: function (ccPlugin, hPtzRes) {
        return NPCCIF.Common.GetCCResponse("PTZ_StopTurn", ccPlugin, hPtzRes);
    },

     // ----------------------------------------------------------------------------------------------------------------
     // 音视频相关
     // ----------------------------------------------------------------------------------------------------------------
    /**
     * 启动视频预览
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hCameraRes {Object} [in] 摄像头资源句柄
     * @param hWnd {Object} [in] 窗口句柄，即调用NPCCIF.GetWindowHandle方法返回的值
     * @param streamType {NPCCEnum.StreamType} [in]  流类型，取值NPCCEnum.StreamType.ST_MainStream或NPCCEnum.StreamType.ST_SubStream
     * @param alg {NPCCEnum.StreamVideoAlg} [in] 视频算法，取值参照NPCCEnum.StreamVideoAlg.SVA_H264或NPCCEnum.StreamVideoAlg.SVA_MPEG4，只有streamType为转码流时有效，目前不支持
     * @param width {int} [in] 视频宽度，只有streamType为转码流时有效
     * @param height {int} [in] 视频高度，只有streamType为转码流时有效
     * @param frameRate {int} [in] 帧率，只有streamType为转码流时有效
     * @param bitRate {int} [in] 码率，只有streamType为转码流时有效
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value为媒体库句柄，否则表示启动失败
     * @see 该方法可以启动一路视频预览，可以调用多次打开多个摄像头同时预览
     */
    StartCameraPreview: function (ccPlugin, hCameraRes, hWnd, streamType, alg, width, height, frameRate, bitRate) {
        return NPCCIF.Common.GetCCResponse("StartCameraPreview", ccPlugin, hCameraRes, hWnd, false,
            (typeof streamType != 'undefined' ? streamType : 1), (typeof alg != 'undefined' ? alg : 1),
            (typeof width != 'undefined' ? width : 0), (typeof height != 'undefined' ? height : 0),
            (typeof frameRate != 'undefined' ? frameRate : 0), (typeof bitRate != 'undefined' ? bitRate : 0), 0, false, 0, 3000);
    },

    /**
     * 启动音频
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hMedia {Object} [in] 媒体库句柄，调用NPCCIF.StartCameraPreview方法返回的值
     * @param hAudioRes {Object} [in] 音频资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示启动失败
     * @see 调用该方法前，必选先调用NPCCIF.StartCameraPreview方法打开视频
     */
    StartAudioPreview: function (ccPlugin, hMedia, hAudioRes)
    {
        return NPCCIF.Common.GetCCResponse("StartAudioPreview", ccPlugin, hMedia, hAudioRes);
    },

    /**
     * 停止音视频预览
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hMedia {Object} [in] 媒体库句柄，调用NPCCIF.StartCameraPreview方法返回的值
     * @param type {NPCCEnum.StopRealtimePreviewType} [in] 停止流类型，取值NPCCEnum.StopRealtimePreviewType.SREP_VIDEO、NPCCEnum.StopRealtimePreviewType.SREP_AUDIO、NPCCEnum.StopRealtimePreviewType.SREP_ALL
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示启动失败
     * @see 当type取值为NPCCEnum.StopRealtimePreviewType.SREP_VIDEO代表只停止视频，此时建议把音频也停止了；
     *          当type取值为NPCCEnum.StopRealtimePreviewType.SREP_AUDIO代表只停止音频；
     *          当type取值为NPCCEnum.StopRealtimePreviewType.SREP_ALL代表同时停止音视频
     */
    StopPreview: function (ccPlugin, hMedia, type) {
        return NPCCIF.Common.GetCCResponse("StopPreview", ccPlugin, hMedia, type);
    },

    /**
     * 设置播放窗口
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hMedia {Object} [in] 媒体库句柄，调用NPCCIF.StartCameraPreview方法返回的值
     * @param hWnd {Object} [in] 窗口句柄，即调用NPCCIF.GetWindowHandle方法返回的值
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示启动失败
     */
    SetRenderWnd: function (ccPlugin, hMedia, hWnd) {
        return NPCCIF.Common.GetCCResponse("SetRenderWnd", ccPlugin, hMedia, hWnd);
    },

    /**
     * 刷新最后一帧画面
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hMedia {Object} [in] 媒体库句柄，调用NPCCIF.StartCameraPreview方法返回的值
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示启动失败
     */
    RefreshImage: function (ccPlugin, hMedia) {
        return NPCCIF.Common.GetCCResponse("RefreshImage", ccPlugin, hMedia);
    },

    /**
     * 启动对讲
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hMedia {Object} [in] 媒体库句柄，调用NPCCIF.StartCameraPreview方法返回的值
     * @param hTalkRes {Object} 对讲资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示启动失败
     * @see 调用该方法前，必选先调用NPCCIF.StartCameraPreview方法打开视频；对讲和喊话不能共存，打开对讲前需要先停止喊话
     */
    StartTalkPreview: function (ccPlugin, hMedia, hTalkRes) {
        return NPCCIF.Common.GetCCResponse("StartTalkPreview", ccPlugin, hMedia, hTalkRes);
    },

    /**
     * 停止对讲
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hMedia {Object} [in] 媒体库句柄，调用NPCCIF.StartCameraPreview方法返回的值
     * @param hTalkRes {Object} [in] 对讲资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示停止失败
     */
    StopTalkPreview: function (ccPlugin, hMedia, hTalkRes) {
        return NPCCIF.Common.GetCCResponse("StopTalkPreview", ccPlugin, hMedia, hTalkRes);
    },

    /**
     * 启动喊话
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hMedia {Object} [in] 媒体库句柄，调用NPCCIF.StartCameraPreview方法返回的值
     * @param hTalkRes {Object} [in] 对讲资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示启动失败
     * @see 调用该方法前，必选先调用NPCCIF.StartCameraPreview方法打开视频；喊话和对讲不能共存，打开喊话前需要先停止对讲
     */
    StartCallPreview: function (ccPlugin, hMedia, hTalkRes) {
        return NPCCIF.Common.GetCCResponse("StartCallPreview", ccPlugin, hMedia, hTalkRes);
    },

    /**
     * 停止喊话
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hMedia {Object} [in] 媒体库句柄，调用NPCCIF.StartCameraPreview方法返回的值
     * @param hTalkRes {Object} [in] 对讲资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示停止失败
     */
    StopCallPreview: function (ccPlugin, hMedia, hTalkRes) {
        return NPCCIF.Common.GetCCResponse("StopCallPreview", ccPlugin, hMedia, hTalkRes);
    },

    /**
     * 启动定位
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hLocationRes {Object} [in] 定位资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示启动失败
     * @see 该方法启动成功后，定位数据是通过回调的方式传给上层的，所以要想获得定位数据,开发者还需要调用NPCCIF.AttachObjectEvent绑定NPCCEnum.CCObjectNotify.location_data_notify事件。
     */
    StartLocationPreview: function (ccPlugin, hLocationRes) {
        return NPCCIF.Common.GetCCResponse("StartLocationPreview", ccPlugin, hLocationRes);
    },

    /**
     * 停止定位
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param hLocationRes {Object} [in] 定位资源句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示停止失败
     */
    StopLocationPreview: function (ccPlugin, hLocationRes) {
        return NPCCIF.Common.GetCCResponse("StopLocationPreview", ccPlugin, hLocationRes);
    },

    /**
     * 绑定事件
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param eventMethodName {string} [in] 事件方法名，必须跟插件里定义的一致，请看NPCCEnum.CCObjectNotify
     * @param callback {function} [in] 回调函数，参数必须跟插件定义的一致，请看NPCCInterlayer.js文中NPCCILY.CCNotifyManager，这里详细给出回调方法参数定义
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示执行失败
     */
    AttachObjectEvent: function (ccPlugin, eventMethodName, callback)
    {
        try {
            if (ccPlugin && eventMethodName) {
                if(typeof callback != "function") {
                    callback = function() {};
                }
                var is_ie_11 = (NPCCIF.age.search("msie") == -1 && NPCCIF.age.search("trident") != -1 ? true : false);
                if (ccPlugin.attachEvent && typeof ccPlugin.attachEvent == "function") {
                    ccPlugin.attachEvent("on" + eventMethodName, callback);
                }
                else if (ccPlugin.addEventListener && typeof ccPlugin.addEventListener == "function") {
                    if (is_ie_11) {
                        ccPlugin["on" + eventMethodName] = callback;
                    }
                    else {
                        ccPlugin.addEventListener(eventMethodName, callback, false);
                    }
                }
                else {
                    ccPlugin["on" + eventMethodName] = callback;
                }
            }
            else {
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
     * @param ccPlugin {Object} [in] cc插件句柄
     * @param eventMethodName {string} [in] 事件方法名，必须跟插件里定义的一致，同AttachObjectEvent方法
     * @param callback {function} [in] 回调函数，参数必须跟插件定义的一致，同AttachObjectEvent方法
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示执行失败
     */
    DetachObjectEvent: function (ccPlugin, eventMethodName, callback)
    {
        try {
            if (ccPlugin && eventMethodName) {
                if(typeof callback != "function") {
                    callback = function() {};
                }

                var is_ie_11 = (NPCCIF.agt.search("msie") == -1 && NPCCIF.agt.search("trident") != -1 ? true : false);
                if (ccPlugin.detachEvent && typeof ccPlugin.detachEvent == "function") {
                    ccPlugin.detachEvent("on" + eventMethodName, callback);
                }
                else if (ccPlugin.removeEventListener && typeof ccPlugin.removeEventListener == "function") {
                    if (is_ie_11) {
                        if (typeof ccPlugin["on" + eventMethodName] != "undefined") {
                            ccPlugin["on" + eventMethodName] = "";
                            delete ccPlugin["on" + eventMethodName];
                        }
                    }
                    else {
                        ccPlugin.removeEventListener(eventMethodName, callback, false);
                    }
                }
                else {
                    if (typeof ccPlugin["on" + eventMethodName] != "undefined") {
                        ccPlugin["on" + eventMethodName] = "";
                        delete ccPlugin["on" + eventMethodName];
                    }
                }
            }
            else {
                return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_ERROR);
            }
            return new NPCCStruct.ReturnValueStruct(ErrorCode.NP_E_OK);
        }
        catch (e) {
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
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，value为窗口句柄，否则表示执行失败
     */
    GetWindowHandle : function(pw)
    {
        return NPCCIF.Common.GetPWResponse("GetWindow", pw);
    },

    /**
     * 全屏
     * @param pw {Object} pw插件句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示执行失败
     * @see 暂未使用，正在测试
     */
    FullScreen : function(pw)
    {
        return NPCCIF.Common.GetPWResponse("FullScreen", pw);
    },

    /**
     * 退出全屏
     * @param pw {Object} pw插件句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示执行失败
     * @see 暂未使用，正在测试
     */
    ExitFullScreen : function(pw)
    {
        return NPCCIF.Common.GetPWResponse("ExitFullScreen", pw);
    },

    /**
     * 设置是否重绘背景标志
     * @param pw {Object} pw插件句柄
     * @param value {int} 0为不重绘，1为重绘，当视频开始播放时应设为0，否则设为1
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示执行失败
     * @see 暂未使用，正在测试
     */
    SetEraseBkgndFlag : function(pw, value)
    {
        return NPCCIF.Common.GetPWResponse("SetEraseBkgndFlag", pw, value);
    },

    /**
     * 设置控制模式
     * @param pw {Object} pw插件句柄
     * @param mode {int} 0表示拖拽，1表示框选，框选模式时不会全屏
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示执行失败
     * @see 暂未使用，正在测试
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
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示执行失败
     * @see 暂未使用，正在测试
     */
    AppendMenuItem : function(pw, mode, itemID, itemText)
    {
        return NPCCIF.Common.GetPWResponse("AppendMenuItem", pw, mode, keyCode, text);
    },

    /**
     *  移除所有的右键菜单项
     * @param pw {Object} pw插件句柄
     * @returns {NPCCStruct.ReturnValueStruct} errorCode为0表示成功，否则表示执行失败
     * @see 暂未使用，正在测试
     */
    DeleteAllMenuItem : function(pw)
    {
        return NPCCIF.Common.GetPWResponse("DeleteAllMenuItem", pw);
    },
};