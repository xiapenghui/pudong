const NONE = 0;
const UP = 1;
const LEFT = 2;
const DOWN = 3;
const RIGHT = 4;


export default class MarchingSquares {
    constructor(matrix) {
        this.matrix = matrix.expand(1);
        this.matrix.replaceNoDataVal(0);
        this.height = this.matrix.height;
        this.width = this.matrix.width;
        this.previousStep = null;
        this.nextStep = null;
        this.upLeft = null;
        this.upRignt = null;
        this.downLeft = null;
        this.downRight = null;
        this.state = 0;
    }


    getBlobOutlinePoints() {
        let startPoint = this.getFirstPoint();
        if (!startPoint) {
            return [];
        }

        return this.walkPerimeter(startPoint.x, startPoint.y);
    }

    getFirstPoint() {
        let find = this.matrix.find((r, c, v) => {
            return v > 0;
        });
        if(!find){
            return null;
        }

        return {x : find.c , y : find.r};
    }

    walkPerimeter(startX, startY) {
        if (startX < 0) {
            startX = 0;
        }
        if (startX > this.width) {
            startX = this.width;
        }
        if (startY < 0) {
            startY = 0;
        }
        if (startY > this.height) {
            startY = this.height;
        }

        let pointList = [];

        let x = startX;
        let y = startY;
        do {
            this.step(x - 1, y - 1);
            if (x >= 0 &&
                x < this.width &&
                y >= 0 &&
                y < this.height) {
                pointList.push(x - 2, y - 1);
            }

            switch (this.nextStep) {
                case UP:
                    y--;
                    break;
                case LEFT:
                    x--;
                    break;
                case DOWN:
                    y++;
                    break;
                case RIGHT:
                    x++;
                    break;
                default:
                    break;
            }
        } while (x !== startX || y !== startY);

        pointList.push(x - 1, y - 1);

        return pointList;
    }

    step(x, y) {
        let val = this.matrix.getCellValue(y, x);
        this.upLeft = val > 0;

        val = this.matrix.getRightValue(y, x);
        this.upRignt = val > 0;

        val = this.matrix.getBottomValue(y, x);
        this.downLeft = val > 0;

        val = this.matrix.getBottomRightValue(y, x);
        this.downRight = val > 0;

        this.previousStep = this.nextStep;

        this.state = 0;
        if (this.upLeft) {
            this.state |= 1;
        }
        if (this.upRignt) {
            this.state |= 2;
        }
        if (this.downLeft) {
            this.state |= 4;
        }
        if (this.downRight) {
            this.state |= 8;
        }

        switch (this.state) {
            case 1:
                this.nextStep = UP;
                break;
            case 2:
                this.nextStep = RIGHT;
                break;
            case 3:
                this.nextStep = RIGHT;
                break;
            case 4:
                this.nextStep = LEFT;
                break;
            case 5:
                this.nextStep = UP;
                break;
            case 6:
                if (this.previousStep === UP) {
                    this.nextStep = LEFT;
                } else {
                    this.nextStep = RIGHT;
                }
                break;
            case 7:
                this.nextStep = RIGHT;
                break;
            case 8:
                this.nextStep = DOWN;
                break;
            case 9:
                if (this.previousStep === RIGHT) {
                    this.nextStep = UP;
                } else {
                    this.nextStep = DOWN;
                }
                break;
            case 10:
                this.nextStep = DOWN;
                break;
            case 11:
                this.nextStep = DOWN;
                break;
            case 12:
                this.nextStep = LEFT;
                break;
            case 13:
                this.nextStep = UP;
                break;
            case 14:
                this.nextStep = LEFT;
                break;
            default:
                this.nextStep = NONE;//this should never happen
                break;
        }
    }
}