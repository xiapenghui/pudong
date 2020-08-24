/**
 * 提供Heatmap内部的事件支持
 */
export default class Coordinator {

    constructor() {
        this.cStore = {};
    }

    on(evtName, callback, scope) {
        let cStore = this.cStore;

        if (!cStore[evtName]) {
            cStore[evtName] = [];
        }
        cStore[evtName].push((function (data) {
            return callback.call(scope, data);
        }));
    }

    emit(evtName, data) {
        let cStore = this.cStore;
        if (cStore[evtName]) {
            let len = cStore[evtName].length;
            for (let i = 0; i < len; i++) {
                let callback = cStore[evtName][i];
                callback(data);
            }
        }
    }
}