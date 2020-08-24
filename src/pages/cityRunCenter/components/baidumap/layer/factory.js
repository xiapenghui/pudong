import { IDFactory } from "../support/IDGen";
import console from "../support/Console";
import RendererFactory from "../renderer/factory";

import TestLayer from "./TestLayer"
import PowerStationLayer10kv from "./PowerStationLayer10kv" //电站-10kv
import PowerStationLayer35kv from "./PowerStationLayer35kv" //电站-35kv
import PowerStationLayer110kv from "./PowerStationLayer110kv" //电站-110kv
import HiddenHefectsLayer from "./HiddenHefectsLayer" //隐患缺陷
import ConstructionSiteLayer from "./ConstructionSiteLayer" //施工现场
import ConstructionTrajectoryLayer from "./ConstructionTrajectoryLayer" //施工现场-历史轨迹
import IntelligentCoverLayer from "./IntelligentCoverLayer" //智能井盖
import CommandCentreLayer from "./CommandCentreLayer" //指挥中心
import WorkTicketLayer from "./WorkTicketLayer" //工作票
import GridPersonnelLayer from "./GridPersonnelLayer" //网格化运维
import GridPersonnelTrajectoryLayer from "./GridPersonnelTrajectoryLayer" //网格化运维-历史轨迹
import CableVibrationLayer from "./CableVibrationLayer" //电缆振动
import ProtectionObjectLayer from "./ProtectionObjectLayer" //保电对象
import ProtectionDsdLayer from "./ProtectionDsdLayer" //保电对象-蹲守点
import ProtectionLineLayer from "./ProtectionLineLayer" //保电对象-线路

import PulseLayer from "./layerYS/PulseLayer" //脉冲图层
import BufferAreaLayer from "./layerYS/BufferAreaLayer" //演示图层-故障电站缓冲区
import LineAllLayer from "./layerYS/LineAllLayer" //演示图层-线路 全部
import LineFz1Layer from "./layerYS/LineFz1Layer" //演示图层-线路 伦12沈括
import LineFz2Layer from "./layerYS/LineFz2Layer" //演示图层-线路 伦25东捷张江甲
import RepairPersonnelLineLayer from "./layerYS/RepairPersonnelLineLayer" //演示图层-抢修人员线路
import FaultStationYSLayer from "./layerYS/FaultStationYSLayer" //演示图层-故障电站
import IntelligentCoverYSLayer from "./layerYS/IntelligentCoverYSLayer" //演示图层-智能井盖
import RepairPersonnelYSLayer from "./layerYS/RepairPersonnelYSLayer" //演示图层-抢修人员
import IntelligentDeviceLayer from "./layerYS/IntelligentDeviceLayer" //演示图层-智能装置
import HouseholdTableLayer from "./layerYS/HouseholdTableLayer" //演示图层-户表
import LineHplcLayer from "./layerYS/LineHplcLayer" //演示图层-线路 HPLC



// className : "TestLayer",
//     name : "test_gl",
//     alias : "测试",
//     visible : true,
//     minVisibleZoom : 0,
//     maxVisibleZoom : 10,
//     canVisibleZoom : false,
//     renderer : {
//     type : "simpleRenderer",
//         symbol : {
//         type : "simpleFillSymbol",
//             color : [0,155,0,0.8],
//             outline : {
//             type : "simpleLineSymbol",
//                 color : [0 , 155,0,0.8],
//                 width : 5
//         }
//     }
// }

const idGen = IDFactory("_gl_id_");

export default (options) => {
    console.debug("create layer", options);

    let layer = instance(options.className);
    layer.$data.id = idGen.next();
    layer.$data.name = options.name;
    layer.$data.alias = options.alias;
    layer.$data.visible = options.visible;
    layer.$data.canVisibleZoom = options.canVisibleZoom;
    layer.$data.minVisibleZoom = options.minVisibleZoom;
    layer.$data.maxVisibleZoom = options.maxVisibleZoom;
    layer.$data.canvasRendererType = options.canvasRendererType || "default";

    let renderer = RendererFactory(options.renderer);
    layer.setRenderer(renderer);

    layer.$mount();

    return layer;
}


function instance(className) {
    if ("TestLayer" === className) {
        return new TestLayer();
    }
    if ("PowerStationLayer10kv" === className) {//电站-10kv
        return new PowerStationLayer10kv();
    }
    if ("PowerStationLayer35kv" === className) {//电站-35kv
        return new PowerStationLayer35kv();
    }
    if ("PowerStationLayer110kv" === className) {//电站-110kv
        return new PowerStationLayer110kv();
    }
    if ("HiddenHefectsLayer" === className) {//隐患缺陷
        return new HiddenHefectsLayer();
    }
    if ("ConstructionSiteLayer" === className) {//施工现场
        return new ConstructionSiteLayer();
    }
    if ("ConstructionTrajectoryLayer" === className) {//施工现场-历史轨迹
        return new ConstructionTrajectoryLayer();
    }
    if ("IntelligentCoverLayer" === className) {//智能井盖
        return new IntelligentCoverLayer();
    }
    if ("CommandCentreLayer" === className) {//指挥中心
        return new CommandCentreLayer();
    }
    if ("WorkTicketLayer" === className) {//工作票
        return new WorkTicketLayer();
    }
    if ("GridPersonnelLayer" === className) {//网格化运维
        return new GridPersonnelLayer();
    }
    if ("GridPersonnelTrajectoryLayer" === className) {//网格化运维-历史轨迹
        return new GridPersonnelTrajectoryLayer();
    }
    if ("CableVibrationLayer" === className) {//电缆振动
        return new CableVibrationLayer();
    }
    if ("ProtectionObjectLayer" === className) {//保电对象
        return new ProtectionObjectLayer();
    }
    if ("ProtectionDsdLayer" === className) {//保电对象-蹲守点
        return new ProtectionDsdLayer();
    }
    if ("ProtectionLineLayer" === className) {//保电对象线路
        return new ProtectionLineLayer();
    }
    if ("PulseLayer" === className) {//脉冲图层
        return new PulseLayer();
    }
    if ("BufferAreaLayer" === className) {//演示图层-故障电站缓冲区
        return new BufferAreaLayer();
    }
    if ("LineAllLayer" === className) {//演示图层-线路 全部
        return new LineAllLayer();
    }
    if ("LineFz1Layer" === className) {//演示图层-线路 伦12沈括
        return new LineFz1Layer();
    }
    if ("LineFz2Layer" === className) {//演示图层-线路 伦25东捷张江甲
        return new LineFz2Layer();
    }
    if ("RepairPersonnelLineLayer" === className) {//演示图层-抢修人员线路 
        return new RepairPersonnelLineLayer();
    }
    if ("FaultStationYSLayer" === className) {//演示图层-故障电站
        return new FaultStationYSLayer();
    }
    if ("IntelligentCoverYSLayer" === className) {//演示图层-智能井盖
        return new IntelligentCoverYSLayer();
    }
    if ("RepairPersonnelYSLayer" === className) {//演示图层-抢修人员  
        return new RepairPersonnelYSLayer();
    }
    if ("IntelligentDeviceLayer" === className) {//演示图层-智能装置  
        return new IntelligentDeviceLayer();
    }
    if ("HouseholdTableLayer" === className) {//演示图层-户表  
        return new HouseholdTableLayer();
    }
    if ("LineHplcLayer" === className) {//演示图层-线路 HPLC  
        return new LineHplcLayer();
    }
}