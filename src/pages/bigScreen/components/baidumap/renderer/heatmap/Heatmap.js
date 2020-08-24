import HeatmapConfig from "./HeatmapConfig";
import Coordinator from "./Coordinator";
import Renderer from "./Canvas2dRenderer";
import Store from "./Store";

/**
 * 添加事件响应，并将store、renderer、coordinator、heatmap对象做关联
 * @param scope
 * @private
 */
let _connect = (scope) => {
    let renderer = scope._renderer;
    let coordinator = scope._coordinator;
    let store = scope._store;

    coordinator.on('renderpartial', renderer.renderPartial, renderer);
    coordinator.on('renderall', renderer.renderAll, renderer);
    coordinator.on('extremachange', function (data) {
        scope._config.onExtremaChange &&
        scope._config.onExtremaChange({
            min: data.min,
            max: data.max,
            gradient: scope._config['gradient'] || scope._config['defaultGradient']
        });
    });
    store.setCoordinator(coordinator);
};

export default class Heatmap {
    constructor(props = {}) {
        let config = this._config = Object.assign({}, HeatmapConfig, props);
        this._coordinator = new Coordinator();
        // if (config['plugin']) {
        //     let pluginToLoad = config['plugin'];
        //     if (!HeatmapConfig.plugins[pluginToLoad]) {
        //         throw new Error('Plugin \'' + pluginToLoad + '\' not found. Maybe it was not registered.');
        //     } else {
        //         let plugin = HeatmapConfig.plugins[pluginToLoad];
        //         // set plugin renderer and store
        //         this._renderer = new plugin.renderer(config);
        //         this._store = new plugin.store(config);
        //     }
        // } else {
            this._renderer = new Renderer(config);
            this._store = new Store(config);
        // }
        _connect(this);
    }

    addData() {
        this._store.addData.apply(this._store, arguments);
        return this;
    }

    removeData() {
        this._store.removeData &&
        this._store.removeData.apply(this._store, arguments);
        return this;
    }

    setData() {
        this._store.setData.apply(this._store, arguments);
        return this;
    }

    setDataMax() {
        this._store.setDataMax.apply(this._store, arguments);
        return this;
    }

    setDataMin() {
        this._store.setDataMin.apply(this._store, arguments);
        return this;
    }

    configure(config) {
        this._config = Object.assign({}, this._config, config);
        this._renderer.updateConfig(this._config);
        this._coordinator.emit('renderall', this._store._getInternalData());
        return this;
    }

    repaint() {
        this._coordinator.emit('renderall', this._store._getInternalData());
        return this;
    }

    getData() {
        return this._store.getData();
    }

    getDataMax(){
        return this._store._max;
    }

    getDataMin(){
        return this._store._min;
    }

    getDataURL() {
        return this._renderer.getDataURL();
    }

    getValueAt(point) {
        if (this._store.getValueAt) {
            return this._store.getValueAt(point);
        } else if (this._renderer.getValueAt) {
            return this._renderer.getValueAt(point);
        } else {
            return null;
        }
    }

    getAllValue(){
        if(this._renderer.getAllValue){
            return this._renderer.getAllValue();
        }

        return null;
    }

    getMappingValue(){
        if(this._renderer.getMappingValue){
            return this._renderer.getMappingValue();
        }

        return null;
    }
}