
// ������� �������� ����������
function distance(coords1, coords2) {
    x1 = coords1[0];
    y1 = coords1[1];
    x2 = coords2[0];
    y2 = coords2[1];
    let dist = Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    return dist;
}

// ����� �������, ������� �������� ������� � ������������ ����� �����
function newCenter(cluster) {
    let newCenterX = 0;
    let newCenterY = 0;
    for (let i = 1; i < cluster.length; i++) {
        newCenterX += cluster[i][0];
        newCenterY += cluster[i][1];
    }
    newCenterX /= (cluster.length - 1);
    newCenterY /= (cluster.length - 1);
    let newCenterCoords = [];
    newCenterCoords.push(newCenterX);
    newCenterCoords.push(newCenterY);
    return newCenterCoords;
}

// ��������� � ������� ��������� ��������� 
// ����� �������, ������� �������� ���������, ����������� ����� �� ���������, �������� ����� ������ � ���������� �� � ��������� �����������. ���� ����� ������ � ��������� �� ���������, ������� ��������� ���� ���� � ������ �������� � �������� ��������
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
        if (newCoords != clusters[i][0]) {
            clusters[i][0][0] = newCoords[0];
            clusters[i][0][1] = newCoords[1];
            final = false;
        }
    }
    if (final) {
        // ������ �����
        for (let i = 0; i < clusters.length; i++) {
            let canvas = document.getElementById('canvas');
            let ctx = canvas.getContext('2d');
            ctx.strokeStyle = 'rgb(' + Math.round(Math.random() * 255) + ', ' + Math.round(Math.random() * 255) + ', ' + Math.round(Math.random() * 255) + ')';
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

// ����� ������ ����������� ����� � ������������ � ������
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
        let numberOfClusters = document.getElementById('numberOfClusters').value;
        let clusters = [];
        for (let i = 0; i < numberOfClusters; i++) {
            let newCluster = [
                arrayOfPoints[i]
            ];
            clusters.push(newCluster);
        }
        clustering(clusters, arrayOfPoints);
    }
}
