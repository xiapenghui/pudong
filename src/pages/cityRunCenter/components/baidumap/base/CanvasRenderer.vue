<template>
    <vmap-overlay pane="mapPane" class="overlay"
                  v-show="visible"
                  :style="{width:width+'px',height:height + 'px',left:offset.x + 'px',top:offset.y + 'px'}"
                  @initialize="initializeHandler"
                  @overlay-ready="readyHandler">
<!--                  @draw="drawHandler"-->
        <canvas class="render"></canvas>
    </vmap-overlay>
</template>

<script>

    import VmapOverlay from "./Overlay";
    import console from "../support/Console";
    import Console from "../support/Console";
    import {mateFactory} from "./Mate";
    import eventBus from "./EventBus";
    import layerOptions from "../layerConfig";
    import layer from "../layer/factory";
    import mapConfig from "../mapConfig";
    import Point from "../geometry/Point";
    import geoJsonFactory, {isBBox, isFeature, isGeometry, isPoint} from "../geometry/factory";
    import Graphic, {isGraphic} from "../Graphic";

    let minZoom = mapConfig.minZoom;
    let maxZoom = mapConfig.maxZoom;

    export default {
        name: "CanvasRenderer",
        components: {VmapOverlay},
        props: {
            "type": {
                type: String,
                required: true,
                default: "default"
            }
        },
        data() {
            return {
                xmin: null,
                xmax: null,
                ymin: null,
                ymax: null,
                width: null,
                height: null,
                ready: false,
                visible: true,
                offset: {
                    x: 0,
                    y: 0
                },
                isMoving: false,
                isDragging : false,
                isZooming : false,
                layers: [],
                logRedrawCost : false
            };
        },
        computed: {},
        watch: {
            ready() {
                console.log("set width and size");
            }
        },
        methods: {

            $_updateMate(ready = true) {
                if (!ready) {
                    return;
                }

                this.mate = mateFactory(this.map, 0);

                this.xmin = this.mate.xmin;
                this.xmax = this.mate.xmax;
                this.ymin = this.mate.ymin;
                this.ymax = this.mate.ymax;
                this.height = this.mate.height;
                this.width = this.mate.width;

                this.$_updateBufferSize();
            },

            $_updateBufferSize() {
                if (!this.canvas || !this.buffer || !this.mate) {
                    return;
                }

                let width = this.mate.width;
                let height = this.mate.height;

                if (this.canvas.width !== width ||
                    this.canvas.height !== height ||
                    this.buffer.width !== width ||
                    this.buffer.height !== height) {
                    this.canvas.width = width;
                    this.canvas.height = height;
                    this.buffer.width = width;
                    this.buffer.height = height;
                }
            },

            $_updateOffset() {
                if (!this.ready) {
                    return;
                }

                let mapEle = this.map.getContainer();
                let mapViewEle = mapEle.firstChild;
                let left = parseInt(mapViewEle.style.left);
                let top = parseInt(mapViewEle.style.top);

                this.offset = {
                    x: -left,
                    y: -top
                };

                // console.debug("update offset", this.offset);
            },
            initializeHandler({BMap, map, el, overlay}) {
                this.map = map;
                this.BMap = BMap;
                this.originInstance = overlay;
                this.originInstance.enableMassClear = false;
                this.enableMassClear = false;

                this.eventBus = eventBus;
                //处理造成地图范围改变的事件，暂停动画与绘制，提高地图挪动时的系统性能
                this.eventBus.on("move-start", this.moveStartHandler);
                this.eventBus.on("move-end",this.moveEndHandler);
                this.eventBus.on("drag-start", this.dragStartHandler);
                this.eventBus.on("drag-end",this.dragEndHandler);
                this.eventBus.on("zoom-start", this.zoomStartHandler);
                this.eventBus.on("zoom-end" , this.zoomEndHandler);
                //鼠标移动事件，用来判断mouse-over和mouse-out事件（考虑到性能问题，暂未实现）
                this.eventBus.on("mouse-move", this.mouseMoveHandler);
                //鼠标点击事件，用来查找当前点击选中的图层中Graphic对象
                this.eventBus.on("click", this.clickHandler);

                //对外提供的交互接口，通过事件解耦（存在调用较复杂的问题，后期看看是否提供接口调用界面）
                this.eventBus.on("canvas-renderer-addLayer", this.onAddLayerHandler);
                this.eventBus.on("canvas-renderer-delLayer", this.onDelLayerHandler);
                this.eventBus.on("canvas-renderer-orderLayer", this.onOrderLayerHandler);
                this.eventBus.on("canvas-renderer-topLayer", this.onTopLayerHandler);
                this.eventBus.on("canvas-renderer-geometryQuery", this.onGeometryQueryHandler);
                this.eventBus.on("canvas-renderer-attributeQuery", this.onAttributeQueryHandler);
                this.eventBus.on("canvas-renderer-geometryAndAttributeQuery", this.onGeometryAndAttributeQueryHandler);
                this.eventBus.on("canvas-renderer-query", this.onQueryHandler);
                this.eventBus.on("canvas-renderer-fly", this.onFlyHandler);

                //初始化canvasRenderer渲染的图层
                let layers = layerOptions.filter((opts) => {
                    //过滤其他canvasRenderer中渲染的图层参数
                    if ("default" === this.type &&                      //当前canvasRenderer为默认的实例
                        (!opts.hasOwnProperty("canvasRendererType") ||  //canvasRendererType属性不存在
                            !opts.canvasRendererType ||                 //canvasRendererType属性值为空
                            opts.canvasRendererType === this.type)) {   //canvasRendererType与当前canvasRenderer的type相同
                        return true;
                    }

                    return false;
                }).map((opts) => {
                    //实例化图层
                    return layer(opts);
                });
                this.addLayers(layers);

                let size = this.map.getSize();

                //设置显示的canvas对象
                this.canvas = this.$el.firstChild;
                this.canvas.width = size.width;
                this.canvas.height = size.height;
                this.ctx = this.canvas.getContext("2d");

                //初始化内部离屏绘制canvas，实现类似双缓冲功能，优化显示体验
                this.buffer = document.createElement("canvas");
                this.buffer.width = size.width;
                this.buffer.height = size.height;
                this.context = this.buffer.getContext("2d");
                this.imageData = null;

                if (!window.canvasRender) {
                    window.canvasRender = [];
                }
                window.canvasRender[this.type] = this;
            },


            onAddLayerHandler({layer = null, canvasRendererType = "default"}) {
                if (this.type !== canvasRendererType) {
                    return;
                }

                this.addLayer(layer);
            },

            onDelLayerHandler({layer = null}) {
                if (!layer) {
                    return;
                }

                this.delLayer(layer);
            },

            onOrderLayerHandler({layer = null, index = -1}) {
                if (!layer) {
                    return;
                }

                this.orderLayer(layer, index);
            },

            onTopLayerHandler({layer = null}) {
                if (!layer) {
                    return;
                }

                this.topLayer(layer);
            },

            onGeometryQueryHandler({geometry = null, layersOrFun = null, canvasRendererType = "default"}) {
                if (this.type !== canvasRendererType) {
                    return;
                }

                let result = this.geometryQuery(geometry, layersOrFun);
                this.eventBus.emit(
                    "canvas-renderer-geometryQuery-result",
                    Object.assign({
                        canvasRendererType: canvasRendererType
                    }, result));
            },

            onAttributeQueryHandler({fieldInfoOrFun = null, layersOrFun = null, canvasRendererType = "default"}) {
                if (this.type !== canvasRendererType) {
                    return;
                }

                let result = this.attributeQuery(fieldInfoOrFun, layersOrFun);
                this.eventBus.emit(
                    "canvas-renderer-attributeQuery-result",
                    Object.assign({
                        canvasRendererType: canvasRendererType
                    }, result));
            },

            onGeometryAndAttributeQueryHandler({geometry = null, fieldInfoOrFun = null, layersOrFun = null, canvasRendererType = "default"}) {
                if (this.type !== canvasRendererType) {
                    return;
                }

                let result = this.geometryAndAttributeQuery(geometry, fieldInfoOrFun, layersOrFun);
                this.eventBus.emit(
                    "canvas-renderer-geometryAndAttributeQuery-result",
                    Object.assign({
                        canvasRendererType: canvasRendererType
                    }, result));
            },

            onQueryHandler({fun = null, layersOrFun = null, canvasRendererType = "default"}) {
                if (this.type !== canvasRendererType) {
                    return;
                }

                let result = this.query(fun, layersOrFun);
                this.eventBus.emit(
                    "canvas-renderer-query-result",
                    Object.assign({
                        canvasRendererType: canvasRendererType
                    }, result));
            },

            onFlyHandler: function (eventData) {
                if (!eventData) {
                    return;
                }

                let {canvasRendererType = "default"} = eventData;
                if (this.type !== canvasRendererType) {
                    return;
                }

                let result = this.fly(eventData);
                this.eventBus.emit(
                    "canvas-renderer-fly-result",
                    Object.assign({
                        canvasRendererType: canvasRendererType
                    }, result));
            },

            readyHandler({BMap, map, el, overlay}) {
                console.debug("on event", "overlay ready");

                this.$_updateMate(true);
                this.$_updateOffset();

                this.layers.forEach((layer) => {
                    layer.$_updateMate(mateFactory(this.map, layer.$data.boundsExpandSize));
                    layer.$_setMap({BMap, map, vmap: null});
                });

                this.makeZoomViewOptions(map);

                this.ready = true;

                //启动帧动画引擎
                this.runFrame();
            },

            makeZoomViewOptions(map) {
                let size = map.getSize();
                let width = size.width;
                let height = size.height;

                let bounds = map.getBounds();
                let currentZoom = map.getZoom();
                let globalNE = bounds.getNorthEast();
                let globalSW = bounds.getSouthWest();

                let mapType = map.getMapType();
                let projection = mapType.getProjection();
                let minZoom = 0;
                let maxZoom = 21;

                let worldNE = projection.lngLatToPoint(globalNE);
                let worldSW = projection.lngLatToPoint(globalSW);

                let worldWidth = Math.abs(worldNE.x - worldSW.x);
                let worldHeight = Math.abs(worldNE.y - worldSW.y);

                let options = [];
                for (let i = minZoom; i < maxZoom; i++) {
                    let factor = Math.pow(2, i - currentZoom);
                    options.push({
                        zoom: i,
                        worldSize: {
                            width: worldWidth / factor,
                            height: worldHeight / factor
                        },
                        size: {
                            width: width,
                            height: height
                        },
                        resolution: {
                            x: worldWidth / factor / width,
                            y: worldHeight / factor / height
                        }
                    });
                }

                this.zoomOptions = options;
            },

            runFrame() {
                requestAnimationFrame(() => {
                    if (this.needRedraw()) {
                        this.redraw({});
                    }

                    this.runFrame();
                });
            },

            needRedraw() {
                return this.ready &&
                    !this.isMoving &&
                    !this.isZooming &&
                    this.layers.some((layer) => {
                        return layer.canRedraw();
                    });
            },

            zoomStartHandler() {
                this.isZooming = true;
            },

            zoomEndHandler(){
                this.layers.forEach((layer)=>{
                    layer.$_changeZoomStatus();
                });

                this.isZooming = false;
                this.isDragging = false;
                this.isMoving = false;
                this.drawHandler({
                    BMap : this.BMap,
                    map : this.map,
                    el : this.$el,
                    overlay : this.originInstance
                });
            },

            moveStartHandler({type, target, pixel, point}) {
                this.isMoving = true;
            },

            moveEndHandler(){
                this.isMoving = false;
                this.drawHandler({
                    BMap : this.BMap,
                    map : this.map,
                    el : this.$el,
                    overlay : this.originInstance
                });
            },

            dragStartHandler({type, target}) {
                this.isDragging = true;
            },

            dragEndHandler(){
                this.isDragging = false;
                // this.drawHandler({
                //     BMap : this.BMap,
                //     map : this.map,
                //     el : this.$el,
                //     overlay : this.originInstance
                // });
            },

            $_beginChangeMapZoom(){
                this.isZooming = true;
                this.layers.forEach((layer)=>{
                    layer.$_changeZoomStatus();
                });
            },

            $_beginChangeMapExtent() {
                this.oldMate = this.mate;
                this.oldOffset = this.offset;

                this.isMoving = true;
            },

            mouseMoveHandler({type, target, point, pixel, overlay}) {
                if (!this.imageData) {
                    return;
                }

                let width = this.imageData.width;
                let height = this.imageData.height;
                let iData = this.imageData.data;
                let pixelIndex = width * pixel.y + pixel.x;
                let colorIndex = pixelIndex * 4;
                let color = [
                    iData[colorIndex],
                    iData[colorIndex + 1],
                    iData[colorIndex + 2],
                    iData[colorIndex + 3]
                ];

                // Console.log( pixel.x , "," ,pixel.y,pixelIndex , colorIndex , color[0] , color[1] , color[2] , color[3]  );
                // let hitGraphic = null;
                // for(let layer of this.layers){
                //     hitGraphic = layer.hit(pixel.x + layer.$data.boundsExpandSize,pixel.y + layer.$data.boundsExpandSize);
                //     if(hitGraphic){
                //         Console.log("hit" , hitGraphic);
                //         return hitGraphic;
                //     }
                // }
            },

            clickHandler(event) {
                let {type, target, point, pixel, overlay} = event;
                if (!this.imageData) {
                    return;
                }

                let width = this.imageData.width;
                let height = this.imageData.height;
                let iData = this.imageData.data;
                let pixelIndex = width * pixel.y + pixel.x;
                let colorIndex = pixelIndex * 4;
                let color = [
                    iData[colorIndex],
                    iData[colorIndex + 1],
                    iData[colorIndex + 2],
                    iData[colorIndex + 3]
                ];

                Console.debug("mouse click", pixel.x, ",", pixel.y, pixelIndex, colorIndex, color[0], color[1], color[2], color[3]);
                let hitGraphic = null;
                let layer = null;
                for (let i = this.layers.length - 1; i >= 0; i--) {
                    layer = this.layers[i];
                    if (!layer.canVisible) {
                        continue;
                    }

                    hitGraphic = layer.hit(pixel.x + layer.$data.boundsExpandSize, pixel.y + layer.$data.boundsExpandSize);
                    if (hitGraphic) {
                        Console.debug("hit", hitGraphic);
                        event.domEvent.stopPropagation();
                        layer.$emit("graphic-click", {
                            pixel: pixel,
                            point: point,
                            graphic: hitGraphic,
                            map: this.map
                        });
                        return hitGraphic;
                    }
                }
            },

            vectorLayerRedrawHandler: function ({id, name, alias}) {
                this.redraw({});
            },


            redraw: function ({}) {
                if (!this.ready || !this.ctx || !this.context) {
                    return;
                }

                if(this.logRedrawCost){
                    Console.time("redraw canvas render "+this.type+" cost : ");
                }

                // Console.debug("ready to draw");
                this.$emit("beforeDraw", {
                    BMap: this.BMap,
                    map: this.map,
                    el: this.$el,
                    overlay: this.originInstance,
                    render: this
                });

                //更新图层渲染参数
                // this.$_updateMate(this.ready);
                // this.$_updateBufferSize();

                // Console.time("redraw canvas renderer");

                this.drawGraphic()
                    .then(() => {
                        //隐藏图层，为canvas更新图像做准备
                        this.$_updateOffset();
                        this.ctx.clearRect(0, 0, this.width, this.height);
                        this.ctx.drawImage(this.buffer, 0, 0);

                        this.$emit("afterDraw", {
                            BMap: this.BMap,
                            map: this.map,
                            el: this.$el,
                            overlay: this.originInstance,
                            render: this
                        });

                        if(this.logRedrawCost){
                            Console.debug("success to draw " , this.type);
                            Console.timeEnd("redraw canvas render "+this.type+" cost : ");
                        }
                    })
                    .catch((error) => {
                        Console.error("fail to draw", error);

                        this.$_updateOffset();
                        this.ctx.clearRect(0, 0, this.width, this.height);
                        this.$emit("afterDraw", {
                            BMap: this.BMap,
                            map: this.map,
                            el: this.$el,
                            overlay: this.originInstance,
                            render: this
                        });

                        // Console.debug("fail to draw");
                        // Console.timeEnd("redraw canvas renderer");

                        if(this.logRedrawCost){
                            Console.debug("fail to draw ",this.type);
                            Console.timeEnd("redraw canvas render "+this.type+" cost : ");
                        }
                    });
            },

            drawHandler: function ({BMap, map, el, overlay}) {
                Console.log("ready " , this.ready , "isMoving" , this.isMoving , "isDragging" , this.isDragging , "isZooming" , this.isZooming);
                if(!this.ready || this.isMoving || this.isZooming || this.isDragging && overlay === this.originInstance){
                    return;
                }

                Console.log("Canvas Renderer Draw");

                //更新图层渲染参数
                this.$_updateMate(this.ready);
                this.$_updateBufferSize();

                this.layers.forEach((layer) => {
                    layer.$_updateMate(mateFactory(this.map, layer.$data.boundsExpandSize));
                });

                // this.isMoving = false;
            },


            drawGraphic: function () {
                return new Promise((resolve, reject) => {
                    this.context.clearRect(0, 0, this.width, this.height);

                    Promise.all(this.layers.map((layer) => {
                        // layer.$_updateMate(mateFactory(this.map, layer.$data.boundsExpandSize));
                        return layer.requestImageData();
                    })).then(() => {
                        this.layers.forEach((layer) => {
                            this.context.drawImage(
                                layer.buffer,
                                layer.$data.boundsExpandSize,
                                layer.$data.boundsExpandSize,
                                this.width,
                                this.height,
                                0,
                                0,
                                this.width,
                                this.height
                            );
                        });

                        this.imageData = this.context.getImageData(0, 0, this.width, this.height);

                        resolve("");
                    }).catch((error) => {
                        reject(error);
                    });
                });
            },

            /**
             * 获取图层
             * @param idOrNameOrAlias 图层的ID或者name或者alias属性
             */
            getLayer: function (idOrNameOrAlias) {
                for (let layer of this.layers) {
                    if (layer.id === idOrNameOrAlias ||
                        layer.name === idOrNameOrAlias ||
                        layer.alias === idOrNameOrAlias) {
                        return layer;
                    }
                }

                return null;
            },

            /**
             * 传入的对象是否为图层对象
             */
            isLayer: function (layer) {
                return layer &&
                    layer.classType &&
                    "vectorLayer" === layer.classType;
            },


            /**
             * 添加图层
             *
             * @param layer
             * @param index
             * @return {null|*[]}
             * */
            addLayer: function (layer, index) {
                if (!this.isLayer(layer)) {
                    return null;
                }

                if (null === index ||
                    undefined === index ||
                    Number.isNaN(index)) {
                    this.layers.push(layer);
                    layer.canvasRenderer = this;
                    layer.zIndex = this.layers.length - 1;
                    return layer;
                }

                if (index >= this.layers.length) {
                    this.layers.push(layer);
                    layer.zIndex = this.layers.length - 1;
                } else {
                    this.layers.splice(index, 0, layer);
                    this.$_changeLayerZIndex(index);
                }
                layer.canvasRenderer = this;
                this.redraw({});

                return layer;
            },


            /**
             * 添加多个图层
             * @param layers
             */
            addLayers: function (layers) {
                if (!layers ||
                    !(layers instanceof Array) ||
                    0 === layers.length) {
                    return;
                }

                for (let lyr of layers) {
                    if (!this.isLayer(lyr)) {
                        continue;
                    }

                    this.layers.push(lyr);
                    lyr.zIndex = this.layers.length - 1;
                    lyr.canvasRenderer = this;
                }

                this.redraw({});
            },

            /**
             * 删除图层
             * @param layer
             * @return {null|*[]}
             */
            delLayer: function (layer) {
                if (!this.isLayer(layer)) {
                    return null;
                }

                let index = -1;
                let findIndex = -1;
                for (let lyr of this.layers) {
                    index++;
                    if (lyr.id === layer.id) {
                        findIndex = index;
                        break;
                    }
                }

                if (findIndex < 0) {
                    return null;
                }

                let delLayer = this.layers.splice(findIndex, 1);
                delLayer.canvasRenderer = null;
                this.$_changeLayerZIndex(findIndex);
                this.redraw({});

                return delLayer;
            },


            /**
             * 将图层置顶
             * @param layer
             * @return {*}
             */
            topLayer: function (layer) {
                if (!this.isLayer(layer)) {
                    return layer;
                }

                return this.orderLayer(layer, this.layers.length - 1);
            },

            /**
             * 改变图层顺序
             * @param layer
             * @param index
             * @return {*}
             */
            orderLayer: function (layer, index) {
                if (!this.isLayer(layer)) {
                    return layer;
                }

                if (null === index ||
                    undefined === index ||
                    Number.isNaN(index)) {
                    return layer;
                }

                index = parseInt(index);
                if (index < 0) {
                    index = 0;
                } else if (index >= this.layers.length) {
                    index = this.layers.length - 1;
                }

                this.delLayer(layer);
                this.layers.splice(index, 0, layer);
                this.$_changeLayerZIndex(index);
                this.redraw({});

                return layer;
            },


            /**
             * 调整在新增修改zIndex之后的所有图层的zIndex
             */
            $_changeLayerZIndex(changedIndex) {
                for (let i = changedIndex; i < this.layers.length; i++) {
                    this.layers[i].zIndex = i;
                }
            },


            /**
             * 图层过滤
             *
             * 查询图层的基本方法，不建议直接操作该函数，使用包装出来的图形、属性查询接口查询图层信息
             *
             * @param {layersFilterFun} filter - 图层数据过滤函数
             * @param {String[]|layersFilterFun} layersOrFun - 图层组数据过滤函数
             * @return {layerFilterResult[]}
             */
            $_query(filter, layersOrFun) {
                if (!filter || !(filter instanceof Function)) {
                    return [];
                }

                let queryLayers = [];

                if (null === layersOrFun ||
                    undefined === layersOrFun ||
                    !layersOrFun || //判断是0；空字符串；空字符的情况
                    (layersOrFun instanceof Array && 0 === layersOrFun.length) //判断空数组的情况
                ) {
                    //未输入需要查询的图层情况下使用当前的所有图层作为查询的图层
                    queryLayers = this.layers;
                } else if (layersOrFun instanceof Function) {
                    //输入的需要查询的图层为回调函数的情况，则使用该回调函数过滤所有图层，获取到实际需要查询的图层
                    queryLayers = this.layers.filter((layer) => {
                        return layersOrFun(layer);
                    });
                } else if (layersOrFun instanceof Array) {
                    //输入的需要查询的图层为id或name或alias的情况，从所有图层中过滤出符合这几个条件的图层
                    let filterLayers = layersOrFun;

                    let m = new Map();
                    filterLayers.forEach((idOrNameOrAlias) => {
                        m.set(idOrNameOrAlias, idOrNameOrAlias);
                    });

                    queryLayers = this.layers.filter((layer) => {
                        return m.get(layer.id) ||
                            m.get(layer.name) ||
                            m.get(layer.alias);
                    })
                } else {
                    queryLayers = [];
                }


                return queryLayers.map((layer) => {
                    return {
                        layerId: layer.id,
                        layerName: layer.name,
                        layerAlias: layer.alias,
                        graphics: filter(layer)
                    };
                })
            },

            /**
             * 通用图层查询接口
             *
             * @param {graphicsFilterFun} fun - 图层中的图元对象过滤函数
             * @param {String[]|layersFilterFun} layersOrFun - 图层组数据过滤函数
             * @return {layerFilterResult[]}
             */
            query(fun, layersOrFun) {
                return this.$_query(function (layer) {
                    return layer.query(fun);
                }, layersOrFun);
            },

            /**
             * 根据图形查询图层中的对象
             *
             * @param {Geometry} geometry - 查询的图形对象
             * @param {String[]|layersFilterFun} layersOrFun - 图层组数据过滤函数
             * @return {layerFilterResult[]}
             */
            geometryQuery(geometry, layersOrFun) {
                return this.$_query((layer) => {
                    return layer.geometryQuery(geometry);
                }, layersOrFun);
            },

            /**
             * 根据属性信息查询图层中的对象
             *
             * @param {Object|graphicsFilterFun} fieldInfoOrFun - 图层中的图元过滤条件
             * @param {String[]|layersFilterFun} layersOrFun - 图层组数据过滤函数
             * @return {layerFilterResult[]}
             */
            attributeQuery(fieldInfoOrFun, layersOrFun) {
                return this.$_query((layer) => {
                    return layer.attributeQuery(fieldInfoOrFun);
                }, layersOrFun);
            },

            /**
             * 通过图形及属性查询图层中的图元对象
             *
             * @param {Geometry} geometry - 图形对象
             * @param {Object|graphicsFilterFun} fieldInfoOrFun - 图层中的图元过滤条件
             * @param {String[]|layersFilterFun} layersOrFun - 图层组数据过滤函数
             * @return {layerFilterResult[]}
             */
            geometryAndAttributeQuery(geometry, fieldInfoOrFun, layersOrFun) {
                return this.$_query((layer) => {
                    return layer.geometryAndAttributeQuery(geometry, fieldInfoOrFun);
                }, layersOrFun);
            },

            /**
             * @param {Object} options
             * @param {Geometry} options.geometry - 查询的图形对象
             * @param {Object|graphicsFilterFun} options.fieldInfoOrFun - 图层中的图元过滤条件
             * @param {String[]|layersFilterFun} options.layersOrFun - 图层组数据过滤函数
             * @param {Boolean} options.showTips - 是否显示Tips信息
             */
            fly(options) {
                if (!options) {
                    return null;
                }

                if (isPoint(options)) {
                    return this.flyToPoint(options);
                }

                if (isGeometry(options)) {
                    return this.flyToGeometry(options);
                }

                if (isFeature(options)) {
                    return this.flyToFeature(options);
                }

                if (isGraphic(options)) {
                    return this.flyToGraphic(options);
                }

                if (isBBox(options)) {
                    return this.flyToBounds(options);
                }

                if(options.hasOwnProperty("x") &&
                    options.hasOwnProperty("y") &&
                    options.hasOwnProperty("zoom") &&
                    !Number.isNaN(options.x) &&
                    !Number.isNaN(options.y) &&
                    !Number.isNaN(options.zoom)
                ){
                    return this.flyToPoint({
                        type : "Point",
                        coordinates : [ options.x , options.y ]
                    },options.zoom);
                }

                let {
                    geometry = null,
                    fieldInfoOrFun = null,
                    layersOrFun = null,
                    showTips = false
                } = options;

                let queryResults = [];
                if (geometry && fieldInfoOrFun) {
                    queryResults = this.geometryAndAttributeQuery(
                        geometry,
                        fieldInfoOrFun,
                        layersOrFun
                    );
                } else if (geometry) {
                    queryResults = this.geometryQuery(geometry, layersOrFun);
                } else if (fieldInfoOrFun) {
                    queryResults = this.attributeQuery(fieldInfoOrFun, layersOrFun);
                } else {
                    queryResults = [];
                }

                if (0 === queryResults.length) {
                    return {
                        layerId: null,
                        layerName: null,
                        layerAlias: null,
                        graphic: null
                    };
                }

                let firstQueryResult = queryResults[0];
                let graphics = firstQueryResult.graphics;
                if (!graphics || 0 === graphics.length) {
                    return {
                        layerId: firstQueryResult.layerId,
                        layerName: firstQueryResult.layerName,
                        layerAlias: firstQueryResult.layerAlias,
                        graphic: null
                    };
                }

                let graphic = graphics[0];
                this.flyToGraphic(graphic, showTips);

                return {
                    layerId: firstQueryResult.layerId,
                    layerName: firstQueryResult.layerName,
                    layerAlias: firstQueryResult.layerAlias,
                    graphic: graphic
                };
            },

            flyToPoint(point, zoom) {
                if (undefined === zoom ||
                    null === zoom ||
                    Number.isNaN(zoom)) {
                    zoom = maxZoom;
                }

                point = geoJsonFactory(point);
                if (!point ||
                    !point.type ||
                    "Point" !== point.type ||
                    !point.coordinates ||
                    !(point.coordinates instanceof Array) ||
                    2 !== point.coordinates.length ||
                    null === point.coordinates[0] ||
                    null === point.coordinates[1] ||
                    Number.isNaN(point.coordinates[0]) ||
                    Number.isNaN(point.coordinates[1])
                ) {
                    return null;
                }

                this.map.setViewport({
                    center: new BMap.Point(point.coordinates[0], point.coordinates[1]),
                    zoom: zoom
                }, {
                    enableAnimation: true,
                    delay: 200
                });

                return point;
            },

            flyToBounds(bbox) {
                if (!isBBox(bbox)) {
                    return null;
                }

                let globalNE = new BMap.Point(bbox[2], bbox[3]);
                let globalSW = new BMap.Point(bbox[0], bbox[1]);

                let mapType = this.map.getMapType();
                let projection = mapType.getProjection();

                let worldNE = projection.lngLatToPoint(globalNE);
                let worldSW = projection.lngLatToPoint(globalSW);

                let worldWidth = Math.abs(worldNE.x - worldSW.x);
                let worldHeight = Math.abs(worldNE.y - worldSW.y);

                let factor = Math.pow(2, this.map.getZoom() - 18);
                let screenWidth = worldWidth * factor;
                let screenHeight = worldHeight * factor;

                //倒查能够显示下整个范围的地图层级
                let zoom = -1;
                let option;
                for (let index = this.zoomOptions.length - 1; index >= 0; index--) {
                    option = this.zoomOptions[index];
                    if (option.worldSize.width >= worldWidth &&
                        option.worldSize.height >= worldHeight) {
                        zoom = option.zoom;
                        break;
                    }
                }

                if (zoom < 0 || zoom < minZoom) {
                    zoom = minZoom;
                } else if (zoom > maxZoom) {
                    zoom = maxZoom;
                }

                let center = new Point({
                    type: "Point",
                    coordinates: [
                        (bbox[0] + bbox[2]) / 2,
                        (bbox[1] + bbox[3]) / 2
                    ]
                });

                this.flyToPoint(center, zoom);

                return bbox;
            },

            flyToGeometry(geometry) {
                geometry = geoJsonFactory(geometry);
                if (!geometry) {
                    return null;
                }

                if (isPoint(geometry)) {
                    return this.flyToPoint(geometry);
                }

                this.flyToFeature({
                    type: "Feature",
                    geometry: geometry.toJson(),
                    properties: {}
                });

                return geometry;
            },

            flyToFeature(feature) {
                feature = geoJsonFactory(feature);
                if (!feature) {
                    return null;
                }

                let bbox = feature.bbox;

                this.flyToBounds(bbox);

                return feature;
            },

            flyToGraphic(graphic, showTips) {
                let enableShowTips = true;
                if (!(graphic instanceof Graphic)) {
                    graphic = new Graphic(graphic);
                    enableShowTips = false;
                }

                if (!graphic.feature) {
                    return null;
                }

                this.flyToFeature(graphic.feature);

                return graphic;
            }


        }
    }


    /**
     * 图层组过滤函数
     *
     * @function layersFilterFun
     * @param {VectorLayer} layer - 需要判断的图层
     * @return {Boolean}
     **/


    /**
     * 图层上的图元对象过滤结果
     *
     * @typedef layerFilterResult
     *
     * @property {String} layerId - 图层ID
     * @property {String} layerName - 图层名称
     * @property {String} layerAlias - 图层别名
     * @property {Graphic[]} graphics - 图元对象
     **/

    /**
     * 图层处理函数
     *
     * @function layerFilterFun
     * @param {VectorLayer} layer - 需要过滤数据的图层
     * @return {layerFilterResult}
     *
     */

    /**
     * 图层中的图元过滤函数
     *
     * @function graphicsFilterFun
     * @param {Graphic} graphic - 图元对象
     * @return {Boolean}
     * */
</script>

<style scoped>
    .overlay {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        /*background-color: #9dd1cb;*/
        position: absolute;
    }

    .render {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
    }
</style>