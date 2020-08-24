export default [
    // {
    //     className: "TestLayer",
    //     name: "test_gl",
    //     alias: "测试",
    //     visible: true,
    //     minVisibleZoom: 1,
    //     maxVisibleZoom: 10,
    //     canVisibleZoom: true,
    //     // canvasRendererType : "animal",
    //     //绘图测试
    //
    //     // renderer: {
    //     //     type: "uniqueValueRenderer",
    //     //     field: "field",
    //     //     defaultSymbol: {
    //     //         type: "simpleFill",
    //     //         color: [0, 155, 0, 0.8],
    //     //         outline: {
    //     //             type: "simpleLine",
    //     //             color: [0, 155, 0, 0.8],
    //     //             width: 5
    //     //         }
    //     //     },
    //     //     uniqueValueInfos: [
    //     //         {
    //     //             value: "Polygon",
    //     //             symbol: {
    //     //                 type: "simpleFill",
    //     //                 color: [155, 0, 0, 0.8],
    //     //                 outline: {
    //     //                     type: "simpleLine",
    //     //                     color: [0, 155, 0, 0.8],
    //     //                     width: 5
    //     //                 }
    //     //             }
    //     //         },
    //     //         {
    //     //             value: "Polyline",
    //     //             symbol: {
    //     //                 type: "simpleLine",
    //     //                 color: [155, 0, 0, 0.8],
    //     //                 width: 2,
    //     //                 style: "dash"
    //     //             }
    //     //         },
    //     //         {
    //     //             value: "Point",
    //     //             symbol: {
    //     //                 type: "pictureMarker",
    //     //                 url: require('./assets/images/ic_kv_yell.png'),
    //     //                 angle: 0,
    //     //                 height: 70,
    //     //                 width: 70,
    //     //                 xoffset: 0,
    //     //                 yoffset: 0
    //     //             }
    //     //         }
    //     //     ]
    //     // }
    //     // 脉冲动画测试
    //     // renderer: {
    //     //     type: "rippleMarkerRenderer",
    //     //     symbol: {
    //     //         type: "pictureMarker",
    //     //         url: require('./assets/images/ic_kv_yell.png'),
    //     //         angle: 0,
    //     //         height: 70,
    //     //         width: 70,
    //     //         xoffset: 0,
    //     //         yoffset: 0
    //     //     },
    //     //     fromSize : 30,
    //     //     toSize : 80,
    //     //     color : [255,0,0],
    //     //     speed : 3
    //     // }
    //     //
    //     //热力图测试
    //     renderer: {
    //         type: "heatMapRenderer",
    //         valueField: "value",
    //         radius: 80,
    //         blur: 1,
    //         minOpacity: 0.1,
    //         maxOpacity: 0.4,
    //         gradient: {
    //             0.55: "rgba(0,0,255,0.5)",
    //             0.75: "rgba(0,255,0,0.7)",
    //             0.85: "rgba(255,255,0,0.8)",
    //             1.0: "rgba(255,0,0,0.8)"
    //         }
    //     }
    // },


    //演示图层-缓冲区
    {
        className: "BufferAreaLayer",
        name: "BufferAreaLayer",
        alias: "缓冲区",
        visible: true,
        minVisibleZoom: 0,
        maxVisibleZoom: 10,
        canVisibleZoom: false,
        renderer: {
            type: "uniqueValueRenderer",
            field: "field",
            defaultSymbol: {
                type: "simpleFill",
                color: [155, 0, 0, 0.2],
                outline: {
                    type: "simpleLine",
                    color: [155, 0, 0, 0.4],
                    width: 3
                }
            }
        }
    },
    //演示图层-电站线路全部
    {
        className: "LineAllLayer",
        name: "LineAllLayer",
        alias: "线路1-全部",
        visible: false,
        minVisibleZoom: 0,
        maxVisibleZoom: 10,
        canVisibleZoom: false,
        renderer: {
            type: "uniqueValueRenderer",
            field: "JSFS",
            defaultSymbol: {
                type: "simpleLine",
                color: [0, 155, 0, 0.8],
                width: 2
            },
            uniqueValueInfos: [
                {
                    value: "电缆",
                    symbol: {
                        type: "simpleLine",
                        color: [0, 155, 0, 0.8],
                        width: 2,
                        style: "dash"
                    }
                },
                {
                    value: "混合",
                    symbol: {
                        type: "simpleLine",
                        color: [0, 155, 0, 0.8],
                        width: 2
                    }
                }
            ]
        }
    },
    //演示图层 - 线路 伦12沈括
    {
        className: "LineFz1Layer",
        name: "LineFz1Layer",
        alias: "线路-伦12沈括",
        visible: false,
        minVisibleZoom: 0,
        maxVisibleZoom: 10,
        canVisibleZoom: false,
        renderer: {
            type: "uniqueValueRenderer",
            field: "",
            defaultSymbol: {
                type: "simpleLine",
                color: [236, 74, 75],
                width: 5
            }
        }
    },
    //演示图层 - 线路 伦25东捷张江甲
    // {
    //     className: "LineFz2Layer",
    //     name: "LineFz2Layer",
    //     alias: "线路-伦25东捷张江甲",
    //     visible: false,
    //     minVisibleZoom: 0,
    //     maxVisibleZoom: 10,
    //     canVisibleZoom: false,
    //     renderer: {
    //         type: "uniqueValueRenderer",
    //         field: "",
    //         defaultSymbol: {
    //             type: "simpleLine",
    //             color: [0, 155, 0],
    //             width: 4
    //         }
    //     }
    // },
    //演示图层 - 线路 HPLC
    {
        className: "LineHplcLayer",
        name: "LineHplcLayer",
        alias: "线路-HPLC",
        visible: true,
        minVisibleZoom: 0,
        maxVisibleZoom: 10,
        canVisibleZoom: false,
        renderer: {
            type: "uniqueValueRenderer",
            field: "Layer",
            defaultSymbol: {
                type: "simpleLine",
                color: [13, 136, 229],
                width: 2
            },
            uniqueValueInfos: [
                {
                    value: "用电-计量箱",
                    symbol: {
                        type: "simpleLine",
                        color: [255, 204, 0, 0.8],
                        width: 2
                    }
                },
            ]
        }
    },
    //演示图层-抢修人员线路
    {
        className: "RepairPersonnelLineLayer",
        name: "RepairPersonnelLineLayer",
        alias: "抢修人员线路",
        visible: true,
        minVisibleZoom: 0,
        maxVisibleZoom: 10,
        canVisibleZoom: false,
        renderer: {
            type: "uniqueValueRenderer",
            field: "field",
            defaultSymbol: {
                type: "simpleLine",
                color: [102, 179, 242, 1],
                width: 5
            }
        }
    },
    //保电对象线路
    {
        className: "ProtectionLineLayer",
        name: "ProtectionLineLayer",
        alias: "保电对象线路",
        visible: true,
        minVisibleZoom: 0,
        maxVisibleZoom: 10,
        canVisibleZoom: false,
        renderer: {
            type: "uniqueValueRenderer",
            field: "DYDJ",
            defaultSymbol: {
                type: "simpleLine",//22
                color: [185, 72, 66, 0.8],
                width: 5
            },
            uniqueValueInfos: [
                {
                    value: 25,
                    symbol: {
                        type: "simpleLine",
                        color: [255, 204, 0, 0.8],
                        width: 5
                    }
                },
                {
                    value: 32,
                    symbol: {
                        type: "simpleLine",
                        color: [0, 128, 0, 0.8],
                        width: 5
                    }
                },
                {
                    value: 33,
                    symbol: {
                        type: "simpleLine",
                        color: [192, 0, 192, 0.8],
                        width: 5
                    }
                }
            ]
        }
    },
    //脉冲图层
    {
        className: "PulseLayer",
        name: "PulseLayer",
        alias: "脉冲图层",
        visible: true,
        minVisibleZoom: 0,
        maxVisibleZoom: 20,
        canVisibleZoom: false,
        // renderType : "animal",
        renderer: {
            type: "rippleMarkerRenderer",
            field: "field",
            defaultSymbol: {
                type: "simpleFill",
                color: [0, 155, 0, 0.8],
                outline: {
                    type: "simpleLine",
                    color: [0, 155, 0, 0.8],
                    width: 5
                }
            },
            symbol: {
                type: "pictureMarker",
                url: require('./assets/images/marker/ic_PulseTest.png'),
                angle: 0,
                height: 1,
                width: 1,
                xoffset: 0,
                yoffset: 0
            },
            fromSize: 20,
            toSize: 40,
            color: [255, 0, 0],
            speed: 3
        }
    },
    //施工现场-历史轨迹
    {
        className: "ConstructionTrajectoryLayer",
        name: "ConstructionTrajectoryLayer",
        alias: "施工现场-历史轨迹",
        visible: true,
        minVisibleZoom: 0,
        maxVisibleZoom: 10,
        canVisibleZoom: false,
        renderer: {
            type: "uniqueValueRenderer",
            field: "type",
            defaultSymbol: {
                type: "pictureMarker",
                url: require('./assets/images/marker/ic_lsgj_start.png'),//起点
                angle: 0,
                height: 36,
                width: 36,
                xoffset: 0,
                yoffset: 0
            },
            uniqueValueInfos: [
                {
                    value: "end",
                    symbol: {
                        type: "pictureMarker",
                        url: require('./assets/images/marker/ic_lsgj_end.png'),//终点
                        angle: 0,
                        height: 36,
                        width: 36,
                        xoffset: 0,
                        yoffset: 0
                    }
                },
                {
                    value: "line",
                    symbol: {
                        type: "simpleLine",
                        color: [102, 179, 242, 1],//线路
                        width: 5
                    }
                }
            ]
        }
    },
    //网格化运维-历史轨迹
    {
        className: "GridPersonnelTrajectoryLayer",
        name: "GridPersonnelTrajectoryLayer",
        alias: "网格化运维-历史轨迹",
        visible: true,
        minVisibleZoom: 0,
        maxVisibleZoom: 10,
        canVisibleZoom: false,
        renderer: {
            type: "uniqueValueRenderer",
            field: "type",
            defaultSymbol: {
                type: "pictureMarker",
                url: require('./assets/images/marker/ic_lsgj_start.png'),//起点
                angle: 0,
                height: 36,
                width: 36,
                xoffset: 0,
                yoffset: 0
            },
            uniqueValueInfos: [
                {
                    value: "end",
                    symbol: {
                        type: "pictureMarker",
                        url: require('./assets/images/marker/ic_lsgj_end.png'),//终点
                        angle: 0,
                        height: 36,
                        width: 36,
                        xoffset: 0,
                        yoffset: 0
                    }
                },
                {
                    value: "line",
                    symbol: {
                        type: "simpleLine",
                        color: [102, 179, 242, 1],//线路
                        width: 5
                    }
                }
            ]
        }
    },
    //指挥中心
    {
        className: "CommandCentreLayer",
        name: "CommandCentreLayer",
        alias: "指挥中心",
        visible: true,
        minVisibleZoom: 4,
        maxVisibleZoom: 10,
        canVisibleZoom: true,
        renderer: {
            type: "uniqueValueRenderer",
            field: "field",
            defaultSymbol: {
                type: "pictureMarker",
                url: require('./assets/images/marker/ic_zhzx.png'),
                angle: 0,
                height: 36,
                width: 36,
                xoffset: 0,
                yoffset: 0
            }
        }
    },
    //电站-10kv
    {
        className: "PowerStationLayer10kv",
        name: "PowerStationLayer10kv",
        alias: "电站-10kv",
        visible: true,
        minVisibleZoom: 4,
        maxVisibleZoom: 10,
        canVisibleZoom: true,
        renderer: {
            type: "uniqueValueRenderer",
            field: "voltage",//交流35kv，交流110kv，交流10kv
            defaultSymbol: {
                type: "pictureMarker",
                url: require('./assets/images/marker/ic_kv_yell.png'),
                angle: 0,
                height: 36,
                width: 36,
                xoffset: 0,
                yoffset: 0
            },
            uniqueValueInfos: [
                {
                    value: "交流110kV",
                    symbol: {
                        type: "pictureMarker",
                        url: require('./assets/images/marker/ic_kv_green.png'),
                        angle: 0,
                        height: 36,
                        width: 36,
                        xoffset: 0,
                        yoffset: 0
                    }
                },
                {
                    value: "交流10kV",
                    symbol: {
                        type: "pictureMarker",
                        url: require('./assets/images/marker/ic_kv_red.png'),
                        angle: 0,
                        height: 36,
                        width: 36,
                        xoffset: 0,
                        yoffset: 0
                    }
                }
            ]
        }
    },
    //电站-35kv
    {
        className: "PowerStationLayer35kv",
        name: "PowerStationLayer35kv",
        alias: "电站-35kv",
        visible: true,
        minVisibleZoom: 2,
        maxVisibleZoom: 10,
        canVisibleZoom: true,
        renderer: {
            type: "uniqueValueRenderer",
            field: "voltage",
            defaultSymbol: {
                type: "pictureMarker",
                url: require('./assets/images/marker/ic_kv_yell.png'),
                angle: 0,
                height: 36,
                width: 36,
                xoffset: 0,
                yoffset: 0
            }
        }
    },
    //电站-110kv
    {
        className: "PowerStationLayer110kv",
        name: "PowerStationLayer110kv",
        alias: "电站-110kv",
        visible: true,
        minVisibleZoom: 2,
        maxVisibleZoom: 10,
        canVisibleZoom: true,
        renderer: {
            type: "uniqueValueRenderer",
            field: "voltage",
            defaultSymbol: {
                type: "pictureMarker",
                url: require('./assets/images/marker/ic_kv_green.png'),
                angle: 0,
                height: 36,
                width: 36,
                xoffset: 0,
                yoffset: 0
            }
        }
    },
    //隐患缺陷
    {
        className: "HiddenHefectsLayer",
        name: "HiddenHefectsLayer",
        alias: "隐患缺陷",
        visible: true,
        minVisibleZoom: 3,
        maxVisibleZoom: 10,
        canVisibleZoom: true,
        renderer: {
            type: "uniqueValueRenderer",
            field: "bug_property_name",
            defaultSymbol: {
                type: "pictureMarker",
                url: require('./assets/images/marker/ic_ybyhd.png'),
                angle: 0,
                height: 36,
                width: 36,
                xoffset: 0,
                yoffset: 0
            },
            uniqueValueInfos: [
                {
                    value: "严重",
                    symbol: {
                        type: "pictureMarker",
                        url: require('./assets/images/marker/ic_yzyhd.png'),
                        angle: 0,
                        height: 36,
                        width: 36,
                        xoffset: 0,
                        yoffset: 0
                    }
                },
                {
                    value: "危急",
                    symbol: {
                        type: "pictureMarker",
                        url: require('./assets/images/marker/ic_wjyhd.png'),
                        angle: 0,
                        height: 36,
                        width: 36,
                        xoffset: 0,
                        yoffset: 0
                    }
                }
            ]
        }
    },
    //施工现场
    {
        className: "ConstructionSiteLayer",
        name: "ConstructionSiteLayer",
        alias: "施工现场",
        visible: true,
        minVisibleZoom: 3,
        maxVisibleZoom: 10,
        canVisibleZoom: true,
        renderer: {
            type: "uniqueValueRenderer",
            field: "roleCode",//工作负责人、工作许可人、管理人员、查岗人员）
            defaultSymbol: {
                type: "pictureMarker",
                url: require('./assets/images/marker/ic_gzfzr.png'),
                angle: 0,
                height: 36,
                width: 36,
                xoffset: 0,
                yoffset: 0
            },
            uniqueValueInfos: [
                {
                    value: "工作许可人",
                    symbol: {
                        type: "pictureMarker",
                        url: require('./assets/images/marker/ic_gzxkr.png'),
                        angle: 0,
                        height: 36,
                        width: 36,
                        xoffset: 0,
                        yoffset: 0
                    }
                },
                {
                    value: "管理人员",
                    symbol: {
                        type: "pictureMarker",
                        url: require('./assets/images/marker/ic_glry.png'),
                        angle: 0,
                        height: 36,
                        width: 36,
                        xoffset: 0,
                        yoffset: 0
                    }
                },
                {
                    value: "查岗人员",
                    symbol: {
                        type: "pictureMarker",
                        url: require('./assets/images/marker/ic_cgry.png'),
                        angle: 0,
                        height: 36,
                        width: 36,
                        xoffset: 0,
                        yoffset: 0
                    }
                }
            ]
        }
    },
    // {
    //     className: "IntelligentCoverLayer",
    //     name: "IntelligentCoverLayer",
    //     alias: "智能井盖",
    //     visible: false,
    //     minVisibleZoom: 0,
    //     maxVisibleZoom: 10,
    //     canVisibleZoom: false,
    //     renderer: {
    //         type: "uniqueValueRenderer",
    //         field: "field",
    //         defaultSymbol: {
    //             type: "pictureMarker",
    //             url: require('./assets/images/marker/ic_right_well_lid.png'),
    //             angle: 0,
    //             height: 36,
    //             width: 36,
    //             xoffset: 0,
    //             yoffset: 0
    //         }
    //     }
    // },
    //工作票
    {
        className: "WorkTicketLayer",
        name: "WorkTicketLayer",
        alias: "工作票",
        visible: true,
        minVisibleZoom: 3,
        maxVisibleZoom: 10,
        canVisibleZoom: true,
        renderer: {
            type: "uniqueValueRenderer",
            field: "status",//0:未完成 1:已完成
            defaultSymbol: {
                type: "pictureMarker",
                url: require('./assets/images/marker/ic_gzp_yellow.png'),
                angle: 0,
                height: 36,
                width: 36,
                xoffset: 20,
                yoffset: 20
            },
            uniqueValueInfos: [
                {
                    value: "1",
                    symbol: {
                        type: "pictureMarker",
                        url: require('./assets/images/marker/ic_gzp_green.png'),
                        angle: 0,
                        height: 36,
                        width: 36,
                        xoffset: 20,
                        yoffset: 20
                    }
                }
            ]
        }
    },
    //网格化人员
    {
        className: "GridPersonnelLayer",
        name: "GridPersonnelLayer",
        alias: "网格化人员",
        visible: true,
        minVisibleZoom: 3,
        maxVisibleZoom: 10,
        canVisibleZoom: true,
        renderer: {
            type: "uniqueValueRenderer",
            field: "dept_name",//1 线路 2 配电 3 电缆 4 变电  5 营销一体化 6 营业站 7 配电自动化
            defaultSymbol: {
                type: "pictureMarker",
                url: require('./assets/images/marker/ic_xlzy.png'),
                angle: 0,
                height: 36,
                width: 36,
                xoffset: 0,
                yoffset: 0
            },
            uniqueValueInfos: [
                {
                    value: "配电",
                    symbol: {
                        type: "pictureMarker",
                        url: require('./assets/images/marker/ic_pd.png'),
                        angle: 0,
                        height: 36,
                        width: 36,
                        xoffset: 0,
                        yoffset: 0
                    }
                },
                {
                    value: "电缆",
                    symbol: {
                        type: "pictureMarker",
                        url: require('./assets/images/marker/ic_dl.png'),
                        angle: 0,
                        height: 36,
                        width: 36,
                        xoffset: 0,
                        yoffset: 0
                    }
                },
                {
                    value: "变电",
                    symbol: {
                        type: "pictureMarker",
                        url: require('./assets/images/marker/ic_bdzy.png'),
                        angle: 0,
                        height: 36,
                        width: 36,
                        xoffset: 0,
                        yoffset: 0
                    }
                },
                {
                    value: "营销一体化",
                    symbol: {
                        type: "pictureMarker",
                        url: require('./assets/images/marker/ic_yxyth.png'),
                        angle: 0,
                        height: 36,
                        width: 36,
                        xoffset: 0,
                        yoffset: 0
                    }
                },
                {
                    value: "营业站",
                    symbol: {
                        type: "pictureMarker",
                        url: require('./assets/images/marker/ic_yyz.png'),
                        angle: 0,
                        height: 36,
                        width: 36,
                        xoffset: 0,
                        yoffset: 0
                    }
                },
                {
                    value: "配电自动化",
                    symbol: {
                        type: "pictureMarker",
                        url: require('./assets/images/marker/ic_pdzdh.png'),
                        angle: 0,
                        height: 36,
                        width: 36,
                        xoffset: 0,
                        yoffset: 0
                    }
                }
            ]
        }
    },
    //电缆振动
    {
        className: "CableVibrationLayer",
        name: "CableVibrationLayer",
        alias: "电缆振动",
        visible: true,
        minVisibleZoom: 3,
        maxVisibleZoom: 10,
        canVisibleZoom: true,
        renderer: {
            type: "uniqueValueRenderer",
            field: "field",
            defaultSymbol: {
                type: "pictureMarker",
                url: require('./assets/images/marker/ic_dlzd.png'),
                angle: 0,
                height: 36,
                width: 36,
                xoffset: 0,
                yoffset: 0
            }
        }
    },
    //演示图层-故障电站
    {
        className: "FaultStationYSLayer",
        name: "FaultStationYSLayer",
        alias: "故障电站",
        visible: false,
        minVisibleZoom: 0,
        maxVisibleZoom: 10,
        canVisibleZoom: false,
        renderer: {
            type: "uniqueValueRenderer",
            field: "field",
            defaultSymbol: {
                type: "pictureMarker",
                url: require('./assets/images/marker/ic_kv_yell.png'),
                angle: 0,
                height: 36,
                width: 36,
                xoffset: 0,
                yoffset: 0
            }
        }
        // renderType : "animal",
        // renderer: {
        //     type: "rippleMarkerRenderer",
        //     field: "field",
        //     defaultSymbol: {
        //         type: "simpleFill",
        //         color: [0, 155, 0, 0.8],
        //         outline: {
        //             type: "simpleLine",
        //             color: [0, 155, 0, 0.8],
        //             width: 5
        //         }
        //     },
        //     symbol: {
        //         type: "pictureMarker",
        //         url: require('./assets/images/marker/ic_kv_yell.png'),
        //         angle: 0,
        //         height: 36,
        //         width: 36,
        //         xoffset: 0,
        //         yoffset: 0
        //     },
        //     fromSize: 15,
        //     toSize: 40,
        //     color: [255, 0, 0],
        //     speed: 3,
        //     uniqueValueInfos: [
        //         {
        //             value: "Polygon",
        //             symbol: {
        //                 type: "simpleFill",
        //                 color: [155, 0, 0, 0.8],
        //                 outline: {
        //                     type: "simpleLine",
        //                     color: [0, 155, 0, 0.8],
        //                     width: 5
        //                 }
        //             }
        //         },
        //         {
        //             value: "Point",
        //             symbol: {
        //                 type: "pictureMarker",
        //                 url: require('./assets/images/marker/ic_kv_yell.png'),
        //                 angle: 0,
        //                 height: 36,
        //                 width: 36,
        //                 xoffset: 0,
        //                 yoffset: 0
        //             }
        //         }
        //     ]
        // }
    },
    //演示图层-智能装置
    {
        className: "IntelligentDeviceLayer",
        name: "IntelligentDeviceLayer",
        alias: "智能装置",
        visible: false,
        minVisibleZoom: 0,
        maxVisibleZoom: 10,
        canVisibleZoom: false,
        renderer: {
            type: "uniqueValueRenderer",
            field: "field",
            defaultSymbol: {
                type: "pictureMarker",
                url: require('./assets/images/marker/ic_znzz.png'),
                angle: 0,
                height: 42,
                width: 42,
                xoffset: 0,
                yoffset: 0
            }
        }
    },
    //演示图层-户表
    {
        className: "HouseholdTableLayer",
        name: "HouseholdTableLayer",
        alias: "户表",
        visible: false,
        minVisibleZoom: 0,
        maxVisibleZoom: 10,
        canVisibleZoom: false,
        // renderType : "animal",
        renderer: {
            type: "rippleMarkerRenderer",
            field: "field",
            defaultSymbol: {
                type: "simpleFill",
                color: [0, 155, 0, 0.8],
                outline: {
                    type: "simpleLine",
                    color: [0, 155, 0, 0.8],
                    width: 5
                }
            },
            symbol: {
                type: "pictureMarker",
                url: require('./assets/images/marker/ic_hbsd.png'),
                angle: 0,
                height: 16,
                width: 16,
                xoffset: 0,
                yoffset: 0
            },
            // fromSize: 20,
            // toSize: 40,
            // color: [255, 0, 0],
            speed: 2,//速度
            fromSize: 10,//内圈大小
            toSize: 20,//脉冲大小
            color: [255, 0, 0],
        }
    },
    //演示图层-智能井盖
    {
        className: "IntelligentCoverYSLayer",
        name: "IntelligentCoverYSLayer",
        alias: "智能井盖",
        visible: true,
        minVisibleZoom: 4,
        maxVisibleZoom: 10,
        canVisibleZoom: true,
        renderer: {
            type: "uniqueValueRenderer",
            field: "state",
            defaultSymbol: {
                type: "pictureMarker",
                url: require('./assets/images/marker/ic_right_well_lid.png'),
                angle: 0,
                height: 36,
                width: 36,
                xoffset: 0,
                yoffset: 0
            },
            uniqueValueInfos: [
                {
                    value: 999,
                    symbol: {
                        type: "pictureMarker",
                        url: require('./assets/images/marker/ic_right_red.png'),
                        angle: 0,
                        height: 36,
                        width: 36,
                        xoffset: 0,
                        yoffset: 0
                    }
                }
            ]
        }
    },
    //演示图层-抢修人员
    {
        className: "RepairPersonnelYSLayer",
        name: "RepairPersonnelYSLayer",
        alias: "抢修人员",
        visible: false,
        minVisibleZoom: 0,
        maxVisibleZoom: 10,
        canVisibleZoom: false,
        renderer: {
            type: "uniqueValueRenderer",
            field: "field",
            defaultSymbol: {
                type: "pictureMarker",
                url: require('./assets/images/marker/ic_qxry.png'),
                angle: 0,
                height: 36,
                width: 36,
                xoffset: 0,
                yoffset: 0
            }
        }
    },
    //保电对象
    {
        className: "ProtectionObjectLayer",
        name: "ProtectionObjectLayer",
        alias: "保电对象",
        visible: true,
        minVisibleZoom: 4,
        maxVisibleZoom: 10,
        canVisibleZoom: true,
        renderer: {
            type: "uniqueValueRenderer",
            field: "zydj",
            defaultSymbol: {
                type: "pictureMarker",
                url: require('./assets/images/marker/ic_bddx_1j.png'),
                angle: 0,
                height: 36,
                width: 36,
                xoffset: 0,
                yoffset: 0
            },
            uniqueValueInfos: [
                {
                    value: "二级",
                    symbol: {
                        type: "pictureMarker",
                        url: require('./assets/images/marker/ic_bddx_2j.png'),
                        angle: 0,
                        height: 36,
                        width: 36,
                        xoffset: 0,
                        yoffset: 0
                    }
                },
                {
                    value: "景观",
                    symbol: {
                        type: "pictureMarker",
                        url: require('./assets/images/marker/ic_bddx_jgd.png'),
                        angle: 0,
                        height: 36,
                        width: 36,
                        xoffset: 0,
                        yoffset: 0
                    }
                }
            ]
        }
    },
    //保电对象-蹲守点
    {
        className: "ProtectionDsdLayer",
        name: "ProtectionDsdLayer",
        alias: "保电对象-蹲守点",
        visible: true,
        minVisibleZoom: 0,
        maxVisibleZoom: 10,
        canVisibleZoom: false,
        renderer: {
            type: "uniqueValueRenderer",
            field: "DYDJ",
            defaultSymbol: {
                type: "pictureMarker",
                url: require('./assets/images/marker/ic_bddxDZ10kv.png'),//10kv
                angle: 0,
                height: 36,
                width: 36,
                xoffset: 0,
                yoffset: 0
            },
            uniqueValueInfos: [
                {
                    value: 25,
                    symbol: {
                        type: "pictureMarker",
                        url: require('./assets/images/marker/ic_bddxDZ35kv.png'),//35kv
                        angle: 0,
                        height: 36,
                        width: 36,
                        xoffset: 0,
                        yoffset: 0
                    }
                },
                {
                    value: 32,
                    symbol: {
                        type: "pictureMarker",
                        url: require('./assets/images/marker/ic_bddxDZ110kv.png'),//110kv
                        angle: 0,
                        height: 36,
                        width: 36,
                        xoffset: 0,
                        yoffset: 0
                    }
                },
                {
                    value: 33,
                    symbol: {
                        type: "pictureMarker",
                        url: require('./assets/images/marker/ic_bddxDZ220kv.png'),//220kv
                        angle: 0,
                        height: 36,
                        width: 36,
                        xoffset: 0,
                        yoffset: 0
                    }
                }
            ]
        }
    },
]