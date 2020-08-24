import Vue from "vue";
import idGen from "../support/IDGen";
import Console from "../support/Console";
import Graphic from "../Graphic";
import Feature from "../geometry/Feature";
import {NONE_SYMBOL, PICTURE_MARKER_SYMBOL} from "../symbol/SymbolEnum";
import Index from "../support/Index";
import Renderer from "../renderer/Renderer";
import rendererFactory from "../renderer/factory";
import eventBus from "../base/EventBus";
import {GEOMETRY_TYPE_BOUNDS} from "../geometry/Geometry";
import ResolveResponse from "../support/ResolveResponse";
import mapConfig from "../mapConfig";
import {clip, intersects, cleanCoords} from "../geometry/geometryEngine";
import {geometryFactory, isPoint} from "../geometry/factory";
import Bounds from "../geometry/Bounds";
import {validateNum} from "../utils/Utils";


export function BaseLayerMixin() {
    return {
        data() {
            return {
                id: idGen.next(),
                ready: false,
                name: null,
                alias: null,

                canVisible: false,
                canVisibleZoom: true,
                minVisibleZoom: null,
                maxVisibleZoom: null,
                visible: true,

                //定时刷新功能
                autoRefreshTimer : null,
                delay : 0,

                graphics: [],
                boundsExpandSize: 100,
                zIndex: 0,
                canvasRendererType: "default",
                logRequestImageDataCost: false,
                logRenderState: false,
                logLayerState: false
            };
        },

        render() {
            return "";
        },

        created() {

            Console.log("vector layer created");
            this.BMap = null;
            this.map = null;
            this.vmap = null;
            this.classType = "vectorLayer";
            this.canvasRenderer = null;

            this.eventBus = eventBus;
            this.buffer = document.createElement("canvas");
            this.context = this.buffer.getContext("2d");
            this.mate = null;

            this.$_initCache();
            this.ready = false;

            Console.log("vector layer buffer created ", !!this.buffer)
        },

        computed: {},

        methods: {
            $_setMap({BMap, map, vmap}) {
                this.BMap = BMap;
                this.map = map;
                this.vmap = vmap;

                this.$_changeBufferSize();
                this.canVisible = this.$_getCanVisible(this.$_getCanVisibleOptions());


                // let v = this.canVisible;
                // this.needClear = true;
                // this.needRedraw = v;//图层是否需要重修绘制
                // this.needReClipAndScreen = v;//图层数据是否需要重新clip及映射屏幕
                // this.needZoomProject = v;//是否需要重新将坐标投影至当前层级

                this.ready = true;

            },

            /**
             * 初始化图层缓存
             */
            $_initCache() {
                this.$_cache = new Map();
            },


            /**
             * 将经纬度投影至平面坐标（单位米）
             *
             * @param mate
             * @param graphic
             */
            $_projectGraphic(mate, graphic) {
                if (!mate) {
                    return;
                }

                let geometry = graphic.feature.geometry;
                let cleanResult = cleanCoords(geometry);
                if(!cleanResult || cleanResult.isEmpty()){
                    graphic._updateWorld(null);
                    graphic._updateClippedWorld(null);
                    graphic._updateScreen(null);
                    return;
                }

                let cleanGeometry = geometryFactory(cleanResult);
                //转换为投影坐标的图形
                try {
                    graphic._updateWorld(new Feature({
                        id: graphic.id,
                        geometry: cleanGeometry.coordinatesMap((coordinate) => {
                            let world = mate.toWorld(coordinate[0], coordinate[1]);
                            return [world.x, world.y];
                        }),
                        properties: {}
                    }));
                }catch (e) {
                    //防止cleanCoords之后出现的意外情况
                    graphic._updateWorld(null);
                }

                //在屏幕上显示的部分图形
                graphic._updateClippedWorld(null);
                //在屏幕上显示的图形的屏幕坐标图形
                graphic._updateScreen(null);
            },

            $_projectGraphics(mate, graphics) {
                if (!mate) {
                    return;
                }

                graphics.forEach((g) => {
                    this.$_projectGraphic(mate, g);
                })
            },

            $_zoomProjectGraphic(mate, graphic) {
                if (!mate) {
                    return;
                }

                let factor = mate.getFactor();
                let feature = graphic._getWorld();
                if(!feature){
                    return;
                }

                let geometry = feature.geometry;
                geometry = geometry.coordinatesMap((coordinate) => {
                    return [
                        coordinate[0] * factor,
                        coordinate[1] * factor
                    ]
                });
                // geometry = simplify(geometry, 1);

                graphic._updateZoomWorld(new Feature({
                    geometry: geometry.toJson(),
                    properties: {}
                }));
            },

            $_zoomProjectGraphics(mate, graphics) {
                if (!mate) {
                    return;
                }

                graphics.forEach((g) => {
                    this.$_zoomProjectGraphic(mate, g);
                })
            },

            $_createWorldBounds(mate) {
                return new Bounds({
                    type: GEOMETRY_TYPE_BOUNDS,
                    coordinates: [
                        [mate.xmin, mate.ymin],
                        [mate.xmax, mate.ymax]
                    ]
                });
            },

            $_createZoomProjectBounds(mate) {
                let factor = mate.getFactor();
                let bounds = new Bounds({
                    type: GEOMETRY_TYPE_BOUNDS,
                    coordinates: [
                        [
                            mate.xmin * factor, mate.ymin * factor
                        ],
                        [
                            mate.xmax * factor, mate.ymax * factor
                        ]
                    ]
                });

                return bounds;
            },

            $_clipGraphic(mate, graphic, border) {
                if (!mate) {
                    return;
                }

                // if (!border) {
                //     border = this.$_createZoomProjectBounds(mate);
                // }
                //
                // let zf = graphic._getZoomWorld();
                // let bbox = zf.bbox;
                // let zfBounds = new Bounds({
                //     type : GEOMETRY_TYPE_BOUNDS,
                //     coordinates :[
                //         [bbox[0] , bbox[1]],
                //         [bbox[2] , bbox[3]]
                //     ]
                // });
                //
                // if(border.contain(zfBounds)){
                //     graphic._updateClippedZoomWorld(zf);
                //     return;
                // }
                //
                // if(border.intersects(zfBounds)){
                //     let clipResult = clip(zf.geometry, border, true);
                //     if (clipResult) {
                //         graphic._updateClippedZoomWorld(new Feature({
                //             geometry: clipResult,
                //             properties: {}
                //         }));
                //     } else {
                //         graphic._updateClippedZoomWorld(null);
                //     }
                // }
                //
                // graphic._updateClippedZoomWorld(null);

                if (!border) {
                    border = this.$_createZoomProjectBounds(mate);
                }

                let wf = graphic._getZoomWorld();
                if(!wf){
                    return;
                }

                let wfBBox = wf.bbox;
                let geoBounds = new Bounds({
                    type: GEOMETRY_TYPE_BOUNDS,
                    coordinates: [
                        [wfBBox[0], wfBBox[1]],
                        [wfBBox[2], wfBBox[3]]
                    ]
                });
                let clipped = clip(wf.geometry, border, geoBounds, false);
                if (clipped) {
                    graphic._updateClippedWorld(new Feature({
                        geometry: clipped,
                        properties: {}
                    }));
                } else {
                    graphic._updateClippedWorld(null);
                }

            },

            /**
             * 获取在当前可是范围内的图形（平面坐标）
             *
             * @param mate
             * @param graphics
             */
            $_clipGraphics(mate, graphics) {
                if (!mate) {
                    return;
                }

                let border = this.$_createZoomProjectBounds(mate);
                // let border = this.$_createZoomProjectBounds(mate);

                graphics.forEach((g) => {
                    this.$_clipGraphic(mate, g, border);
                });
            },

            $_screenGraphic(mate, graphic, zoomUnit, xoffset, yoffset) {
                if (!mate) {
                    return;
                }

                if (!validateNum(zoomUnit) ||
                    !validateNum(xoffset) ||
                    !validateNum(yoffset)) {
                    zoomUnit = mate.getFactor();
                    xoffset = mate.xmin * zoomUnit;
                    yoffset = mate.ymax * zoomUnit;
                }

                let g = graphic;
                let f = g._getClippedWorld();
                if (!f) {
                    f = g._getZoomWorld();
                    if(!f){
                        g._updateScreen(null);
                    }else{
                        let geometry = f.geometry;
                        if (isPoint(geometry)) {
                            g._updateScreen(new Feature({
                                id: g.id,
                                geometry: geometry.coordinatesMap((coordinate) => {
                                    return [
                                        Math.floor(coordinate[0] - xoffset),
                                        Math.floor(yoffset - coordinate[1])
                                    ];
                                }),
                                properties: {}
                            }));
                        } else {
                            g._updateScreen(null);
                        }
                    }

                    g._updateEnableView(false);
                } else {
                    let geometry = f.geometry;
                    g._updateScreen(new Feature({
                        id: g.id,
                        geometry: geometry.coordinatesMap((coordinate) => {
                            return [
                                Math.floor(coordinate[0] - xoffset),
                                Math.floor(yoffset - coordinate[1])
                            ];
                        }),
                        properties: {}
                    }));
                    g._updateEnableView(true);
                }
            },

            /**
             * 将可视范围内的平面坐标转换为屏幕像素坐标
             *
             * @param mate
             * @param graphics
             */
            $_screenGraphics(mate, graphics) {
                if (!mate) {
                    return;
                }

                let zoomUnit = this.mate.getFactor();
                let xoffset = this.mate.xmin * zoomUnit;
                let yoffset = this.mate.ymax * zoomUnit;

                graphics.forEach((g) => {
                    this.$_screenGraphic(mate, g, zoomUnit, xoffset, yoffset);
                });
            },

            /**
             * 清除当前屏幕绘制的像素点
             */
            $_clearScreen() {
                if (!this.ready) {
                    return;
                }

                if (!this.context) {
                    return;
                }

                this.needClear = false;
                this.context.clearRect(0, 0, this.mate.width, this.mate.height);
                this.context.beginPath();
            },


            /**
             * 绘制图层上的图元对象
             * @param renderer
             * @param graphics
             * @param group
             * @return {Promise<[any, any]>}
             */
            $_drawGraphic(renderer, graphics, group) {
                //如果存在动画，那么需要清除上一帧动画，才能绘制下一帧
                //没有动画效果的图层，则在绘制图元信息之前已经清除
                if (this.renderer.hasAnimal()) {
                    this.renderer.clear(this.context);
                }

                return this.renderer.draw(this.context, this.graphics);
            },


            /**
             * 添加Graphic对象
             * @param graphic
             * @return {null|Graphic}
             */
            add(graphic) {
                let g = null;
                if (graphic instanceof Graphic) {
                    g = graphic;
                } else {
                    g = new Graphic(graphic);
                }

                if (!g) {
                    return null;
                }

                if (this.$_cache.has(g.id)) {
                    let oldGraphic = this.graphics[this.$_cache.get(g.id).index];
                    this.graphics[this.$_cache.get(g.id).index] = g;

                    this.renderer.ungroup(oldGraphic);
                } else {
                    this.graphics.push(g);
                    this.$_cache.set(g.id,
                        new Index({
                            id: g.id,
                            index: this.graphics.length - 1
                        }));
                }

                this.renderer.group(g);
                this.$_projectGraphic(this.mate, g);
                this.$_zoomProjectGraphic(this.mate, g);
                this.$_clipGraphic(this.mate, g);
                this.$_screenGraphic(this.mate, g);

                this.$_changeRedrawStatus();

                return g;
            },

            /**
             * 移除Graphic对象
             * @param id
             * @return {*}
             */
            remove(id) {
                let cachedIndex = this.$_cache.get(id);
                if (!cachedIndex) {
                    return;
                }

                let g = this.graphics.splice(cachedIndex.index, 1)[0];
                this.renderer.ungroup(g);

                this.$_changeRedrawStatus();

                return g;
            },

            /**
             * 添加一组Graphics对象
             * @param graphics
             * @return {*}
             */
            addGraphics(graphics) {
                let newGraphics = graphics.map((graphic) => {
                    let g = null;
                    if (graphic instanceof Graphic) {
                        g = graphic;
                    } else {
                        g = new Graphic(graphic);
                    }

                    return g;
                }).filter((g) => {
                    return g;
                });


                newGraphics.forEach((g) => {
                    if (this.$_cache.has(g.id)) {
                        let oldGraphic = this.graphics[this.$_cache.get(g.id).index];
                        this.graphics[this.$_cache.get(g.id).index] = g;

                        this.renderer.ungroup(oldGraphic);
                    } else {
                        this.graphics.push(g);
                        this.$_cache.set(g.id,
                            new Index({
                                id: g.id,
                                index: this.graphics.length - 1
                            }));
                    }
                });

                this.renderer.group(newGraphics);
                this.$_projectGraphics(this.mate, newGraphics);
                this.$_zoomProjectGraphics(this.mate, newGraphics);
                this.$_clipGraphics(this.mate, newGraphics);
                this.$_screenGraphics(this.mate, newGraphics);

                this.$_changeRedrawStatus();

                return newGraphics;
            },

            /**
             * 清空当前图层中所有的Graphic对象
             */
            removeAll() {
                this.$_initCache();
                this.graphics = [];
                this.renderer._initCachedRendererGroup();
                this.$_clearScreen();

                this.$_changeRedrawStatus();
            },

            /**
             * 设置图层的渲染样式
             * @param renderer
             */
            setRenderer(renderer) {
                if (renderer) {
                    if (renderer instanceof Renderer) {
                        this.renderer = renderer;
                    } else {
                        this.renderer = rendererFactory(renderer);
                    }
                } else {
                    this.renderer = new Renderer({type: NONE_SYMBOL});
                }

                //重置renderer之后更新Graphic的分组数据
                this.renderer.group(this.graphics);

                this.$_changeRedrawStatus();
            },

            /**
             * 刷新图层
             *
             * 在下一次绘制帧中重绘图层
             */
            refresh() {
                this.redraw();
            },

            /**
             * 重绘
             */
            redraw() {
                this.$_changeRedrawStatus();
            },

            $_unMap() {
                this.$data.ready = false;
                this.$data.id = null;
                this.$data.name = null;
                this.$data.alias = null;
                this.$data.canVisibleZoom = null;
                this.$data.minVisibleZoom = null;
                this.$data.maxVisibleZoom = null;
                this.$data.visible = null;
                this.$data.graphics = null;
                this.$data.boundsExpandSize = null;
                this.$_cache = null;
            },


            requestImageData() {
                this.$_logLayerState();

                if (this.logRequestImageDataCost) {
                    Console.time("request image data " + this.name);
                }

                try {
                    if (!this.ready || !this.context) {
                        return new Promise(resolve => {
                            if (this.logRequestImageDataCost) {
                                Console.timeEnd("request image data " + this.name);
                            }
                            resolve(new ResolveResponse({message: "not ready"}))
                        });
                    }

                    if (this.logRequestImageDataCost) {
                        Console.debug(
                            "ready", this.ready,
                            "needClear", this.needClear,
                            "needZoomProject", this.needZoomProject,
                            "needReClipAndScreen", this.needReClipAndScreen,
                            "needRedraw", this.needRedraw
                        );
                    }

                    if (this.needZoomProject) {
                        if (this.logRequestImageDataCost) {
                            Console.time("request zoom project " + this.name);
                        }

                        this.$_zoomProjectGraphics(this.mate, this.graphics);
                        this.needZoomProject = false;

                        if (this.logRequestImageDataCost) {
                            Console.timeEnd("request zoom project " + this.name);
                        }
                    }


                    if (this.needClear) {
                        this.$_clearScreen();
                        this.needClear = false;
                    }


                    if (this.needReClipAndScreen) {
                        this.needReClipAndScreen = false;

                        //clip图形
                        if (this.logRequestImageDataCost) {
                            Console.time("request clip " + this.name);
                        }
                        this.$_clipGraphics(this.mate, this.graphics);
                        if (this.logRequestImageDataCost) {
                            Console.timeEnd("request clip " + this.name);
                        }

                        //映射clip结果至屏幕坐标
                        if (this.logRequestImageDataCost) {
                            Console.time("request screen " + this.name);
                        }
                        this.$_screenGraphics(this.mate, this.graphics);
                        if (this.logRequestImageDataCost) {
                            Console.timeEnd("request screen " + this.name);
                        }
                    }

                    if (this.needRedraw) {
                        if (this.logRequestImageDataCost) {
                            Console.time("request draw " + this.name);
                        }

                        //动画图层需要一直绘制，所以需要好正needRedraw参数为true
                        if (this.renderer.hasAnimal() && this.canVisible) {
                            this.$_changeRedrawStatus();
                        } else {
                            this.needRedraw = false;
                        }

                        //绘制
                        return this.$_drawGraphic(
                            this.renderer,
                            this.graphics,
                            this.$_cache.get("rendererGroup")
                        ).then(() => {
                            if (this.logRequestImageDataCost) {
                                Console.timeEnd("request draw " + this.name);
                            }

                            if (this.logRequestImageDataCost) {
                                Console.timeEnd("request image data " + this.name);
                            }

                            return new ResolveResponse({message: "redraw success"});
                        });
                    }

                    // Console.debug(this.id, this.name, "use buffer");
                    return new Promise(resolve => {
                        if (this.logRequestImageDataCost) {
                            Console.timeEnd("request image data " + this.name);
                        }
                        resolve(new ResolveResponse({message: "using success"}));
                    });
                } catch (e) {
                    //预防由于图层中存在的异常，导致所有的图层都无法绘制
                    Console.error(this.id, this.name, e);

                    return new Promise(reject => {
                        if (this.logRequestImageDataCost) {
                            Console.timeEnd("request image data " + this.name);
                        }
                        reject(e)
                    });
                }
            },

            /**
             * 从后台接口中请求图层数据，为了设置统一
             */
            loadData(){

            },

            startAutoRefreshData(){
                Console.debug(this.$data.name , "start auto refresh timer");

                this.stopAutoRefreshData();

                if(null === this.delay ||
                    undefined === this.delay ||
                    isNaN(this.delay) || 
                    this.delay <= 0){
                    return;
                }

                this.autoRefreshTimer = setInterval( function(){
                    this.loadData();
                }.bind(this) , this.delay);

                Console.debug(this.$data.name , "started auto refresh timer");
            },

            stopAutoRefreshData(){
                if(this.autoRefreshTimer){
                    clearInterval(this.autoRefreshTimer);
                }

                this.autoRefreshTimer = null;
            },

            /**
             * 查询图层中的图元对象
             *
             * @param fun
             * @return {T[]|Array}
             */
            query(fun) {
                if (!fun || !(fun instanceof Function)) {
                    return [];
                }

                return this.graphics
                    .filter((g) => {//过滤合法的图元对象
                        return g &&
                            g.feature &&
                            g.feature.type &&
                            g.feature.geometry &&
                            g.feature.geometry.type;
                    })
                    .filter((g) => {//调用过滤的回调函数
                        return fun(g);
                    });
            },


            /**
             * 根据图形查询图层中的图元对象
             *
             * @param geometry
             * @return {T[]|Array}
             */
            geometryQuery(geometry) {
                if (!geometry || !geometry.type) {
                    return [];
                }

                //输入的图形与图元中的图形相交
                return this.query((g) => {
                    return intersects(geometry, g.feature.geometry);
                });
            },

            /**
             * 根据属性信息查询图层中的图元对象
             *
             * @param fieldInfoOrFun
             * @return {T[]|Array}
             */
            attributeQuery(fieldInfoOrFun) {
                if (!fieldInfoOrFun) {
                    return [];
                }

                //输入的条件是回调函数，调用回调函数判断是否是需要的图元对象
                if (fieldInfoOrFun instanceof Function) {
                    return this.query((g) => {
                        return fieldInfoOrFun(g);
                    });
                }

                //输入的条件为{field : <String> , value : <Object>}格式，通过获取图元的属性信息，与value比较是否相等
                if (fieldInfoOrFun.hasOwnProperty("field") &&
                    fieldInfoOrFun.hasOwnProperty("value")) {
                    return this.query((g) => {
                        let val = g.getPropVal(fieldInfoOrFun.field, null);
                        return val === fieldInfoOrFun.value;
                    });
                }

                return [];
            },

            /**
             * 通过图形及属性查询图层中的图元对象
             *
             * @param geometry
             * @param fieldInfoOrFun
             * @return {Array|T[]|Array}
             */
            geometryAndAttributeQuery(geometry, fieldInfoOrFun) {
                if (!geometry || !geometry.type) {
                    return [];
                }

                //通过属性过滤出部分图元对象（优先使用属性过滤，性能较高）
                let graphics = this.attributeQuery(fieldInfoOrFun);

                //将属性过滤后的图元对象在与图形条件做比较过滤（相交）
                return graphics.filter((g) => {
                    return intersects(geometry, g.feature.geometry);
                });
            },


            hit(x, y) {
                let graphic = null;
                for (let i = this.graphics.length - 1; i >= 0; i--) {
                    graphic = this.graphics[i];
                    let groupedInfo = graphic._getGroupedInfo();
                    let symbol = null;
                    if (null === groupedInfo || undefined === groupedInfo) {
                        continue;
                    } else if ("self" === groupedInfo.id) {
                        symbol = graphic.symbol;
                    } else if ("default" === groupedInfo.id) {
                        symbol = this.renderer.defaultSymbol;
                    } else {
                        symbol = this.renderer.getSymbol(groupedInfo.id);
                    }

                    let tolerance = (symbol.type === PICTURE_MARKER_SYMBOL && 1) ||
                        symbol.width ||
                        (symbol.outline && (symbol.outline.width || 1)) || 0;
                    let isHit = graphic.hit(x, y, tolerance);
                    if (isHit) {
                        return graphic;
                    }
                }

                return null;
            },

            /**
             * 图层是否可见
             * @return {*|boolean|*}
             */
            $_getCanVisible({visible = false, canVisibleZoom = true, minVisibleZoom = -1, maxVisibleZoom = -1}) {
                if (canVisibleZoom) {
                    let zoom = this.map.getZoom();
                    // let mapType = this.map.getMapType();
                    let minZoom = mapConfig.minZoom;//this.map.getMinZoom();
                    let maxZoom = mapConfig.maxZoom;//this.map.getMaxZoom();

                    let offsetZoom = minZoom;
                    let currentZoom = zoom - offsetZoom;

                    if (null !== minVisibleZoom &&
                        undefined !== minVisibleZoom &&
                        !isNaN(minVisibleZoom)) {
                        minVisibleZoom = parseInt(minVisibleZoom);
                    }

                    if (null !== maxVisibleZoom &&
                        undefined !== maxVisibleZoom &&
                        !isNaN(maxVisibleZoom)) {
                        maxVisibleZoom = parseInt(maxVisibleZoom);
                    } else {
                        maxVisibleZoom = maxZoom - minZoom;
                    }

                    return visible &&
                        (minVisibleZoom < 0 || currentZoom >= minVisibleZoom) &&
                        (maxVisibleZoom < 0 || currentZoom <= maxVisibleZoom);
                } else {
                    return visible;
                }
            },

            $_getLayerBaseOptions() {
                return {
                    id: this.id,
                    name: this.name,
                    alias: this.alias,
                    zIndex: this.zIndex,
                    count: this.graphics.length
                };
            },

            $_getCanVisibleOptions() {
                return {
                    visible: this.visible,
                    canVisibleZoom: this.canVisibleZoom,
                    minVisibleZoom: this.minVisibleZoom,
                    maxVisibleZoom: this.maxVisibleZoom
                };
            },

            $_getRenderOptions() {
                return {
                    needClear: this.needClear,
                    needZoomProject: this.needZoomProject,
                    needReClipAndScreen: this.needReClipAndScreen,
                    needRedraw: this.needRedraw
                };
            },

            /**
             * 判断图层是否需要重新绘制
             *
             * @return {boolean|Array|*}
             */
            canRedraw() {
                return this.ready &&                //图层已经就绪
                    this.graphics &&                //图层中包含图元信息
                    this.graphics.length > 0 &&
                    (this.needClear ||              //地图范围发生变化或者图元信息发生变化
                        this.needRedraw ||          //图元信息发生变化
                        this.needReClipAndScreen || //地图范围发生变化
                        this.needZoomProject        //地图发生缩放
                    );
            },


            $_updateMate(mate) {
                if (this.mate &&
                    this.mate.isEqual(mate)) {
                    return;
                }

                this.mate = mate;

                this.$_changeBufferSize();
                this.$_changeReClipAndScreenStatus();
                this.$_changeRedrawStatus();
                this.$_changeNeedClearStatus();
            },

            $_changeBufferSize() {
                if (!this.buffer || !this.mate) {
                    return;
                }

                let bufferWidth = this.buffer.width;
                let bufferHeight = this.buffer.height;

                if (bufferWidth !== this.mate.width ||
                    bufferHeight !== this.mate.height) {
                    this.buffer.width = this.mate.width;
                    this.buffer.height = this.mate.height;

                    this.$_changeReClipAndScreenStatus();
                }
            },

            /**
             * 修改层级重投影的状态
             */
            $_changeZoomStatus() {
                this.$_logRenderState("$_changeZoomStatus before");

                if (this.ready && !this.needZoomProject) {
                    let newVal = this.$_getCanVisible(
                        this.$_getCanVisibleOptions()
                    );

                    this.needZoomProject = true;
                    if(newVal === this.canVisible){
                        this.needReClipAndScreen = true;
                        this.needClear = true;
                        if(newVal){
                            this.needRedraw = true;
                        }
                    }else{
                        this.canVisible = newVal;
                    }
                }

                this.$_logRenderState("$_changeZoomStatus after");
            },

            /**
             * 修改重绘状态
             */
            $_changeRedrawStatus() {
                this.$_logRenderState("$_changeRedrawStatus before");

                if(!this.needRedraw){
                    this.needRedraw = this.canVisible;
                }

                this.$_logRenderState("$_changeRedrawStatus after");
            },

            /**
             * 修改图形Clip状态
             */
            $_changeReClipAndScreenStatus() {
                this.$_logRenderState("$_changeReClipAndScreenStatus before");

                if (!this.needReClipAndScreen) {
                    this.needReClipAndScreen = this.canVisible;
                }

                this.$_logRenderState("$_changeReClipAndScreenStatus after");
            },

            /**
             * 修改图层是否需要清楚状态
             */
            $_changeNeedClearStatus() {
                this.$_logRenderState("$_changeNeedClearStatus before");

                if (!this.needClear) {
                    this.needClear = this.needReClipAndScreen || this.needRedraw;
                }

                this.$_logRenderState("$_changeNeedClearStatus after");
            },

            // $_visibleOptionsChangeHandle() {
            //     this.$_logRenderState("$_visibleOptionsChangeHandle before");
            //
            //     if (this.ready) {
            //         if (this.canVisible) {
            //             this.needClear = true;
            //             this.needReClipAndScreen = true;
            //             this.needRedraw = true;
            //         } else {
            //             this.needClear = true;
            //             this.needReClipAndScreen = false;
            //             this.needRedraw = false;
            //         }
            //     }
            //
            //     this.$_logRenderState("$_visibleOptionsChangeHandle after");
            // },


            $_logRenderState(state) {
                if (!this.logRenderState) {
                    return;
                }

                Console.debug(state, JSON.stringify(Object.assign(
                    {},
                    this.$_getLayerBaseOptions(),
                    this.$_getRenderOptions()))
                )
            },


            $_logLayerState() {
                if (!this.logLayerState) {
                    return;
                }

                Console.debug(JSON.stringify(Object.assign(
                    {canVisible: this.canVisible},
                    this.$_getLayerBaseOptions(),
                    this.$_getRenderOptions(),
                    this.$_getCanVisibleOptions()
                )));
            }
        },
        watch: {
            ready() {
                Console.debug(this.$data.name, "ready", this.$data.ready);
                setTimeout(function(){
                    this.startAutoRefreshData();
                }.bind(this),500);
            },
            visible(newVal, oldVal) {
                if (!this.ready) {
                    return;
                }

                let options = Object.assign({
                    visible: newVal
                }, this.$_getCanVisibleOptions());

                this.canVisible = this.$_getCanVisible(options);
            },
            canVisibleZoom(newVal, oldVal) {
                if (!this.ready) {
                    return;
                }

                let options = Object.assign({
                    canVisibleZoom: newVal
                }, this.$_getCanVisibleOptions());

                this.canVisible = this.$_getCanVisible(options);
            },
            minVisibleZoom(newVal, oldVal) {
                if (!this.ready) {
                    return;
                }

                let options = Object.assign({
                    minVisibleZoom: newVal
                }, this.$_getCanVisibleOptions());

                this.canVisible = this.$_getCanVisible(options);
            },
            maxVisibleZoom(newVal, oldVal) {
                if (!this.ready) {
                    return;
                }

                let options = Object.assign({
                    maxVisibleZoom: newVal
                }, this.$_getCanVisibleOptions());

                this.canVisible = this.$_getCanVisible(options);
            },

            canVisible(newVal, oldVal) {
                this.$_logRenderState("$_watch_canVisible before");

                if (this.ready) {
                    if (newVal) {
                        this.needZoomProject = true;
                        this.needClear = true;
                        this.needReClipAndScreen = true;
                        this.needRedraw = true;
                    } else {
                        this.needZoomProject = false;
                        this.needClear = true;
                        this.needReClipAndScreen = false;
                        this.needRedraw = false;
                    }
                }

                this.$_logRenderState("$_watch_canVisible after");
            }
        }
    };
}

export default Vue.extend(BaseLayerMixin());