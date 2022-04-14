//Функция паузы
function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}
//Алгоритм генерации лабиринта(на основе Прима)
async function creatLabyrinth(tds, size, waitLab) {
    let N = size * size;
    let begin = Math.floor(Math.random() * (size * size));
    tds[begin].innerHTML = "";

    let check = [];
    if (begin - 2 * size >= 0) {
        check.push(begin - 2 * size);
    }
    if (begin % size < size - 2 && begin + 2 < N) {
        check.push(begin + 2);
    }
    if (begin + 2 * size < N) {
        check.push(begin + 2 * size);
    }
    if (begin % size > 1 && begin - 2 >= 0) {
        check.push(begin - 2);
    }

    while (check.length > 0) {
        if (waitLab > 0)
            await sleep(waitLab);

        let ran = Math.floor(Math.random() * check.length);
        let ind = check[ran];
        tds[ind].innerHTML = "";
        check.splice(ran, 1);

        let choose = [1, 2, 3, 4];
        while (choose.length > 0) {
            let indch = Math.floor(Math.random() * choose.length);
            switch (choose[indch]) {
                case 1:
                    if (ind - 2 * size >= 0 && tds[ind - 2 * size].innerHTML != "X") {
                        tds[ind - size].innerHTML = ""; choose.length = 0;
                    }
                    break;
                case 2:
                    if (ind % size < size - 2 && ind + 2 < N && tds[ind + 2].innerHTML != "X") {
                        tds[ind + 1].innerHTML = ""; choose.length = 0;
                    }
                    break;
                case 3:
                    if (ind + 2 * size < N && tds[ind + 2 * size].innerHTML != "X") {
                        tds[ind + size].innerHTML = ""; choose.length = 0;
                    }
                    break;
                case 4:
                    if (ind % size > 1 && ind - 2 >= 0 && tds[ind - 2].innerHTML != "X") {
                        tds[ind - 1].innerHTML = ""; choose.length = 0;
                    }
                    break;
            }
            choose.splice(indch, 1);
        }
    

        if (ind - 2 * size >= 0 && tds[ind - 2 * size].innerHTML == "X") {
            check.push(ind - 2 * size);
        }
        if (ind % size < size - 2 && ind + 2 < N && tds[ind + 2].innerHTML == "X") {
            check.push(ind + 2);
        }
        if (ind + 2 * size < N && tds[ind + 2 * size].innerHTML == "X") {
            check.push(ind + 2 * size);
        }
        if (ind % size > 1 && ind - 2 >= 0 && tds[ind - 2].innerHTML == "X") {
            check.push(ind - 2);
        }
    }
}

window.onload = function () {
    var creatMapBut = document.querySelector("#createTable");
    creatMapBut.onclick = function () {
        let size = Number(document.querySelector("#size").value);
        let table = document.createElement("table");
                                                        //Создание таблицы
        for (i = 0; i < size; ++i) {
            let tr = document.createElement("tr");
            for (j = 0; j < size; ++j) {
                let td = document.createElement("td");
                td.innerHTML = "X";
                tr.appendChild(td);
            }
            table.appendChild(tr)
        }
        document.querySelector("#table").appendChild(table);

        let div = document.querySelector("#table");

        let radio1 = document.createElement("input");
        radio1.type = "radio"; radio1.id = "r1"; radio1.name = "chose"; radio1.checked = true;
        let lab = document.createElement("label");
        lab.htmlFor = "r1"; lab.innerHTML = "X";
        div.appendChild(radio1); div.appendChild(lab);

        let radio2 = document.createElement("input");
        radio2.type = "radio"; radio2.id = "r2"; radio2.name = "chose";
        lab = document.createElement("label");
        lab.htmlFor = "r2"; lab.innerHTML = "Begin";
        div.appendChild(radio2); div.appendChild(lab);

        let radio3 = document.createElement("input");
        radio3.type = "radio"; radio3.id = "r3"; radio3.name = "chose";
        lab = document.createElement("label"); 
        lab.htmlFor = "r3"; lab.innerHTML = "End";
        div.appendChild(radio3); div.appendChild(lab);

        let p = document.createElement("p");
        p.innerHTML = "Нажмите на ячейку чтобы изменить её<br>Двойное нажатие очищает ячейку<br>";
        p.innerHTML += "X - непроходимые клетки<br>B - начало<br>E - конец<br>";
        p.innerHTML += "Результатом успешной работы алгоритма будет путь, выделенный жёлтым цветом";
        div.appendChild(p);

        //Нажатия на ячейку
        let begin = -1;
        let end = -1;
        let tds = document.querySelectorAll("td");       
        for (i = 0; i < tds.length; ++i) {
            tds[i].onclick = function () {
                if (radio1.checked)
                    this.innerHTML = "X";
                else if (radio2.checked) {
                    if (begin != -1) tds[begin].innerHTML = "";
                    this.innerHTML = "B";
                    begin = this.parentNode.rowIndex * size + this.cellIndex;
                }
                else if (radio3.checked) {
                    if (end != -1) tds[end].innerHTML = "";
                    this.innerHTML = "E";
                    end = this.parentNode.rowIndex * size + this.cellIndex;
                }
            }
            tds[i].ondblclick = function () {
                this.innerHTML = "";
            }
        }

        let b = document.createElement("button");
        b.textContent = "Выполнить поиск пути";
        div.appendChild(b);

        let N = size * size;

        let waitLab = 50, waitAlgo = 150;
        if (size > 12) { waitLab = 5; waitAlgo = 40; }
        if (size >= 45) { waitLab = 0; waitAlgo = 20; }

        creatLabyrinth(tds, size, waitLab);     //Генерируем лабиринт

        //Алгоритм А*
        function getDist(cur, end) {
            return Math.sqrt(Math.pow(cur % size - end % size,2) + Math.pow((cur / size) - (end / size),2)) * 10;
        }
        function pushPriority(queue, ver, val) {
            if (queue.length === 0)
                queue.push(ver);
            else {
                let add = false;
                for (let i = queue.length - 1; i >= 0; --i) {
                    if (heuristic[queue[i]] > val) {
                        queue.splice(i + 1, 0, ver);
                        add = true;
                        break;
                    }
                }
                if (!add) {
                    queue.splice(0, 0, ver)
                }
            }
        }
        let heuristic = new Array(N);

        //Основная часть алгоритма
        b.onclick = async function () {
            heuristic = new Array(N);
            let path = new Array(N);
            let visit = new Array(N);
            for (i = 0; i < N; ++i) {
                visit[i] = 0;
            }
            let dist = new Array(N);
            for (i = 0; i < N; ++i) {
                dist[i] = 99999999;
            }
            
            for (i = 0; i < tds.length; ++i) {
                tds[i].style.backgroundColor = "#FFFFFF";
            }

            if (begin === -1 || end === -1)
                alert("Не задана начальная или конечная позиция");
            else {
                let q = [];
                let cur;
                let score;
                dist[begin] = 0;
                heuristic[begin] = dist[begin] + getDist(begin, end);
                q.push(begin);

                while (q.length != 0) {
                    cur = q[q.length - 1];
                    q.pop();
                    visit[cur] = 1;

                    tds[cur].style.backgroundColor = "#F08080";
                    await sleep(waitAlgo);

                    if (cur === end) {
                        visit[end] = 1;
                        break;
                    }
                    if (cur - size >= 0 && tds[cur - size].innerHTML != "X") {
                        score = dist[cur] + 1;
                        if (score < dist[cur - size]) {
                            path[cur - size] = cur;
                            dist[cur - size] = score;
                            heuristic[cur - size] = dist[cur - size] + getDist(cur - size, end);
                        }
                        if (visit[cur - size] === 0) {
                            tds[cur - size].style.backgroundColor = "#DCDCDC";
                            pushPriority(q, cur - size, heuristic[cur - size]);
                        }
                    }
                    if (cur % size != size - 1 && cur + 1 < N && tds[cur + 1].innerHTML != "X") {
                        score = dist[cur] + 1;
                        if (score < dist[cur + 1]) {
                            path[cur + 1] = cur;
                            dist[cur + 1] = score;
                            heuristic[cur + 1] = dist[cur + 1] + getDist(cur + 1, end);
                        }
                        if (visit[cur + 1] === 0) {
                            tds[cur + 1].style.backgroundColor = "#DCDCDC";
                            pushPriority(q, cur + 1, heuristic[cur + 1]);
                        }
                    }
                    if (cur + size < N && tds[cur + size].innerHTML != "X") {
                        score = dist[cur] + 1;
                        if (score < dist[cur + size]) {
                            path[cur + size] = cur;
                            dist[cur + size] = score;
                            heuristic[cur + size] = dist[cur + size] + getDist(cur + size, end);
                        }
                        if (visit[cur + size] === 0) {
                            tds[cur + size].style.backgroundColor = "#DCDCDC";
                            pushPriority(q, cur + size, heuristic[cur + size]);
                        }
                    }
                    if (cur % size != 0 && cur - 1 >= 0 && tds[cur - 1].innerHTML != "X") {
                        score = dist[cur] + 1;
                        if (score < dist[cur - 1]) {
                            path[cur - 1] = cur;
                            dist[cur - 1] = score;
                            heuristic[cur - 1] = dist[cur - 1] + getDist(cur - 1, end);
                        }
                        if (visit[cur - 1] === 0) {
                            tds[cur - 1].style.backgroundColor = "#DCDCDC";
                            pushPriority(q, cur - 1, heuristic[cur - 1]);
                        }
                    }
                    await sleep(waitAlgo);
                }
                if (visit[end] === 0)
                    alert("Пути нет");
                else {
                    for (inpath = end; inpath != begin; ++i) {
                        tds[inpath].style.backgroundColor = "#FFFF00";
                        inpath = path[inpath];
                        await sleep(waitAlgo);
                    }
                    tds[begin].style.backgroundColor = "#FFFF00";
                }
            }

        }
        this.remove();
    }
}

