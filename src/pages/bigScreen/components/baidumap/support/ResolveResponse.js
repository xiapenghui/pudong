export default class ResolveResponse {

    constructor({message = "" , data = null}){
        this._message = message;
        this._data = data;
    }

    get message() {
        return this._message;
    }

    set message(value) {
        this._message = value;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }

}