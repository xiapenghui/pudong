// canvasRender.default.layers[0].renderer._instance._renderer.shadowCanvas
// canvasRender.default.layers[0].buffer
import contour from "./Contour.js";
import Grid from "./Grid.js";


export let clearPage = () => {
    document.body.innerHTML = "";
};

export let createRendererCanvas = (id, beforeNode) => {
    let canvas = document.getElementById(id);
    if (canvas) {
        return canvas;
    }

    canvas = document.createElement("canvas");
    canvas.id = id;
    if (beforeNode) {
        document.body.insertBefore(canvas, beforeNode);
    } else {
        document.body.appendChild(canvas);
    }

    return canvas;
};

export let loadImageDataUrl = (dataUrl, canvas) => {
    let image = document.createElement("img");
    image.onload = function () {
        canvas.width = image.width;
        canvas.height = image.height;
        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);
    };
    image.src = dataUrl;
};

export let getDataMax = () => {
    return 3;
};

export let getDataMin = () => {
    return 0;
};

export let getHeatmapBuffer = () => {
    return createRendererCanvas("heatmap");
};

export let getHeatmapContext = () => {
    return getHeatmapBuffer().getContext("2d");
};

export let getHeatmapShadowBuffer = () => {
    return createRendererCanvas("shadow");
};


export let getHeatmapBufferSize = () => {
    let buffer = getHeatmapBuffer();
    let width = parseInt(buffer.width);
    let height = parseInt(buffer.height);
    return {
        width: width,
        height: height
    };
};


//创建测试canvas
export let createDebugRenderer = (beforeNode) => {
    let size = getHeatmapBufferSize();
    let width = size.width;
    let height = size.height;
    let canvas = createRendererCanvas("debugRender", beforeNode);
    canvas.width = width;
    canvas.height = height;
    return canvas;
};

//清除测试绘图结果
export let clearDebugRenderer = () => {
    let size = getHeatmapBufferSize();
    let width = size.width;
    let height = size.height;
    let canvas = createDebugRenderer();
    let context = canvas.getContext("2d");
    context.clearRect(0, 0, width, height);
};

export let drawShadow = () => {
    let size = getHeatmapBufferSize();
    let width = size.width;
    let height = size.height;
    let canvas = createDebugRenderer();
    let context = canvas.getContext("2d");
    let imageData = getHeatmapShadowBuffer().getContext("2d").getImageData(0, 0, width, height);
    context.putImageData(imageData, 0, 0);
};


//显示热力图绘制结果
export let drawHeatmap = () => {
    let size = getHeatmapBufferSize();
    let width = size.width;
    let height = size.height;
    let canvas = createDebugRenderer();
    let context = canvas.getContext("2d");
    let imageData = getHeatmapContext().getImageData(0, 0, width, height);
    context.putImageData(imageData, 0, 0);
};

export let getMappingValue = () => {
    let size = getHeatmapBufferSize();
    let width = size.width;
    let height = size.height;

    let canvas = getHeatmapShadowBuffer();
    let context = canvas.getContext("2d");
    let imageData = context.getImageData(0, 0, width, height);
    let data = imageData.data;

    let index = 0;
    let m = new Array(height);
    for (let r = 0; r < height; r++) {
        m[r] = new Array(width);
        for (let c = 0; c < width; c++) {
            index = (r * width + c) * 4 + 3;
            m[r][c] = data[index];
        }
    }

    return m;
};

export let toBinaryGrid = (data, width, height, value) => {
    let grid = new Grid(width, height);
    grid.forEach((r, c, v) => {
        let index = (r * width + c) * 4 + 3;
        if (data[index] >= value) {
            grid.setCellValue(r, c, 1);
        } else {
            grid.setCellValue(r, c, 0);
        }
    });
    return grid;
};

export let drawGrid = (grid)=>{
    let size = getHeatmapBufferSize();
    let width = size.width;
    let height = size.height;
    let canvas = createDebugRenderer();
    let context = canvas.getContext("2d");
    context.fillStyle = "rgb(0,0,0)";
    context.fillRect(0 , 0 , width , height);

    context.fillStyle = "rgb(255,255,255)";
    grid.forEach((r,c,v)=>{
        if(v) {
            context.fillRect(c, r, 1, 1);
        }
    })
};

//显示二值图结果
export let drawBinaryImage = (value) => {
    let size = getHeatmapBufferSize();
    let width = size.width;
    let height = size.height;
    let canvas = createDebugRenderer();
    let context = canvas.getContext("2d");

    let max = getDataMax();
    let min = getDataMin();
    let alpha = Math.floor(255 * value / Math.abs(max - min));

    let matrix = getMappingValue();
    let rowNums = matrix.length;
    let colNums = matrix[0].length;

    for (let r = 0; r < rowNums; r++) {
        for (let c = 0; c < colNums; c++) {
            if (matrix[r][c] >= alpha) {
                matrix[r][c] = 1;
            } else {
                matrix[r][c] = 0;
            }
        }
    }

    // var coordinates = null;
    // for (var r = 0; r < rowNums; r++) {
    //     for (var c = 0; c < colNums; c++) {
    //         if (matrix[r][c] > 0) {
    //             var x = c;
    //             var y = r;
    //             var xmin = x - size;
    //             var xmax = x + size;
    //             var ymin = y - size;
    //             var ymax = y + size;
    //             var coordinates = [];
    //             for (var yoffset = ymin; yoffset <= ymax; yoffset++) {
    //                 for (var xoffset = xmin; xoffset <= xmax; xoffset++) {
    //                     coordinates.push({
    //                         x: xoffset,
    //                         y: yoffset
    //                     });
    //                 }
    //             }
    //
    //             var coord = null;
    //             for (var i = 0; i < coordinates.length; i++) {
    //                 coord = coordinates[i];
    //                 if (coord.x < 0 ||
    //                     coord.x >= colNums ||
    //                     coord.y < 0 ||
    //                     coord.y >= rowNums
    //                 ) {
    //                     continue;
    //                 }
    //
    //                 matrix[coord.y][coord.x] = 1;
    //             }
    //         }
    //     }
    // }

    let imageData = context.getImageData(0, 0, width, height);
    let data = imageData.data;
    console.log("rows", rowNums, "cols", colNums, "dataLength", rowNums * colNums * 4, "realDataLength", data.length);

    for (let r = 0; r < rowNums; r++) {
        for (let c = 0; c < colNums; c++) {
            data[(r * width + c) * 4] = 255;
            data[(r * width + c) * 4 + 1] = 255;
            data[(r * width + c) * 4 + 2] = 255;
            data[(r * width + c) * 4 + 3] = 255;
        }
    }

    context.putImageData(imageData, 0, 0);
};


//显示轮廓追踪结果
export let drawContours = (value) => {
    let size = getHeatmapBufferSize();
    let width = size.width;
    let height = size.height;
    let canvas = createDebugRenderer();
    let context = canvas.getContext("2d");
    let contours = contour(getHeatmapShadowBuffer(), value);
    let imageData = context.getImageData(0, 0, width, height);
    let data = imageData.data;
    for (let i = 0; i < contours.length; i++) {
        for (let j = 0; j < contours[i].length; j++) {
            let p = contours[i][j];
            let x = p.x;
            let y = p.y;
            data[(y * width + x) * 4] = 0;
            data[(y * width + x) * 4 + 1] = 197;
            data[(y * width + x) * 4 + 2] = 205;
            data[(y * width + x) * 4 + 3] = 255;
        }
    }
    context.putImageData(imageData, 0, 0);
    return contours;
};


function printContourCoorOrder(contour) {
    var arr = [];
    for (var i = 0; i < contour.length; i++) {
        var x = contour[i].x;
        var y = contour[i].y;

        if (!arr[y]) {
            arr[y] = [];
        }
        arr[y].push(x);
    }

    var text = [];
    var ysArr = Object.keys(arr);
    for (var i = 0; i < ysArr.length; i++) {
        var y = parseInt(ysArr[i]);
        var xs = arr[y];

        text.push("[" + y + "] " + xs.join(","));
    }

    console.log(text.join("/n"));
}