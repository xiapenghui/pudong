import Shape, {SHAPE_CIRCLE_TYPE} from "./Shape";

export default class Circle extends Shape {
    constructor({type = SHAPE_CIRCLE_TYPE, x = 0, y = 0, radius = 0}) {
        super({type});
        this._x = x;
        this._y = y;
        this._radius = radius;

        this._coordinates = this._createCoordinates();
    }

    _createCoordinates() {
        let centerX = this.x,
            centerY = this.y,
            longAxis = this.radius,
            shortAxis = this.radius,
            numOfPoints = 60,
            cosVal,
            index,
            sinVal,
            p;

        let points = [];
        let delta = 2 * Math.PI / numOfPoints;
        for (index = 0; index < numOfPoints; index++) {
            cosVal = Math.cos(index * delta);
            sinVal = Math.sin(index * delta);
            p = [
                longAxis * cosVal + centerX,
                shortAxis * sinVal + centerY
            ];
            points.push(p);
        }
        points.push(points[0]);

        return points;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    get radius() {
        return this._radius;
    }

    set radius(value) {
        this._radius = value;
    }

    getCoordinates() {
        return this._coordinates;
    }

    toJson() {
        return {
            type: this.type,
            x: this.x,
            y: this.y,
            radius: this.radius
        }
    }

    hit(x, y, tolerance) {
        super.hit(x, y, tolerance);

        if (!this.x && !this.y || !this.radius) {
            return false;
        }

        let xdelta = x - this.x;
        let ydelta = y - this.y;

        return (xdelta * xdelta + ydelta * ydelta) <= (this.radius * this.radius + tolerance * tolerance);
    }

    draw(context, needFill, needStroke) {
        context.beginPath();

        context.moveTo(this.x + this.radius, this.y);
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.closePath();

        if (needFill) {
            context.fill();
        }

        if (needStroke) {
            context.stroke();
        }
    }
}