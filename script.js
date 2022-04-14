class Point {
    constructor(coordsX, coordsY) {
        this.x = coordsX;
        this.y = coordsY;
    }
}

class ClusterK {
    constructor(center) {
        this.center = center;
        this.points = [];
        this.colour = 'rgb(0, 0, 0)';
    }
}

class ClusterG {
    constructor() {
        this.points = [];
        this.colour = 'rgb(0, 0, 0)';
    }
}

class Rib {
    constructor(from, to, size) {
        this.from = from;
        this.to = to;
        this.size = size;
    }
}
// функция рассчёта расстояний
function distance(point1, point2) {
    x1 = point1.x;
    y1 = point1.y;
    x2 = point2.x;
    y2 = point2.y;
    let dist = Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    return dist;
}

// здесь функция, которая получает кластер и рассчитывает новый центр
function newCenter(cluster) {
    let newCenterX = 0;
    let newCenterY = 0;
    for (let i = 0; i < cluster.points.length; i++) {
        newCenterX += cluster.points[i].x;
        newCenterY += cluster.points[i].y;
    }
    if (cluster.points.length >= 1) {
        newCenterX /= cluster.points.length;
        newCenterY /= cluster.points.length;
    }
    else {
        newCenterX = Math.floor(Math.random() * 500);
        newCenterY = Math.floor(Math.random() * 500);
    }
    let newCenter = new Point(newCenterX, newCenterY)
    return newCenter;
}

// здесь функция, которая получает центроиды, распихивает точки по кластерам, получает новые центры и сравнивает их с нынешними центроидами. если новые центры и центроиды не совпадают, функция запускает саму себя с новыми центрами в качестве центроид
function kmeans(clusters, arrayOfPoints) {
    let count = 0;
    let currentPoint;
    let min;
    let indexMin;
    let final;
    let i;
    while (true) {
        for (i = 0; i < arrayOfPoints.length; i++) {
            currentPoint = arrayOfPoints[i];
            min = distance(clusters[0].center, currentPoint);
            indexMin = 0;
            for (let j = 1; j < clusters.length; j++) {
                let check = distance(clusters[j].center, currentPoint);
                if (check < min) {
                    min = check;
                    indexMin = j;
                }
            }
            clusters[indexMin].points.push(arrayOfPoints[i]);
        }
        final = true;
        for (let i = 0; i < clusters.length; i++) {
            newCoords = newCenter(clusters[i]);
            if ((newCoords.x != clusters[i].center.x) || (newCoords.y != clusters[i].center.y)) {
                clusters[i].center.x = newCoords.x;
                clusters[i].center.y = newCoords.y;
                final = false;
            }
        }
        if (final || (count > 1000000)) {
            break;
        }
        else {
            for (i = 0; i < clusters.length; i++) {
                clusters[i].points.length = 0;
            }
            count++;
        }
    }

    // красим точки
    for (let i = 0; i < clusters.length; i++) {
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        clusters[i].colour = 'rgb(' + Math.round(Math.random() * 255) + ', ' + Math.round(Math.random() * 255) + ', ' + Math.round(Math.random() * 255) + ')';
        ctx.fillStyle = clusters[i].colour;
        for (let j = 0; j < clusters[i].points.length; j++) {
            let x = clusters[i].points[j].x;
            let y = clusters[i].points[j].y;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2, true);
            ctx.fill();
        }
    }
    return clusters;
}

function contains(arr, elem) {
    return arr.indexOf(elem) != -1;
}

function Kruscal(arrayOfPoints) {
    let ribs = [];
    for (let i = 0; i < arrayOfPoints.length; i++) {
        for (let j = i + 1; j < arrayOfPoints.length; j++) {
            let dist = distance(arrayOfPoints[i], arrayOfPoints[j]);
            let rib = new Rib(arrayOfPoints[i], arrayOfPoints[j], dist);
            ribs.push(rib);
        }
    }
    ribs.sort(function (a, b) {
        if (a.size > b.size) {
            return 1;
        }
        if (a.size < b.size) {
            return -1;
        }
        return 0;
    });
    let passed = [ribs[0].from, ribs[0].to];
    let MST = [ribs[0]];
    for (let i = 1; i < ribs.length; i++) {
        if (((contains(passed, ribs[i].to)) && (!contains(passed, ribs[i].from))) || ((contains(passed, ribs[i].from)) && (!contains(passed, ribs[i].to)))) {
            MST.push(ribs[i]);
            passed.push(ribs[0].to);
        }
    }
    return MST;
}

function compareClusters(clustersK, clustersG) {

}

//функция кластеризации через удаление н рёбер графа
function graph(numberOfClusters, arrayOfPoints) {
    let MST = Kruscal(arrayOfPoints);
    let k = MST.length;
    numberOfClusters = Number(numberOfClusters);
    MST.length = (k - numberOfClusters + 1);
    let clusters = [];
    for (let i = 0; i < numberOfClusters; i++) {
        let newCluster = new ClusterG();
        newCluster.points.push(arrayOfPoints[0]);
        arrayOfPoints.slice(0, 1);
        let check = true;
        while (check) {
            check = false;
            for (let j = 0; j < MST.length; j++) {
                if (contains(newCluster.points, MST[j].to)) {
                    newCluster.push(MST[j].to);
                    arrayOfPoints.splice(arrayOfPoints.indexOf(MST[j].to), 1);
                    MST.splice(j, 1);
                    check = true;
                    break;
                }
                else if (contains(newCluster.points, MST[j].from)) {
                    newCluster.push(MST[j].from);
                    arrayOfPoints.splice(arrayOfPoints.indexOf(MST[j].from), 1);
                    MST.splice(j, 1);
                    check = true;
                    break;
                }
            }
        }
        clusters.push(newCluster);
    }
    for (let i = 0; i < clusters.length; i++) {
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        clusters[i].colour = 'rgb(' + Math.round(Math.random() * 255) + ', ' + Math.round(Math.random() * 255) + ', ' + Math.round(Math.random() * 255) + ')';
        ctx.fillStyle = clusters[i].colour;
        for (let j = 0; j < clusters[i].points.length; j++) {
            let x = clusters[i].points[j].x;
            let y = clusters[i].points[j].y;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2, true);
            ctx.fill();
        }
    }
    return clusters;
}

// здесь должны считываться точки и записываться в массив
window.onload = function () {
    let arrayOfPoints = [];
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    canvas.onclick = function (event) {
        let t = canvas.getBoundingClientRect();
        let x = (event.clientX - t.left) * canvas.width / canvas.clientWidth;
        let y = (event.clientY - t.top) * canvas.height / canvas.clientHeight;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2, true);
        ctx.fill();
        let newPoint = new Point(x, y);
        arrayOfPoints.push(newPoint);
    }

    let button = document.getElementById('startButton');
    button.onclick = function () {
        let numberOfClusters = document.getElementById('numberOfClusters').value;
        if ((numberOfClusters > arrayOfPoints.length) || (numberOfClusters == '')) {
            alert('С количеством кластеров что-то не так. Количество кластеров не указано или превышает количество точек.');
        }
        else {
            let clusters = [];
            for (let i = 0; i < numberOfClusters; i++) {
                let newCluster = new ClusterK(new Point(Math.floor(Math.random() * 500), Math.floor(Math.random() * 500)));
                clusters.push(newCluster);
            }
            //let clustersK = kmeans(clusters, arrayOfPoints);
            let clustersG = graph(numberOfClusters, arrayOfPoints);
        }
    }
}
