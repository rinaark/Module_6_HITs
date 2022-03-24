// JavaScript source code
window.onload = function () {
    document.querySelector("#createTable").onclick = () => {
        let size = Number(document.querySelector("#size").value);
        let table = document.createElement("table");

        for (i = 0; i < size; ++i) {
            let tr = document.createElement("tr");
            for (j = 0; j < size; ++j) {
                let td = document.createElement("td");
                tr.appendChild(td);
            }
            table.appendChild(tr)
        }
        document.querySelector("#table").appendChild(table);

        let div = document.querySelector("#table");
        div.innerHTML += "Нажмите на ячейку чтобы изменить её<br>";
        div.innerHTML += "X - непроходимые клетки<br>B - начало<br>E - конец<br>";

        let tds = document.querySelectorAll("td");
        for (i = 0; i < tds.length; ++i) {
            tds[i].onclick = function () {
                if (this.innerHTML == "")
                    this.innerHTML = "X";
                else
                    switch (this.innerHTML) {
                        case "X":
                            this.innerHTML = "B";
                            break;
                        case "B":
                            this.innerHTML = "E";
                            break;
                        case "E":
                            this.innerHTML = "";
                            break;
                }
            }
        }

        let b = document.createElement("button");
        b.textContent = "Выполнить поиск пути";
        div.appendChild(b);

        function getDist(cur, end) {
            return (Math.abs(cur % size - end % size) + Math.abs(Math.floor(cur / size) - Math.floor(end / size)))*10;
        }
        function pushPriority(queue, ver, val) {
            if (queue.length === 0)
                queue.push(ver);
            else {
                let add = false;
                for (let i = queue.length - 1; i >= 0; --i) {
                    if (heuristic[queue[i]] > val) {
                        queue.splice(i+1, 0, ver)
                        add = true
                        break;
                    }
                }
                if (!add) {
                    queue.push(ver)
                }
            }
        }

        let N = size * size;
        let heuristic = new Array(N);
        
        b.onclick = function () {
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
            let begin = -1;
            let end = -1;
            let problem = [ false, false];
            for (i = 0; i < tds.length; ++i) {
                tds[i].style.backgroundColor = "#FFFFFF";
                if (tds[i].innerHTML === "B")
                    if (begin === -1)
                        begin = i;
                    else {
                        problem[0] = true; break;
                    }
                else if (tds[i].innerHTML === "E")
                    if (end === -1)
                        end = i;
                    else {
                        problem[1] = true; break;
                    }
            }

            if (problem[0])
                alert("Несколько начальных позиций!");
            else if (problem[1])
                alert("Несколько конечных позиций!");
            else if (begin === -1 || end === -1)
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
                        if (visit[cur - size] === 0) pushPriority(q, cur - size, heuristic[cur - size]);
                    }
                    if (cur % size != size - 1 && cur + 1 < N && tds[cur + 1].innerHTML != "X") {
                        score = dist[cur] + 1;
                        if (score < dist[cur + 1] ) {
                            path[cur + 1] = cur;
                            dist[cur + 1] = score;
                            heuristic[cur + 1] = dist[cur + 1] + getDist(cur + 1, end);
                        }
                        if (visit[cur + 1] === 0) pushPriority(q, cur + 1, heuristic[cur + 1]);
                    }
                    if (cur + size < N && tds[cur + size].innerHTML != "X") {
                        score = dist[cur] + 1;
                        if (score < dist[cur + size]) {
                            path[cur + size] = cur;
                            dist[cur + size] = score;
                            heuristic[cur + size] = dist[cur + size] + getDist(cur + size, end);
                        }
                        if (visit[cur + size] === 0) pushPriority(q, cur + size, heuristic[cur + size]);
                    }
                    if (cur % size != 0 && cur - 1 >= 0 && tds[cur - 1].innerHTML != "X") {
                        score = dist[cur] + 1;
                        if (score < dist[cur - 1]) {
                            path[cur - 1] = cur;
                            dist[cur - 1] = score;
                            heuristic[cur - 1] = dist[cur - 1] + getDist(cur - 1, end);
                        }
                        if (visit[cur - 1] === 0) pushPriority(q, cur - 1, heuristic[cur - 1]);
                    }
                }
                if (visit[end] === 0)
                    alert("Пути нет");
                else {
                    for (inpath = end; inpath != begin; ++i) {
                        tds[inpath].style.backgroundColor = "#FFFF00";
                        inpath = path[inpath];
                    }
                    tds[begin].style.backgroundColor = "#FFFF00";
                }
            }
            
        }
    };
}