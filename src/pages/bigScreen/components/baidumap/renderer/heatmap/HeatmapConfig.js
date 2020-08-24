//提供默认的热力图参数
export default {
    defaultRadius: 40,
    defaultRenderer: 'canvas2d',
    defaultGradient: {
        0.25: "rgb(0,0,255)",
        0.55: "rgb(0,255,0)",
        0.85: "rgb(255,255,0)",
        1.0: "rgb(255,0,0)"
    },
    defaultMaxOpacity: 1,
    defaultMinOpacity: 0,
    defaultBlur: .85,
    defaultXField: 'x',
    defaultYField: 'y',
    defaultValueField: 'value',
    plugins: {}
};