import Vue from "vue";
import {IDFactory} from "../support/IDGen";

let idGen = IDFactory("_eb_id_");

const eventBusFactory = ()=>{
    let eventBus = new Vue();

    return {
        id : idGen.next(),
        on : eventBus.$on.bind(eventBus),
        emit : eventBus.$emit.bind(eventBus),
        off : eventBus.$emit.bind(eventBus),
        once : eventBus.$once.bind(eventBus)
    };
};

const eventBus = new Vue();
eventBus.id = idGen.next();
window.mapEventBus = eventBus;

const on = eventBus.$on;

const emit = eventBus.$emit;

const off = eventBus.$off;

const once = eventBus.$once;

const EventBus = {
    id : idGen.next(),
    on : on.bind(eventBus),
    emit : emit.bind(eventBus),
    off : off.bind(eventBus),
    once : once.bind(eventBus)
};

export {
    on,
    off,
    once,
    emit,
    eventBusFactory
};

export default EventBus;

