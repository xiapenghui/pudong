import Vue from "vue";

import BaiduMap from "vue-baidu-map/components/map/Map.vue";
Vue.component("baidu-map", BaiduMap);

import BmView from "vue-baidu-map/components/map/MapView.vue";
Vue.component("bm-view", BmView);

import BmScale from "vue-baidu-map/components/controls/Scale.vue";
Vue.component("bm-scale", BmScale);

import BmNavigation from "vue-baidu-map/components/controls/Navigation.vue";
Vue.component("bm-navigation", BmNavigation);

import BmMapType from "vue-baidu-map/components/controls/MapType.vue";
Vue.component("bm-map-type", BmMapType);

import BmOverviewMap from "vue-baidu-map/components/controls/OverviewMap.vue";
Vue.component("bm-overview-map", BmOverviewMap);

import BmGeolocation from "vue-baidu-map/components/controls/Geolocation.vue";
Vue.component("bm-geolocation", BmGeolocation);

import BmCopyright from "vue-baidu-map/components/controls/Copyright.vue";
Vue.component("bm-copyright", BmCopyright);

import BmCityList from "vue-baidu-map/components/controls/CityList.vue";
Vue.component("bm-city-list", BmCityList);

import BmPanorama from "vue-baidu-map/components/controls/Panorama.vue";
Vue.component("bm-panorama", BmPanorama);

import BmControl from "vue-baidu-map/components/controls/Control.vue";
Vue.component("bm-control", BmControl);

import BmMarker from "vue-baidu-map/components/overlays/Marker.vue";
Vue.component("bm-marker", BmMarker);

import BmPointCollection from "vue-baidu-map/components/overlays/PointCollection.vue";
Vue.component("bm-point-collection", BmPointCollection);

import BmPolyline from "vue-baidu-map/components/overlays/Polyline.vue";
Vue.component("bm-polyline", BmPolyline);

import BmPolygon from "vue-baidu-map/components/overlays/Polygon.vue";
Vue.component("bm-polygon", BmPolygon);

import BmCircle from "vue-baidu-map/components/overlays/Circle.vue";
Vue.component("bm-circle", BmCircle);

import BmGround from "vue-baidu-map/components/overlays/Ground.vue";
Vue.component("bm-ground", BmGround);

import BmLabel from "vue-baidu-map/components/overlays/Label.vue";
Vue.component("bm-label", BmLabel);

import BmInfoWindow from "vue-baidu-map/components/overlays/InfoWindow.vue";
Vue.component("bm-info-window", BmInfoWindow);

import BmOverlay from "vue-baidu-map/components/overlays/Overlay.vue";
Vue.component("bm-overlay", BmOverlay);

import BmContextMenu from "vue-baidu-map/components/context-menu/Menu.vue";
Vue.component("bm-context-menu", BmContextMenu);

import BmContextMenuItem from "vue-baidu-map/components/context-menu/Item.vue";
Vue.component("bm-context-menu-item", BmContextMenuItem);

import BmLocalSearch from "vue-baidu-map/components/search/LocalSearch.vue";
Vue.component("bm-local-search", BmLocalSearch);

import BmTransit from "vue-baidu-map/components/search/Transit.vue";
Vue.component("bm-transit", BmTransit);

import BmWalking from "vue-baidu-map/components/search/Walking.vue";
Vue.component("bm-walking", BmWalking);

import BmDriving from "vue-baidu-map/components/search/Driving.vue";
Vue.component("bm-driving", BmDriving);

import BmBus from "vue-baidu-map/components/search/Bus.vue";
Vue.component("bm-bus", BmBus);

import BmTile from "vue-baidu-map/components/layers/Tile.vue";
Vue.component("bm-tile", BmTile);

import BmTraffic from "vue-baidu-map/components/layers/Traffic.vue";
Vue.component("bm-traffic", BmTraffic);

import BmBoundary from "vue-baidu-map/components/others/Boundary.vue";
Vue.component("bm-boundary", BmBoundary);

import BmAutoComplete from "vue-baidu-map/components/others/AutoComplete.vue";
Vue.component("bm-auto-complete", BmAutoComplete);

import BmlMarkerClusterer from "vue-baidu-map/components/extra/MarkerClusterer.vue";
Vue.component("bm-marker-clusterer", BmlMarkerClusterer);

import BmlLushu from "vue-baidu-map/components/extra/Lushu.vue";
Vue.component("bm-lushu", BmlLushu);

import BmlHeatmap from "vue-baidu-map/components/extra/Heatmap.vue";
Vue.component("bm-heatmap", BmlHeatmap);

import BmlCurveLine from "vue-baidu-map/components/extra/CurveLine.vue";
Vue.component("bm-curve-line", BmlCurveLine);

import EventBus,{on,off,once,emit } from "./base/EventBus";

import VmapControl from "./base/Control.vue";
Vue.component("vmap-control",VmapControl);



import VmapToolbar from "./control/ToolBar.vue";
Vue.component("vmap-toolbar" , VmapToolbar);


export {
    BaiduMap,
    BmView,
    BmScale,
    BmNavigation,
    BmMapType,
    BmOverviewMap,
    BmGeolocation,
    BmCopyright,
    BmCityList,
    BmPanorama,
    BmControl,
    BmMarker,
    BmPointCollection,
    BmPolyline,
    BmPolygon,
    BmCircle,
    BmGround,
    BmLabel,
    BmInfoWindow,
    BmOverlay,
    BmContextMenu,
    BmContextMenuItem,
    BmLocalSearch,
    BmTransit,
    BmWalking,
    BmDriving,
    BmBus,
    BmTile,
    BmTraffic,
    BmBoundary,
    BmAutoComplete,
    BmlMarkerClusterer,
    BmlLushu,
    BmlHeatmap,
    BmlCurveLine,

    EventBus,
    on,
    off,
    once,
    emit,

    VmapControl,
    VmapToolbar
};

