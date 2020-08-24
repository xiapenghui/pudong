// import Vue from "vue";
import VectorLayer from "../VectorLayer";
import Graphic from "../../Graphic";
import Feature from "../../geometry/Feature";
import { NONE_SYMBOL } from "../../symbol/SymbolEnum";
import Console from "../../support/Console";
import IntelligentDeviceData from "./IntelligentDeviceData";
import { GEOMETRY_TYPE_POINT } from "../../geometry/Geometry";
import Point from "../../geometry/Point";
// import DrivingRoute from "../../utils/DrivingRoute";//导航线路
// import { wgs2bd } from "../../utils/Convert";//坐标转换

//演示图层-智能装置
function IntelligentDeviceLayer() {//121.610732 31.191723
    return {
        data() {
            return {};
        },
        props: {},
        methods: {
        },
        watch: {
            ready: function () {
                this.eventBus.on("layer-visible-IntelligentDeviceLayer", this.onLayerVisible);//图层显示隐藏监听
                let graphics = IntelligentDeviceData.map((data) => {
                    return new Graphic({
                        id: data.objId,
                        feature: new Feature({
                            id: data.objId,
                            geometry: new Point({
                                type: GEOMETRY_TYPE_POINT,
                                coordinates: [data.longitude, data.latitude]
                            }),
                            properties: Object.assign({
                            }, data)
                        }),
                        symbol: {
                            type: NONE_SYMBOL
                        }
                    });
                });
                this.addGraphics(graphics);
                this.refresh();
            }
        },
        methods: {
            onLayerVisible(type) {//图层显示隐藏
                if(type){
                    this.visible=type;
                }else{
                    this.visible = !this.visible
                }
            }
        }
    };
};


export default VectorLayer.extend(IntelligentDeviceLayer());
