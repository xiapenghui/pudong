import Renderer, {HEATMAP_RENDERER} from "./Renderer";
import HeatmapFactory from "./heatmap/factory";
import {GEOMETRY_TYPE_POINT} from "../geometry/Geometry";
import ResolveResponse from "../support/ResolveResponse";
import contour from "../utils/Contour";
// import contour from "./heatmap/Contour";

export default class HeatMapRenderer extends Renderer {

    constructor(props) {
        super({type: HEATMAP_RENDERER});
        let {
            radius = 40,
            opacity = 0,
            maxOpacity = 1,
            minOpacity = 0,
            gradient = {
                0.25: "rgb(0,0,255)",
                0.55: "rgb(0,255,0)",
                0.85: "rgb(255,255,0)",
                1.0: "rgb(255,0,0)"
            },
            blur = 0.85,
            valueField = "value"
        } = props;
        this.radius = radius;
        this.opacity = opacity;
        this.maxOpacity = maxOpacity;
        this.minOpacity = minOpacity;
        this.gradient = gradient;
        this.blur = blur;
        this.valueField = valueField;

        this._instance = null;
        this._renderall = true;
        this._min = 0;
        this._max = 100;
    }

    toJson() {
        return {
            radius: this.radius,
            opacity: this.opacity,
            minOpacity: this.minOpacity,
            maxOpacity: this.maxOpacity,
            blur: this.blur,
            valueField: this.valueField
        }
    }


    group(graphics) {
        let val = super.group(graphics);
        if (val) {
            this._renderall = true;
        }

        return val
    }

    ungroup(graphics) {
        let val = super.ungroup(graphics);
        if (val) {
            this._renderall = true;
        }

        return val;
    }

    get radius() {
        return this._radius;
    }

    set radius(value) {
        this._radius = value;
    }

    get opacity() {
        return this._opacity;
    }

    set opacity(value) {
        this._opacity = value;
    }

    get maxOpacity() {
        return this._maxOpacity;
    }

    set maxOpacity(value) {
        this._maxOpacity = value;
    }

    get minOpacity() {
        return this._minOpacity;
    }

    set minOpacity(value) {
        this._minOpacity = value;
    }

    get gradient() {
        return this._gradient;
    }

    set gradient(value) {
        this._gradient = value;
    }

    get blur() {
        return this._blur;
    }

    set blur(value) {
        this._blur = value;
    }

    get valueField() {
        return this._valueField;
    }

    set valueField(value) {
        this._valueField = value;
    }


    draw(context, graphics) {
        try {
            if (!this._instance) {
                this._renderall = true;
                this._instance = HeatmapFactory.create(
                    Object.assign(
                        {
                            canvas: context.canvas,
                            context: context,
                            width: context.canvas.width,
                            height: context.canvas.height
                        },
                        this.toJson(),
                        {
                            xField: "x",
                            yField: "y",
                            valueField: "value"
                        }));
            }
        } catch (e) {
            console.error(e);
        }


        this._instance._renderer.setDimensions(
            context.canvas.width,
            context.canvas.height);
        if (this._renderall) {
            let data = {
                min: 0,
                max: 100,
                data: []
            };
            let min = Number.MAX_VALUE;
            let max = Number.MIN_VALUE;
            graphics.forEach((g) => {
                let value = g.getFloatPropVal(this.valueField);
                min = Math.min(value, min);
                max = Math.max(value, max);

                let screen = g._getScreen();
                if (screen && GEOMETRY_TYPE_POINT === screen.geometry.type) {
                    data.data.push({
                        x: screen.geometry.coordinates[0],
                        y: screen.geometry.coordinates[1],
                        value: value
                    });
                }
            });
            data.min = min;
            data.max = max;
            this._instance.setData(data);
        } else {
            this._instance.repaint();
        }


        return new Promise(resolve => resolve(new ResolveResponse({message: "renderer heatmap"})))
    }

    getValue(x, y, expandSize) {
        let xoffset = x + expandSize ? expandSize : 0;
        let yoffset = y + expandSize ? expandSize : 0;

        if(!this._instance){
            return null;
        }

        return this._instance.getValue({
            x : xoffset,
            y : yoffset
        });
    }

    getAllValue(expandSize){
        if(!this._instance){
            return null;
        }

        let values = this._instance.getAllValue();
        if(expandSize <= 0){
            return values;
        }

        let rowNum = values.length;
        let colNum = values[0].length;

        let visibleRowNum = rowNum - expandSize - expandSize;
        let visibleColNum = colNum - expandSize - expandSize;
        let newValues = new Array(visibleRowNum);
        for(let i = 0 ; i < visibleRowNum ; i++){
            newValues[i] = new Array(visibleColNum);
        }

        for(let r = 0 ; r < visibleRowNum;r++){
            for(let c = 0 ; c < visibleColNum;c++){
                newValues[r][c] = values[r + expandSize][c + expandSize];
            }
        }

        return newValues;
    }

    getMappingValue(expandSize){
        if(!this._instance){
            return null;
        }

        let values = this._instance.getMappingValue();
        if(expandSize <= 0){
            return values;
        }

        let rowNum = values.length;
        let colNum = values[0].length;

        let visibleRowNum = rowNum - expandSize - expandSize;
        let visibleColNum = colNum - expandSize - expandSize;
        let newValues = new Array(visibleRowNum);
        for(let i = 0 ; i < visibleRowNum ; i++){
            newValues[i] = new Array(visibleColNum);
        }

        for(let r = 0 ; r < visibleRowNum;r++){
            for(let c = 0 ; c < visibleColNum;c++){
                newValues[r][c] = values[r + expandSize][c + expandSize];
            }
        }

        return newValues;
    }

    getDataMax(){
        if(!this._instance){
            return null;
        }

        return this._instance.getDataMax();
    }

    getDataMin(){
        if(!this._instance){
            return null;
        }

        return this._instance.getDataMin();
    }
}