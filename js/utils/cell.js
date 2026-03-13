class Cell {

    constructor(i, j) {
        this.i = i;
        this.j = j;
    }

    getNeighbors() {

        let neighbors = [];

        neighbors.push(new Cell(this.i - 1, this.j - 1 ));
        neighbors.push(new Cell(this.i - 1, this.j ));
        neighbors.push(new Cell(this.i - 1, this.j + 1 ));

        neighbors.push(new Cell(this.i, this.j - 1 ));
        neighbors.push(new Cell(this.i, this.j + 1 ));

        neighbors.push(new Cell(this.i + 1, this.j - 1 ));
        neighbors.push(new Cell(this.i + 1, this.j ));
        neighbors.push(new Cell(this.i + 1, this.j + 1 ));

        return neighbors;
    }

    toString() {
        return `${this.i},${this.j}`;
    }
}
