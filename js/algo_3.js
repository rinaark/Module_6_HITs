class Point {
    x; y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

}
function distance(p1, p2) {
    return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
}

//Алгоритм для перемешивания Фишера-Йетса
function mix(array) {
    let res = [...array];
    let i, j, temp;
    for (i = array.length - 1; i > 0; --i) {
        j = Math.floor(Math.random() * (i + 1));
        temp = res[i];
        res[i] = res[j];
        res[j] = temp;
    }
    res.push(getScore(res));
    return res;
}
//Стоимость маршрута
function getScore(path) {
    let res = 0;
    for (let i = 0; i < path.length - 1; ++i) {
        res += distance(path[i], path[i + 1]);
    }
    res += distance(path[path.length - 1], path[0]);
    return res;
}
//Вспомогательные функции
function comp(a, b) {
    if (a[a.length - 1] > b[b.length - 1]) return 1;
    if (a[a.length - 1] < b[b.length - 1]) return -1;
    return 0;
}
function check(newA, element) {
    for (let i = 0; i < newA.length; ++i) {
        if (newA[i] == element)
            return true;
    }
    return false;
}
//Выбор(селекция)
function select(population, elit) {
    population.sort(comp);
    population.length = elit;
    show(population[0]);
}
//Скрещивание
function cross(population, populationSize) {
    let p1, p2, breakPoint;
    while (population.length < populationSize) {
        let child1 = [], child2 = [];
        p1 = Math.floor(Math.random() * population.length);
        p2 = Math.floor(Math.random() * population.length);
        while (p1 == p2)
            p2 = Math.floor(Math.random() * population.length);
        breakPoint = Math.floor(Math.random() * (population[0].length - 3) + 2);
        for (let j = 0; j < breakPoint; ++j) {
            child1.push(population[p1][j]);
            child2.push(population[p2][j]);
        }
        for (let j = 0; j < population[0].length - 1; ++j) {
            if (!check(child1, population[p2][j]))
                child1.push(population[p2][j]);
            if (!check(child2, population[p1][j]))
                child2.push(population[p1][j]);
        }
        child1.push(getScore(child1));
        child2.push(getScore(child2));
        population.push(child1);
        population.push(child2);
    }
}
//Мутация
function mutate(population, percent) {
    let c1, c2, temp;
    for (let i = 1; i < population.length; ++i) {
        let j = Math.floor(Math.random() * 101);
        if (j < percent + 1) {
            c1 = Math.floor(Math.random() * (population[i].length - 1));
            c2 = Math.floor(Math.random() * (population[i].length - 1));
            while (c1 == c2)
                c2 = Math.floor(Math.random() * (population[i].length - 1));
            temp = population[i][c1];
            population[i][c1] = population[i][c2];
            population[i][c2] = temp;
        }
    }
}
//Вывод маршрута
function show(popBest) {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.strokeStyle = "red";

    for (let i = 0; i < popBest.length - 2; ++i) {
        ctx.beginPath();
        ctx.arc(popBest[i].x, popBest[i].y, 5, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(popBest[i].x, popBest[i].y);
        ctx.lineTo(popBest[i + 1].x, popBest[i + 1].y);
        ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(popBest[popBest.length - 2].x, popBest[popBest.length - 2].y, 5, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.beginPath();
    ctx.moveTo(popBest[popBest.length - 2].x, popBest[popBest.length - 2].y);
    ctx.lineTo(popBest[0].x, popBest[0].y);
    ctx.stroke();
}

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
        if (arrayOfPoints.length < 4) {
            alert("Мало точек!(Меньше 4-х)");
        }
        else {
            let population = []
            let populationSize = arrayOfPoints.length * 8;
            let elit = Math.floor(populationSize / 4);
            let repeat = 1000;
            let percentMut = 10;
            for (let i = 0; i < populationSize; ++i)
                population[i] = mix(arrayOfPoints);
            for (let i = 0; i < repeat; ++i) {
                select(population, elit);
                cross(population, populationSize);
                mutate(population, percentMut);
            }

            select(population, elit);
            console.log("Dist: ", population[0][population[0].length - 1]);
        }
    }
}