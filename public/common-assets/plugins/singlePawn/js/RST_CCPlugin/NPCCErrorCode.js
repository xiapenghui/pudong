
/**
 * RST_WebSDK中使用到的所有错误码
 * @class ErrorCode
 * @autho shaosy
 * @readonly
 */
var ErrorCode = {
    language : NPCCEnum.LanguageType.zh_CN,

    /**
     * 错误码翻译
     * @param errorCode {int}  [in]  错误码
     * @returns {string} 描述
     */
    Error2Desc : function (errorCode) {
        try
        {
            var detail = this.language == "zh_CN" ? "未知错误" : "Unknown error";
            switch (errorCode)
            {
                case this.NP_E_OK : {
                    detail = this.language == "zh_CN" ? "操作成功" : "Operator Success";
                    break;
                }
                case this.NP_E_ERROR:
                    detail = this.language == "zh_CN" ? "发生错误" : "Operator Error";
                    break;
                case this.NP_E_THREAD:
                    detail = this.language == "zh_CN" ? "抛出异常错误" : "Threading Error";
                    break;
                case this.NP_E_INITIALIZED:
                    detail = this.language == "zh_CN" ? "CC插件已初始化" : "NC Plug-in Init Success";
                    break;
                case this.NP_E_UNINITIALIZED:
                    detail = this.language == "zh_CN" ? "CC插件未初始化" : "NC Plug-in Init Failed";
                    break;
                case this.NP_E_INIT_CCPLUG_FAILED:
                    detail = this.language == "zh_CN" ? "CC插件初始化失败" : "Nrcap Plug-in Init Failed";
                    break;
                case this.NP_E_INIT_CCPPLUG_THREAD:
                    detail = this.language == "zh_CN" ? "CC插件初始化抛出异常" : "Nrcap Plug-in Init Threading Error";
                    break;
                case this.NP_E_UNLOAD_CCPLUG_FAILED:
                    detail = this.language == "zh_CN" ? "CC插件卸载失败" : "Nrcap Plug-in UnLoad Failed";
                    break;
                case this.NP_E_LOADPLUG_CC:
                    detail = this.language == "zh_CN" ? "CC未加载" : "CC Plug-in Load Failed";
                    break;
                case this.NP_E_INTERFACE_UNDEFINED:
                    detail = this.language == "zh_CN" ? "接口未定义错误" : "Interface Undefined Error";
                    break;
                case this.NP_E_CONNECT_FAILED:
                    detail = this.language == "zh_CN" ? "建立连接失败" : "Create Connection Failed";
                    break;
                case this.NP_E_CONNECTIONID_ALREADY:
                    detail = this.language == "zh_CN" ? "连接已经存在" : "Connection Existed";
                    break;
                case this.NP_E_CONNECTID_ERROR:
                    detail = this.language == "zh_CN" ? "连接ID错误" : "ConnectId Error";
                    break;
                case this.NP_E_RES_ILLEGAL:
                    detail = this.language == "zh_CN" ? "资源非法" : "Resources illegally";
                    break;
                case this.NP_E_INIT_WINDOW_FAILED:
                    detail = this.language == "zh_CN" ? "初始化窗口失败" : "Initialize window failure";
                    break;
                case this.NP_E_WINDOW_NOTEXIST:
                    detail = this.language == "zh_CN" ? "视频窗口不存在" : "Play window not exist";
                    break;
                case this.NP_E_WINDOW_NOPLAY:
                    detail = this.language == "zh_CN" ? "窗口未播放视频" : "Window does not play the video";
                    break;
                case this.NP_E_INDEX_ERROR:
                    detail = this.language == "zh_CN" ? "资源索引错误" : "Resource index error";
                    break;
                case this.NP_E_PU_OFFLINE:
                    detail = this.language == "zh_CN" ? "设备不在线" : "Device offline";
                    break;
                case this.NP_E_CALL_EXISTED:
                    detail = this.language == "zh_CN" ? "已在喊话" : "Calling";
                    break;
                case this.NP_E_TALK_EXISTED:
                    detail = this.language == "zh_CN" ? "已在对讲" : "Talking";
                    break;
                case this.NP_E_LOADPLUG_PW:
                    detail = this.language == "zh_CN" ? "PW未加载" : "PW Plug-in Load Failed";
                    break;
                case this.NP_E_LOCATION_EXISTED:
                    detail = this.language == "zh_CN" ? "定位已经存在" : "Locationing";
                    break;
                case this.NP_C_E_SET:
                    detail = this.language == "zh_CN" ? "不支持设置" : "Unsupport setting";
                    break;
                case this.NP_C_E_INVALID_COMMAND:
                    detail = this.language == "zh_CN" ? "无效的命令" : "Invalid command";
                    break;
                case this.NP_C_E_NOT_SUPPORTED:
                    detail = this.language == "zh_CN" ? "不支持" : "Unsupport operate";
                    break;
                case this.NP_C_E_INIT_FAILED:
                    detail = this.language == "zh_CN" ? "初始化失败" : "Init failed";
                    break;
                case this.NP_C_E_READ_FILE:
                    detail = this.language == "zh_CN" ? "读文件失败" : "Read file failed";
                    break;
                case this.NP_C_E_WRITE_FILE:
                    detail = this.language == "zh_CN" ? "写文件失败" : "Write file failed";
                    break;
                case this.NP_C_E_NO_MORE:
                    detail = this.language == "zh_CN" ? "没有更多" : "No data";
                    break;
                case this.NP_C_E_NEED_CONTINUE:
                    detail = this.language == "zh_CN" ? "需要继续" : "Need continue";
                    break;
                case this.NP_C_E_WOULD_BLOCK:
                    detail = this.language == "zh_CN" ? "操作正在进行中" : "Would block";
                    break;
                case this.NP_C_E_END:
                    detail = this.language == "zh_CN" ? "已结束" : "End";
                    break;
                case this.NP_C_E_AUDIO_CAPTURE:
                    detail = this.language == "zh_CN" ? "音频采集失败" : "Capture audio failed";
                    break;
                case this.NP_C_E_STREAM_TYPE:
                    detail = this.language == "zh_CN" ? "流类型不匹配" : "ConnectId Error";
                    break;
                case this.NP_C_E_LOGIN_USER_TYPE_NOT_SUPPORTED:
                    detail = this.language == "zh_CN" ? "不支持的登录用户类型" : "Type does not support the logged in user";
                    break;
                case this.NP_C_E_NO_FREE_RESOURCE:
                    detail = this.language == "zh_CN" ? "没有空闲的资源" : "No idle resources";
                    break;
                case this.NP_SU_E_TIMEOUT:
                    detail = this.language == "zh_CN" ? "命令超时" : "Timeout";
                    break;
                case this.NP_SU_E_ROUTE:
                    detail = this.language == "zh_CN" ? "路由失败" : "Routing failed";
                    break;
                case this.NP_SU_E_PERMISSION:
                    detail = this.language == "zh_CN" ? "权限不足" : "Permission denied";
                    break;
                case this.NP_SU_E_OBJ_NOT_EXIST:
                    detail = this.language == "zh_CN" ? "对象不存在" : "Object not exist";
                    break;
                case this.NP_SU_E_UNSUPPORTED_CMD:
                    detail = this.language == "zh_CN" ? "不支持的命令" : "Unsupport command";
                    break;
                case this.NP_SU_E_UNSUPPORTED_RES:
                    detail = this.language == "zh_CN" ? "不支持的资源" : "Unsupport resource";
                    break;
                case this.NP_SU_E_UNSUPPORTED_DST:
                    detail = this.language == "zh_CN" ? "不支持的目标" : "Unsupport object";
                    break;
                case this.NP_SU_E_FAKE_DOMAIN:
                    detail = this.language == "zh_CN" ? "伪造的域" : "Fake domain";
                    break;
                case this.NP_SU_E_FAKE_PRIORITY:
                    detail = this.language == "zh_CN" ? "伪造的优先级" : "Fake priority";
                    break;
                case this.NP_SU_E_NO_VALID_DISPATCHER:
                    detail = this.language == "zh_CN" ? "无有效的分发单元" : "No invalid dispacher";
                    break;
                case this.NP_SU_E_KEY_NOT_EXIST:
                    detail = this.language == "zh_CN" ? "流通道Key不存在" : "Stream key not exist";
                    break;
                case this.NP_SU_E_AM_UNIT_WRONG_PASSWORD:
                    detail = this.language == "zh_CN" ? "混音单元密码错误" : "CAM unit password error";
                    break;
                case this.NP_DB_E_PERMISSIION_DENIED:
                    detail = this.language == "zh_CN" ? "没有该操作的权限" : "Permission denied";
                    break;
                case this.NP_DB_E_OBJECT_NOT_EXIST:
                    detail = this.language == "zh_CN" ? "操作的对象不存在" : "Object not exist";
                    break;
                case this.NP_DB_E_OBJECT_ALREADY_EXIST:
                    detail = this.language == "zh_CN" ? "该对象已经存在" : "Object already exist";
                    break;
                case this.NP_DB_E_ADMIN_NOT_IN_GROUP:
                    detail = this.language == "zh_CN" ? "管理员不在集群中" : "Admin not in group";
                    break;
                case this.NP_DB_E_PLATFORM_MAX_USER_NUMNER:
                    detail = this.language == "zh_CN" ? "超过平台允许的最大用户数" : "Over the platform allows the maximum number of users";
                    break;
                case this.NP_DB_E_DOMAIN_MAX_USER_NUMBER:
                    detail = this.language == "zh_CN" ? "超过域允许的最大用户数" : "Over the domain allows the maximum number of users";
                    break;
                case this.NP_DB_E_USER_MAX_GROUP_NUMBER:
                    detail = this.language == "zh_CN" ? "超过用户允许的集群用户数" : "More than the user allow number of group users";
                    break;
                case this.NP_PU_E_INVALID_RES:
                    detail = this.language == "zh_CN" ? "无效的资源" : "Invalid resource";
                    break;
                case this.NP_PU_E_CMD_NOT_SUPPORT:
                    detail = this.language == "zh_CN" ? "命令不支持" : "Command not support";
                    break;
                case this.NP_PU_E_CMD_FAILED:
                    detail = this.language == "zh_CN" ? "命令执行失败" : "Failed to execute the command";
                    break;
                case this.NP_PU_E_FLOW_TIME_LACK:
                    detail = this.language == "zh_CN" ? "流量或时间不足" : "Flow or lack of time";
                    break;
                case this.NP_PU_E_RES_DISABLED:
                    detail = this.language == "zh_CN" ? "资源被禁用" : "Resource is disabled";
                    break;
                case this.NP_PU_E_STREAM_DISABLED:
                    detail = this.language == "zh_CN" ? "流被禁用" : "Stream is disabled";
                    break;
                case this.NP_PU_E_WRONG_STATE:
                    detail = this.language == "zh_CN" ? "错误的状态" : "Wrong state";
                    break;
                case this.NP_PU_E_OVERFLOW:
                    detail = this.language == "zh_CN" ? "溢出" : "Overflow";
                    break;
                case this.NP_PU_E_DATA_CORRUPT:
                    detail = this.language == "zh_CN" ? "数据损坏" : "Data corruption";
                    break;
                case this.NP_PU_E_OPEN:
                    detail = this.language == "zh_CN" ? "打开文件错误" : "Open file error";
                    break;
                case this.NP_PU_E_READ:
                    detail = this.language == "zh_CN" ? "读取文件错误" : "Read file error";
                    break;
                case this.NP_PU_E_WRITE:
                    detail = this.language == "zh_CN" ? "写入文件错误" : "Write file error";
                    break;
                case this.NP_PU_E_NOT_MATCH:
                    detail = this.language == "zh_CN" ? "不匹配" : "Not match";
                    break;
                case this.NP_PU_E_CONTINUE:
                    detail = this.language == "zh_CN" ? "继续操作" : "Continue";
                    break;
                case this.NP_PU_E_NO_DATA:
                    detail = this.language == "zh_CN" ? "无数据" : "No data";
                    break;
                case this.NP_PU_E_END:
                    detail = this.language == "zh_CN" ? "结束" : "End";
                    break;
                case this.NP_PU_E_PRIORITY:
                    detail = this.language == "zh_CN" ? "优先级不够" : "The priority is not enough";
                    break;
                case this.NP_PU_E_OCCUPIED:
                    detail = this.language == "zh_CN" ? "被占用" : "Be occupied";
                    break;
                case this.NP_PU_E_EXHAUSTED:
                    detail = this.language == "zh_CN" ? "没有资源，或资源耗尽" : "Without resources or resources";
                    break;
                case this.NP_PU_E_ONLY_ROUTE:
                    detail = this.language == "zh_CN" ? "设备处于仅路由模式" : "Device is in routing mode only";
                    break;
                case this.NP_CC_E_TIMEOUT:
                    detail = this.language == "zh_CN" ? "命令通道请求超时" : "NC request timeout";
                    break;
                case this.NP_CC_E_STATUS:
                    detail = this.language == "zh_CN" ? "错误的状态" : "State error";
                    break;
                case this.NP_CC_E_NO_EXTER_PARAM:
                    detail = this.language == "zh_CN" ? "没有扩展参数" : "No extended parameter";
                    break;
                case this.NP_CC_E_UNKNOW:
                    detail = this.language == "zh_CN" ? "未知错误" : "Unknown error";
                    break;
                case this.NP_CC_E_UNREACHABLE:
                    detail = this.language == "zh_CN" ? "无法连接至目标服务器" : "The server address or port is unreachable";
                    break;
                case this.NP_CC_E_CONNECT_TIMEOUT:
                    detail = this.language == "zh_CN" ? "网络连接超时" : "Command connection timeout";
                    break;
                case this.NP_CC_E_MEMORY_ALLOC:
                    detail = this.language == "zh_CN" ? "内存分配失败" : "Memory allocation error";
                    break;
                case this.NP_CC_E_SEND_CMD:
                    detail = this.language == "zh_CN" ? "发送网络命令失败" : "Error occurred in sending data";
                    break;
                case this.NP_CC_E_RECEIVE_CMD:
                    detail = this.language == "zh_CN" ? "接收网络命令失败" : "Error occurred in receiving data";
                    break;
                case this.NP_CC_E_OPERATOR_TERMINATED:
                    detail = this.language == "zh_CN" ? "操作被中断" : "Operation is terminated";
                    break;
                case this.NP_CC_E_ROUTE:
                    detail = this.language == "zh_CN" ? "路由失败" : "Route failed";
                    break;
                case this.NP_CC_E_NOT_SERVER:
                    detail = this.language == "zh_CN" ? "服务未开启" : "Service not running";
                    break;
                case this.NP_CC_E_ADDRESS_UNREACHABLE:
                    detail = this.language == "zh_CN" ? "无法连接至目标服务器" : "The server address or port is unreachable";
                    break;
                case this.NP_CC_E_EXTER_PARAM_LEN:
                    detail = this.language == "zh_CN" ? "网络连接异常1" : "The returned length of extended parameter is wrong when registering";
                    break;
                case this.NP_CC_E_NO_CONTENT_LEN:
                    detail = this.language == "zh_CN" ? "网络连接异常2" : "Return no content length in HTTP header when registering";
                    break;
                case this.NP_CC_E_CONTENT_LEN_OVERFLOW:
                    detail = this.language == "zh_CN" ? "网络连接异常3" : "Return content length overflow in HTTP header when registering";
                    break;
                case this.NP_CC_E_NO_XML_HEADER:
                    detail = this.language == "zh_CN" ? "网络连接异常4" : "Return no XML header in HTTP content when registering";
                    break;
                case this.NP_CC_E_XML_FORMAT:
                    detail = this.language == "zh_CN" ? "网络连接异常" : "Return XML format error in HTTP content when registering";
                    break;
                case this.NP_CC_E_REDIRECT:
                    detail = this.language == "zh_CN" ? "网络连接重定向异常" : "The returned result in redirecting message is wrong when registering";
                    break;
                case this.NP_CC_E_RECEIVE_CMD_START_CHARACTER:
                    detail = this.language == "zh_CN" ? "接收命令时起始字符错误" : "Starting characters error when receiving command";
                    break;
                case this.NP_CC_E_RECEIVE_CMD_VERSION:
                    detail = this.language == "zh_CN" ? "接收命令时版本错误" : "Version error when receiving command";
                    break;
                case this.NP_CC_E_RECEIVE_CMD_CONTROL_FILED:
                    detail = this.language == "zh_CN" ? "接收命令时控制字段错误" : "Control field error when receiving command";
                    break;
                case this.NP_CC_E_RECEIVE_CMD_MSG_TYPE:
                    detail = this.language == "zh_CN" ? "接收命令时消息类型错误" : "Message type error when receiving command";
                    break;
                case this.NP_CC_E_RECEIVE_CMD_PACKAGE_LEN:
                    detail = this.language == "zh_CN" ? "接收命令时包长度错误" : "Packet length error when receiving command";
                    break;
                case this.NP_CC_E_RECEIVE_CMD_PACKAGE_TYPE:
                    detail = this.language == "zh_CN" ? "接收命令时包类型错误" : "Packet type error when receiving command";
                    break;
                case this.NP_CC_E_RECEIVE_CMD_PACKAGE_BODY_LEN:
                    detail = this.language == "zh_CN" ? "接收命令时包体长度不合法" : "Packet body length is illegal when receiving command";
                    break;
                case this.NP_CC_E_CONNECT_UNKNOW:
                    detail = this.language == "zh_CN" ? "网络连接未知错误" : "Returned an unknown error in registration";
                    break;
                case this.NP_CC_E_CERT_TIMEOUT:
                    detail = this.language == "zh_CN" ? "用户认证超时" : "Certification timeout";
                    break;
                case this.NP_CC_E_ROUTE_FAILED:
                    detail = this.language == "zh_CN" ? "命令寻路中断" : "Route failed";
                    break;
                case this.NP_CC_E_USER_NOT_EXIST:
                    detail = this.language == "zh_CN" ? "用户名不存在" : "User does not exist";
                    break;
                case this.NP_CC_E_DOMAIN_NOT_EXIST:
                    detail = this.language == "zh_CN" ? "域不存在" : "Domain does not exist";
                    break;
                case this.NP_CC_E_USER_DISABLE:
                    detail = this.language == "zh_CN" ? "用户名不可用" : "User is disabled";
                    break;
                case this.NP_CC_E_DOMAIN_DISABLE:
                    detail = this.language == "zh_CN" ? "域不可用" : "Domain is disabled";
                    break;
                case this.NP_CC_E_ONLINE_USER_FULL:
                    detail = this.language == "zh_CN" ? "在线用户数已达到最大" : "The online user is full already";
                    break;
                case this.NP_CC_E_DOMAIN_ONLINE_USER_LIMIT:
                    detail = this.language == "zh_CN" ? "域在线用户数已达到最大" : "Exceed the maximum number of online users domain limited";
                    break;
                case this.NP_CC_E_SERVER_ONLINE_USER_LIMIT:
                    detail = this.language == "zh_CN" ? "平台在线用户数已达到最大" : "Exceed the maximum number of online users server limited";
                    break;
                case this.NP_CC_E_PASSWORD:
                    detail = this.language == "zh_CN" ? "用户密码验证失败" : "Password error";
                    break;
                case this.NP_CC_E_AUTH_KEY:
                    detail = this.language == "zh_CN" ? "认证密钥验证失败" : "Invalid auth key";
                    break;
                case this.NP_CC_E_WHITELIST_AUTH:
                    detail = this.language == "zh_CN" ? "白名单验证失败" : "Whitelist auth failure";
                    break;
                case this.NP_CC_E_ILLEGAL_DEVICE:
                    detail = this.language == "zh_CN" ? "用户使用非法设备登录" : "Illegal device login";
                    break;
                case this.NP_CC_E_UNDERFINED_IN_REDIRECT:
                    detail = this.language == "zh_CN" ? "网络连接重定向错误" : "Return undefined error in redirecting";
                    break;
                case this.NP_CC_E_MSG_FORMAT:
                    detail = this.language == "zh_CN" ? "网络命令格式错误" : "Message format error";
                    break;
                case this.NP_CC_E_NO_SUPPORTED_TERMINAL_TYPE:
                    detail = this.language == "zh_CN" ? "不支持的终端类型" : "Unsupported terminal type";
                    break;
                case this.NP_CC_E_NO_ONLINE_SERVER_OF_USER:
                    detail = this.language == "zh_CN" ? "用户接入网关不在线" : "No online server for user access";
                    break;
                case this.NP_CC_E_NO_REDIRECT_SUPPORTED_SERVER_OF_USER:
                    detail = this.language == "zh_CN" ? "用户接入网关不支持重定向" : "No redirection-supported server for user access";
                    break;
                case this.NP_CC_E_NO_SUPPORTED_VID:
                    detail = this.language == "zh_CN" ? "不支持的厂商" : "Do not support the vendor ID";
                    break;
                case this.NP_CC_E_OPERATOR:
                    detail = this.language == "zh_CN" ? "操作暂时无法完成" : "The operation is unable to be completed temporarily";
                    break;
                case this.NP_CC_E_FRAME_LEN:
                    detail = this.language == "zh_CN" ? "数据帧长度错误" : "Frame length error";
                    break;
                case this.NP_CC_E_RECEIVE_END_PACKAGE:
                    detail = this.language == "zh_CN" ? "接收到结束包" : "Receiving the end packet";
                    break;
                case this.NP_CC_E_PARAME:
                    detail = this.language == "zh_CN" ? "参数错误" : "Parameter error";
                    break;
                case this.NP_CC_E_INVALID_DATA_CHANNEL:
                    detail = this.language == "zh_CN" ? "无效的流通道" : "Invalid data channel handle";
                    break;
                case this.NP_CC_E_MEMORY:
                    detail = this.language == "zh_CN" ? "内存分配失败" : "Memory error";
                    break;
                case this.NP_CC_E_CHANNEL_TIMEOUT:
                    detail = this.language == "zh_CN" ? "网络连接超时" : "Request for data channel timeout";
                    break;
                case this.NP_CC_E_CONNECT:
                    detail = this.language == "zh_CN" ? "网络连接异常" : "Connection error";
                    break;
                case this.NP_CC_E_SEND_TCP:
                    detail = this.language == "zh_CN" ? "网络数据发送失败" : "Sending TCP error";
                    break;
                case this.NP_CC_E_RECEIVE_TCP:
                    detail = this.language == "zh_CN" ? "网络数据接收失败" : "Receiving TCP error";
                    break;
                case this.NP_CC_E_INVALID_TOKEN:
                    detail = this.language == "zh_CN" ? "无效的令牌" : "Invalid token";
                    break;
                case this.NP_CC_E_CHANNEL_TYPE:
                    detail = this.language == "zh_CN" ? "通道类型错误" : "Channel type error";
                    break;
                case this.NP_CC_E_CHANNLE_EXIST:
                    detail = this.language == "zh_CN" ? "该通道已存在" : "Channel already exists";
                    break;
                case this.NP_CC_E_PACKAGE_VERSION:
                    detail = this.language == "zh_CN" ? "包版本错误" : "Packet version error";
                    break;
                case this.NP_CC_E_PACKAGE_TYPE:
                    detail = this.language == "zh_CN" ? "包类型错误" : "Packet type error";
                    break;
                case this.NP_CC_E_PACKAGE_LEN:
                    detail = this.language == "zh_CN" ? "包长度错误" : "Packet length error";
                    break;
                case this.NP_CC_E_FRAME_START_FLAG:
                    detail = this.language == "zh_CN" ? "帧开始标志错误" : "Frame starting flag error";
                    break;
                case this.NP_CC_E_FRAME_END_FLAG:
                    detail = this.language == "zh_CN" ? "帧结束标志错误" : "Frame ending flag error";
                    break;
                case this.NP_CC_E_FRAME_TYPE:
                    detail = this.language == "zh_CN" ? "帧类型错误" : "Frame type error";
                    break;
                case this.NP_CC_E_DATA_FRAME_LEN:
                    detail = this.language == "zh_CN" ? "数据帧长度错误" : "Data frame length error";
                    break;
                case this.NP_E_UNKNOWN:
                    detail = this.language == "zh_CN" ? "未知错误" : "Other error";
                    break;
                case this.NP_E_MEMORY:
                    detail = this.language == "zh_CN" ? "内存分配失败" : "Malloc failure";
                    break;
                case this.NP_E_PARAM:
                    detail = this.language == "zh_CN" ? "参数错误" : "Error parameter";
                    break;
                case this.NP_E_MESSAGE_FORMAT:
                    detail = this.language == "zh_CN" ? "报文格式错误" : "Error message format";
                    break;
            }
            return detail;
        }
        catch (e)
        {
            return "错误码解析异常";
        }
    },

    /**
     * 判断当前错误码是否为成功的
     * @param errorCode {int}  [in] 错误码
     * @returns {boolean} 是否成功 0代表失败 1表示成功
     */
    CLIENT_SUCCEEDED: function (errorCode) {
        return (errorCode >= 0x0000 && errorCode <= 0x000F)
    },

    /** 成功 */
    NP_E_OK : 0x0000,
    /** 发生错误 */
    NP_E_ERROR : 0x0200,
    /** 抛出异常错误 */
    NP_E_THREAD : 0x0201,
    /** CC插件已初始化 */
    NP_E_INITIALIZED : 0x0202,
    /** CC插件未初始化 */
    NP_E_UNINITIALIZED : 0x0203,
    /** CC插件初始化失败 */
    NP_E_INIT_CCPLUG_FAILED : 0x0204,
    /** CC插件初始化抛出异常 */
    NP_E_INIT_CCPPLUG_THREAD : 0x0305,
    /** CC插件卸载失败 */
    NP_E_UNLOAD_CCPLUG_FAILED : 0x0206,
    /** 插件未加载 */
    NP_E_LOADPLUG_CC : 0x0207,
    /** 接口未定义错误 */
    NP_E_INTERFACE_UNDEFINED : 0x0208,
    /** 建立连接失败 */
    NP_E_CONNECT_FAILED : 0x0209,
    /** 连接已经存在 */
    NP_E_CONNECTIONID_ALREADY : 0x020A,
    /** connectId错误 */
    NP_E_CONNECTID_ERROR : 0x020B,
    /** 资源非法 */
    NP_E_RES_ILLEGAL : 0x020C,
    /** 初始化窗口失败 */
    NP_E_INIT_WINDOW_FAILED : 0x020D,
    /** 视频窗口不存在 */
    NP_E_WINDOW_NOTEXIST : 0x020E,
    /** 窗口没有播放 */
    NP_E_WINDOW_NOPLAY : 0x020F,
    /** 索引错误 */
    NP_E_INDEX_ERROR : 0x0210,
    /** 设备不在线 */
    NP_E_PU_OFFLINE : 0x0211,
    /** 喊话已经存在 */
    NP_E_CALL_EXISTED : 0x0212,
    /** 对讲已经存在 */
    NP_E_TALK_EXISTED : 0x0213,
    /** PW未加载 */
    NP_E_LOADPLUG_PW : 0x0214,
    /** 定位已经存在 */
    NP_E_LOCATION_EXISTED : 0x0215,

    /** 不支持设置 */
    NP_C_E_SET : 0x0001,
    /** 无效的命令 */
    NP_C_E_INVALID_COMMAND : 0x0010,
    /** 不支持 */
    NP_C_E_NOT_SUPPORTED : 0x0011,
    /** 初始化失败 */
    NP_C_E_INIT_FAILED : 0x0012,
    /** 读文件失败 */
    NP_C_E_READ_FILE : 0x0013,
    /** 写文件失败 */
    NP_C_E_WRITE_FILE : 0x0014,
    /** 没有更多 */
    NP_C_E_NO_MORE : 0x0015,
    /** 需要继续 */
    NP_C_E_NEED_CONTINUE : 0x0016,
    /** 操作正在进行中 */
    NP_C_E_WOULD_BLOCK : 0x0017,
    /** 已结束 */
    NP_C_E_END : 0x0018,
    /** 音频采集失败 */
    NP_C_E_AUDIO_CAPTURE : 0x0019,
    /** 流类型不匹配 */
    NP_C_E_STREAM_TYPE : 0x001A,
    /** 不支持的登录用户类型 */
    NP_C_E_LOGIN_USER_TYPE_NOT_SUPPORTED : 0x001B,
    /** 没有空闲的资源 */
    NP_C_E_NO_FREE_RESOURCE : 0x001C,

    /** 命令超时 */
    NP_SU_E_TIMEOUT : 0x1001,
    /** 路由失败 */
    NP_SU_E_ROUTE : 0x1002,
    /** 权限不足 */
    NP_SU_E_PERMISSION : 0x1003,
    /** 对象不存在 */
    NP_SU_E_OBJ_NOT_EXIST : 0x1004,
    /** 不支持的命令 */
    NP_SU_E_UNSUPPORTED_CMD : 0x1005,
    /** 不支持的资源 */
    NP_SU_E_UNSUPPORTED_RES : 0x1006,
    /** 不支持的目标 */
    NP_SU_E_UNSUPPORTED_DST : 0x1007,
    /** 伪造的域 */
    NP_SU_E_FAKE_DOMAIN : 0x1008,
    /** 伪造的优先级 */
    NP_SU_E_FAKE_PRIORITY : 0x1009,
    /** 无有效的分发单元 */
    NP_SU_E_NO_VALID_DISPATCHER : 0x100A,
    /** 流通道Key不存在 */
    NP_SU_E_KEY_NOT_EXIST : 0x100B,
    /** 混音单元密码错误 */
    NP_SU_E_AM_UNIT_WRONG_PASSWORD : 0x100C,

    /** 没有该操作的权限 */
    NP_DB_E_PERMISSIION_DENIED: 0x1100,
    /** 操作的对象不存在 */
    NP_DB_E_OBJECT_NOT_EXIST: 0x1101,
    /** 该对象已经存在 */
    NP_DB_E_OBJECT_ALREADY_EXIST: 0x1102,
    /** 管理员不在集群中 */
    NP_DB_E_ADMIN_NOT_IN_GROUP: 0x1103,
    /** 超过平台允许的最大用户数 */
    NP_DB_E_PLATFORM_MAX_USER_NUMNER: 0x1104,
    /** 超过域允许的最大用户数 */
    NP_DB_E_DOMAIN_MAX_USER_NUMBER: 0x1105,
    /** 超过用户允许的集群用户数 */
    NP_DB_E_USER_MAX_GROUP_NUMBER: 0x1106,

    /** 无效的资源 */
    NP_PU_E_INVALID_RES : 0x2000,
    /** 命令不支持 */
    NP_PU_E_CMD_NOT_SUPPORT : 0x2001,
    /** 命令执行失败 */
    NP_PU_E_CMD_FAILED : 0x2002,
    /** 流量或时间不足 */
    NP_PU_E_FLOW_TIME_LACK : 0x2003,
    /** 资源被禁用 */
    NP_PU_E_RES_DISABLED : 0x2004,
    /** 流被禁用 */
    NP_PU_E_STREAM_DISABLED : 0x2005,
    /** 错误的状态 */
    NP_PU_E_WRONG_STATE : 0x2006,
    /** 溢出 */
    NP_PU_E_OVERFLOW : 0x2007,
    /** 数据损坏 */
    NP_PU_E_DATA_CORRUPT : 0x2008,
    /** 打开文件错误 */
    NP_PU_E_OPEN : 0x2009,
    /** 读取文件错误 */
    NP_PU_E_READ : 0x200A,
    /** 写入文件错误 */
    NP_PU_E_WRITE : 0x200B,
    /** 不匹配 */
    NP_PU_E_NOT_MATCH : 0x200C,
    /** 继续操作 */
    NP_PU_E_CONTINUE : 0x200D,
    /** 无数据 */
    NP_PU_E_NO_DATA : 0x200E,
    /** 结束 */
    NP_PU_E_END : 0x200F,
    /** 优先级不够 */
    NP_PU_E_PRIORITY : 0x2010,
    /** 被占用 */
    NP_PU_E_OCCUPIED : 0x2011,
    /** 没有资源，或资源耗尽*/
    NP_PU_E_EXHAUSTED : 0x2012,
    /** 处于仅路由模式 */
    NP_PU_E_ONLY_ROUTE : 0x2013,

    /** 命令通道请求超时 */
    NP_CC_E_TIMEOUT : 0x31FC,
    /** 错误的状态 */
    NP_CC_E_STATUS : 0x31FB,
    /** 没有扩展参数 */
    NP_CC_E_NO_EXTER_PARAM : 0x31FA,
    /** 未知错误 */
    NP_CC_E_UNKNOW : 0x3101,
    /** 无法连接至目标服务器 */
    NP_CC_E_UNREACHABLE : 0x3102,
    /** 网络连接超时 */
    NP_CC_E_CONNECT_TIMEOUT : 0x3103,
    /** 内存分配失败 */
    NP_CC_E_MEMORY_ALLOC : 0x3104,
    /** 发送网络命令失败 */
    NP_CC_E_SEND_CMD : 0x3105,
    /** 接收网络命令失败 */
    NP_CC_E_RECEIVE_CMD : 0x3106,
    /** 操作被中断 */
    NP_CC_E_OPERATOR_TERMINATED : 0x3107,
    /** 路由失败 */
    NP_CC_E_ROUTE : 0x3108,
    /** 服务未开启 */
    NP_CC_E_NOT_SERVER : 0x3109,
    /** 无法连接至目标服务器 */
    NP_CC_E_ADDRESS_UNREACHABLE : 0x310A,
    /** 网络连接异常1 */
    NP_CC_E_EXTER_PARAM_LEN : 0x3164,
    /** 网络连接异常2 */
    NP_CC_E_NO_CONTENT_LEN : 0x3165,
    /** 网络连接异常3 */
    NP_CC_E_CONTENT_LEN_OVERFLOW : 0x3166,
    /** 网络连接异常4 */
    NP_CC_E_NO_XML_HEADER : 0x3167,
    /** 网络连接异常 */
    NP_CC_E_XML_FORMAT : 0x3168,
    /** 网络连接重定向异常 */
    NP_CC_E_REDIRECT : 0x3169,
    /** 接收命令时起始字符错误 */
    NP_CC_E_RECEIVE_CMD_START_CHARACTER : 0x3179,
    /** 接收命令时版本错误 */
    NP_CC_E_RECEIVE_CMD_VERSION : 0x317A,
    /** 接收命令时控制字段错误 */
    NP_CC_E_RECEIVE_CMD_CONTROL_FILED : 0x317B,
    /** 接收命令时消息类型错误 */
    NP_CC_E_RECEIVE_CMD_MSG_TYPE : 0x317C,
    /** 接收命令时包长度错误 */
    NP_CC_E_RECEIVE_CMD_PACKAGE_LEN : 0x317D,
    /** 接收命令时包类型错误 */
    NP_CC_E_RECEIVE_CMD_PACKAGE_TYPE : 0x317E,
    /** 接收命令时包体长度不合法 */
    NP_CC_E_RECEIVE_CMD_PACKAGE_BODY_LEN : 0x317F,
    /** 网络连接未知错误 */
    NP_CC_E_CONNECT_UNKNOW : 0x318B,
    /** 用户认证超时 */
    NP_CC_E_CERT_TIMEOUT : 0x318D,
    /** 命令寻路中断 */
    NP_CC_E_ROUTE_FAILED : 0x318E,
    /** 用户名不存在 */
    NP_CC_E_USER_NOT_EXIST : 0x318F,
    /** 域不存在 */
    NP_CC_E_DOMAIN_NOT_EXIST : 0x3190,
    /** 用户名不可用 */
    NP_CC_E_USER_DISABLE : 0x3191,
    /** 域不可用 */
    NP_CC_E_DOMAIN_DISABLE : 0x3192,
    /** 在线用户数已达到最大 */
    NP_CC_E_ONLINE_USER_FULL : 0x3193,
    /** 域在线用户数已达到最大 */
    NP_CC_E_DOMAIN_ONLINE_USER_LIMIT : 0x3194,
    /** 平台在线用户数已达到最大 */
    NP_CC_E_SERVER_ONLINE_USER_LIMIT : 0x3195,
    /** 用户密码验证失败 */
    NP_CC_E_PASSWORD : 0x3196,
    /** 认证密钥验证失败 */
    NP_CC_E_AUTH_KEY : 0x3197,
    /** 白名单验证失败 */
    NP_CC_E_WHITELIST_AUTH : 0x3198,
    /** 用户使用非法设备登录 */
    NP_CC_E_ILLEGAL_DEVICE : 0x3199,
    /** 网络连接重定向错误 */
    NP_CC_E_UNDERFINED_IN_REDIRECT : 0x31B3,
    /** 网络命令格式错误 */
    NP_CC_E_MSG_FORMAT : 0x31B5,
    /** 不支持的终端类型 */
    NP_CC_E_NO_SUPPORTED_TERMINAL_TYPE : 0x31B6,
    /** 用户接入网关不在线 */
    NP_CC_E_NO_ONLINE_SERVER_OF_USER : 0x31B7,
    /** 用户接入网关不支持重定向 */
    NP_CC_E_NO_REDIRECT_SUPPORTED_SERVER_OF_USER : 0x31B8,
    /** 不支持的厂商 */
    NP_CC_E_NO_SUPPORTED_VID : 0x31B9,
    /** 操作暂时无法完成 */
    NP_CC_E_OPERATOR : 0x32FE,
    /** 数据帧长度错误 */
    NP_CC_E_FRAME_LEN : 0x32FD,
    /** 接收到结束包 */
    NP_CC_E_RECEIVE_END_PACKAGE : 0x32FC,
    /** 参数错误 */
    NP_CC_E_PARAME : 0x3202,
    /** 无效的流通道 */
    NP_CC_E_INVALID_DATA_CHANNEL : 0x3203,
    /** 内存分配失败 */
    NP_CC_E_MEMORY : 0x3204,
    /** 网络连接超时 */
    NP_CC_E_CHANNEL_TIMEOUT : 0x3205,
    /** 网络连接异常 */
    NP_CC_E_CONNECT : 0x3206,
    /** 网络数据发送失败 */
    NP_CC_E_SEND_TCP : 0x3207,
    /** 网络数据接收失败 */
    NP_CC_E_RECEIVE_TCP : 0x3208,
    /** 无效的令牌 */
    NP_CC_E_INVALID_TOKEN : 0x3265,
    /** 通道类型错误 */
    NP_CC_E_CHANNEL_TYPE : 0x3266,
    /** 该通道已存在 */
    NP_CC_E_CHANNLE_EXIST : 0x3267,
    /** 包版本错误 */
    NP_CC_E_PACKAGE_VERSION : 0x32C9,
    /** 包类型错误 */
    NP_CC_E_PACKAGE_TYPE : 0x32CA,
    /** 包长度错误 */
    NP_CC_E_PACKAGE_LEN : 0x32CB,
    /** 帧开始标志错误 */
    NP_CC_E_FRAME_START_FLAG : 0x32CC,
    /** 帧结束标志错误 */
    NP_CC_E_FRAME_END_FLAG : 0x32CD,
    /** 帧类型错误 */
    NP_CC_E_FRAME_TYPE : 0x32D3,
    /** 数据帧长度错误 */
    NP_CC_E_DATA_FRAME_LEN : 0x32D4,

    /** 未知错误 */
    NP_E_UNKNOWN : 0xFFFF,
    /** 内存分配失败 */
    NP_E_MEMORY : 0xFFFE,
    /** 参数错误/不合法 */
    NP_E_PARAM : 0xFFFD,
    /** 报文格式错误/不合法 */
    NP_E_MESSAGE_FORMAT : 0xFFFC,
};