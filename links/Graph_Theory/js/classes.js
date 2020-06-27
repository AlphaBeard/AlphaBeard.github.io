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
    }
    addVertex() {
        this.vertexSet[this.size] = this.size;
        this.adjMatrix[this.size] = [];
        this.size += 1;
    } addEdge(n1, n2) {
        console.log(`Added edge: ${n1},${n2}`);
        this.adjMatrix[n1].push(n2);

    }
}

class Node {
    constructor(x, y, parentElement) {
        //make html element
        let nodeElement = document.createElement("div");
        let text = document.createElement("p");
        text.innerText = nodesArray.length;
        this.vertex = nodesArray.length;
        nodeElement.appendChild(text);
        nodeElement.classList.add("node");
        parentElement.appendChild(nodeElement);

        this.nodeElement = nodeElement;

        this.x = x;
        this.y = y;
        this.velx = 0;
        this.vely = 0;
    }
    update(boundX, boundY) {
        this.updateVel(boundX, boundY);
        this.nodeElement.style.top = this.y + 'px'
        this.nodeElement.style.left = this.x + 'px'
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
    connect() {
        let body = document.getElementById("svg");
        nodesArray.forEach(node => {
            if (this == node) return;
            edgesArray.push(new Edge(0, 0, this, node, body));
            graph.addEdge(this.vertex, node.vertex);
        });

    }
}

class Edge {
    constructor(x2, y2, node1, node2, parentElement) {
        this.x2 = x2;
        this.y2 = y2;
        this.node1 = node1;
        this.node2 = node2;
        var edgeElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        edgeElement.setAttribute('x1', node1.x + NODE_RADIUS);
        edgeElement.setAttribute('y1', node1.y + NODE_RADIUS);
        edgeElement.setAttribute('x2', x2);
        edgeElement.setAttribute('y2', y2);
        edgeElement.setAttribute("marker-end", "url(#arrowhead)");
        edgeElement.classList = "edge";
        parentElement.appendChild(edgeElement);
        this.edgeElement = edgeElement;
    }
    updateWithMouse(x2, y2) {
        this.edgeElement.setAttribute('x1', this.node1.x + NODE_RADIUS);
        this.edgeElement.setAttribute('y1', this.node1.y - NAVBAR_HEIGHT + NODE_RADIUS);
        this.edgeElement.setAttribute('x2', x2);
        this.edgeElement.setAttribute('y2', y2 - NAVBAR_HEIGHT);

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


}

class Toolbar {
    constructor() {
        this.nodeCreateTool = false;
        this.edgeCreateTool = false;
        this.edgeCreateinProgress = false;
        this.nodeMoveinProgress = false;
    }
    nodeCreateButtonClicked() {
        $("#edgeCreate").removeClass("button-active");
        $("#node-dropdown").toggleClass("button-active");
        $("#nodeCreate").toggleClass("button-active");
        this.edgeCreateTool = false;
        this.nodeCreateTool = !this.nodeCreateTool;
        /* If currently making an edge, delete when edge button clicked */
        if (this.edgeCreateinProgress) {
            edgesArray.pop().destroyHTMLElement();
            this.edgeCreateinProgress = false;
        }
    }
    edgeCreateButtonClicked() {
        $("#node-dropdown").removeClass("button-active");
        $("#nodeCreate").removeClass("button-active");
        $("#edgeCreate").toggleClass("button-active");
        this.nodeCreateTool = false;
        this.edgeCreateTool = !this.edgeCreateTool;
        /* If currently making an edge, delete when edge button clicked */
        if (this.edgeCreateinProgress) {
            edgesArray.pop().destroyHTMLElement();
            this.edgeCreateinProgress = false;
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
