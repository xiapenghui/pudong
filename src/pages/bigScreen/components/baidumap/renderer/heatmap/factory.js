import Heatmap from "./Heatmap";
import HeatmapConfig from "./HeatmapConfig";

export default {
    create(config) {
        return new Heatmap(config);
    },

    register(pluginKey, plugin) {
        HeatmapConfig.plugins[pluginKey] = plugin;
    }
}