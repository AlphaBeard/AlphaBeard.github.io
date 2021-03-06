const NODE_RADIUS = 35;

function random(low, high, floor) {
    if (floor) {
        return (Math.floor((high - low) * Math.random())) + low;
    } else {
        return ((high - low) * Math.random()) + low;
    }
}
class Graph {
    constructor() {
        this.vertexSet = [];
        this.edgeSet = [];
        this.adjMatrix = [];
        this.size = 0;
        this.source = undefined;
        this.dest = undefined;
    }
    addVertex() {
        this.vertexSet[this.size] = this.size;
        this.adjMatrix[this.size] = [];
        this.size += 1;
    } addEdge(n1, n2) {
        console.log(`Added edge: ${n1},${n2}`);
        this.adjMatrix[n1].push(n2);
        this.edgeSet.push(`${n1},${n2}`);
    }
    createAdjMatrix() {
        let adj = [];
        let i = 0;
        this.adjMatrix.forEach((adjList) => {
            adj[i] = [];
            adj[i] = adjList.slice()
            i++;
        })
        return adj;
    }
}

class Node {
    constructor(x, y, parentElement) {
        console.log("making Node");
        //make html element
        let nodeElement = document.createElement("div");
        let nodeAnimater = document.createElement('div');
        let text = document.createElement("span");

        nodeAnimater.classList += " node-animater";

        // text.innerText = nodesArray.length;
        nodeElement.appendChild(nodeAnimater);
        nodeAnimater.appendChild(text);
        nodeElement.classList.add("node");
        nodeElement.classList.add("node-placed");
        setTimeout(function () { nodeElement.classList.remove("node-placed") }, 2000);

        parentElement.appendChild(nodeElement);

        this.nodeElement = nodeElement;

        this.destNode = false;
        this.startNode = false;
        this.vertex = nodesArray.length;
        this.x = x;
        this.y = y;
        this.velx = 0;
        this.vely = 0;
    }
    update(boundX, boundY) {
        this.updateVel(boundX, boundY);
        this.nodeElement.style.top = this.y + 'px';
        this.nodeElement.style.left = this.x + 'px';
    }
    updateVel(boundX, boundY) {
        this.x += this.velx;
        this.y += this.vely;
        if (this.x + NODE_RADIUS * 2 > boundX || this.x < 0) {
            this.velx *= -1;
        }
        if (this.y + NODE_RADIUS * 2 > boundY || this.y < 0) {
            this.vely *= -1;
        }
    }
    destroyHTMLElement() {
        this.nodeElement.parentNode.removeChild(this.nodeElement);
    }
    edgetoPrev(directed) {
        if (nodesArray.length < 2) return;
        let body = document.getElementById("svg");
        if (directed) {
            edgesArray.push(new Edge(nodesArray[nodesArray.length - 2], this, body));
        } else {
            edgesArray.push(new Edge(nodesArray[nodesArray.length - 2], this, body));
            edgesArray.push(new Edge(this, nodesArray[nodesArray.length - 2], body));
        }
    }
    connect() {
        let body = document.getElementById("svg");
        nodesArray.forEach(node => {
            if (this == node) return;
            edgesArray.push(new Edge(this, node, body));
            graph.addEdge(this.vertex, node.vertex);
        });

    }
}

class Edge {
    constructor(node1, node2, parentElement) {
        this.node1 = node1;
        this.node2 = node2;
        var edgeElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        edgeElement.setAttribute('x1', node1.x + NODE_RADIUS);
        edgeElement.setAttribute('y1', node1.y + NODE_RADIUS);
        edgeElement.setAttribute('x2', node1.x);
        edgeElement.setAttribute('y2', node1.y);
        edgeElement.setAttribute("marker-end", "url(#arrowhead)");
        edgeElement.classList = "edge";
        parentElement.appendChild(edgeElement);
        this.edgeElement = edgeElement;
        this.weighted = false;

        if (node2) {
            graph.addEdge(node1.vertex, node2.vertex);
        }
    }
    updateWithMouse(x2, y2) {
        this.edgeElement.setAttribute('x1', this.node1.x + NODE_RADIUS);
        this.edgeElement.setAttribute('y1', this.node1.y - NAVBAR_HEIGHT + NODE_RADIUS);
        this.edgeElement.setAttribute('x2', x2);
        this.edgeElement.setAttribute('y2', y2 - NAVBAR_HEIGHT);

    }
    setNode2(node) {
        this.node2 = node;
        graph.addEdge(this.node1.vertex, this.node2.vertex);
    }
    update() {
        this.edgeElement.setAttribute('x1', this.node1.x + NODE_RADIUS);
        this.edgeElement.setAttribute('y1', this.node1.y - NAVBAR_HEIGHT + NODE_RADIUS);
        this.edgeElement.setAttribute('x2', this.node2.x + NODE_RADIUS);
        this.edgeElement.setAttribute('y2', this.node2.y - NAVBAR_HEIGHT + NODE_RADIUS);
    }
    destroyHTMLElement() {
        let edgeHTML = this.edgeElement;
        edgeHTML.parentNode.removeChild(edgeHTML);
    }
    static deletedUnwantedEdges(node) {
        const n1 = currentEdge.node1.vertex;
        const n2 = node.vertex;
        // Self edges not allowed
        if (n1 == n2) {
            deleteLastEdge();
            return;
        }

        let duplEdge = false;
        graph.edgeSet.forEach(edge => {
            const nodes = edge.split(',');
            if (n1 == nodes[0] && n2 == nodes[1]) {
                console.log("Deleting Duplicate Edge");
                duplEdge = true;
                deleteLastEdge();
            }
        });
        if (!duplEdge) {
            currentEdge.setNode2(node);
        }
    }
    // let edgeWithSameTerminus = edgesArray.filter(edge => edge.node2 == node); //find edges with same node2
    // let edgeWithSameOrigin = edgeWithSameTerminus.filter(edge => edge.node1 == currentEdge.node1);
    // if (edgeWithSameOrigin[0]) {
    //     console.log("Can't make duplicate Edges")
    //     deleteLastEdge();
    // } else {
    //     currentEdge.setNode2(node);

    // }
}



class Toolbar {
    constructor() {
        this.moveStartNode = false;
        this.moveDestNode = false;
        this.nodeCreateTool = false;
        this.edgeCreateTool = false;
        this.edgeCreateinProgress = false;
        this.nodeMoveinProgress = false;
        this.undirectedEdges = false;
    }
    nodeCreateButtonClicked() {
        $("#edge-tool-warning").css("display", "none");
        $("#node-tool-warning").toggle();
        $("#edgeCreate").removeClass("button-active-edge");
        $("#nodeCreate").toggleClass("button-active-node");
        this.edgeCreateTool = false;
        this.nodeCreateTool = !this.nodeCreateTool;

        /* If currently making an edge, delete when edge button clicked */
        if (this.edgeCreateinProgress) {
            edgesArray.pop().destroyHTMLElement();
            this.edgeCreateinProgress = false;
        }
    }
    edgeCreateButtonClicked() {
        $("#node-tool-warning").css("display", "none"); //if node create warning active, disable
        $("#edge-tool-warning").toggle();
        $("#nodeCreate").removeClass("button-active-node");
        $("#edgeCreate").toggleClass("button-active-edge");
        this.nodeCreateTool = false;
        this.edgeCreateTool = !this.edgeCreateTool;
        if (!this.edgeCreateTool) currentEdgeWeight = 1;
        /* If currently making an edge, delete when edge button clicked */
        if (this.edgeCreateinProgress) {
            edgesArray.pop().destroyHTMLElement();
            this.edgeCreateinProgress = false;
        }
    }
    deactivateCreateButtons() {
        $("#node-tool-warning").css("display", "none");
        $("#edge-tool-warning").css("display", "none");
        $("#nodeCreate").removeClass("button-active-node");
        $("#edgeCreate").removeClass("button-active-edge");
        this.nodeCreateTool = false;
        this.edgeCreateTool = false;
        this.nodeMoveinProgress = false;
        if (this.edgeCreateinProgress) {
            deleteLastEdge()
        }
        this.edgeCreateinProgress = false;
    }
    algorithmClicked(button) {
        this.deactivateCreateButtons();
        $("#visualize").text("Visualize Algorithm");
        switch (button.innerText) {
            case "BFS": {
                algorithmConfig.algorithm = "bfs";
                $("#algorithm").text("Algorithm: BFS");
                break;
            }
            case "DFS": {
                algorithmConfig.algorithm = "dfs";
                $("#algorithm").text("Algorithm: DFS");
                break;
            }
        }

    }
    algorithmSpeedClicked(btn) {
        this.deactivateCreateButtons();
        let text = btn.innerText;
        $("#speed-dropdown").text("Speed: " + text);
        switch (text) {
            case "Usain Bolt":
                algorithmConfig.speed = 5;
                root.style.setProperty('--animation-time', '.2s');
                break;
            case "Fast":
                algorithmConfig.speed = 50;
                root.style.setProperty('--animation-time', '.4s');
                break;
            case "Medium":
                algorithmConfig.speed = 200;
                root.style.setProperty('--animation-time', '1s');
                break;
            case "Slow":
                algorithmConfig.speed = 500;
                root.style.setProperty('--animation-time', '1.5s');
                break;
        }
    }
}
class Queue {
    constructor() {
        this.elements = [];
    }
    enqueue(e) {
        this.elements.push(e);
    }
    dequeue() {
        return this.elements.shift();
    }
    isEmpty() {
        return this.elements.length == 0;
    }
    length() {
        return this.elements.length;
    }
}
