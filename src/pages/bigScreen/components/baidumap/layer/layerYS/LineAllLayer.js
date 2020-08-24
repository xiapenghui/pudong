import Vue from "vue";
import VectorLayer from "../VectorLayer";
import Graphic from "../../Graphic";
import Feature from "../../geometry/Feature";
import { NONE_SYMBOL } from "../../symbol/SymbolEnum";
import Console from "../../support/Console";
import MultiLineString from "../../geometry/MultiLineString";
// import LineAllData1 from "./LineAllData1"//线数据 全部
import LineAllData from "./LineAllData"//线数据 虚实线
// import LineString from "../../geometry/LineString";
import {wgs2bd} from "../../utils/Convert";//坐标转换

function LineAllLayer() {
    return {
        data() {
            return {};
        },
        props: {},
        watch: {
            ready: function () {
                Console.debug("Test layer ready run");
                this.eventBus.on("layer-visible-LineAllLayer", this.onLayerVisible);//图层显示隐藏监听


                let data = LineAllData;//LineAllData1;//线数据
                let wgs2bdData=[];
                for(let i=0;i<data.features.length;i++){//坐标转换
                    let jArr=[];
                    for(let j=0;j<data.features[i].geometry.paths.length;j++){
                        let kArr=[];
                        for(let k=0;k<data.features[i].geometry.paths[j].length;k++){
                            let jd=data.features[i].geometry.paths[j][k][0];
                            let wd=data.features[i].geometry.paths[j][k][1];
                            let point=wgs2bd(jd,wd);//世界大地坐标转为百度坐标
                            kArr.push([point[0],point[1]]);
                        }
                        jArr.push(kArr);
                    }
                    data.features[i].geometry.lineData=jArr;
                    //data.features[i].geometry.lineData.push(jArr);
                }

                // let gs = data.features.filter((item)=>{
                //     return item.geometry.paths.length;
                // }).filter((item)=>{
                //     return item.geometry.paths[0].length > 2  ||
                //     ( item.geometry.paths[0].length === 2 &&
                //         item.geometry.paths[0][0][0] !==item.geometry.paths[0][1][0] &&
                //         item.geometry.paths[0][0][1] !==item.geometry.paths[0][1][1]);
                // });


                let gs = data.features.map((item)=>{
                    let geometry = new MultiLineString({
                        type: "MultiLineString",
                        coordinates: item.geometry.lineData
                        //coordinates: item.geometry.paths
                    });
                    return new Graphic({
                        feature : new Feature({
                            geometry :  geometry,
                            properties : Object.assign({},item.attributes)
                        }),
                        symbol : {
                            type : NONE_SYMBOL
                        }
                    });
                });

                this.addGraphics(gs);
                this.refresh();
            }
        },
        methods: {
            onLayerVisible(type) {//图层显示隐藏
                this.visible =type
            }
        }
    };
};


export default VectorLayer.extend(LineAllLayer());
