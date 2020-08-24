export default class Index{
    constructor({id , index}){
        this.id = id;
        this.index = index;
    }

    isEmpty(){
        return null === this.id ||
            undefined === this.id ||
            null === this.index ||
            undefined === this.index;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get index() {
        return this._index;
    }

    set index(value) {
        this._index = value;
    }
}