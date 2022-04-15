
function countUniqueValues(elements, attribute) {
    var counter = {};

    //выясняем сколько различных значений есть у атрибута
    for (let i = 0; i < elements.length; i++) {
        counter[elements[i][attribute]] = 0;
    }

    //считаем, сколько элементов для каждого из значений
    for (let i = 0; i < elements.length; i++) {
        counter[elements[i][attribute]] += 1;
    }

    return counter;
}

//энтропия Шеннона
function entropy(elements, attribute) {
    let counter = countUniqueValues(elements, attribute);

    let entropy = 0;
    let p;
    for (var i in counter) {
        p = counter[i] / elements.length;
        entropy += -p * Math.log(p);
    }

    return entropy;
}

//функция для разделения множества по правилу
function split(elements, attribute, predicate, pivot) {
    let match = [];
    let notMatch = [];

    let item,
        attrValue;

    for (let i = 0; i < elements.length; i++) {
        item = elements[i];
        attrValue = item[attribute];

        if (predicate(attrValue, pivot)) {
            match.push(item);
        } else {
            notMatch.push(item);
        }
    }

    return {
        match: match,
        notMatch: notMatch
    }
}

//находим самый частый атрибут
function mostFrequentValue(items, attr) {
    let counter = countUniqueValues(items, attr);

    let mostFrequentCount = 0;
    let mostFrequentValue;

    for (let value in counter) {
        if (counter[value] > mostFrequentCount) {
            mostFrequentCount = counter[value];
            mostFrequentValue = value;
        }
    }

    return mostFrequentValue;
}

var predicates = {
    '==': function (a, b) { return a == b },
    '>=': function (a, b) { return a >= b }
}

function drawRoot(coords, attrName, predicateName, value, nodeID) {
    let node = document.createElement('div');
    node.className = 'node';
    node.id = nodeID;
    node.style.top = coords.bottom + 'px';
    node.style.left = coords.left + 'px';
    node.innerHTML = attrName + ' ' + predicateName + ' ' + value;
    document.body.append(node);
    coords = node.getBoundingClientRect();

    let leftPart = document.createElement('canvas');
    leftPart.className = 'line';
    leftPart.style.top = coords.bottom + 'px';
    leftPart.style.left = coords.left + (coords.right - coords.left) / 2 - 20 + 'px';
    leftPart.style.width = 20;
    leftPart.style.height = 50;
    document.body.append(leftPart);
    let context = leftPart.getContext('2d');
    context.beginPath();
    context.moveTo(20, 0);
    context.lineTo(0, 50);
    context.stroke();

    let match = document.createElement('div');
    match.className = 'node';
    let matchID = nodeID + 'yes';
    match.id = matchID;
    match.style.top = coords.bottom + 50 + 'px';
    match.style.left = coords.left + (coords.right - coords.left) / 2 - 40 + 'px';
    match.innerHTML = 'yes';
    document.body.append(match);
    coords = match.getBoundingClientRect();

    let leftTale = document.createElement('canvas');
    leftTale.className = 'line';
    leftTale.style.top = coords.bottom + 'px';
    leftTale.style.left = coords.left + (coords.right - coords.left) / 2 + 'px';
    leftTale.style.width = 1;
    leftTale.style.height = 5;
    document.body.append(leftTale);
    context = leftTale.getContext('2d');
    context.beginPath();
    context.moveTo(1, 0);
    context.lineTo(1, 5);
    context.stroke();

    coords = node.getBoundingClientRect();
    let rightPart = document.createElement('canvas');
    rightPart.className = 'line';
    rightPart.style.top = coords.bottom + 'px';
    rightPart.style.left = coords.left + (coords.right - coords.left) / 2 + 'px';
    rightPart.style.width = 20;
    rightPart.style.height = 50;
    document.body.append(rightPart);
    context = rightPart.getContext('2d');
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(20, 50);
    context.stroke();

    let notMatch = document.createElement('div');
    notMatch.className = 'node';
    let notMatchID = nodeID + 'no';
    notMatch.id = notMatchID;
    notMatch.style.top = coords.bottom + 50 + 'px';
    notMatch.style.left = coords.left + (coords.right - coords.left) / 2 + 20 + 'px';
    notMatch.innerHTML = 'no';
    document.body.append(notMatch);
    coords = notMatch.getBoundingClientRect();

    let rightTale = document.createElement('canvas');
    rightTale.className = 'line';
    rightTale.style.top = coords.bottom + 'px';
    rightTale.style.left = coords.left + (coords.right - coords.left) / 2 + 'px';
    rightTale.style.width = 1;
    rightTale.style.height = 5;
    document.body.append(rightTale);
    context = rightTale.getContext('2d');
    context.beginPath();
    context.moveTo(1, 0);
    context.lineTo(1, 5);
    context.stroke();

    let notMatchCoords = rightTale.getBoundingClientRect();
    notMatchCoords.top = notMatchCoords.bottom;
    let matchCoords = leftTale.getBoundingClientRect();
    matchCoords.top = matchCoords.bottom;
    return {
        notMatchCoords: notMatchCoords,
        notMatchID: notMatchID,
        matchCoords: matchCoords,
        matchID: matchID
    }
}

function drawLeaf(coords, category) {
    let node = document.createElement('div');
    node.className = 'node';
    node.id = nodeID;
    node.style.top = coords.bottom + 10 + 'px';
    node.style.left = coords.left + 'px';
    node.innerHTML = category;
    document.body.append(node);
    coords = node.getBoundingClientRect();
}

function buildDecisionTree(builder) {
    let nodeID = builder.nodeID;
    let nodeCoords = builder.nodeCoords;
    let trainingSet = builder.trainingSet;
    let categoryAttribute = builder.categoryAttribute;
    let maxTreeSize = builder.maxTreeDepth;
    let entropyEnough = 0.01;

    if (maxTreeSize == 0) {
        return {
            category: mostFrequentValue(trainingSet, categoryAttribute)
        }
    }

    let startEntropy = entropy(trainingSet, categoryAttribute);

    if (startEntropy <= entropyEnough) {
        return {
            category: mostFrequentValue(trainingSet, categoryAttribute)
        }
    }

    let alreadyChecked = {};

    let bestSplit = { informationGain: 0 };

    for (let i = trainingSet.length - 1; i >= 0; i--) {
        let element = trainingSet[i];

        for (let attribute in element) {
            if (attribute === categoryAttribute) {
                continue;
            }

            let pivot = element[attribute];

            let predicateName;
            if (typeof pivot == 'number') {
                predicateName = '>=';
            }
            else {
                predicateName = '==';
            }

            let attrPredPivot = attribute + predicateName + pivot;
            if (alreadyChecked[attrPredPivot]) {
                continue;
            }
            alreadyChecked[attrPredPivot] = true;

            let predicate = predicates[predicateName];

            let currSplit = split(trainingSet, attribute, predicate, pivot);
            let matchEntropy = entropy(currSplit.match, categoryAttribute);
            let notMatchEntropy = entropy(currSplit.notMatch, categoryAttribute);

            let newEntropy = 0;
            newEntropy += matchEntropy * currSplit.match.length;
            newEntropy += notMatchEntropy * currSplit.notMatch.length;
            newEntropy /= trainingSet.length;
            let currGain = startEntropy - newEntropy;

            if (currGain > bestSplit.informationGain) {
                bestSplit = currSplit;
                bestSplit.predicateName = predicateName;
                bestSplit.predicate = predicate;
                bestSplit.attribute = attribute;
                bestSplit.pivot = pivot;
                bestSplit.informationGain = currGain;
            }
        }
    }

    if (!bestSplit.informationGain) {
        //изображаем лист
        let leafValue = mostFrequentValue(trainingSet, categoryAttribute);
        drawLeaf(nodeCoords, leafValue);
        return { category: leafValue };
    }

    //здесь у нас происходит разделение деревьев, надо это изобразить
    //изображаем узел
    let coordsAndIDs = drawRoot(nodeCoords, bestSplit.attribute, bestSplit.predicateName, bestSplit.pivot, nodeID);

    builder.maxTreeDepth = maxTreeSize - 1;

    builder.trainingSet = bestSplit.match;
    builder.nodeID = coordsAndIDs.matchID;
    builder.nodeCoords = coordsAndIDs.matchCoords;
    let matchSubTree = buildDecisionTree(builder);

    builder.trainingSet = bestSplit.notMatch;
    builder.nodeID = coordsAndIDs.notMatchID;
    builder.nodeCoords = coordsAndIDs.notMatchCoords;
    let notMatchSubTree = buildDecisionTree(builder);

    return {
        attribute: bestSplit.attribute,
        predicate: bestSplit.predicate,
        predicateName: bestSplit.predicateName,
        pivot: bestSplit.pivot,
        match: matchSubTree,
        notMatch: notMatchSubTree,
        matchedCount: bestSplit.match.length,
        notMatchedCount: bestSplit.notMatch.length
    }
}

//дерево
//builder - тренировочная выборка и параметры
class decisionTree {
    constructor(builder) {
        this.root = buildDecisionTree({
            trainingSet: builder.trainingSet,
            categoryAttribute: builder.categoryAttribute,
            maxTreeSize: builder.maxTreeDepth,
            nodeCoords: builder.startCoords,
            nodeID: builder.nodeID
        });
    }
}

decisionTree.prototype.predict = function (element) {
    return predict(this.root, element);
}

//используем дерево
function predict(tree, element) {
    let attribute,
        id,
        value,
        predicate,
        pivot;

    while (true) {

        if (tree.category) {
            return tree.category;
        }

        attribute = tree.attribute;
        value = element[attribute];

        predicate = tree.predicate;
        pivot = tree.pivot;

        //переход на следующий узел
        if (predicate(value, pivot)) {
            tree = tree.match;
        } else {
            tree = tree.notMatch;
        }
    }
}

window.onload = function () {
    let trainingSet = [{ person: 'Homer', hairLength: 0, weight: 250, age: 36, sex: 'male' },
    { person: 'Marge', hairLength: 10, weight: 150, age: 34, sex: 'female' },
    { person: 'Bart', hairLength: 2, weight: 90, age: 10, sex: 'male' },
    { person: 'Lisa', hairLength: 6, weight: 78, age: 8, sex: 'female' },
    { person: 'Maggie', hairLength: 4, weight: 20, age: 1, sex: 'female' },
    { person: 'Abe', hairLength: 1, weight: 170, age: 70, sex: 'male' },
    { person: 'Selma', hairLength: 8, weight: 160, age: 41, sex: 'female' },
    { person: 'Otto', hairLength: 10, weight: 180, age: 38, sex: 'male' },
    { person: 'Krusty', hairLength: 6, weight: 200, age: 45, sex: 'male' }];;
    let elem = document.getElementById('maxTreeSize');
    let coords = elem.getBoundingClientRect();
    let startCoords = coords;
    startCoords.top = coords.bottom;
    startCoords.left = document.documentElement.clientWidth / 2;
    let builder = {
        trainingSet: trainingSet,
        categoryAttribute: 'sex',
        maxTreeSize: 10,
        startCoords: startCoords,
        nodeID: 'a'
    }
    let button = document.getElementById('startButton');
    button.onclick = function () {
        let tree = new decisionTree(builder);
    }
}

