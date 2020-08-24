<template>
    <vmap-overlay pane="mapPane" class="overlay"
                  v-show="visible"
                  :style="{width:width+'px',height:height + 'px',left:offset.x + 'px',top:offset.y + 'px'}"
                  @initialize="initializeHandler"
                  @overlay-ready="readyHandler">
        @draw="drawHandler"

    </vmap-overlay>
</template>

<script>
    import eventBus from "../base/EventBus";
    import Console from "../support/Console";

    export default {
        name: "Tips",
        props: {
            visible: {
                type: "Boolean",
                default: false,
                required: true
            },
            lng: {
                type: "Number",
                default: Number.NaN,
                required: true
            },
            lat: {
                type: "Number",
                default: Number.NaN,
                required: true
            }
        },
        data: function () {
            return {
                ready: false,
                title: "",
                graphic: null,
                items: [],
                buts: []
            }
        },
        methods: {
            initializeHandler({BMap, map, el, overlay}) {
                this.BMap = BMap;
                this.map = map;
                this.originInstance = overlay;
                this.originInstance.enableMassClear = false;
                this.enableMassClear = false;

                this.eventBus = eventBus;
            },

            readyHandler({BMap, map, el, overlay}) {
                this.ready = true;
            },

            drawHandler() {
                if(this.ready){

                }

                let map = this.map;

            }
        },
        watch: {
            ready(newVal, oldVal) {

            }
        }
    }
</script>

<style scoped>

</style>