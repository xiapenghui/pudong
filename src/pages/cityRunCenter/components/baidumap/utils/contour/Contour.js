import MarchingSquares from "./MarchingSquares.js";
import Grid from "./Grid.js";
import simplify from "./simplify.js";

const FILTER_AREA = 50;//过滤追踪到的很小的面
const SIMPLIFY_TOLERANCE = 2;//简化追踪到的轮廓线
const REPLACE_LINE_WIDTH = 10;//
const MAX_LOOP = 40;//最大循环次数，一旦达到该数字则不再执行轮廓线追踪，可能存在没有追踪完成的情况，在该情况下需要设置isMorphological = true

export default (heatmapRenderer, value, isMorphological) => {
    // let _instance = heatmapRenderer._instance;
    // let canvas = createOffScreenCanvas(_instance._renderer.shadowCanvas);
    // let max = _instance.getDataMax();
    // let min = _instance.getDataMin();

    //独立测试轮廓线追踪时的测试方式，heatmapRenderer传入的为canvas对象
    let canvas = createOffScreenCanvas(heatmapRenderer);
    let max = 3;
    let min = 0;

    if (undefined === isMorphological ||
        null === isMorphological) {
        isMorphological = false;
    }
    let alpha = value2Alpha(value, max, min);

    let contours = [];
    let contour = findContour(canvas, alpha, isMorphological);
    let loopCount = 1;
    while (contour.length) {
        contours.push(contour);
        replaceContour(canvas, contour);
        contour = findContour(canvas, alpha, isMorphological);

        if (loopCount++ > MAX_LOOP) {
            break;
        }
    }
    contours.push(contour);

    return contours.filter((contour) => {
        let bounds = blobPointsBounds(contour);
        let area = boundsArea(bounds);

        return area >= FILTER_AREA;
    }).map((contour) => {
        return blobPoints2Obj(contour);
    }).map((contour) => {
        return simplify(contour, SIMPLIFY_TOLERANCE);
    }).map((contour) => {
        return pointObj2Arr(contour);
    }).map((contour) => {
        return {
            type: "Polygon",
            coordinates: [
                contour
            ]
        }
    });
}

let createOffScreenCanvas = (sourceCanvas) => {
    let canvas = document.createElement("canvas");
    canvas.width = sourceCanvas.width;
    canvas.height = sourceCanvas.height;
    canvas.id = "offline";
    let context = canvas.getContext("2d");

    context.drawImage(sourceCanvas, 0, 0);
    return canvas;
};

let canvasImage2Grid = (canvas) => {
    let width = canvas.width;
    let height = canvas.height;
    let context = canvas.getContext("2d");
    let imageData = context.getImageData(0, 0, width, height);
    let data = imageData.data;

    let grid = new Grid(width, height, 0);
    let index = null;
    grid.forEach((r, c, v) => {
        index = (r * width + c) * 4 + 3;
        grid.setCellValue(r, c, data[index]);
    });

    return grid;
};

let value2Alpha = (value, max, min) => {
    return Math.floor(255 * value / Math.abs(max - min));
};

let binaryGridData = (grid, alpha) => {
    grid.forEach((r, c, v) => {
        if (v >= alpha) {
            grid.setCellValue(r, c, 1);
        } else {
            grid.setCellValue(r, c, 0);
        }
    })
};

let morphologicalOperator = (matrix) => {
    let grid = matrix.map((r, c, v) => {
        return matrix.neighbor(r, c, true, 0);
    }).map((r, c, v) => {
        let result = v.reduce(0, (r, c, v, result) => {
            return v + result;
        });

        if (result > 1 && result !== 9) {
            return 1;
        } else {
            return 0;
        }
    });

    matrix.fromGrid(grid);
};

let morphologicalDilation = (matrix, dilation) => {
    let grid = matrix.map((r, c, v) => {
        return matrix.neighbor(r, c, true, 0);
    }).map((r, c, v) => {
        let result = v.reduce(0, (r, c, v, result) => {
            return v + result;
        });

        if (result > dilation) {
            return 1;
        } else {
            return 0;
        }
    });

    matrix.fromGrid(grid);
};

let morphologicalOperator4 = (matrix) => {
    let grid = matrix.map((r, c, v) => {
        let g = new Grid(2, 2, 0);
        g.setCellValue(0, 0, matrix.getTopLeftValue(r, c));
        g.setCellValue(0, 1, matrix.getTopValue(r, c));
        g.setCellValue(1, 0, matrix.getLeftValue(r, c));
        g.setCellValue(1, 1, matrix.getCellValue(r, c));
        g.replaceNoDataVal(0);

        return g;
    }).map((r, c, v) => {
        let result = v.reduce(0, (r, c, v, result) => {
            return v + result;
        });

        if (result > 1 && result !== 4) {
            return 1;
        } else {
            return 0;
        }
    });

    matrix.fromGrid(grid);
};

let findBlobOutlinePoints = (grid) => {
    let ms = new MarchingSquares(grid);
    return ms.getBlobOutlinePoints();
};

let findContour = (canvas, alpha, isMorphological) => {
    if (undefined === isMorphological ||
        null === isMorphological) {
        isMorphological = false;
    }

    let grid = canvasImage2Grid(canvas);
    binaryGridData(grid, alpha);

    if (isMorphological) {
        //过滤轮廓线上的噪点数据，如果当前结果不佳的时候需要使用以下两行代码做优化，但会造成一定的性能影响
        morphologicalOperator(grid);
        morphologicalDilation(grid, 5);
    }

    return findBlobOutlinePoints(grid);
};

let replaceContour = (canvas, blobOutlinePoints) => {
    let context = canvas.getContext("2d");
    context.fillStyle = "rgb(255,255,255)";
    context.strokeStyle = "rgb(255,255,255)";
    context.lineWidth = REPLACE_LINE_WIDTH;

    context.beginPath();
    context.moveTo(blobOutlinePoints[0], blobOutlinePoints[1]);
    for (let i = 2; i < blobOutlinePoints.length; i += 2) {
        context.lineTo(blobOutlinePoints[i], blobOutlinePoints[i + 1]);
    }
    context.closePath();
    context.fill();
    context.stroke();

    replaceWhite2Opacity(canvas);
};

let replaceWhite2Opacity = (canvas) => {
    let width = canvas.width;
    let height = canvas.height;
    let context = canvas.getContext("2d");
    let imageData = context.getImageData(0, 0, width, height);
    let data = imageData.data;
    let index = 0;
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            index = (r * width + c) * 4;
            if (data[index] === 255 &&
                data[index + 1] === 255 &&
                data[index + 2] === 255 &&
                data[index + 3] === 255) {
                data[index + 3] = 0;
            }
        }
    }

    context.putImageData(imageData, 0, 0);
};

let blobPointsBounds = (blobPoints) => {
    let bounds = [10000000000, 10000000000, 0, 0];//xmin,ymin,xmax,ymax

    let len = blobPoints.length;
    for (let i = 0; i < len; i += 2) {
        bounds[0] = Math.min(bounds[0], blobPoints[i]);
        bounds[1] = Math.min(bounds[1], blobPoints[i + 1]);
        bounds[2] = Math.max(bounds[2], blobPoints[i]);
        bounds[3] = Math.max(bounds[3], blobPoints[i + 1]);
    }

    return bounds;
};

let boundsArea = (bounds) => {
    return Math.abs(bounds[2] - bounds[0]) * Math.abs(bounds[3] - bounds[1])
};

let blobPoints2Obj = (blobPoints) => {
    let len = blobPoints.length;

    let points = [];
    for (let i = 0; i < len; i += 2) {
        points.push({
            x: blobPoints[i],
            y: blobPoints[i + 1]
        })
    }

    return points;
};

let pointObj2Arr = (points) => {
    let len = points.length;

    let ps = [];
    for (let i = 0; i < len; i++) {
        ps.push([
            points[i].x,
            points[i].y
        ]);
    }

    return ps;
};

let blobPoints2Arr = (blobPoints) => {
    let len = blobPoints.length;

    let points = [];
    for (let i = 0; i < len; i += 2) {
        points.push([
            blobPoints[i],
            blobPoints[i + 1]
        ]);
    }

    return points;
};