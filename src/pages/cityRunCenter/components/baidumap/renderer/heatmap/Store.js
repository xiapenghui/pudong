export default class Store {
    constructor(props) {
        let {xField, yField, valueField, radius} = props;
        this._xField = xField;//x坐标的字段
        this._yField = yField;//y坐标的字段
        this._valueField = valueField;//value字段
        this._radius = radius;//点的半径

        this._coordinator = {};
        this._data = [];//数据的缓存
        this._radi = [];//点半径缓存（在数据中可以自定义半径，不使用全局半径）
        this._min = 10;
        this._max = 1;
    }


    get xField() {
        return this._xField;
    }

    set xField(value) {
        this._xField = value;
    }

    get yField() {
        return this._yField;
    }

    set yField(value) {
        this._yField = value;
    }

    get valueField() {
        return this._valueField;
    }

    set valueField(value) {
        this._valueField = value;
    }

    get radius() {
        return this._radius;
    }

    set radius(value) {
        this._radius = value;
    }

    /**
     * 组织数据
     *
     * @param dataPoint - 数据对象
     * @param forceRender - 是否立即重新渲染，最大最小值发生改变之后立即渲染
     * @return {boolean|{min: (number|*|Boolean.value), max: (number|*|Boolean.value), x: *, y: *, radius: *, value: (*|number)}}
     * @private
     */
    _organiseData(dataPoint, forceRender) {
        let x = dataPoint[this.xField];
        let y = dataPoint[this.yField];
        let radi = this._radi;
        let store = this._data;
        let max = this._max;
        let min = this._min;
        let value = dataPoint[this._valueField] || 1;//value值不存在的情况下使用默认值1
        let radius = dataPoint.radius || this.radius;//radius值不存在的情况下默认使用全局radius值

        //使用离散数组存储数据（类似键值对的方式）,arr[x][y] = value,x为x坐标分量，y为y坐标分量
        if (!store[x]) {
            store[x] = [];
            radi[x] = [];
        }

        if (!store[x][y]) {
            store[x][y] = value;
            radi[x][y] = radius;
        } else {
            //同一个点出现多次，将权重相加
            store[x][y] += value;
        }
        let storedVal = store[x][y];

        if (storedVal > max) {
            if (!forceRender) {
                this._max = storedVal;
            } else {
                this.setDataMax(storedVal);
            }
            return false;
        } else if (storedVal < min) {
            if (!forceRender) {
                this._min = storedVal;
            } else {
                this.setDataMin(storedVal);
            }
            return false;
        } else {
            return {
                x: x,
                y: y,
                value: value,
                radius: radius,
                min: min,
                max: max
            };
        }
    }

    /**
     * 获取重组织过的数据
     *
     * @return {{min: (number|*|Boolean.value), data: Array, max: (number|*|Boolean.value)}}
     * @private
     */
    _unOrganizeData() {
        let unorganizedData = [];
        let data = this._data;
        let radi = this._radi;

        for (let x in data) {
            for (let y in data[x]) {

                unorganizedData.push({
                    x: x,
                    y: y,
                    radius: radi[x][y],
                    value: data[x][y]
                });

            }
        }
        return {
            min: this._min,
            max: this._max,
            data: unorganizedData
        };
    }

    //图例改变的事件
    _onExtremaChange() {
        this._coordinator.emit('extremachange', {
            min: this._min,
            max: this._max
        });
    }

    /**
     * 添加数据
     * @return {Store}
     */
    addData() {
        if (arguments[0].length > 0) {
            //传入的是一个数组，包含多个数据项
            let dataArr = arguments[0];
            let dataLen = dataArr.length;
            while (dataLen--) {
                this.addData.call(this, dataArr[dataLen]);
            }
        } else {
            // add to store
            let organisedEntry = this._organiseData(arguments[0], true);
            if (organisedEntry) {
                // if it's the first datapoint initialize the extremas with it
                if (this._data.length === 0) {
                    this._min = this._max = organisedEntry.value;
                }
                this._coordinator.emit('renderpartial', {
                    min: this._min,
                    max: this._max,
                    data: [organisedEntry]
                });
            }
        }
        return this;
    }

    setData(data) {
        let dataPoints = data.data;
        let pointsLen = dataPoints.length;


        // reset data arrays
        this._data = [];
        this._radi = [];

        this._max = data.max;
        this._min = data.min || 0;
        for (let i = 0; i < pointsLen; i++) {
            this._organiseData(dataPoints[i], false);
        }

        this._onExtremaChange();
        this._coordinator.emit('renderall', this._getInternalData());
        return this;
    }

    removeData() {
        // TODO: implement
    }

    setDataMax(max) {
        this._max = max;
        this._onExtremaChange();
        this._coordinator.emit('renderall', this._getInternalData());
        return this;
    }

    setDataMin(min) {
        this._min = min;
        this._onExtremaChange();
        this._coordinator.emit('renderall', this._getInternalData());
        return this;
    }

    setCoordinator(coordinator) {
        this._coordinator = coordinator;
    }

    _getInternalData() {
        return {
            max: this._max,
            min: this._min,
            data: this._data,
            radi: this._radi
        };
    }

    getData() {
        return this._unOrganizeData();
    }
}
