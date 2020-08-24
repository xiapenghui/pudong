import Point from "../geometry/Point";
import Geometry, {GEOMETRY_TYPE_POINT} from "../geometry/Geometry";
import Feature from "../geometry/Feature";
import Graphic from "../Graphic";

/**
 * 驾车路径规划
 *
 * @param {Point} startPoint - 起点（人员的当前位置）
 * @param {Point} endPoint - 终点（故障变电站的位置）
 * @return {Promise<any>}
 *
 * 返回结果的结构
 * {
 *     start : <Point>,
 *     end : <Point>,
 *     route : <MultiLineString>,
 *     distance : <Number>
 * }
 */
export default (startPoint, endPoint) => {
    if (!BMap) {
        return new Promise(reject => reject(new Error("BMap not loaded")))
    }

    let toPoint = function(p){
        if(p instanceof Point){
            return new BMap.Point(p.geometry.coordinates[ 0 ] , p.geometry.coordinates[ 1 ]);
        }

        if(p instanceof Geometry){
            if(GEOMETRY_TYPE_POINT === p.type ){
                return new BMap.Point(p.geometry.coordinates[ 0 ] , p.geometry.coordinates[ 1 ]);
            }else{
                return null;
            }
        }

        if(p instanceof Feature){
            return toPoint(p.geometry);
        }

        if(p instanceof Graphic){
            return toPoint(p.feature);
        }

        if(p.hasOwnProperty("lng") && p.hasOwnProperty("lat")){
            return new BMap.Point(p.lng , p.lat);
        }

        if(p.hasOwnProperty("x") && p.hasOwnProperty("y")){
            return new BMap.Point(p.x , p.y);
        }

        return null;
    };

    return new Promise((resolve, reject) => {
        let p1 = toPoint(startPoint);
        let p2 = toPoint(endPoint);

        if(!p1 || !p2){
            reject(new Error("start or end point is error"));
            return;
        }

        let driving = new BMap.DrivingRoute("上海", {renderOptions: {map: null, autoViewport: false}});
        driving.setSearchCompleteCallback((response) => {
            let status = driving.getStatus();
            if(BMAP_STATUS_SUCCESS !== status){
                reject(new Error("driving route analysis error"))
                return;
            }

            let distance;
            if (response.taxiFare) {
                distance = response.taxiFare.distance;
            }

            let start = response.getStart().point;
            let end = response.getEnd().point;
            let plan = response.getPlan(0);

            distance = plan.getDistance(false);
            let routeNum = plan.getNumRoutes();
            let coordinates = [];
            for (let i = 0; i < routeNum; i++) {
                let route = plan.getRoute(i);
                let path = route.getPath();
                path = path.map((p) => {
                    return [p.lng, p.lat];
                });
                coordinates.push(path);
            }

            let result = {
                start: {
                    type: "Point",
                    coordinates: [start.lng, start.lat]
                },
                end: {
                    type: "Point",
                    coordinates: [end.lng, end.lat]
                },
                distance: distance,
                route: coordinates
            };

            resolve(result);
        });
        driving.search(p1, p2);
    });

}