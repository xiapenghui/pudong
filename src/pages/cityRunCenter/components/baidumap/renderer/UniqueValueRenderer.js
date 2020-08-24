import Renderer from "./Renderer";
import SymbolFactory from "../symbol/factory";
import {NONE_SYMBOL} from "../symbol/SymbolEnum";
import Graphic from "../Graphic";

export class UniqueValueInfo{
    constructor(props) {
        let {value, symbol} = props;
        this.value = value;
        this.symbol = symbol;
    }

    isUniqueValue(value) {
        if (null === value || undefined === value) {
            return false;
        }

        return this.value === value;
    }

    toJson(){
        return {
            value : this.value,
            symbol : this.symbol.toJson()
        }
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }

    get symbol() {
        return this._symbol;
    }

    set symbol(value) {
        this._symbol = SymbolFactory(value);
    }
}

export default class UniqueValueRenderer extends Renderer {
    constructor(props) {
        super(props);

        let {type, field, defaultSymbol, uniqueValueInfos} = props;
        this.field = field;
        this.defaultSymbol = defaultSymbol;
        this.uniqueValueInfos = uniqueValueInfos;

        this._initCachedRendererGroup();
    }


    get field() {
        return this._field ? this._field : null;
    }

    set field(value) {
        this._field = value;
    }

    get uniqueValueInfos() {
        return this._uniqueValueInfos ? this._uniqueValueInfos : [];
    }

    set uniqueValueInfos(value) {
        if (!value || !Array.isArray(value)) {
            this._uniqueValueInfos = [];
        } else {
            this._uniqueValueInfos = value.map((props) => {
                return new UniqueValueInfo(props);
            }).filter((uvInfo) => {
                return uvInfo &&
                    uvInfo.symbol &&
                    uvInfo.symbol.type !== NONE_SYMBOL;
            });
        }
    }

    toJson() {
        return Object.assign( super.toJson() , {
            field : this.field,
            defaultSymbol : this.defaultSymbol.toJson(),
            uniqueValueInfos : this.uniqueValueInfos.map((uvInfo)=>{
                return uvInfo.toJson();
            })
        } );
    }

    addUniqueValueInfo(props) {
        let uvInfo = new UniqueValueInfo(props);
        if (uvInfo && uvInfo.type !== NONE_SYMBOL) {
            this._uniqueValueInfos.push(uvInfo);
        }
    }

    getUniqueValueInfo(graphic) {
        let index = this.getSymbolIndex(graphic);
        if (index >= 0) {
            return this.uniqueValueInfos[index];
        }

        return null;
    }

    delUniqueValueInfo(value) {
        this._uniqueValueInfos = this._uniqueValueInfos.filter((uvInfo) => {
            return uvInfo.value !== value;
        })
    }

    getSymbol(graphic) {
        super.getSymbol(graphic);
        if(graphic instanceof Graphic) {
            let uvInfo = this.getUniqueValueInfo(graphic);
            if (uvInfo) {
                return uvInfo.symbol;
            }
        }else if(graphic - parseInt(graphic) >= 0){
            let index = parseInt(graphic);
            if(index < 0 && index >= this.uniqueValueInfos.length){
                return SymbolFactory({type : NONE_SYMBOL});
            }else{
                return this.uniqueValueInfos[index].symbol;
            }
        }

        return SymbolFactory({type: NONE_SYMBOL});
    }

    getSymbolIndex(graphic) {
        super.getSymbolIndex(graphic);
        if (!this.uniqueValueInfos || 0 === this.uniqueValueInfos.length) {
            return -1;
        }

        let uvInfo = null;
        let field = this.field;
        for (let i = 0; i < this.uniqueValueInfos.length; i++) {
            uvInfo = this.uniqueValueInfos[i];
            if (!graphic.hasProp(field)) {
                return -1;
            }

            let val = graphic.getPropVal(field);
            if (uvInfo.isUniqueValue(val)) {
                return i;
            }
        }

        return -1;
    }

    each(fun) {
        if (!super.each(fun)) {
            return;
        }

        this.uniqueValueInfos.forEach((info, index) => {
            fun(info, index);
        })
    }
}