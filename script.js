// JavaScript source code
window.onload = function () {
    document.querySelector("#createTable").onclick = () => {
        let size = document.querySelector("#size").value;
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
        div.innerHTML += "X - непроходимые клетки<br>B - начало<br>E - конец";

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
    };
}