class LUCroutDecomposition {
    isscaling = false;  // boolean for scaling
    tol = 1e-7;            //smallest possible scaled pivot allowed
    precision;      // number of significant figures
    n;               // number of equations
    A = []              //coefficients matrix
    B = []              //array of bs
    er = 0;              //if the matrix is singular will return -1
    scales = [];         //array of scaling factors
    A = [[0]]          //array of L and U
    o = []              //array of index of rows
    infinitesol = false // boolean for infinite number of solutions
    nosol = false       //boolean for no solution


    constructor(n, A, B, isscaling = false, precision) {
        this.n = n;
        this.A = A;
        this.B = B;
        this.isscaling = isscaling;
        this.precision = precision;
    }


    print_step() {
        document.getElementById("steps-taken-field").style.display = "block";
        var steps = document.getElementById("steps");
        // steps.innerHTML = ""
        var accumulator = steps.innerHTML;
        for (let i = 0; i < this.n; i++) {
            var arr = [];
            for (let j = 0; j < this.n; j++) {
                let tmp = (this.A[i][j]).toPrecision(5);
                accumulator += `<span>[${tmp}] </span>`
            }
            accumulator += `<br><br>`
        }

        accumulator += `<span>O = [<span>`
        accumulator += `<span>${this.o} ]</span>`
        accumulator += `<hr>`
        steps.innerHTML = accumulator
    }


    print_step_y(y, name) {
        console.log("Y from print step = ", y);
        // document.getElementById("steps-taken-field").style.display = "block";
        var steps = document.getElementById("steps");
        // steps.innerHTML = ""
        var accumulator = steps.innerHTML;
        accumulator += `<span>${name} = [</span>`
        for (let i = 0; i < this.n; i++) {
            if (i != this.n - 1)
                accumulator += `<span>${Number(y[i]).toFixed(5)}, </span>`
            else
                accumulator += `<span>${Number(y[i]).toFixed(5)} ]</span><br>`
        }
        steps.innerHTML = accumulator;
    }

    //function to apply partial pivoting
    partialPivoting(k) {
        //k row to start calculations from
        //assume k is the pivot
        var pivot = k;
        let dummy = 0;
        let big = Math.abs(this.A[k][this.o[k]]);
        if (this.scales[this.o[k]] != 0) {
            big = big / this.scales[this.o[k]];
        }
        for (let j = k + 1; j < this.n; j++) {
            if (this.scales[this.o[j]] == 0) {
                dummy = Math.abs(this.A[k][this.o[j]]);
            }
            else {
                dummy = Math.abs(this.A[k][this.o[j]]) / this.scales[this.o[j]];
            }
            if (dummy > big) {
                big = dummy;
                pivot = j;
            }
        }
        //change the rows for os
        dummy = this.o[pivot];
        this.o[pivot] = this.o[k];
        this.o[k] = dummy;
    }
    scaling() {
        for (let j = 0; j < this.n; j++) {
            this.o[j] = j;
            if (!this.isscaling) {
                this.scales[j] = 1;
            }
            else {
                this.scales[j] = Math.abs(this.A[0][j])
                for (let i = 1; i < this.n; i++) {
                    if (Math.abs(A[i][j]) > this.scales[j])
                        this.scales[j] = Math.abs(this.A[i][j])
                }
            }
        }
    }

    Decompostion_A_to_A() {
        document.getElementById("steps").innerHTML += `<h2 style = "text-align: center;">steps taken</h2><hr>`
        document.getElementById("steps").innerHTML += `<span>start decomposing A to LU</span><br><br>`
        this.scaling();
        for (let k = 0; k < (this.n - 1); k++) {
            //make partial pivote for each iteration
            this.partialPivoting(k);

            if ((Math.abs(this.A[k][this.o[k]]) / this.scales[this.o[k]]) < this.tol) {
                this.er = -1;
                continue;
            }
            for (var j = k + 1; j < this.n; j++) {
                var factor = Number((this.A[k][this.o[j]] / this.A[k][this.o[k]]).toPrecision(this.precision));
                //will store L matrix
                this.A[k][this.o[j]] = factor;
                for (var i = k + 1; i < this.n; i++) {
                    //will store U matrix in the same matrix A
                    this.A[i][this.o[j]] = Number((this.A[i][this.o[j]] - factor * this.A[i][this.o[k]]).toPrecision(this.precision));
                }
                this.print_step();
            }
            // Check for singular or near-singular case
            if (Math.abs(this.A[this.n - 1][this.o[this.n - 1]]) / this.scales[this.o[this.n - 1]] < this.tol)
                this.er = -1;
        }
    }
    subsitution() {
        //forward subsitution
        let y = [];
        let x = [];
        for (let i = 0; i < this.n; i++) {
            y[i] = 0;
            x[i] = 0;
        }
        document.getElementById("steps").innerHTML += `<span>start solving for y</span><br><br>`
        if (this.B[0] == 0 && this.A[0][this.o[0]] == 0) {
            this.infinitesol = true;
            y[this.o[0]] = 1;
        }
        else if (this.A[0][this.o[0]] == 0) {
            this.nosol = true;
            return;
        }
        else {
            y[this.o[0]] = Number((this.B[0] / this.A[0][this.o[0]]).toPrecision(this.precision));
        }
        this.print_step_y(y, "y");
        for (let i = 1; i < this.n; i++) {
            let sum = this.B[i];
            for (let j = 0; j < i; j++) {
                sum = sum - this.A[i][this.o[j]] * y[this.o[j]];
            }
            if (sum == 0 && this.A[i][this.o[i]] == 0) {
                this.infinitesol = true;
                y[this.o[i]] = 1;
            }
            else if (this.A[i][this.o[i]] == 0) {
                this.nosol = true;
                return;
            }
            else {
                y[this.o[i]] = Number((sum / this.A[i][this.o[i]]).toPrecision(this.precision));
                this.print_step_y(y, "y");
            }
        }
        //back subsitution
        document.getElementById("steps").innerHTML += `<hr>`
        document.getElementById("steps").innerHTML += `<span>start solving for x</span><br><br>`
        x[this.o[this.n - 1]] = y[this.o[this.n - 1]];
        this.print_step_y(x, "x");
        for (let i = this.n - 2; i >= 0; i--) {
            let sum = 0;
            for (let j = i + 1; j < this.n; j++) {
                sum = sum + (this.A[i][this.o[j]] * x[this.o[j]])
            }
            x[this.o[i]] = Number((y[this.o[i]] - sum).toPrecision(this.precision));
            this.print_step_y(x, "x");
        }
        return x;
    }

    solve() {
        // var steps = document.getElementById("steps");
        // steps.innerHTML = "";
        // document.getElementById("steps-taken-field").style.display = "block";
        // var accumulator = steps.innerHTML;
        this.Decompostion_A_to_A();
        console.log("A", this.A);
        let x = this.subsitution();
        if (this.nosol) {
            console.log("system doesn't exist");
            return;
        }
        if (this.infinitesol) {
            console.log("There are infinite number of solutions");
        }
        console.log("x", x);
        return x;
    }
}

// let A = [[25, 5, 1],
// [64, 8, 1],
// [144, 12, 1]];
// let A = [[1, 2, 2],
//          [1, 2, 2],
//          [3, 2, -1]];
// let B = [106.8, 177.2, 279.2];
// let n = 3;
// let A = [[1, 2, 3, 1],
// [0, 0, 4, 5],
// [0, 0, 2, 4],
// [0, 0, 0, 1]];
// let B = [5, 8, 10, 4];
// let n = 4;
// let g = new LUCroutDecomposition(n, A, B);
// let v = g.solve();