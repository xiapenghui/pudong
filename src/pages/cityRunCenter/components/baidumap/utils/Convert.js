
// 坐标转换常量
const pi = 3.14159265358979324;
const a = 6378245.0;
const ee = 0.00669342162296594323;
const x_pi = 3.14159265358979324 * 3000.0 / 180.0;

/**
 * 世界大地坐标转为百度坐标
 * @param lon
 * @param lat
 * @return {Array}
 */
export function wgs2bd (lon,lat) {
    const wgs2gcjR = wgs2gcj(lon ,lat);
    return gcj2bd(wgs2gcjR[0], wgs2gcjR[1])
}

/**
 * 火星坐标转为百度坐标
 * @param lon
 * @param lat
 * @return {Array}
 */
export function gcj2bd (lon,lat) {
    const x = lon, y = lat;
    const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    const bd_lon = z * Math.cos(theta) + 0.0065;
    const bd_lat = z * Math.sin(theta) + 0.006;
    let result = [];

    result.push(bd_lon);
    result.push(bd_lat);

    return result
}


/**
 * 百度坐标转为火星坐标
 * @param lon
 * @param lat
 * @return {Array}
 */
export function bd2gcj (lon ,lat) {
    const x = lon - 0.0065, y = lat - 0.006;
    const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    const gg_lon = z * Math.cos(theta);
    const gg_lat = z * Math.sin(theta);
    let result = [];

    result.push(gg_lon);
    result.push(gg_lat);

    return result
}

/**
 * 世界坐标转为火星坐标
 *
 * @param lon
 * @param lat
 * @return {Array}
 */
export function wgs2gcj ( lon , lat) {
    let dLat = transformLat(lon - 105.0, lat - 35.0);
    let dLon = transformLon(lon - 105.0, lat - 35.0);
    const radLat = lat / 180.0 * pi;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
    const mgLat = lat + dLat;
    const mgLon = lon + dLon;
    let result = [];

    result.push(mgLon);
    result.push(mgLat);

    return result
}

function transformLat (lat, lon) {
    let ret = -100.0 + 2.0 * lat + 3.0 * lon + 0.2 * lon * lon + 0.1 * lat * lon +
        0.2 * Math.sqrt(Math.abs(lat));
    ret += (20.0 * Math.sin(6.0 * lat * pi) + 20.0 * Math.sin(2.0 * lat * pi)) *
        2.0 / 3.0;
    ret += (20.0 * Math.sin(lon * pi) + 40.0 * Math.sin(lon / 3.0 * pi)) * 2.0 /
        3.0;
    ret += (160.0 * Math.sin(lon / 12.0 * pi) + 320 * Math.sin(lon * pi / 30.0)) *
        2.0 / 3.0;
    return ret
}

function transformLon (lat, lon) {
    let ret = 300.0 + lat + 2.0 * lon + 0.1 * lat * lat + 0.1 * lat * lon + 0.1 *
        Math.sqrt(Math.abs(lat));
    ret += (20.0 * Math.sin(6.0 * lat * pi) + 20.0 * Math.sin(2.0 * lat * pi)) *
        2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * pi) + 40.0 * Math.sin(lat / 3.0 * pi)) * 2.0 /
        3.0;
    ret += (150.0 * Math.sin(lat / 12.0 * pi) + 300.0 *
        Math.sin(lat / 30.0 * pi)) * 2.0 / 3.0;
    return ret
}
