class Cholesky {
    precision;          // number of significant figures
    n = 0;             // number of equations
    A = []              //coefficients matrix
    B = []              //array of bs
    notvalid = false    // boolean indicates that the matrix can't be solved using chelosky
    notsymm = false     // boolean for non symmetric matrix
    infinitesol = false // boolean for infinite number of solutions
    nosol = false       //boolean for no solution

    constructor(n, A, B, precision = 5) {
        this.n = n;
        this.A = A;
        this.B = B;
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
            accumulator += `<br>`
        }

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

    check() {
        for (let i = 0; i < this.n; i++) {
            for (let j = i; j < this.n; j++) {
                if (i != j) {
                    if (this.A[i][j] != this.A[j][i]) {
                        this.notsymm = true;
                        return false;
                    }
                }
                else {
                    if (this.A[i][j] <= 0) {
                        this.notvalid = true;
                        return false;
                    }
                }
            }
        }
        return true;
    }

    decompose() {
        document.getElementById("steps").innerHTML += `<h2 style = "text-align: center;">steps taken</h2><hr>`
        document.getElementById("steps").innerHTML += `<span>start decomposing A to LU</span><br><br>`
        for (var k = 0; k < this.n; k++) {
            for (var i = 0; i <= k; i++) {
                if (k == i) {
                    let sum = this.A[k][k];
                    for (let j = 0; j < k; j++) {
                        sum = sum - Math.pow(this.A[k][j], 2);
                        if (sum < 0) {
                            this.notvalid = true;
                            console.log("not ")
                            return;
                        }
                    }
                    this.A[k][k] = Number((Math.sqrt(sum)).toPrecision(this.precision));
                    this.print_step();
                }
                else {
                    if (this.A[i][i] == 0) {
                        this.notvalid = true;
                        console.log(this.L[i][i])
                        return;
                    }
                    let sum = this.A[k][i];
                    for (let j = 0; j < i; j++) {
                        sum = sum - this.A[i][j] * this.A[k][j];
                    }
                    this.A[k][i] = Number((sum / this.A[i][i]).toPrecision(this.precision));
                    this.A[i][k] = this.A[k][i];
                    this.print_step();
                }
            }
        }
    }
    substitution() {
        let y = [];
        let x = [];
        for (let i = 0; i < this.n; i++) {
            y[i] = 0;
            x[i] = 0;
        }
        document.getElementById("steps").innerHTML += `<span>start solving for y</span><br><br>`
        y[0] = Number((this.B[0] / this.A[0][0]).toPrecision(this.precision));
        this.print_step_y(y, "y");
        for (let i = 1; i < this.n; i++) {
            let sum = this.B[i];
            for (let j = 0; j < i; j++) {
                sum = sum - this.A[i][j] * y[j];
            }
            y[i] = Number((sum / this.A[i][i]).toPrecision(this.precision));
            this.print_step_y(y, "y");
        }
        //back subsitution
        document.getElementById("steps").innerHTML += `<hr>`
        document.getElementById("steps").innerHTML += `<span>start solving for x</span><br><br>`
        x[this.n - 1] = Number((y[this.n - 1] / this.A[this.n - 1][this.n - 1]).toPrecision(this.precision));
        this.print_step_y(x, "x");
        for (let i = this.n - 2; i >= 0; i--) {
            let sum = 0;
            for (let j = i + 1; j < this.n; j++) {
                sum = sum + (this.A[j][i] * x[j])
            }
            x[i] = Number(((y[i] - sum) / this.A[i][i]).toPrecision(this.precision));
            this.print_step_y(x, "x");
        }
        return x;
    }
    solve() {
        if (this.check()) {
            this.decompose();
            if (!this.notvalid)
                return this.substitution();
        }
    }
}

// var a = [[6, 15, 55], [15, 55, 225],[55, 225, 979]];
// var b = [15, 15, 10];
// var n = 3;
// var g = new Cholesky(n, a, b);
// g.solve();