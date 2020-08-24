<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>
    import commonMixin from "vue-baidu-map/components/base/mixins/common.js";
    import {createSize} from "vue-baidu-map/components/base/factory.js";
    import EventBus from "./EventBus";

    export default {
        name: "vmap-control",
        mixins: [commonMixin("control")],
        props: ["anchor", "offset"],
        watch: {
            anchor(val) {
                this.originInstance.setAnchor(val);
            },
            offset(val) {
                this.originInstance.setOffset(val);
            }
        },
        methods: {
            load() {
                const {BMap, map, anchor, offset, $el} = this;
                const Control = function () {
                    this.defaultAnchor = global[anchor || "BMAP_ANCHOR_TOP_LEFT"];
                    this.defaultOffset = createSize(BMap, offset);
                };
                Control.prototype = new BMap.Control();
                Control.prototype.initialize = map => map.getContainer().appendChild($el);
                this.originInstance = new Control(anchor, offset);
                this.eventBus = EventBus;
                map.addControl(this.originInstance);

                //禁止事件冒泡
                this.disablePropagation("click");
                this.disablePropagation("dblclick");
                this.disablePropagation("wheel");
            },

            disablePropagation(eventType) {
                if (this.$el) {
                    this.$el.addEventListener(eventType, e => {
                        this.stopPropagation(e);
                    })
                }

                return this;
            },

            stopPropagation(e) {
                if (e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    e.cancelBubble = true;
                }

                return this;
            }
        }
    };
</script>
