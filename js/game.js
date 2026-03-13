class Game {

    constructor() {

        this.cells = new Map();
    }

    born(cell) {

        this.cells.set(cell.toString(), cell);
    }

    kill(cell) {

        this.cells.delete(cell.toString());
    }

    isAlive(cell) {

        return this.cells.has(cell.toString());
    }

    getAliveNeighbors(cell) {

        var aliveNeighbors = [];

        for (const neighbor of cell.getNeighbors()) {

            if (this.isAlive(neighbor)) {
                aliveNeighbors.push(neighbor);
            }
        }

        return aliveNeighbors;
    };

    toggleCell(i, j) {

        console.debug("Toggling...");

        let cell = new Cell(i, j);

        if (this.isAlive(cell)) {
            this.kill(cell);
        } else {
            this.born(cell);
        }
    };

    step() {

        console.debug("Stepping...");

        let toBeAnalized = new Map();

        for (const cell of game.cells.values()) {

            toBeAnalized.set(cell.toString(), cell);

            for (const neighbor of cell.getNeighbors()) {
                toBeAnalized.set(neighbor.toString(), neighbor);
            }
        }

        var nextStates = new Array();

        for (const cell of toBeAnalized.values()) {

            var nAliveNeighbors = this.getAliveNeighbors(cell).length;

            //1 - Qualquer célula viva com menos de dois vizinhos vivos morre de solidão.
            if (this.isAlive(cell) && nAliveNeighbors < 2) {
                nextStates.push({ cell, next: "dead" });
            }
            //2 - Qualquer célula viva com mais de três vizinhos vivos morre de superpopulação.
            else if (this.isAlive(cell) && nAliveNeighbors > 3) {
                nextStates.push({ cell, next: "dead" });
            }
            //3 - Qualquer célula com exatamente três vizinhos vivos se torna uma célula viva.
            else if (nAliveNeighbors == 3) {
                nextStates.push({ cell, next: "alive" });
            }
            //3 - Qualquer célula com dois vizinhos vivos continua no mesmo estado para a próxima geração.
            else if (nAliveNeighbors == 2) {
                //Stay state
            }
        };

        var that = this;

        nextStates.forEach(function (state) {
            if (state.next === "dead") {
                that.kill(state.cell);
            } else if (state.next === "alive") {
                that.born(state.cell);
            }
        });
    }

    /**
     * Move all Cells
     * @param {string} direction
     */
    move(direction){

        // Possible values
        // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"

        if (direction === "ArrowRight") {
            this.moveRight();
        }
        if (direction === "ArrowLeft") {
            this.moveLeft();
        }
        if (direction === "ArrowUp") {
            this.moveUp();
        }
        if (direction === "ArrowDown") {
            this.moveDown();
        }
    }

    moveLeft() {

        let newCells = new Map();

        this.cells.forEach(function(cell, key) {
            cell.j--;
            newCells.set(cell.toString(), cell);
        });

        this.cells = newCells;
    }
    moveRight() {

        let newCells = new Map();

        this.cells.forEach(function(cell, key) {
            cell.j++;
            newCells.set(cell.toString(), cell);
        });

        this.cells = newCells;
    }
    moveUp() {

        let newCells = new Map();

        this.cells.forEach(function(cell, key) {
            cell.i--;
            newCells.set(cell.toString(), cell);
        });
    }
    moveDown() {

        let newCells = new Map();

        this.cells.forEach(function(cell, key) {
            cell.i++;
            newCells.set(cell.toString(), cell);
        });

        this.cells = newCells;
    }
};
