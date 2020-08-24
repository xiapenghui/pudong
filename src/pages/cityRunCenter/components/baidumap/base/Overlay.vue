<template>
    <div :data-bis-id="id" :style="{width:width , height : height}">
        <slot></slot>
    </div>
</template>

<script>
    import idGen from "../support/IDGen";
    import console from "../support/Console";
    import commonMixin from 'vue-baidu-map/components/base/mixins/common.js'
    import eventBus from "./EventBus";

    export default {
        name: 'vmap-overlay',
        mixins: [commonMixin('overlay')],
        props: {
            pane: {
                type: String
            },
            width: {
                type: Number
            },
            height: {
                type: Number
            }
        },
        computed: {
            id() {
                return idGen.next();
            }
        },
        watch: {
            pane() {
                this.reload()
            }
        },
        methods: {
            load() {
                const {BMap, map, $el, pane} = this;
                const $emit = this.$emit.bind(this);
                let _self = this;

                class CustomOverlay extends BMap.Overlay {
                    initialize() {
                        this.eventBus = eventBus;

                        try {
                            map.getPanes()[pane].appendChild($el)
                        } catch (e) {
                        }

                        console.debug("emit event", "initialize", BMap, map, $el, this, _self);
                        $emit('initialize', {
                            BMap,
                            map,
                            el: $el,
                            overlay: this
                        });

                        return $el;
                    }

                    draw() {
                        // console.debug("emit event", "draw", BMap, map, $el, this, _self);
                        $emit('draw', {
                            BMap,
                            map,
                            el: $el,
                            overlay: this
                        });
                    }
                }

                const overlay = new CustomOverlay();
                this.originInstance = overlay;
                map.addOverlay(overlay);

                this.eventBus = eventBus;
                this.eventBus.once("tiles-loaded", (function () {
                    console.debug("emit event", "overlay-ready", BMap, map, $el, this, _self);
                    this.$emit("overlay-ready", {
                        BMap,
                        map,
                        el: $el,
                        overlay: overlay
                    });
                }).bind(_self));
            }
        }
    }
</script>
