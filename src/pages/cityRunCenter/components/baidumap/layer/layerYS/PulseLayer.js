import Vue from "vue";
import VectorLayer from "../VectorLayer";
import Graphic from "../../Graphic";
import Feature from "../../geometry/Feature";
import { NONE_SYMBOL } from "../../symbol/SymbolEnum";
import Console from "../../support/Console";
import FaultStationYSData from "./FaultStationYSData";
import { GEOMETRY_TYPE_POINT } from "../../geometry/Geometry";
import Point from "../../geometry/Point";
import DrivingRoute from "../../utils/DrivingRoute";//导航线路
import { wgs2bd } from "../../utils/Convert";//坐标转换

//脉冲图层
function PulseLayer() {
    return {
        data() {
            return {};
        },
        props: {},
        methods: {
        },
        watch: {
            ready: function () {
                this.eventBus.on("layer-visible-PulseLayer", this.onLayerVisible);//图层显示隐藏监听
                this.eventBus.on("layer-addPulseGraphic", this.addPulseGraphic);//添加一个Graphic

                // let graphics = FaultStationYSData.map((data) => {
                //     return new Graphic({
                //         id: data.objId,
                //         feature: new Feature({
                //             id: data.objId,
                //             geometry: new Point({
                //                 type: GEOMETRY_TYPE_POINT,
                //                 coordinates: [data.longitude, data.latitude]
                //             }),
                //             properties: Object.assign({
                //             }, data)
                //         }),
                //         symbol: {
                //             type: NONE_SYMBOL
                //         }
                //     });
                // });
                // this.addGraphics(graphics);
                // this.refresh();
            }
        },
        methods: {
            addPulseGraphic({point}) {
                this.removeAll();//清除当前图层所有Graphic
                this.add(new Graphic({
                    feature: new Feature({
                        geometry: {
                            type: GEOMETRY_TYPE_POINT,
                            coordinates: [point.jd, point.wd]
                        },
                        properties:""
                    })
                    , symbol: { type: NONE_SYMBOL }
                }));
                this.refresh();
            },
            onLayerVisible(type) {//图层显示隐藏
                if (type) {
                    this.visible = type;
                } else {
                    this.visible = !this.visible
                }
            }
        }
    };
};


export default VectorLayer.extend(PulseLayer());
