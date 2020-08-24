const DEFAULT_VAL = 0;
export const NO_DATA_VAL = 9999;

export default class Grid {
    constructor(width, height, defaultVal) {
        this._width = width;
        this._height = height;
        this._buffer = new Array(this.height);

        if(undefined === defaultVal){
            defaultVal = NO_DATA_VAL;
        }

        for (let r = 0; r < this.height; r++) {
            this.buffer[r] = new Array(this.width);
            for (let c = 0; c < this.width; c++) {
                this.buffer[r][c] = defaultVal;
            }
        }
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get buffer() {
        return this._buffer;
    }

    validateRow(r){
        return null !== r &&
            undefined !== r &&
            !isNaN(r) &&
            r >= 0 &&
            r < this.height;
    }

    validateCol(c){
        return null !== c &&
            undefined !== c &&
            !isNaN(c) &&
            c >= 0 &&
            c < this.width;
    }

    isNoDataVal(val){
        return NO_DATA_VAL - val === 0;
    }

    fromGrid(grid){
        this._width = grid.width;
        this._height = grid.height;
        this._buffer = grid.buffer;

        return this;
    }

    replaceNoDataVal(val){
        this.forEach((r , c , v)=>{
            if(this.isNoDataVal(v)){
                this.setCellValue(r , c , val);
            }
        });

        return this;
    }

    getCellValue(r, c) {
        if (!this.validateRow(r)) {
            return NO_DATA_VAL;
        }

        if (!this.validateCol(c)) {
            return NO_DATA_VAL;
        }

        return this.buffer[r][c];
    }

    setCellValue(r, c, v) {
        if (!this.validateRow(r)) {
            return this;
        }

        if (!this.validateCol(c)) {
            return this;
        }

        this.buffer[r][c] = v;
        return this;
    }

    getTopLeftValue(r , c){
        return this.getCellValue(r - 1 , c -1 );
    }

    getTopValue(r , c){
        return this.getCellValue(r - 1 , c)
    }

    getTopRightValue(r , c){
        return this.getCellValue(r - 1 , c + 1);
    }

    getLeftValue(r , c){
        return this.getCellValue(r , c -1 );
    }

    getRightValue(r , c){
        return this.getCellValue(r , c + 1);
    }

    getBottomLeftValue(r , c){
        return this.getCellValue(r + 1 , c - 1);
    }

    getBottomValue(r,c){
        return this.getCellValue(r + 1 , c);
    }

    getBottomRightValue(r , c){
        return this.getCellValue(r + 1 , c + 1);
    }

    find(fun){
        for (let r = 0; r < this.height; r++) {
            for (let c = 0; c < this.width; c++) {
                if(fun(r, c, this.buffer[r][c])){
                    return {
                        r : r,
                        c : c ,
                        v : this.buffer[r][c]
                    }
                }
            }
        }

        return null;
    }

    forEach(fun) {
        for (let r = 0; r < this.height; r++) {
            for (let c = 0; c < this.width; c++) {
                fun(r, c, this.buffer[r][c]);
            }
        }

        return this;
    }

    map(fun) {
        let grid = new Grid(this.width, this.height);
        for (let r = 0; r < this.height; r++) {
            for (let c = 0; c < this.width; c++) {
                grid.setCellValue(r, c, fun(r, c, this.buffer[r][c]));
            }
        }
        return grid;
    }

    reduce(result , fun){
        for(let r = 0 ; r < this.height ; r++){
            for(let c = 0 ; c < this.width;c++){
                result = fun(r , c , this.buffer[r][c] ,result);
            }
        }
        return result;
    }

    expand(size){
        let grid = new Grid(this.width + size * 2 , this.height + size * 2);
        this.forEach((r , c , v)=>{
             grid.setCellValue(r + size , c + size , v);
        });
        return grid;
    }

    neighbor(r, c, isReplaceNoDataVal , replacedVal) {
        if(null === isReplaceNoDataVal ||
            undefined === isReplaceNoDataVal){
            isReplaceNoDataVal = false;
        }

        if (null === r ||
            undefined === r ||
            r < 0 ||
            r >= this.height) {
            if(isReplaceNoDataVal){
                return new Grid(3 , 3).replaceNoDataVal(replacedVal);
            }
            return null;
        }

        if (null === c ||
            undefined === c ||
            c < 0 ||
            c >= this.width) {
            if(isReplaceNoDataVal){
                return new Grid(3 , 3).replaceNoDataVal(replacedVal);
            }
            return null;
        }

        let grid = new Grid(3, 3);
        grid.setCellValue(0, 0, this.getCellValue(r - 1, c - 1));//top left
        grid.setCellValue(0, 1, this.getCellValue(r - 1, c));//top center
        grid.setCellValue(0, 2, this.getCellValue(r - 1, c + 1));//top right
        grid.setCellValue(1, 0, this.getCellValue(r, c - 1));//left
        grid.setCellValue(1, 1, this.getCellValue(r, c));//current
        grid.setCellValue(1, 2, this.getCellValue(r, c + 1));//right
        grid.setCellValue(2, 0, this.getCellValue(r + 1, c - 1));//bottom left
        grid.setCellValue(2, 1, this.getCellValue(r + 1, c));//bottom center
        grid.setCellValue(2, 2, this.getCellValue(r + 1, c + 1));//bottom right

        if(isReplaceNoDataVal){
            grid.replaceNoDataVal(replacedVal);
        }

        return grid;
    }
}