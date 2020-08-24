import {NONE_SYMBOL, validateSymbolType} from "./SymbolEnum";
import Console from "../support/Console";
import {IDFactory} from "../support/IDGen";
import ResolveResponse from "../support/ResolveResponse";

let idCreate = IDFactory("_s_id_");

export default class Symbol {
    constructor(props) {
        let {type = NONE_SYMBOL} = props;
        this.type = type;
        this.id = idCreate.next();
        this._cache = new Map();
    }

    toJson() {
        return {
            type:this.type
        };
    }

    fromJson(json) {
        let {type} = json;
        this.type = type;
    }

    get id(){
        return this._id;
    }

    set id(value){
        if(value){
            this._id = value;
        }else{
            this._id = idCreate.next();
        }
    }

    get type() {
        return this._type;
    }

    set type(type) {
        if (validateSymbolType(type)) {
            this._type = type;
        } else {
            Console.warn("illegal symbol type");
            this._type = NONE_SYMBOL;
        }
    }

    draw(context , graphics){
        return new Promise(function(resolve,reject){
            resolve(new ResolveResponse({message : "default render styleContext"}));
        })
    }
}
