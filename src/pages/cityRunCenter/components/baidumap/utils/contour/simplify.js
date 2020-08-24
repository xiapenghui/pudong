let getSqDist = (p1, p2) => {

    let dx = p1.x - p2.x,
        dy = p1.y - p2.y;

    return dx * dx + dy * dy;
};

// square distance from a point to a segment
let getSqSegDist = (p, p1, p2) => {

    let x = p1.x,
        y = p1.y,
        dx = p2.x - x,
        dy = p2.y - y;

    if (dx !== 0 || dy !== 0) {

        let t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);

        if (t > 1) {
            x = p2.x;
            y = p2.y;

        } else if (t > 0) {
            x += dx * t;
            y += dy * t;
        }
    }

    dx = p.x - x;
    dy = p.y - y;

    return dx * dx + dy * dy;
};

let simplifyRadialDist = (points, sqTolerance) => {

    let prevPoint = points[0],
        newPoints = [prevPoint],
        point;

    for (let i = 1, len = points.length; i < len; i++) {
        point = points[i];

        if (getSqDist(point, prevPoint) > sqTolerance) {
            newPoints.push(point);
            prevPoint = point;
        }
    }

    if (prevPoint !== point) newPoints.push(point);

    return newPoints;
};

let simplifyDPStep = (points, first, last, sqTolerance, simplified) => {
    let maxSqDist = sqTolerance,
        index;

    for (let i = first + 1; i < last; i++) {
        let sqDist = getSqSegDist(points[i], points[first], points[last]);

        if (sqDist > maxSqDist) {
            index = i;
            maxSqDist = sqDist;
        }
    }

    if (maxSqDist > sqTolerance) {
        if (index - first > 1) simplifyDPStep(points, first, index, sqTolerance, simplified);
        simplified.push(points[index]);
        if (last - index > 1) simplifyDPStep(points, index, last, sqTolerance, simplified);
    }
};

let simplifyDouglasPeucker = (points, sqTolerance) => {
    let last = points.length - 1;

    let simplified = [points[0]];
    simplifyDPStep(points, 0, last, sqTolerance, simplified);
    simplified.push(points[last]);

    return simplified;
};

export default (points, tolerance, highestQuality) => {

    if (points.length <= 2) return points;

    let sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

    points = highestQuality ? points : simplifyRadialDist(points, sqTolerance);
    points = simplifyDouglasPeucker(points, sqTolerance);

    return points;
}
