import Renderer from "./Renderer";
import symbolFactory from "../symbol/factory";
import {NONE_SYMBOL} from "../symbol/SymbolEnum";
import Graphic from "../Graphic";

class ClassBreakInfo {
    constructor(props) {
        let {
            minValue,
            maxValue,
            symbol
        } = props;

        this.minValue = minValue;
        this.maxValue = maxValue;
        this.symbol = symbol;


    }

    isInRange(value) {
        if (null === value ||
            undefined === value ||
            Number.isNaN(value) ||
            !Number.isFinite(value)
        ) {
            return false;
        }

        return value >= this.minValue && value < this.maxValue;
    }

    get minValue() {
        return this._minValue;
    }

    set minValue(value) {
        if (null === value ||
            undefined === value ||
            Number.isNaN(value) ||
            !Number.isFinite(value)
        ) {
            this._minValue = Number.MAX_VALUE;
            return;
        }

        this._minValue = value;
    }

    get maxValue() {
        return this._maxValue;
    }

    set maxValue(value) {
        if (null === value ||
            undefined === value ||
            Number.isNaN(value) ||
            !Number.isFinite(value)
        ) {
            this._maxValue = Number.MIN_VALUE;
            return;
        }

        this._maxValue = value;
    }

    get symbol() {
        return this._symbol;
    }

    set symbol(value) {
        this._symbol = symbolFactory(value);
    }

    toJson(){
        return {
            minValue : this.minValue,
            maxValue : this.maxValue,
            symbol : this.symbol.toJson()
        };
    }
}

export default class ClassBreaksRenderer extends Renderer {
    constructor(props) {
        super(props);

        let {
            type,
            field,
            defaultSymbol,
            classBreakInfos
        } = props;
        this.field = field;
        this.defaultSymbol = defaultSymbol;
        this.classBreakInfos = classBreakInfos;

        this._initCachedRendererGroup();
    }


    get field() {
        return this._field ? this._field : null;
    }

    set field(value) {
        this._field = value;
    }


    get classBreakInfos() {
        return this._classBreakInfos ? this._classBreakInfos : [];
    }

    set classBreakInfos(value) {
        if (!value || !Array.isArray(value)) {
            this._classBreakInfos = [];
        } else {
            this._classBreakInfos = value.map((props) => {
                return new ClassBreakInfo(props);
            }).filter((cbInfo) => {
                return cbInfo &&
                    cbInfo.symbol &&
                    cbInfo.symbol.type !== NONE_SYMBOL;
            })
        }
    }

    toJson() {
        return Object.assign( super.toJson(),{
            field : this.field,
            defaultSymbol : this.defaultSymbol.toJson(),
            classBreakInfos : this.classBreakInfos.map((cbInfo)=>{
                return cbInfo.toJson();
            })
        } );
    }

    addClassBreakInfo(props) {
        let cbInfo = new ClassBreakInfo(props);
        if (cbInfo &&
            cbInfo.symbol &&
            cbInfo.symbol.type !== NONE_SYMBOL) {

            let infos = [];
            this.classBreakInfos.forEach((info) => {
                if (cbInfo.minValue >= info.maxValue) {
                    infos.push(cbInfo);
                }

                infos.push(info)
            });

            this.classBreakInfos = infos;
        }
    }

    getClassBreakInfo(graphic) {
        let index = this.getSymbolIndex(graphic);
        if (index >= 0) {
            return this.classBreakInfos[index];
        }

        return null;
    }

    delClassBreakeInfo({minValue, maxValue}) {
        this.classBreakInfos = this.classBreakInfos.filter((cbInfo) => {
            return !(cbInfo.minValue >= minValue && cbInfo.maxValue <= maxValue)
        })
    }

    getSymbol(graphic) {
        super.getSymbol(graphic);
        if(graphic instanceof Graphic) {
            let cbInfo = this.getClassBreakInfo(graphic);
            if (cbInfo) {
                return cbInfo.symbol;
            }
        }else if(graphic - parseInt(graphic) >= 0){
            let index = parseInt(graphic);
            if(index < 0 || index >= this.classBreakInfos.length){
                return symbolFactory({type : NONE_SYMBOL});
            }else{
                return this.classBreakInfos[index].symbol;
            }
        }

        return symbolFactory({type: NONE_SYMBOL});
    }

    getSymbolIndex(graphic) {
        super.getSymbolIndex(graphic);
        if (!this.classBreakInfos || 0 === this.classBreakInfos.length) {
            return -1;
        }

        let cbInfo = null;
        let field = this.field;
        for (let i = 0; i < this.classBreakInfos.length; i++) {
            cbInfo = this.classBreakInfos[i];
            if (!graphic.hasProp(field)) {
                return -1;
            }

            let val = graphic.getFloatPropVal(field);
            if (cbInfo.isInRange(val)) {
                return i;
            }
        }

        return -1;
    }

    each(fun) {
        if (!super.each(fun)) {
            return;
        }

        this.classBreakInfos.forEach((cbInfo, index) => {
            fun(cbInfo, index);
        })
    }

}