import {validateType as validateGeoJsonType} from "./GeoJson";
import Feature from "./Feature";
import Geometry, {
    GEOMETRY_TYPE_BOUNDS,
    GEOMETRY_TYPE_LINESTRING,
    GEOMETRY_TYPE_MULTILINESTRING,
    GEOMETRY_TYPE_MULTIPOINT,
    GEOMETRY_TYPE_MULTIPOLYGON,
    GEOMETRY_TYPE_POINT,
    GEOMETRY_TYPE_POLYGON,
    validateType as validateGeometryType
} from "./Geometry";
import {GEOJSON_TYPE_FEATURE} from "./GeoJson";
import Point, {draw as drawPoint} from "./Point";
import MultiPoint, {draw as drawMultiPoint} from "./MultiPoint";
import LineString, {draw as drawLineString} from "./LineString";
import MultiLineString, {draw as drawMultiLineString} from "./MultiLineString";
import Polygon, {draw as drawPolygon} from "./Polygon";
import MultiPolygon, {draw as drawMultiPolygon} from "./MultiPolygon";
import Console from "../support/Console";
import Shape from "./shape/Shape";
import Bounds from "./Bounds";

export function validateType(type) {
    return validateGeometryType(type) ||
        validateGeoJsonType(type);
}

export default function geoJsonFactory(props) {
    if (!props) {
        return null;
    }

    let {type = null} = props;

    if (!type) {
        return null;
    }

    if (GEOJSON_TYPE_FEATURE === type) {
        return new Feature(props);
    }

    return geometryFactory(props);
}


export function isFeature(feature) {
    if (feature instanceof Feature) {
        return;
    }

    feature = geoJsonFactory(feature);
    if (!feature) {
        return false;
    }

    if (isGeometry(feature)) {
        return false;
    }

    return true;
}

export function isGeometry(geometry) {
    if (geometry instanceof Geometry) {
        return true;
    }

    geometry = geometryFactory(geometry);
    return !!geometry;
}

export function isBBox(bbox) {
    return !(!bbox ||
        !(bbox instanceof Array) ||
        4 !== bbox.length ||
        Number.isNaN(bbox[0]) ||
        Number.isNaN(bbox[1]) ||
        Number.isNaN(bbox[2]) ||
        Number.isNaN(bbox[3]));
}

export function isPoint(geometry) {
    if (geometry instanceof Point) {
        return true;
    }

    geometry = geometryFactory(geometry);
    return geometry &&
        geometry.type &&
        GEOMETRY_TYPE_POINT === geometry.type;
}

export function isBounds(geometry){
    if(geometry instanceof Bounds){
        return true;
    }

    geometry = geometryFactory(geometry);
    return geometry &&
        geometry.type &&
        GEOMETRY_TYPE_BOUNDS === geometry.type ;
}

export function isLikePoint(geometry) {
    if (geometry instanceof Point ||
        geometry instanceof MultiPoint) {
        return true;
    }

    geometry = geometryFactory(geometry);
    return geometry &&
        geometry.type &&
        (GEOMETRY_TYPE_POINT === geometry.type ||
            GEOMETRY_TYPE_MULTIPOINT === geometry.type);
}

export function isLine(geometry) {
    if (geometry instanceof LineString ||
        geometry instanceof MultiLineString) {
        return true;
    }

    geometry = geometryFactory(geometry);
    return geometry &&
        geometry.type &&
        (GEOMETRY_TYPE_LINESTRING === geometry.type ||
            GEOMETRY_TYPE_MULTILINESTRING === geometry.type);
}

export function isPolygon(geometry){
    if (geometry instanceof Polygon ||
        geometry instanceof MultiPolygon) {
        return true;
    }

    geometry = geometryFactory(geometry);
    return geometry &&
        geometry.type &&
        (GEOMETRY_TYPE_POLYGON === geometry.type ||
            GEOMETRY_TYPE_MULTIPOLYGON === geometry.type);
}

export function geometryFactory(props) {
    if (!props) {
        return null;
    }

    let {type = null} = props;
    if (!type) {
        return null;
    }

    if (GEOMETRY_TYPE_POINT === type) {
        return new Point(props);
    }

    if (GEOMETRY_TYPE_MULTIPOINT === type) {
        return new MultiPoint(props);
    }

    if (GEOMETRY_TYPE_LINESTRING === type) {
        return new LineString(props);
    }

    if (GEOMETRY_TYPE_MULTILINESTRING === type) {
        return new MultiLineString(props);
    }

    if (GEOMETRY_TYPE_POLYGON === type) {
        return new Polygon(props);
    }

    if (GEOMETRY_TYPE_MULTIPOLYGON === type) {
        return new MultiPolygon(props);
    }

    return null;
}

export function draw(context, feature, symbol) {
    if (!feature ||
        !feature.geometry ||
        !feature.geometry.type ||
        !validateGeometryType(feature.geometry.type) ||
        !feature.geometry.coordinates ||
        0 === feature.geometry.coordinates.length
    ) {
        return new Shape({});
    }

    let type = feature.geometry.type;
    let coordinates = feature.geometry.coordinates;

    if (GEOMETRY_TYPE_POINT === type) {
        return drawPoint(context, coordinates, symbol);
    }

    if (GEOMETRY_TYPE_MULTIPOINT === type) {
        return drawMultiPoint(context, coordinates, symbol);
    }

    if (GEOMETRY_TYPE_LINESTRING === type) {
        return drawLineString(context, coordinates, symbol);
    }

    if (GEOMETRY_TYPE_MULTILINESTRING === type) {
        return drawMultiLineString(context, coordinates, symbol);
    }

    if (GEOMETRY_TYPE_POLYGON === type) {
        return drawPolygon(context, coordinates, symbol);
    }

    if (GEOMETRY_TYPE_MULTIPOLYGON === type) {
        return drawMultiPolygon(context, coordinates, symbol);
    }

    Console.warn("not supported geometry type ", type);
    return new Shape({});
}
