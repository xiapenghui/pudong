import {flattenEach} from "@turf/meta";
import Feature from "./Feature";
import Geometry, {
    GEOMETRY_TYPE_BOUNDS,
    GEOMETRY_TYPE_LINESTRING,
    GEOMETRY_TYPE_MULTILINESTRING,
    GEOMETRY_TYPE_MULTIPOINT,
    GEOMETRY_TYPE_POINT
} from "./Geometry";
import {bboxClip, booleanDisjoint, buffer as geometryBuffer, intersect} from "@turf/turf";
import Point from "./Point";
import {geometryFactory, isBounds, isLikePoint, isLine, isPoint, isPolygon} from "./factory";
import Bounds from "./Bounds";
import LineString from "./LineString";
import Graphic from "../Graphic";
import {validateNum} from "../utils/Utils";


/**
 *
 * @param {Graphic|Feature|Geometry} geoJson
 * @param {Boolean} isPlanObj
 * @return {null|null|*|{coordinates, type}|Geometry|*}
 */
const toGeoJson = (geoJson, isPlanObj) => {
    if (!geoJson) {
        return geoJson;
    }

    if (null === isPlanObj && undefined === isPlanObj) {
        isPlanObj = true;
    }

    if (geoJson instanceof Feature) {
        if (isPlanObj) {
            return geoJson.geometry.toJson();
        } else {
            return geoJson.geometry;
        }
    } else if (geoJson instanceof Geometry) {
        if (isPlanObj) {
            return geoJson.toJson();
        } else {
            return geoJson;
        }
    } else if (geoJson instanceof Graphic) {
        if (isPlanObj) {
            return geoJson.feature.geometry.toJson();
        } else {
            return geoJson.feature.geometry;
        }
    }

    return null;
};

/**
 * 判断两个图形是否相交
 *
 * @param {Feature|Geometry} geometry1
 * @param {Feature|Geometry} geometry2
 * @return {boolean}
 */
export const intersects = (geometry1, geometry2) => {
    let geoJson1 = toGeoJson(geometry1, true);
    let geoJson2 = toGeoJson(geometry2, true);

    if (!geoJson1 || !geoJson2) {
        return false;
    }

    let bool = false;
    flattenEach(geoJson1, (flatten1) => {
        flattenEach(geoJson2, (flatten2) => {
            if (bool === true) {
                return true;
            }
            bool = !booleanDisjoint(flatten1.geometry, flatten2.geometry);
        });
    });
    return bool;

};

/**
 * 判断两个图形是否不相交
 *
 * @param {Feature|Geometry} geometry1
 * @param {Feature|Geometry} geometry2
 * @return {boolean}
 */
export const disjoint = (geometry1, geometry2) => {
    let geoJson1 = toGeoJson(geometry1, true);
    let geoJson2 = toGeoJson(geometry2, true);

    if (!geoJson1 || !geoJson2) {
        return false;
    }

    return booleanDisjoint(geoJson1, geoJson2);
};

/**
 * 缓冲区
 *
 * @param {Feature|Geometry} geometry
 * @param {Number} radius - 缓冲半径（单位米）
 * @return {Polygon|MultiPolygon}
 */
export const buffer = (geometry, radius) => {
    let geoJson = toGeoJson(geometry, true);
    if (!geoJson) {
        return null;
    }

    let geoResult = geometryBuffer(geoJson, radius, {
        units: "meters"
    });

    return geometryFactory(geoResult.geometry);
};

/**
 * 简化（不能解决自相交的问题）
 *
 * @param geometry
 * @param tolerance
 */
export const simplify = (geometry, tolerance) => {
    let geoJson = toGeoJson(geometry, false);
    if (!geoJson) {
        return null;
    }

    if (isPoint(geoJson)) {
        return geoJson;
    }

    if (isLikePoint(geoJson)) {
        let result = cleanCoords(geoJson.toJson());
        return geometryFactory(result.geometry);
    }

    let coordinates = _simplify(geoJson.coordinates, 1);
    return geometryFactory({
        type: geoJson.type,
        coordinates: coordinates
    });
};

const _isValidatePoint = (p) => {
    return !!p.length &&
        2 === p.length &&
        validateNum(p[0]) &&
        validateNum(p[1]);
};

const _isSamePoint = (p1, p2) => {
    return p1[0] === p2[0] && p1[1] === p2[1];
};

const _isPointOnLineSegment = (start, end, point) => {
    let x = point[0],
        y = point[1];
    let startX = start[0],
        startY = start[1];
    let endX = end[0],
        endY = end[1];

    let dxc = x - startX;
    let dyc = y - startY;
    let dxl = endX - startX;
    let dyl = endY - startY;
    let cross = dxc * dyl - dyc * dxl;

    if (cross !== 0) {
        return false;
    } else if (Math.abs(dxl) >= Math.abs(dyl)) {
        return dxl > 0 ? startX <= x && x <= endX : endX <= x && x <= startX;
    } else {
        return dyl > 0 ? startY <= y && y <= endY : endY <= y && y <= startY;
    }
};

const _cleanPath = (path) => {

    let points = path;

    if (points.length == 2) {
        if (_isSamePoint(points[0], points[1])) {
            return null;
        } else {
            return points;
        }
    }

    let newPoints = new Array(points.length);
    let index = 0;
    let newPointsLength = 0;

    newPoints[index++] = points[0];
    newPointsLength = index;
    for (let i = 1; i < points.length; i++) {
        let prevAddedPoint = newPoints[newPointsLength - 1];

        if (!_isSamePoint(points[i], prevAddedPoint)) {
            //不同的点添加到数组中
            newPoints[index++] = points[i];
            newPointsLength = index;
        } else if (newPointsLength > 1) {
            if (!_isPointOnLineSegment(newPoints[newPointsLength - 2], points[i], newPoints[newPointsLength - 1])) {
                //点不在同一直线上，添加至数组中
                newPoints[index++] = points[i];
                newPointsLength = index;
            } else {
                //点在同一值线上，替换最后一个点为当前计算的点
                newPoints[index - 1] = points[i];
            }
        }
    }

    //如果有点过滤，那么创建的数组大于实际返回的数据，剪切出需要返回的部分
    return newPoints.slice(0, index);
};

/**
 * 过滤图形中的重复点或者在同一直线上的中间点
 *
 * @param geometry
 * @return {*|{coordinates, type}|Geometry|null|Point|MultiPoint|LineString|MultiLineString|Polygon|*|MultiPolygon|Polygon|MultiLineString|LineString}
 */
export const cleanCoords = (geometry) => {
    let geoJson = toGeoJson(geometry, false);
    if (!geoJson) {
        return null;
    }

    if (isPoint(geoJson)) {
        return geoJson;
    }

    if (isLikePoint(geoJson)) {
        let coordinates = geoJson.coordinates;
        let points = [];
        for (let coordinate of coordinates) {
            if (!_isValidatePoint(coordinate)) {
                continue;
            }

            for (let point of points) {
                if (_isSamePoint(coordinate, point)) {
                    break;
                }
            }

            points.push(coordinate);
        }

        return geometryFactory({
            type: geoJson.type,
            coordinates: points
        });
    }

    if (isLine(geoJson)) {
        geoJson = geoJson.pathsMap((path)=>{
            return _cleanPath(path);
        });

        if(geoJson.isEmpty()){
            return null;
        }else{
            return geoJson;
        }
    }

    if(isPolygon(geoJson)){
        geoJson = geoJson.ringsMap((ring)=>{
            return _cleanPath(ring);
        });

        if(geoJson.isEmpty()){
            return null;
        }else{
            return geoJson;
        }
    }

    return null;
};

/**
 * 获取图形的矩形范围
 *
 * @param geometry
 * @return {Bounds|null}
 */
export function envelope(geometry) {
    let geoJson = toGeoJson(geometry, false);
    if (!geoJson) {
        return null;
    }

    if (geoJson.isEmpty()) {
        return null;
    }

    let xmin = Number.MAX_VALUE;
    let ymin = Number.MAX_VALUE;
    let xmax = Number.MIN_VALUE;
    let ymax = Number.MIN_VALUE;
    geoJson.coordinatesMap((coordinate) => {
        let x = coordinate[0];
        let y = coordinate[1];

        xmin = Math.min(x, xmin);
        ymin = Math.min(y, ymin);
        xmax = Math.max(x, xmax);
        ymax = Math.max(y, ymax);
    });

    //预防图形中没有点的情况
    if (xmin > xmax || ymin > ymax) {
        return null;
    }

    return new Bounds({
        type: GEOMETRY_TYPE_BOUNDS,
        coordinates: [
            [xmin, ymin],
            [xmax, ymax]
        ]
    });
};

/**
 * 剪切出矩形范围内的图形
 *
 * @param {Geometry} geometry - 几何对象
 * @param {Bounds} bbox - Bounds对象（矩形范围）
 * @param {Bounds} geoBounds - 几何对象的矩形范围
 * @param {Boolean} round - 是否取整（四舍五入）
 *
 */
export const clip = (geometry, bbox, geoBounds, round) => {
    let geoJson = toGeoJson(geometry, false);
    if (!geoJson) {
        return null;
    }

    if (!(geoJson instanceof Geometry)) {
        return null;
    }

    if (geoJson instanceof Bounds) {
        return null;
    }

    if (!(bbox instanceof Bounds)) {
        return null;
    }

    let bounds = bbox;
    if (isPoint(geoJson)) {
        if (bounds.contain(geoJson)) {
            if (round) {
                return new Point({
                    type: GEOMETRY_TYPE_POINT,
                    coordinates: [
                        Math.round(geoJson.coordinates[0]),
                        Math.round(geoJson.coordinates[1])
                    ]
                });
            } else {
                return geoJson;
            }
        }

        return null;
    }

    if (isLikePoint(geoJson)) {
        let coordinates = [];
        for (let coordinate of geoJson.coordinates) {
            if (bounds.contain({
                type: GEOMETRY_TYPE_POINT,
                coordinates: coordinate
            })) {
                coordinates.push(coordinate);
            }
        }

        if (0 !== coordinates.length) {
            if (round) {
                coordinates = coordinates.map((coordinate) => {
                    return [
                        Math.round(coordinate[0]),
                        Math.round(coordinate[1])
                    ];
                });
            }

            return geometryFactory({
                type: GEOMETRY_TYPE_MULTIPOINT,
                coordinates: coordinates
            });
        } else {
            return null;
        }
    }


    if (!geoBounds) {
        geoBounds = envelope(geoJson);
    }
    if (!geoBounds) {
        return null;
    }

    if (bounds.contain(geoBounds)) {
        return geoJson;
    }

    if (!bounds.overlaps(geoBounds)) {
        return null;
    }

    if (isLine(geoJson)) {
        let clipped = bboxClip(geoJson.toJson(), bounds.toArr());
        if (clipped) {
            let geo = geometryFactory(clipped.geometry);
            if (geo && !geo.isEmpty()) {
                if (round) {
                    return geo.coordinatesMap((coordinate) => {
                        return [
                            Math.round(coordinate[0]),
                            Math.round(coordinate[1])
                        ]
                    });
                }

                return geo;
            }
        } else {
            return null;
        }
    }

    if (isPolygon(geoJson)) {
        let intersectGeo = intersect(geoJson.toJson(), bounds.toPolygon().toJson());
        if (intersectGeo) {
            let geo = geometryFactory(intersectGeo.geometry);
            if (geo && !geo.isEmpty()) {
                if (round) {
                    return geo.coordinatesMap((coordinate) => {
                        return [
                            Math.round(coordinate[0]),
                            Math.round(coordinate[1])
                        ]
                    });
                }

                return geo;
            }
        } else {
            return null;
        }
    }

    return null;

    // return geo;

    // if(isLine(geoJson)){
    //     let paths = [];
    //     if(geoJson instanceof LineString){
    //         paths = clipPath([geoJson.coordinates] , bounds ,round);
    //         if(0 !== paths.length){
    //             return geometryFactory({
    //                 type : GEOMETRY_TYPE_LINESTRING,
    //                 coordinates : paths[0]
    //             })
    //         }
    //     }else{
    //         paths = clipPath(geoJson.coordinates , bounds,round);
    //         if(0 !== paths.length){
    //             return geometryFactory({
    //                 type : GEOMETRY_TYPE_MULTILINESTRING,
    //                 coordinates : paths
    //             });
    //         }
    //     }
    // }
    //
    //
    //
    // return null;
};

function clipPath(rings, bounds, round) {
    let parts = [],
        i, j, k, len, len2, segment, points;

    for (i = 0, k = 0, len = rings.length; i < len; i++) {
        points = rings[i];

        for (j = 0, len2 = points.length; j < len2 - 1; j++) {
            segment = _clipSegment(points[j], points[j + 1], bounds, j, round);

            if (!segment) {
                continue;
            }

            parts[k] = parts[k] || [];
            parts[k].push(segment[0]);

            // if segment goes out of screen, or it's the last one, it's the end of the line part
            if ((segment[1] !== points[j + 1]) || (j === len2 - 2)) {
                parts[k].push(segment[1]);
                k++;
            }
        }
    }

    return parts;
}

function clipPolygon(rings, bounds) {

}

function _simplify(points, tolerance) {
    if (!tolerance || !points.length) {
        return points.slice();
    }

    let sqTolerance = tolerance * tolerance;

    // stage 1: vertex reduction
    points = _reducePoints(points, sqTolerance);

    // stage 2: Douglas-Peucker simplification
    points = _simplifyDP(points, sqTolerance);

    return points;
}

// function pointToSegmentDistance(p, p1, p2) {
//     return Math.sqrt(_sqClosestPointOnSegment(p, p1, p2, true));
// }
//
// function closestPointOnSegment(p, p1, p2) {
//     return _sqClosestPointOnSegment(p, p1, p2);
// }

function _simplifyDP(points, sqTolerance) {

    let len = points.length,
        ArrayConstructor = typeof Uint8Array !== undefined + '' ? Uint8Array : Array,
        markers = new ArrayConstructor(len);

    markers[0] = markers[len - 1] = 1;

    _simplifyDPStep(points, markers, sqTolerance, 0, len - 1);

    let i,
        newPoints = [];

    for (i = 0; i < len; i++) {
        if (markers[i]) {
            newPoints.push(points[i]);
        }
    }

    return newPoints;
}

function _simplifyDPStep(points, markers, sqTolerance, first, last) {

    let maxSqDist = 0,
        index, i, sqDist;

    for (i = first + 1; i <= last - 1; i++) {
        sqDist = _sqClosestPointOnSegment(points[i], points[first], points[last], true);

        if (sqDist > maxSqDist) {
            index = i;
            maxSqDist = sqDist;
        }
    }

    if (maxSqDist > sqTolerance) {
        markers[index] = 1;

        _simplifyDPStep(points, markers, sqTolerance, first, index);
        _simplifyDPStep(points, markers, sqTolerance, index, last);
    }
}

function _reducePoints(points, sqTolerance) {
    let reducedPoints = [points[0]];

    let i = 1, prev = 0, len = points.length;
    for (; i < len; i++) {
        if (_sqDist(points[i], points[prev]) > sqTolerance) {
            reducedPoints.push(points[i]);
            prev = i;
        }
    }
    if (prev < len - 1) {
        reducedPoints.push(points[len - 1]);
    }
    return reducedPoints;
}

let _lastCode;

function _clipSegment(a, b, bounds, useLastCode, round) {
    let codeA = useLastCode ? _lastCode : _getBitCode(a, bounds),
        codeB = _getBitCode(b, bounds),

        codeOut, p, newCode;

    // save 2nd code to avoid calculating it on the next segment
    _lastCode = codeB;

    while (true) {
        // if a,b is inside the clip window (trivial accept)
        if (!(codeA | codeB)) {
            return [a, b];
        }

        // if a,b is outside the clip window (trivial reject)
        if (codeA & codeB) {
            return false;
        }

        // other cases
        codeOut = codeA || codeB;
        p = _getEdgeIntersection(a, b, codeOut, bounds, round);
        newCode = _getBitCode(p, bounds);

        if (codeOut === codeA) {
            a = p;
            codeA = newCode;
        } else {
            b = p;
            codeB = newCode;
        }
    }
}

function _clipPolygon(points, bounds, round) {
    let clippedPoints,
        edges = [1, 4, 2, 8],
        i, j, k,
        a, b,
        len, edge, p;

    for (i = 0, len = points.length; i < len; i++) {
        points[i]._code = _getBitCode(points[i], bounds);
    }

    // for each edge (left, bottom, right, top)
    for (k = 0; k < 4; k++) {
        edge = edges[k];
        clippedPoints = [];

        for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
            a = points[i];
            b = points[j];

            // if a is inside the clip window
            if (!(a._code & edge)) {
                // if b is outside the clip window (a->b goes out of screen)
                if (b._code & edge) {
                    p = _getEdgeIntersection(b, a, edge, bounds, round);
                    p._code = _getBitCode(p, bounds);
                    clippedPoints.push(p);
                }
                clippedPoints.push(a);

                // else if b is inside the clip window (a->b enters the screen)
            } else if (!(b._code & edge)) {
                p = _getEdgeIntersection(b, a, edge, bounds, round);
                p._code = _getBitCode(p, bounds);
                clippedPoints.push(p);
            }
        }
        points = clippedPoints;
    }

    return points;
}

function _getEdgeIntersection(a, b, code, bounds, round) {
    let dx = b[0] - a[0],
        dy = b[1] - a[1],
        min = bounds.min,
        max = bounds.max,
        x, y;

    if (code & 8) { // top
        x = a[0] + dx * (max.y - a[1]) / dy;
        y = max.y;

    } else if (code & 4) { // bottom
        x = a[0] + dx * (min.y - a[1]) / dy;
        y = min.y;

    } else if (code & 2) { // right
        x = max.x;
        y = a[1] + dy * (max.x - a[0]) / dx;

    } else if (code & 1) { // left
        x = min.x;
        y = a[1] + dy * (min.x - a[0]) / dx;
    }

    if (round) {
        return new Point({
            type: GEOMETRY_TYPE_POINT,
            coordinates: [
                Math.round(x),
                Math.round(y)
            ]
        });
    } else {
        return new Point({
            type: GEOMETRY_TYPE_POINT,
            coordinates: [
                x, y
            ]
        })
    }
}

function _getBitCode(p, bounds) {
    let code = 0;

    if (p[0] < bounds.min.x) { // left
        code |= 1;
    } else if (p[0] > bounds.max.x) { // right
        code |= 2;
    }

    if (p[1] < bounds.min.y) { // bottom
        code |= 4;
    } else if (p[1] > bounds.max.y) { // top
        code |= 8;
    }

    return code;
}

// square distance (to avoid unnecessary Math.sqrt calls)
function _sqDist(p1, p2) {
    let dx = p2[0] - p1[0],
        dy = p2.y - p1[1];
    return dx * dx + dy * dy;
}

// return closest point on segment or distance to that point
export function _sqClosestPointOnSegment(p, p1, p2, sqDist) {
    let x = p1[0],
        y = p1[1],
        dx = p2[0] - x,
        dy = p2[1] - y,
        dot = dx * dx + dy * dy,
        t;

    if (dot > 0) {
        t = ((p[0] - x) * dx + (p[1] - y) * dy) / dot;

        if (t > 1) {
            x = p2[0];
            y = p2[1];
        } else if (t > 0) {
            x += dx * t;
            y += dy * t;
        }
    }

    dx = p[0] - x;
    dy = p[1] - y;

    return sqDist ? dx * dx + dy * dy : new Point({
        type: GEOMETRY_TYPE_POINT,
        coordinates: [x, y]
    });
}
