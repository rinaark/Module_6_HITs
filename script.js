
// функция рассчёта расстояний
function distance(coords1, coords2) {
    x1 = coords1[0];
    y1 = coords1[1];
    x2 = coords2[0];
    y2 = coords2[1];
    let dist = Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    return dist;
}

// здесь функция, которая получает кластер и рассчитывает новый центр
function newCenter(cluster) {
    let newCenterX = 0;
    let newCenterY = 0;
    for (let i = 1; i < cluster.length; i++) {
        newCenterX += cluster[i][0];
        newCenterY += cluster[i][1];
    }
    if (cluster.length > 1) {
        newCenterX /= (cluster.length - 1);
        newCenterY /= (cluster.length - 1);
    }
    else {
        newCenterX = Math.floor(Math.random() * 500);
        newCenterY = Math.floor(Math.random() * 500);
    }
    let newCenterCoords = [];
    newCenterCoords.push(newCenterX);
    newCenterCoords.push(newCenterY);
    return newCenterCoords;
}

// центроиды в нулевых элементах кластеров 
// здесь функция, которая получает центроиды, распихивает точки по кластерам, получает новые центры и сравнивает их с нынешними центроидами. если новые центры и центроиды не совпадают, функция запускает саму себя с новыми центрами в качестве центроид
function clustering(clusters, arrayOfPoints) {
    for (let i = 0; i < arrayOfPoints.length; i++) {
        let currentPointCoords = arrayOfPoints[i];
        let min = distance(clusters[0][0], currentPointCoords);
        let indexMin = 0;
        for (let j = 1; j < clusters.length; j++) {
            let check = distance(clusters[j][0], currentPointCoords);
            if (check < min) {
                min = check;
                indexMin = j;
            }
        }
        clusters[indexMin].push(arrayOfPoints[i]);
    }

    let final = true;
    for (let i = 0; i < clusters.length; i++) {
        newCoords = newCenter(clusters[i]);
        if ((newCoords[0] != clusters[i][0][0]) || (newCoords[1] != clusters[i][0][1])) {
            clusters[i][0][0] = newCoords[0];
            clusters[i][0][1] = newCoords[1];
            final = false;
        }
    }
    if (final) {
        // красим точки
        for (let i = 0; i < clusters.length; i++) {
            let canvas = document.getElementById('canvas');
            let ctx = canvas.getContext('2d');
            ctx.fillStyle = 'rgb(' + Math.round(Math.random() * 255) + ', ' + Math.round(Math.random() * 255) + ', ' + Math.round(Math.random() * 255) + ')';
            for (let j = 1; j < clusters[i].length; j++) {
                let x = clusters[i][j][0];
                let y = clusters[i][j][1];
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2, true);
                ctx.fill();
            }
        }
    }
    else {
        for (let i = 0; i < clusters.length; i++) {
            clusters[i].length = 1;
        }
        clustering(clusters, arrayOfPoints);
    }
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
        let newPoint = [x, y];
        arrayOfPoints.push(newPoint);
    }
    //
    let button = document.getElementById('startButton');
    button.onclick = function () {
        let numberOfClusters = Number(document.getElementById('numberOfClusters').value);
        let clusters = [];
        for (let i = 0; i < numberOfClusters; i++) {
            let newClusterCenter = [
                [
                    Math.floor(Math.random() * 500),
                    Math.floor(Math.random() * 500)
                ]
            ];
            clusters.push(newClusterCenter);
        }
        clustering(clusters, arrayOfPoints);
    }
}
