
/**
 * @file 一些通用方法
 */

/**
 * @class NPCCUtils
 * @autho shaosy
 */
var NPCCUtils = {
    /**
     * 哈希表对象
     * @memberof NPCCUtils
     * @constructor
     */
    Hash : function ()
    {
        var size = 0;
        var entry = new Object();
        this.set = function (key, value)
        {
            if (typeof key == "undefined" || key == null || key == "") {
                return false;
            }
            if (!this.containsKey(key)) {
                size++;
            }
            entry[key] = typeof value != "undefined" ? value : null;
        };

        this.unset = function (key)
        {
            if (this.containsKey(key)) {
                this.remove(key);
            }
        };

        this.get = function (key)
        {
            return this.containsKey(key) ? entry[key] : null;
        };

        this.remove = function (key)
        {
            if (this.containsKey(key) && (delete entry[key])) {
                size--;
            }
        };

        this.containsKey = function (key)
        {
            return (key in entry);
        };

        this.containsValue = function (value)
        {
            for (var prop in entry) {
                if (entry[prop] == value) {
                    return true;
                }
            }
            return false;
        };

        this.keys = function ()
        {
            var _keys = new Array();
            for (var prop in entry) {
                _keys.push(prop);
            }
            return _keys;
        };

        this.values = function ()
        {
            var _values = new Array();
            for (var prop in entry) {
                _values.push(entry[prop]);
            }
            return _values;
        };

        this.size = function ()
        {
            return size || 0;
        };

        this.clear = function ()
        {
            size = 0;
            entry = new Object();
        };

        this._self = function ()
        {
            return entry;
        };

        this.each = function (iterator, content)
        {
            var iterator = iterator || function () {};
            var content = content || this;
            var i = 0;
            for (var prop in entry) {
                var item = {
                    key : prop, value : entry[prop]
                };
                if (iterator.call(content, item, i++)) {
                    break;
                }
            }
            i = 0;
        };

        this.any = function (iterator, content)
        {
            var iterator = iterator || function () {};
            var content = content || this;
            var i = 0;
            for (var prop in entry) {
                var item = {
                    key : prop, value : entry[prop]
                };
                if (iterator.call(content, item, i++)) {
                    return true;
                    break;
                }
            };
            return false;
        };

        this.all = function (iterator, content)
        {
            var iterator = iterator || function () {};
            var content = content || this;
            var i = 0;
            for (var prop in entry) {
                var item = {
                    key : prop, value : entry[prop]
                };
                if (!iterator.call(content, item, i++)) {
                    return false;
                    break;
                }
            };
            return true;
        };
    },

    /**
     * 格式化返回当前客户端系统时间
     * @param mask {string} 时间样式
     * @param d {Date} 当天的日期和时间
     */
    DateFormat : function (mask, d)
    {
        if (typeof d == "undefined" || !d instanceof Date) {
            d = new Date();
        }
        if (typeof mask == "undefined" || mask == "" || mask == null) {
            mask = "yyyy-MM-dd HH:mm:ss";
        }
        return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|[m|M]{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g,
            function ($0)
            {
                var _zeroize = NPCCUtils.Zeroize || function (_me)
                {
                    return _me;
                };
                switch ($0)
                {
                    case 'd':
                        return d.getDate();
                    case 'dd':
                        return _zeroize(d.getDate());
                    case 'ddd':
                        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];
                    case 'dddd':
                        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
                    case 'M':
                        return d.getMonth() + 1;
                    case 'MM':
                        return _zeroize(d.getMonth() + 1);
                    case 'MMM':
                        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
                    case 'MMMM':
                        return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
                            'October', 'November', 'December'][d.getMonth()];
                    case 'yy':
                        return String(d.getFullYear()).substr(2);
                    case 'yyyy':
                        return d.getFullYear();
                    case 'h':
                        return d.getHours() % 12 || 12;
                    case 'hh':
                        return _zeroize(d.getHours() % 12 || 12);
                    case 'H':
                        return d.getHours();
                    case 'HH':
                        return _zeroize(d.getHours());
                    case 'm':
                        return d.getMinutes();
                    case 'mm':
                        return _zeroize(d.getMinutes());
                    case 's':
                        return d.getSeconds();
                    case 'ss':
                        return _zeroize(d.getSeconds());
                    case 'l':
                        return _zeroize(d.getMilliseconds(), 3);
                    case 'L':
                        var m = d.getMilliseconds();
                        if (m > 99) {
                            m = Math.round(m  / 10);
                        }
                        return _zeroize(m);
                    case 'tt':
                        return d.getHours() < 12 ? 'am' : 'pm';
                    case 'TT':
                        return d.getHours() < 12 ? 'AM' : 'PM';
                    case 'Z':
                        return d.toUTCString().match(/[A-Z]+$/);
                    default:
                        return $0.substr(1, $0.length - 2);
                }
            });
    },

    /**
     * 根据长度左补零
     * @param value 需要补零的值
     * @param length 需要补零的值的长度
     * @returns {string}
     */
    Zeroize : function (value, length)
    {
        if (!length) {
            length = 2;
        }
        value = String(value);
        for (var i = 0, zeros = ''; i < (length - value.length); i++) {
            zeros += '0';
        }
        return zeros + value;
    },

    /**
     * 定时器对象
     * @memberof NPCCUtils
     * @constructor
     */
    Timer : {
        /** @property {int} 定时器间隔 */
        interval : 100,
        /** @property {int} 定时器个数 */
        count : 0,
        /** @property {Object} 定时器句柄 */
        timer : null,
        /** @property {NPCCUtils.Hash} 定时器回调 */
        events: null,

        /**
         * 启动定时器
         * @returns {boolean}
         */
        Start : function ()
        {
            try
            {
                if (NPPUtils.Timer.timer == null)
                {
                    NPPUtils.Timer.timer = setInterval
                    (
                        NPPUtils.Timer.Call,
                        NPPUtils.Timer.interval
                    );
                }

                return true;
            }
            catch(e) {
                return false;
            }
        },

        /**
         * 停止定时器
         * @returns {boolean}
         * @constructor
         */
        Stop : function ()
        {
            try
            {
                if (NPPUtils.Timer.timer != null)
                {
                    clearInterval(NPPUtils.Timer.timer);
                    NPPUtils.Timer.timer = null;
                    NPPUtils.Timer.events = new NPPUtils.Hash();
                    NPPUtils.Timer.count = 0;
                }

                return true;
            }
            catch(e) {
                return false;
            }
        },

        Set : function (ev, cb)
        {
            try
            {
                if (NPPUtils.Timer.events == null || !NPPUtils.Timer.events instanceof NPPUtils.Hash)
                {
                    NPPUtils.Timer.events = new NPPUtils.Hash();
                }

                if (typeof NPPUtils.Timer.events == "undefined")
                {
                    return false;
                }

                if (typeof cb != "object" || typeof cb.name != "string" || typeof cb.fu != "function")
                {
                    return false;
                }

                if (!NPPUtils.Timer.events.get(ev))
                {
                    NPPUtils.Timer.events.set(ev, new NPPUtils.Hash());
                }
                if (NPPUtils.Timer.events.get(ev))
                {
                    NPPUtils.Timer.events.get(ev).set
                    (
                        cb.name,
                        {
                            name : cb.name,
                            fu : cb.fu,
                            interval : cb.interval
                        }
                    );
                }

                return true;
            }
            catch(e) {
                return false;
            }
        },

        ContainsKey : function (ev, cbName)
        {
            try
            {
                if (NPPUtils.Timer.events == null || !NPPUtils.Timer.events instanceof NPPUtils.Hash)
                {
                    NPPUtils.Timer.events = new NPPUtils.Hash();
                }

                if (typeof NPPUtils.Timer.events == "undefined")
                {
                    return false;
                }

                if (!NPPUtils.Timer.events.get(ev)
                    || !cbName || !NPPUtils.Timer.events.get(ev).get(cbName))
                {
                    return false;
                }

                return true;
            }
            catch(e) {
                return false;
            }
        },

        UnSet : function (ev, cbName)
        {
            try
            {
                if (typeof NPPUtils.Timer.events == "undefined")
                {
                    return false;
                }

                if (!NPPUtils.Timer.events.get(ev))
                {
                    return false;
                }

                if (typeof cbName != "string")
                {
                    return false;
                }

                NPPUtils.Timer.events.get(ev).unset(cbName);
                return true;
            }
            catch(e) {
                return false;
            }
        },

        Call : function()
        {
            try
            {
                NPPUtils.Timer.count++;
                NPPUtils.Timer.events.each
                (
                    function (item)
                    {
                        var ev = item.value;
                        if (ev && typeof ev.each == "function")
                        {
                            ev.each
                            (
                                function (evItem)
                                {
                                    var evItemNode = evItem.value;
                                    if ((NPPUtils.Timer.count * NPPUtils.Timer.interval) % evItemNode.interval == 0)
                                    {
                                        if (typeof evItemNode.fu == "function")
                                        {
                                            evItemNode.fu();
                                        }
                                    }
                                }
                            )
                        }
                    }
                );

                if (NPPUtils.Timer.count == 100000000)
                {
                    NPPUtils.Timer.count = 0;
                }

                return true;
            }
            catch(e) {
                return false;
            }
        },

        end : true
    },

    /**
     * UTF8转Unicode
     * @param s {string}
     * @returns {string}
     */
    UTF8toUnicode : function (s)
    {
        var c, d = "", flag = 0, tmp;
        for (var i = 0; i < s.length; i++)
        {
            c = s.charCodeAt(i);
            if (flag == 0)
            {
                if ((c & 0xe0) == 0xe0) {
                    flag = 2;
                    tmp = (c & 0x0f) << 12;
                }
                else if ((c & 0xc0) == 0xc0) {
                    flag = 1;
                    tmp = (c & 0x1f) << 6;
                }
                else if ((c & 0x80) == 0) {
                    d += s.charAt(i);
                }
                else {
                    flag = 0;
                }
            }
            else if (flag == 1) {
                flag = 0;
                d += String.fromCharCode(tmp | (c & 0x3f));
            }
            else if (flag == 2) {
                flag = 3;
                tmp |= (c & 0x3f) << 6;
            }
            else if (flag == 3) {
                flag = 0;
                d += String.fromCharCode(tmp | (c & 0x3f));
            }
            else {
                flag = 0;
            }
        }
        return d;
    },

    end : true
};