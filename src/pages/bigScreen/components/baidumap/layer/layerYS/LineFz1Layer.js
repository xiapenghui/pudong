// import Vue from "vue";
import VectorLayer from "../VectorLayer";
import Graphic from "../../Graphic";
import Feature from "../../geometry/Feature";
import { NONE_SYMBOL } from "../../symbol/SymbolEnum";
import Console from "../../support/Console";
import MultiLineString from "../../geometry/MultiLineString";
import LineFz1Data from "./LineFz1Data"//线数据伦12沈括
import {wgs2bd} from "../../utils/Convert";//坐标转换

function LineFz1Layer() {
    return {
        data() {
            return {};
        },
        props: {},
        watch: {
            ready: function () {
                Console.debug("Test layer ready run");
                this.eventBus.on("layer-visible-LineFz1Layer", this.onLayerVisible);//图层显示隐藏监听


                let data = LineFz1Data;//线数据
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


                let gs = [];
                for (let i = 0; i < data.features.length; i++) {//data.features.length
                    // if (data.features[i].geometry.paths.length <= 0) {
                    //     //console.log("i："+i+"！！！！"+data.features[i].attributes.OBJECTID)
                    //     continue;
                    // }
                    // if (data.features[i].geometry.paths[0].length <= 2) {//过滤线路数据
                        
                    //     if (data.features[i].geometry.paths[0][0][0] == data.features[i].geometry.paths[0][1][0] &&
                    //         data.features[i].geometry.paths[0][0][1] == data.features[i].geometry.paths[0][1][1]) {
                    //         continue;
                    //     }
                    // }
                    gs.push(
                        new Graphic({
                            id: data.features[i].attributes.OBJECTID,
                            feature: new Feature({
                                id: data.features[i].attributes.OBJECTID,
                                geometry: new MultiLineString({
                                    type: MultiLineString,
                                    coordinates: data.features[i].geometry.lineData//[data.features[i].geometry.paths[0]]
                                }),
                                properties: Object.assign({
                                }, data.features[i].attributes)
                            }),
                            symbol: {
                                type: NONE_SYMBOL
                            }
                        })
                    );
                }
                this.addGraphics(gs);
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


export default VectorLayer.extend(LineFz1Layer());
