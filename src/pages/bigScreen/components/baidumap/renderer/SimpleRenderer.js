import Renderer from "./Renderer";
import symbolFactory from "../symbol/factory";

export default class SimpleRenderer extends Renderer{
    constructor(props){
        super(props);

        let {type , symbol} = props;
        this.symbol = symbol;

        this._initCachedRendererGroup();
    }

    get symbol() {
        return this._symbol ? this._symbol : null;
    }

    set symbol(value) {
        if(value instanceof Symbol){
            this._symbol = value;
        }else{
            this._symbol = symbolFactory(value);
        }

        this.defaultSymbol = this.symbol;
    }

    toJson() {
        return Object.assign(super.toJson(),{
            symbol : this.symbol.toJson()
        });
    }

    each(fun){
        if(!super.each(fun)){
            return;
        }

        fun({symbol : this.symbol} , 0);
    }

    getSymbol(graphic) {
        super.getSymbol(graphic);
        return this.symbol;
    }

    getSymbolIndex(graphic){
        super.getSymbolIndex(graphic);
        return 0;
    }

}