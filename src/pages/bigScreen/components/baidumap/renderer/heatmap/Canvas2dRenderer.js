//计算获取渐变色的色带，在对热力图赋色的时候根据透明度（0-255）直接从色带中获取对应位置的颜色分量
let _getColorPalette = (config) => {
    //渐变色配置
    let gradientConfig = config.gradient || config.defaultGradient;
    let paletteCanvas = document.createElement('canvas');
    let paletteCtx = paletteCanvas.getContext('2d');

    paletteCanvas.width = 256;
    paletteCanvas.height = 1;

    let gradient = paletteCtx.createLinearGradient(0, 0, 256, 1);
    for (let key in gradientConfig) {
        gradient.addColorStop(key, gradientConfig[key]);
    }

    paletteCtx.fillStyle = gradient;
    paletteCtx.fillRect(0, 0, 256, 1);

    return paletteCtx.getImageData(0, 0, 256, 1).data;
};

//获取点扩散的模板，不同半径的扩散范围会重新计算，所以经量不要使用不同半径的圆，会影响性能
let _getPointTemplate = (radius, blurFactor) => {
    let tplCanvas = document.createElement('canvas');
    let tplCtx = tplCanvas.getContext('2d');
    let x = radius;
    let y = radius;
    tplCanvas.width = tplCanvas.height = radius * 2;

    if (1 === blurFactor) {
        //不做透明度光晕处理
        tplCtx.beginPath();
        tplCtx.arc(x, y, radius, 0, 2 * Math.PI, false);
        tplCtx.fillStyle = 'rgba(0,0,0,1)';
        tplCtx.fill();
    } else {
        //做透明度的径向渐变处理
        let gradient = tplCtx.createRadialGradient(x, y, radius * blurFactor, x, y, radius);
        gradient.addColorStop(0, 'rgba(0,0,0,1)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        tplCtx.fillStyle = gradient;
        tplCtx.fillRect(0, 0, 2 * radius, 2 * radius);
    }


    return tplCanvas;
};

//预处理绘制的数据，数据从store中获取
let _prepareData = (data) => {
    let renderData = [];
    let min = data.min;
    let max = data.max;
    let radi = data.radi;
    data = data.data;

    let xValues = Object.keys(data);
    let xValuesLen = xValues.length;

    while (xValuesLen--) {
        let xValue = xValues[xValuesLen];
        let yValues = Object.keys(data[xValue]);
        let yValuesLen = yValues.length;
        while (yValuesLen--) {
            let yValue = yValues[yValuesLen];
            let value = data[xValue][yValue];
            let radius = radi[xValue][yValue];
            renderData.push({
                x: xValue,
                y: yValue,
                value: value,
                radius: radius
            });
        }
    }

    return {
        min: min,
        max: max,
        data: renderData
    };
};


export default class Canvas2dRenderer {
    constructor(config) {
        // let container = config.container;
        //影子canvas，用来绘制灰度透明图，为赋色做准备工作
        let shadowCanvas = this.shadowCanvas = document.createElement('canvas');
        //实际绘制的canvas对象，在创建图层的时候创建
        let canvas = this.canvas = config.canvas;// this.canvas = config.canvas || document.createElement('canvas');
        let renderBoundaries = this._renderBoundaries = [10000, 10000, 0, 0];

        this._width = shadowCanvas.width = canvas.width;
        this._height = shadowCanvas.height = canvas.height;

        this.shadowCtx = shadowCanvas.getContext('2d');
        this.ctx = config.context;//canvas.getContext('2d');

        this._palette = _getColorPalette(config);
        this._templates = {};

        this._setStyles(config);
    }

    renderPartial(data) {
        this._renderBoundaries = [1000, 1000, 0, 0];
        if (data.data.length > 0) {
            this._drawAlpha(data);
            this._colorize();
        }
    }

    renderAll(data) {
        this._renderBoundaries = [1000, 1000, 0, 0];
        this._clear();
        if (data.data.length > 0) {
            this._drawAlpha(_prepareData(data));
            this._colorize();
        }
    }

    _updateGradient(config) {
        this._palette = _getColorPalette(config);
    }

    updateConfig(config) {
        if (config['gradient']) {
            this._updateGradient(config);
        }
        this._setStyles(config);
    }

    setDimensions(width, height) {
        this._width = width;
        this._height = height;
        this.shadowCanvas.width = width;
        this.shadowCanvas.height = height;
    }

    _clear() {
        this.shadowCtx.clearRect(0, 0, this._width, this._height);
        this.ctx.clearRect(0, 0, this._width, this._height);
    }

    _setStyles(config) {
        this._blur = (config.blur === 0) ? 0 : (config.blur || config.defaultBlur);

        if (config.backgroundColor) {
            this.canvas.style.backgroundColor = config.backgroundColor;
        }

        // this._width = this.canvas.width = this.shadowCanvas.width = config.width || this._width;
        // this._height = this.canvas.height = this.shadowCanvas.height = config.height || this._height;

        //设置透明度（0-1）之间，然后转换为0-255
        this._opacity = (config.opacity || 0) * 255;
        this._maxOpacity = (config.maxOpacity || config.defaultMaxOpacity) * 255;
        this._minOpacity = (config.minOpacity || config.defaultMinOpacity) * 255;
        this._useGradientOpacity = !!config.useGradientOpacity;
    }

    //绘制影子canvas的灰度透明值
    _drawAlpha(data) {
        let min = this._min = data.min;
        let max = this._max = data.max;
        data = data.data || [];
        let dataLen = data.length;
        // on a point basis?
        let blur = 1 - this._blur;

        while (dataLen--) {

            let point = data[dataLen];

            let x = point.x;
            let y = point.y;
            let radius = point.radius;
            // if value is bigger than max
            // use max as value
            let value = Math.min(point.value, max);
            let rectX = x - radius;
            let rectY = y - radius;
            let shadowCtx = this.shadowCtx;


            let tpl;
            if (!this._templates[radius]) {
                this._templates[radius] = tpl = _getPointTemplate(radius, blur);
            } else {
                tpl = this._templates[radius];
            }
            // value from minimum / value range
            // => [0, 1]
            let templateAlpha = (value - min) / (max - min);
            // this fixes #176: small values are not visible because globalAlpha < .01 cannot be read from imageData
            shadowCtx.globalAlpha = templateAlpha < .01 ? .01 : templateAlpha;

            shadowCtx.drawImage(tpl, rectX, rectY);

            // update renderBoundaries
            if (rectX < this._renderBoundaries[0]) {
                this._renderBoundaries[0] = rectX;
            }
            if (rectY < this._renderBoundaries[1]) {
                this._renderBoundaries[1] = rectY;
            }
            if (rectX + 2 * radius > this._renderBoundaries[2]) {
                this._renderBoundaries[2] = rectX + 2 * radius;
            }
            if (rectY + 2 * radius > this._renderBoundaries[3]) {
                this._renderBoundaries[3] = rectY + 2 * radius;
            }

        }
    }

    _colorize() {
        let x = this._renderBoundaries[0];
        let y = this._renderBoundaries[1];
        let width = this._renderBoundaries[2] - x;
        let height = this._renderBoundaries[3] - y;
        let maxWidth = this._width;
        let maxHeight = this._height;
        let opacity = this._opacity;
        let maxOpacity = this._maxOpacity;
        let minOpacity = this._minOpacity;
        let useGradientOpacity = this._useGradientOpacity;

        if (x < 0) {
            x = 0;
        }
        if (y < 0) {
            y = 0;
        }
        if (x + width > maxWidth) {
            width = maxWidth - x;
        }
        if (y + height > maxHeight) {
            height = maxHeight - y;
        }

        let img = this.shadowCtx.getImageData(x, y, width, height);
        let imgData = img.data;
        let len = imgData.length;
        let palette = this._palette;


        for (let i = 3; i < len; i += 4) {
            let alpha = imgData[i];
            let offset = alpha * 4;


            if (!offset) {
                continue;
            }

            //最终使用的透明度值，
            //if opacity && opacity > 0 , 如果设置了opacity值并且不为全透明
            //  使用opacity
            //else minOpacity && maxOpacity , 如果设置了min、max opacity那么透明度设置为这两个值之间
            //如果设置useGradientOpacity为true，则使用色带的透明度
            let finalAlpha;
            if (opacity > 0) {
                finalAlpha = opacity;
            } else {
                if (alpha < maxOpacity) {
                    if (alpha < minOpacity) {
                        finalAlpha = minOpacity;
                    } else {
                        finalAlpha = alpha;
                    }
                } else {
                    finalAlpha = maxOpacity;
                }
            }

            imgData[i - 3] = palette[offset];
            imgData[i - 2] = palette[offset + 1];
            imgData[i - 1] = palette[offset + 2];
            imgData[i] = useGradientOpacity ? palette[offset + 3] : finalAlpha;

        }

        // img.data = imgData;
        this.ctx.putImageData(img, x, y);

        // this._renderBoundaries = [1000, 1000, 0, 0];

    }

    _alpha2ValueByRange(alpha , range){
        return (range * (alpha / 255)); //>> 0;
    }

    _alpha2Value(alpha , max , min){
        return this._alpha2ValueByRange(alpha , Math.abs( max - min));
    }

    getValueAt(point) {
        let value;
        let shadowCtx = this.shadowCtx;
        let img = shadowCtx.getImageData(point.x, point.y, 1, 1);
        let data = img.data[3];
        let max = this._max;
        let min = this._min;

        return this._alpha2Value(data , max , min);
    }

    getMappingValue(){
        let shadowCanvas = this.shadowCanvas;
        let shadowCtx = this.shadowCtx;
        let width = parseInt(shadowCanvas.width);
        let height = parseInt(shadowCanvas.height);
        let img = shadowCtx.getImageData(0,0, width, height);
        let imgData = img.data;
        let len = imgData.length;
        let max = this._max;
        let min = this._min;

        let range = Math.abs(max - min);
        let values = [];
        for(let i = 0 ; i < len;i += 4){
            let alpha = imgData[i + 3];
            values.push(alpha);
        }

        let matrix = new Array(height);
        for(let row = 0 ; row < height;row++){
            matrix[row] = new Array(width);
        }

        let row = 0 , col = 0;
        for(let i = 0 ; i < values.length;i++){
            row = Math.floor( i / width );
            col = i % width;
            matrix[row][col] = values[i];
        }

        return matrix;
    }

    getAllValue(){
        let shadowCanvas = this.shadowCanvas;
        let shadowCtx = this.shadowCtx;
        let width = parseInt(shadowCanvas.width);
        let height = parseInt(shadowCanvas.height);
        let img = shadowCtx.getImageData(0,0, width, height);
        let imgData = img.data;
        let len = imgData.length;
        let max = this._max;
        let min = this._min;

        let range = Math.abs(max - min);
        let values = [];
        for(let i = 0 ; i < len;i += 4){
            let alpha = imgData[i + 3];
            values.push(this._alpha2ValueByRange(alpha , range));
        }

        let matrix = new Array(height);
        for(let row = 0 ; row < height;row++){
            matrix[row] = new Array(width);
        }

        let row = 0 , col = 0;
        for(let i = 0 ; i < values.length;i++){
            row = Math.floor( i / width );
            col = i % width;
            matrix[row][col] = values[i];
        }

        return matrix;
    }

    getDataURL() {
        return this.canvas.toDataURL();
    }
}