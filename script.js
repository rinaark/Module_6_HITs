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
            return Math.abs(cur % size - end % size) + Math.abs(Math.floor(cur / size) - Math.floor(end / size));
        }

        b.onclick = function () {
            let begin = -1;
            let end = -1;
            for (i = 0; i < tds.length; ++i) {
                if (tds[i].innerHTML === "B")
                    begin = i;
                else if (tds[i].innerHTML === "E")
                    end = i;
            }

            let visit = new Array(size * size);
            for (i = 0; i < size * size; ++i) {
                visit[i] = 0;
            }

            let path = new Array(size * size);
            let dist = new Array(size * size);

            if (begin === -1 || end === -1)
                alert("Не задана начальная или конечная позиция");
            else {
                let q = [];
                let cur;
                let len;
                visit[begin] = 1;
                dist[begin] = 0;
                q.push(begin);

                while (q.length != 0) {
                    cur = q[q.length - 1];
                    q.pop();
                    if (cur === end) break;
                    if (cur - size >= 0 && visit[cur - size] === 0 && tds[cur - size].innerHTML != "X") {
                        visit[cur - size] = visit[cur] + 1;
                        path[cur - size] = cur;
                        if (cur - size === end) break; else q.push(cur - size);
                    }
                    if (cur % size != size - 1 && cur + 1 < size * size && visit[cur + 1] === 0 && tds[cur + 1].innerHTML != "X") {
                        visit[cur + 1] = visit[cur] + 1;
                        path[cur + 1] = cur;
                        if (cur + 1 === end) break; else q.push(cur + 1);
                    }
                    if (cur + size < size * size && visit[cur + size] === 0 && tds[cur + size].innerHTML != "X") {
                        visit[cur + size] = visit[cur] + 1;
                        path[cur + size] = cur;
                        if (cur + size === end) break; else q.push(cur + size);
                    }
                    if (cur % size != 0 && cur - 1 >= 0 && visit[cur - 1] === 0 && tds[cur - 1].innerHTML != "X") {
                        visit[cur - 1] = visit[cur] + 1;
                        path[cur - 1] = cur;
                        if (cur - 1 === end) break; else q.push(cur - 1);
                    }
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
    };
}