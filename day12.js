const { test, test2, test3, data } = require('./data/day12');

const smallRegex = /[a-z]/;
const bigRegex = /[A-Z]/;

const SMALL = Symbol('small');
const BIG = Symbol('big');
const START = 'start';
const END = 'end';

const getNodeSize = (node) => {
  return node.match(smallRegex) ? SMALL : BIG;
}
const isStart = (node) => node === START;
const isEnd = (node) => node === END;

class Node {
  constructor(node) {
    this.name = node;
    this.edges = [];
  }

  get type() {
    return getNodeSize(this.name);
  }

  isStart = () => {
    return isStart(this.name);
  };

  isEnd = () => {
    return isEnd(this.name);
  };

  addEdge = (target) => {
    if (this.edges.find(el => target.name === el.name)) {
      return;
    }

    this.edges.push(target);

    if (target.edges && !target.edges.find(el => el.name === this.name)) {
      target.addEdge(this);
    }
  };

  toString = () => {
    return `[${this.name} (${this.type.toString()})]: ${this.edges.map(edge => edge.name).join (', ')}`;
  };
}

const parseGraph = (input) => {
  const rawNodes = new Set();
  const rawEdges = input.map(el => new Set(el.split('-')));
  rawEdges.forEach(edge => edge.forEach((node) => rawNodes.add(node)));
  const vertices = [];

  Array.from(rawNodes.values()).forEach((node) => {
    vertices.push(new Node(node));
  });

  vertices.forEach(vertex => {
    const edgePartners = rawEdges
      .filter(edge => edge.has(vertex.name))
      .map(edge => {
        const [partner] = Array.from(edge.values()).filter(n => n !== vertex.name)

        return partner;
      });

    edgePartners.forEach((partner) => vertex.addEdge(vertices.find(v => v.name === partner)));
  });

  return vertices;
}

const alreadyVisitedSmallTwice = (fromArray) => {
  const smalls = fromArray.filter(n => !n.isStart() && n.type === SMALL).map(n => n.name);
  const isUnique = smalls.some((el, idx, arr) => arr.indexOf(el) !== idx);
  return isUnique;
};

const dfs = (node, from, paths) => {
  if (node.isEnd()) {
    from.push(node);
    paths.push(from.map(n => n.name));
    return;
  }

  from.push(node);

  node.edges.forEach((edgeNode) => {
    if (
      edgeNode.name === START
        || edgeNode.type === SMALL && from.find(el => el.name === edgeNode.name)
    ) {
      return;
    }

    dfs(edgeNode, [...from], paths);
  });

  return paths;
};

const dfsRevisit = (node, from, paths) => {
  if (node.isEnd()) {
    from.push(node);
    paths.push(from.map(n => n.name));
    return;
  }

  from.push(node);

  node.edges.forEach((edgeNode) => {
    if (
      edgeNode.name === START ||
      (
        edgeNode.type === SMALL && from.find(el => el.name === edgeNode.name)
          && alreadyVisitedSmallTwice(from)
      )
      ) {
      return;
    }

    dfsRevisit(edgeNode, [...from], paths);
  });

  return paths;
};

const traverseGraph = (vertices, allowRevisitSingleSmall = false) => {
  const paths = [];
  const visited = [];
  const startNode = vertices.find(v => v.name === START);
  
  return allowRevisitSingleSmall ? dfsRevisit(startNode, [], []) : dfs(startNode, [], []);
};

const testGraph = parseGraph(test);
const test2Graph = parseGraph(test2);
const test3Graph = parseGraph(test3);
const dataGraph = parseGraph(data);

console.log({
  test: {
    paths: traverseGraph(testGraph).map(path => path.join(', ')).length,
    pathsRevisit: traverseGraph(testGraph, true).map(path => path.join(', ')).length,
  },
  test2: {
    paths: traverseGraph(test2Graph).map(path => path.join(', ')).length,
    pathsRevisit: traverseGraph(test2Graph, true).map(path => path.join(', ')).length,
  },
  test3: {
    paths: traverseGraph(test3Graph).map(path => path.join(', ')).length,
    pathsRevisit: traverseGraph(test3Graph, true).map(path => path.join(', ')).length,
  },
  data: {
    paths: traverseGraph(dataGraph).map(path => path.join(', ')).length,
    pathsRevisit: traverseGraph(dataGraph, true).map(path => path.join(', ')).length,
  },
})
