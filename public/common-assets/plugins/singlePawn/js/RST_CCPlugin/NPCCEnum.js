
/**
 * @file RST_WebSDK中使用到的所有枚举类型
 */

/**
 * RST_WebSDK中使用到的所有枚举类型
 * @class NPCCEnum
 * @autho shaosy
 * @readonly
 */
var NPCCEnum = {
    /**
     *******************************************************************************************************************
     **************************************************NPCCInterlayer.js************************************************
     *******************************************************************************************************************
     */

    /**
     * 支持的语言
     * @enum {string}
     */
    LanguageType: {
        /**
         * 中文
         * @type {string}
         */
        zh_CN: "zh_CN",
        /**
         * 英文
         * @type {string}
         */
        en: "en"
    },

    /**
     * 浏览器类型
     * @enum {string}
     */
    BrowserType: {
        /**
         * IE浏览器
         * @type {string}
         */
        "IE": "IE",
        /**
         * Chrome浏览器
         * @type {string}
         */
        "Chrome": "Chrome",
        /**
         * FireFox浏览器
         * @type {string}
         */
        "FireFox": "FireFox",
        /**
         * Other浏览器
         * @type {string}
         */
        "Other": "Other"
    },

    /**
     *******************************************************************************************************************
     **************************************************NPCCInterface.js*************************************************
     *******************************************************************************************************************
     */

    /**
     * 插件类型
     * @enum {string}
     */
    PluginType: {
        /**
         * CC插件
         * @type {string}
         */
        CC: "CC",
        /**
         * PW窗口插件
         * @type {string}
         */
        PW: "PW",
    },

    /**
     *  代理类型，目前插件不支持
     *  @enum {number}
     */
    ProxyType: {
        ProxyType_NONE: 0,
        ProxyType_HTTP: 1,
        ProxyType_SOCK4: 2,
        ProxyType_SOCK5: 3,
        ProxyType_NTLM: 4
    },

    /**
     * 流类型
     * @enum {number}
     */
    StreamType: {
        /**
         * 存储流
         * @type {int}
         */
        ST_MainStream: 0,
        /**
         * 实时流
         * @type {int}
         */
        ST_SubStream: 1,
    },

    /**
     * 视频算法，仅对转码流有效
     * @enum {number}
     */
    StreamVideoAlg: {
        /**
         * H264解码
         * @type {int}
         */
        SVA_H264: 0,
        /**
         * MPEG4解码
         * @type {int}
         */
        SVA_MPEG4: 1,
    },

    /**
     * 停止预览资源类型
     * @enum {number}
     */
    StopRealtimePreviewType: {
        /**
         * 视频
         * @type {int}
         */
        SREP_VIDEO: 0x01,
        /**
         * 音频
         * @type {int}
         */
        SREP_AUDIO: 0x10,
        /**
         * 视频或音频
         * @type {int}
         */
        SREP_ALL: 	0x01 | 0x10,
    },

    /**
     * 流状态描述
     * @enum {string}
     */
    StreamStatusDesc: {
        /**
         * 未知状态
         * @type {string}
         */
        "0": {
            "zh_CN": "未知状态",
            "en": "Unknown state"
        },
        /**
         * 正在连接...
         * @type {string}
         */
        "1": {
            "zh_CN": "正在连接...",
            "en": "Connecting..."
        },
        /**
         * 已连接成功...
         @type {string}
         */
        "2": {
            "zh_CN": "已连接成功...",
            "en": "Connected success..."
        },
        /**
         * 正在读取视频流
         @type {string}
         */
        "3": {
            "zh_CN": "正在读取视频流",
            "en": "Read the video streaming"
        },
        /**
         * 视频尺寸有效
         @type {string}
         */
        "4": {
            "zh_CN": "视频尺寸有效",
            "en": "Video size effectively"
        },
        /**
         * 正在连接...
         @type {string}
         */
        "5": {
            "zh_CN": "正在连接...",
            "en": "Connecting..."
        },
        /**
         * 已连接成功...
         @type {string}
         */
        "6": {
            "zh_CN": "已连接成功...",
            "en": "Connected success..."
        },
        /**
         * 正在读取音频流
         @type {string}
         */
        "7": {
            "zh_CN": "正在读取音频流",
            "en": "Read the audio streaming"
        },
        /**
         * 正在读取对讲流
         @type {string}
         */
        "8": {
            "zh_CN": "正在读取对讲流",
            "en": "Read the talkback streaming"
        },
    },


    /**
     * 资源类型
     * @enum {number}
     */
    ResType: {
        /**
         * 设备资源
         * @type {int}
         */
        RES_TYPE_DEV: 0,
        /**
         * 摄像头资源
         * @type {int}
         */
        RES_TYPE_CAM: 4,
        /**
         * 音频资源
         * @type {int}
         */
        RES_TYPE_AUD: 5,
        /**
         * 对讲资源
         * @type {int}
         */
        RES_TYPE_TBK: 6,
        /**
         * 定位资源
         * @type {int}
         */
        RES_TYPE_LOC: 13,
        /**
         * 云台资源
         * @type {int}
         */
        RES_TYPE_PTZ: 25,
    },

    /**
     * 型号类型
     * @enum {number}
     */
    ModelType: {
        /**
         * 有线编码器
         * @type {int}
         */
        MODEL_TYPE_ENC: 0,
        /**
         * 无线编码器
         * @type {int}
         */
        MODEL_TYPE_WENC: 1,
        /**
         * 存储器
         * @type {int}
         */
        MODEL_TYPE_OSS: 4,
    },

    /**
     * 子用户类型
     * @enum {number}
     */
    UserType: {
        /**
         * 普通用户
         * @type {int}
         */
        UserType_Normal: 0,
        /**
         * 集群用户
         * @type {int}
         */
        UserType_Group: 1,
    },

    /**
     * 定位状态
     * @enum {number}
     */
    LocationStatus: {
        /**
         * 无模块
         * @type {int}
         */
        LocationStatus_NoModule: 0,
        /**
         * 无信号
         * @type {int}
         */
        LocationStatus_NoSignal: 1,
        /**
         * 正常
         * @type {int}
         */
        LocationStatus_HasSignal: 2,
    },

    /**
     * CC事件方法
     * @enum {string}
     */
    CCObjectNotify: {
        /**
         * 接收平台(设备)事件通知
         * @type {string}
         */
        "event_notify": "event_notify",
        /**
         * 接收流状态通知
         * @type {string}
         */
        "stream_status_notify": "stream_status_notify",
        /**
         * 接收对讲或喊话状态通知
         * @type {string}
         */
        "call_stream_status_notify": "call_stream_status_notify",
        /**
         * 接收定位数据通知
         * @type {string}
         */
        "location_data_notify": "location_data_notify",
    },

    /**
     * 事件ID
     * @enum {number}
     */
    Notification: {
        /**
         * 平台断开
         * @type {int}
         */
        RST_EVT_SERVER_ConnectionBreak: 0x1001,
        /**
         * 设备上线
         * @type {int}
         */
        RST_EVT_PU_Online: 0x1002,
        /**
         * 设备下线
         * @type {int}
         */
        RST_EVT_PU_Offline: 0x1003,
    }
}
