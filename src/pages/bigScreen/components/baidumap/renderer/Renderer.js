import Console from "../support/Console";
import SymbolFactory from "../symbol/factory";
import {NONE_SYMBOL} from "../symbol/SymbolEnum";
import {IDFactory} from "../support/IDGen";
import Index from "../support/Index";
import Graphic from "../Graphic";
import ResolveResponse from "../support/ResolveResponse";

let idCreate = IDFactory("_r_id_");

export const SIMPLE_RENDERER = "simpleRenderer";
export const UNIQUE_VALUE_RENDERER = "uniqueValueRenderer";
export const CLASS_BREAKS_RENDERER = "classBreaksRenderer";
export const HEATMAP_RENDERER = "heatMapRenderer";
export const RIPPLE_MARKER_RENDERER = "rippleMarkerRenderer";

export const valdateRendererType = (type) => {
    if (!type) {
        return false;
    }

    if (type === SIMPLE_RENDERER) {
        return true;
    }

    if (type === UNIQUE_VALUE_RENDERER) {
        return true;
    }

    if (type === CLASS_BREAKS_RENDERER) {
        return true;
    }

    return false;
};

export default class Renderer {

    constructor(props) {
        let {
            type = null,
            defaultSymbol = {type: NONE_SYMBOL}
        } = props;
        this.type = type;
        this.id = idCreate.next();
        this.defaultSymbol = defaultSymbol;

        this._initCachedRendererGroup();
    }

    get id() {
        return this._id;
    }

    set id(value) {
        if (value) {
            this._id = value;
        } else {
            this._id = idCreate.next();
        }
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    get defaultSymbol() {
        return this._defaultSymbol;
    }

    set defaultSymbol(value) {
        if (value instanceof Symbol) {
            this._defaultSymbol = value;
        } else {
            this._defaultSymbol = SymbolFactory(value);
        }
    }

    getSymbol(graphic) {
        return SymbolFactory({type: NONE_SYMBOL});
    }

    getSymbolIndex(graphic) {
        return -1;
    }

    fromJson(json) {
        let {type} = json;
        this.type = type;
    }


    /**
     *
     * @param {renderItemEachCallback} fun
     * @return {boolean}
     */
    each(fun) {
        if (null === fun ||
            undefined === fun ||
            !(fun instanceof Function)
        ) {
            return false;
        }

        return true;
    }

    toJson() {
        return {
            id: this.id,
            type: this.type
        };
    }

    /**
     * 按照renderer的分组信息写入Graphic的内部缓存中
     *
     * @param {Array[Graphic]} graphics
     * @return {*}
     */
    group(graphics) {
        if(!graphics){
            return null;
        }

        if(graphics instanceof Graphic){
            let graphic = graphics;

            //如果graphic设置了symbol则为自渲染组
            if (graphic.symbol &&
                graphic.symbol.type !== NONE_SYMBOL) {
                let groupIndex = this._addCachedRendererGroupSelfItem(graphic);
                graphic._updateGroupedInfo(groupIndex);
                return graphic;
            }

            //按照renderer分组
            let index = this.getSymbolIndex(graphic);
            if (index < 0) {
                let groupIndex = this._addCachedRendererGroupDefaultItem(graphic);
                graphic._updateGroupedInfo(groupIndex);
            } else {
                let groupIndex = this._addCachedRendererGroupItem(index.toString(), graphic);
                graphic._updateGroupedInfo(groupIndex);
            }

            return graphic;
        }

        if(graphics instanceof  Array){
            return graphics.map((g)=>{
                return this.group(g);
            })
        }

        return null;
    }

    ungroup(graphics){
        if(!graphics){
            return;
        }

        if(graphics instanceof Graphic){
            let graphic = graphics;
            let groupInfo = graphic._getGroupedInfo();
            if(groupInfo){
                this._delCachedRendererGroupItem(groupInfo.id , groupInfo.index);
            }
        }

        if(graphics instanceof Array){
            graphics.forEach((g)=>{
                this.ungroup(g);
            });
        }
    }

    /**
     * 初始化渲染分组数据
     */
    _initCachedRendererGroup() {
        if(!this._cache){
            this._cache = new Map();
        }
        this._resetCachedRendererGroup();
    }

    /**
     * 重置渲染分组数据
     */
    _resetCachedRendererGroup() {
        let group = this._getCachedRendererGroup();
        group.set("default", []);//renderer中的默认样式
        group.set("self", []);//使用Graphic中设置的symbol对象
        this.each((item, index) => {
            group.set(index.toString(), []);
        });
    }


    /**
     * 获取渲染分组数据
     * @return
     */
    _getCachedRendererGroup() {
        if(!this._cache){
            this._cache = new Map();
        }

        return this._cache;
    }

    /**
     * 获取指定分组的渲染数据
     * @param key
     * @return {null|*}
     */
    _getCachedRendererGroupItems(key) {
        let group = this._getCachedRendererGroup();
        let graphics = group.get(key);
        if (graphics) {
            return graphics;
        } else {
            Console.warn("visit none graphic renderer group");
            return null;
        }
    }

    /**
     * 在指定渲染分组中添加Graphic对象
     * @param key
     * @param graphic
     */
    _addCachedRendererGroupItem(key, graphic) {
        let graphics = this._getCachedRendererGroupItems(key);
        if (graphics) {
            graphics.push(graphic);
            return new Index({
                id: key,
                index: graphics.length - 1
            });
        }

        return null;
    }


    /**
     * 在指定渲染分组中删除Graphic对象
     * @param key
     * @param index
     */
    _delCachedRendererGroupItem(key, index) {
        let graphics = this._getCachedRendererGroupItems(key);
        if (graphics) {
            graphics.splice(index, 1);
        }
    }


    /**
     * 在默认渲染分组中添加Graphic对象
     * @param graphic
     */
    _addCachedRendererGroupDefaultItem(graphic) {
        this._addCachedRendererGroupItem("default", graphic);
        return new Index({
            id: "default",
            index: this._getCachedRendererGroupItems("default").length - 1
        });
    }


    /**
     * 在自渲染分组中添加Graphic对象（自渲染指使用自身设置的Symbol对象来做显示样式设置的Graphic）
     * @param graphic
     */
    _addCachedRendererGroupSelfItem(graphic) {
        this._addCachedRendererGroupItem("self", graphic);
        return new Index({
            id: "self",
            index: this._getCachedRendererGroupSelfItems().length - 1
        });
    }


    /**
     * 获取自渲染分组数据
     * @return {*}
     */
    _getCachedRendererGroupSelfItems() {
        return this._getCachedRendererGroupItems("self");
    }

    _drawCachedRendererGroupItems(context , symbol, graphics){
        return symbol.draw(context , graphics);
    }

    _drawCachedRendererGroup(context){
        //构造所有样式键值
        let indexArr = ["default"];
        this.each((item, index) => {
            indexArr.push(index.toString());
        });

        return Promise.all(indexArr.map((index) => {
            let grouped = this._getCachedRendererGroupItems(index.toString());
            let symbol = null;
            if ("default" === index) {
                symbol = this.defaultSymbol;
            } else {
                symbol = this.getSymbol(index);
            }

            return this._drawCachedRendererGroupItems(context ,symbol, grouped);
        }));
    }

    _drawSelfRendererGroupItem(context , symbol , graphic){
        return symbol.draw(context , graphic);
    }

    _drawSelfRendererGroup(context){
        let grouped = this._getCachedRendererGroupSelfItems();
        grouped = grouped.filter((g)=>{
            return g.symbol &&
                NONE_SYMBOL !== g.symbol.type
        });

        if(0 === grouped.length){
            return new Promise(resolve => resolve(new ResolveResponse({message : "draw success"})));
        }

        return Promise.all(grouped.map(g=>{
            let symbol = g.symbol;
            return this._drawSelfRendererGroupItem(context , symbol , g);
        }))
    }

    clear(context){
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.beginPath();
    }

    hasAnimal(){
        return false;
    }

    draw(context, graphics) {
       return Promise.all([
           this._drawCachedRendererGroup(context),
           this._drawSelfRendererGroup(context)
       ]);
    }
}

/**
 * 遍历renderer中所有渲染选项的回调函数
 *
 * @callback renderItemEachCallback
 * @param {Object} item - renderer包含的项
 * @param {Symbol} item.symbol - symbol对象
 * @param {Number} index - 索引
 */
