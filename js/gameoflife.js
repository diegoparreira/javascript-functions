function seed() {
  // a função call chama os objeto arguments como parâmetro para a função slice
  return [].slice.call(arguments);
}

function same([x, y], [j, k]) {
  return x === j && y === k
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  // a palavra reservada this refere ao contexto da aplicação(objeto em questão)
  // a função some verifica se ao menos um elemento de um dado array satisfaz uma função de callback, no caso abaixo
  // verifica se algum dos elementos já existentes no contexto condiz com o elemento passado por parâmetro
  return this.some( (element) => same(element, cell) );
}

const printCell = (cell, state) => {
  return contains.call(state, cell) ? '\u25A3' : '\u25A2';
};

const corners = (state = []) => {
  let objToReturn = {
    topRight: [0,0],
    bottomLeft: [0,0]
  };

  if(state.length === 0) {
    return objToReturn;
  }

  const xs = state.map( ([x, _] ) => x);
  const ys = state.map( ([_, y] ) => y);

  objToReturn.topRight = [Math.max(...xs),Math.max(...ys)];
  objToReturn.bottomLeft = [Math.min(...xs),Math.min(...ys)];

  return objToReturn;
};

const printCells = (state) => {
  const { bottomLeft, topRight } = corners(state);
  let strToReturn = '';

  for (let y = topRight[1] ; y >= bottomLeft[1] ; y--) {
      let row = [];
      for (let x = bottomLeft[0] ; x <= topRight[0] ; x++) {
          row.push(this.printCell([x, y], state));
      }
      strToReturn += row.join(" ") + '\n';
  }

  return strToReturn;
};

const getNeighborsOf = ([x, y]) => [
  [x-1,y+1], [x, y+1], [x+1, y+1],
  [x-1,y], [x+1,y],
  [x-1,y-1], [x,y-1], [x+1,y-1]
];

const getLivingNeighbors = (cell, state) => {
  return this.getNeighborsOf(cell).filter(e => this.contains.bind(state)(e));
};

const willBeAlive = (cell, state) => {
  const aliveNeighbors = this.getLivingNeighbors(cell, state);
  return (aliveNeighbors.length === 3) || (aliveNeighbors.length === 2 && this.contains.call(state, cell));
};

const calculateNext = (state) => {
  const { bottomLeft, topRight } = corners(state);
  let result = [];

  for (let y = topRight[1] + 1; y >= bottomLeft[1] - 1 ; y--) {
    for (let x = bottomLeft[0] - 1 ; x <= topRight[0] + 1 ; x++) {
      result = result.concat(willBeAlive([x,y], state) ? [[x,y]] : []);
    }
  }
  return result;
};

const iterate = (state, iterations) => {
  const res = [state];

  for(let i = 0 ; i < iterations ; i++) {
    res.push(calculateNext(res[i]));
  }

  return res;
};

const main = (pattern, iterations) => {
  const results = iterate(startPatterns[pattern], iterations);
  return results.map(e => console.log(printCells(e)));
};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;