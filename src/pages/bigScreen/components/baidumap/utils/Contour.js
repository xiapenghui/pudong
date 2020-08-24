import HeatMapRenderer from "../renderer/HeatMapRenderer";
import contour from "./contour/Contour";
import Polygon from "../geometry/Polygon";

/**
 * 热力图高热点区域追踪
 *
 * @param layer - 热力图图层对象
 * @param value - 高热点区域的值（热力图的最大最小值可以从HeatmapRenderer中获取）
 * @return {Array|*} - Polygon对象数组，坐标为WGS84
 */
export default (layer, value) => {
    if (!layer.renderer ||//图层不存在渲染器
        !(layer.renderer instanceof HeatMapRenderer) ||//图层的渲染器不为热力图渲染器
        !layer.renderer._instance//热力图尚未绘制
    ) {
        return [];
    }

    if (undefined === value ||
        null === value ||
        isNaN(value)) {
        let max = layer.renderer.getDataMax();
        let min = layer.renderer.getDataMin();
        value = min + Math.abs(max - min) * 0.75;
    }

    let expandSize = layer.$data.boundsExpandSize;
    let map = layer.map;
    let projection = map.getMapType().getProjection();
    let contours = contour(layer.renderer, value, false);

    return contours.map((contour) => {
        return new Polygon(contour);
    }).map((polygon) => {
        return polygon.coordinatesMap((coordinate) => {
            return [
                coordinate[0] - expandSize,
                coordinate[1] - expandSize
            ]
        })
    }).map((polygon) => {
        return polygon.coordinatesMap((coordinate) => {
            let p = projection.pointToLngLat(new BMap.Pixel(coordinate[0], coordinate[1]));
            return [p.lng, p.lat];
        });
    });
}