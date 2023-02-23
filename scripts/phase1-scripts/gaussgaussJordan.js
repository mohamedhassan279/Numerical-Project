class Gauss {
    //A coefficients matrix, B free variables vector
    //n number of rows
    //rows and cols start from 0 as usual
    gaussInfiniteSol = false;
    gaussNoSol = false;
    A = [];
    B = [];
    n;
    precision;

    constructor(A, B, n, precision) {
        this.A = A; this.B = B; this.n = n; this.precision = precision;
    }

    //function to apply partial pivoting
    partialPivoting(k) {
        //k row to start calculations from
        //assume k is the pivot
        var pivot = k;
        //get pivot by finding the largest element in column k starting from row k
        for (var i = k + 1; i < this.n; i++) {
            if (Math.abs(this.A[i][k]) > Math.abs(this.A[pivot][k])) {
                pivot = i;
            }
        }
        if (pivot != k) {
            //swap row k with row of the pivot
            for (var i = k; i < this.n; i++) {
                var temp = this.A[pivot][i];
                this.A[pivot][i] = this.A[k][i];
                this.A[k][i] = temp;
            }
            //swap B[k] with B[pivot]
            temp = this.B[k];
            this.B[k] = this.B[pivot];
            this.B[pivot] = temp;
            console.log("A after pivoting: ", this.A);
            this.print_step();
        }
    }

    print_step() {
        document.getElementById("steps-taken-field").style.display = "block";
        var steps = document.getElementById("steps");
        // steps.innerHTML = ""
        var accumulator = steps.innerHTML;
        for (let i = 0; i < this.n; i++) {
            var arr = [];
            for (let j = 0; j < this.n; j++) {
                // console.log(A[i]);
                let tmp = Number(this.A[i][j]).toFixed(5);
                let s = "";
                if (j == 0)
                    s += tmp;
                else {
                    if (tmp >= 0) s += "+ " + tmp;
                    else s += tmp;
                }
                if (j != this.n - 1)
                    accumulator += `<span>${s} X<sub>${j + 1}</sub> </span>`
                else
                    accumulator += `<span>${s} X<sub>${j + 1}</sub> = </span>`
            }
            accumulator += `<span>${Number(this.B[i]).toFixed(5)}</span><br>`
        }
        accumulator += `<hr>`
        steps.innerHTML = accumulator
    }

    //function to apply backward Substitution
    Substitution() {
        //x vector of n element to store the solution of the equations
        var x = [];
        if (this.B[this.n - 1] != 0 && this.A[this.n - 1][this.n - 1] == 0) {
            this.gaussNoSol = true;
            return "There is no solution";
        }
        else if (this.B[this.n - 1] == 0 && this.A[this.n - 1][this.n - 1] == 0) {
            this.gaussInfiniteSol = true;
            x[this.n - 1] = 1;
        } else {
            x[this.n - 1] = Number((this.B[this.n - 1] / this.A[this.n - 1][this.n - 1]).toPrecision(this.precision));
        }

        for (var i = this.n - 2; i >= 0; i--) {
            var temp = this.B[i];
            for (var j = this.n - 1; j > i; j--) {
                temp = Number((temp - this.A[i][j] * x[j]).toPrecision(this.precision));
            }
            if (temp != 0 && this.A[i][i] == 0) {
                this.gaussNoSol = true;
                return "There is no solution";
            }
            if (temp == 0 && this.A[i][i] == 0) {
                this.gaussInfiniteSol = true;
                x[i] = 1;
            } else {
                x[i] = Number((temp / this.A[i][i]).toPrecision(this.precision));
            }
        }
        return x;
    }


    //function to apply forward elimination
    Elimination() {
        document.getElementById("steps").innerHTML += `<h2 style = "text-align: center;">steps taken</h2><hr>`
        for (var c = 0; c < this.n - 1; c++) {
            this.partialPivoting(c);
            if (this.A[c][c] == 0) {
                continue;
            }
            for (var i = c + 1; i < this.n; i++) {
                var factor = Number((this.A[i][c] / this.A[c][c]).toPrecision(this.precision));
                for (var j = c; j < this.n; j++) {
                    this.A[i][j] = Number((this.A[i][j] - factor * this.A[c][j]).toPrecision(this.precision));
                }
                this.B[i] = Number((this.B[i] - factor * this.B[c]).toPrecision(this.precision));
                this.print_step();
            }
        }
    }
}



class GaussElimination extends Gauss {
    //A coefficients matrix, B free variables vector
    //n number of rows
    //rows and cols start from 0 as usual
    constructor(A, B, n, precision) {
        super(A, B, n, precision);
    }

    solve() {
        this.Elimination();
        return this.Substitution();
    }
}

class GaussEliminationScaling extends Gauss {
    //A coefficients matrix, B free variables vector
    //n number of rows
    //rows and cols start from 0 as usual

    constructor(A, B, n, precision) {
        super(A, B, n, precision);
    }

    //function to get the scaling factors 
    scalingFactors() {
        var s = [];
        //s[i] should be the largest abolute value in row i
        for (var i = 0; i < this.n; i++) {
            s[i] = Math.abs(this.A[i][0]);
            for (var j = 1; j < this.n; j++) {
                if (Math.abs(this.A[i][j]) > s[i]) {
                    s[i] = Math.abs(this.A[i][j]);
                }
            }
        }
        return s;
    }

    //function to apply partial pivoting with scaling
    partialPivoting(k) {
        //k row to start calculations from
        //s the scaling factors
        var s = this.scalingFactors();
        //assume k is the pivot
        var pivot = k;
        //get pivot by finding the largest element in column k starting from row k 
        //we used scaling to improve our choice
        for (var i = k + 1; i < this.n; i++) {
            if (s[i] != 0 && s[pivot] == 0) {
                if (Math.abs(this.A[i][k]) / s[i] > Math.abs(this.A[pivot][k])) {
                    pivot = i;
                }
            } else if (s[i] == 0 && s[pivot] == 0) {
                if (Math.abs(this.A[i][k]) > Math.abs(this.A[pivot][k])) {
                    pivot = i;
                }
            }
            else if (s[i] != 0 && s[pivot] != 0) {
                if (Math.abs(this.A[i][k]) / s[i] > Math.abs(this.A[pivot][k]) / s[pivot]) {
                    pivot = i;
                }
            }
        }
        if (pivot != k) {
            //swap row k with row of the pivot
            for (var i = k; i < this.n; i++) {
                var temp = this.A[pivot][i];
                this.A[pivot][i] = this.A[k][i];
                this.A[k][i] = temp;
            }
            //swap B[k] with B[pivot]
            temp = this.B[k];
            this.B[k] = this.B[pivot];
            this.B[pivot] = temp;
            this.print_step();
        }

    }
    solve() {
        this.Elimination();
        return this.Substitution();
    }

}

class GaussJordan extends Gauss {
    //A coefficients matrix, B free variables vector
    //n number of rows
    //rows and cols start from 0 as usual

    constructor(A, B, n, precision) {
        super(A, B, n, precision);
    }

    //function to apply forward elimination
    Elimination() {
        document.getElementById("steps").innerHTML += `<h2 style = "text-align: center;">steps taken</h2><hr>`
        var rSub = [];
        for (var c = 0; c < this.n; c++) {
            this.partialPivoting(c);
            //Normalization
            var divide = this.A[c][c];
            if (divide == 0) {
                rSub.push(c);
                continue;
            }
            for (var r = c; r < this.n; r++) {
                this.A[c][r] = Number((this.A[c][r] / divide).toPrecision(this.precision));
            }
            this.B[c] = Number((this.B[c] / divide).toPrecision(this.precision));
            this.print_step();
            //forward elimination
            for (var i = c + 1; i < this.n; i++) {
                var factor = Number((this.A[i][c] / this.A[c][c]).toPrecision(this.precision));
                for (var j = c; j < this.n; j++) {
                    this.A[i][j] = Number((this.A[i][j] - factor * this.A[c][j]).toPrecision(this.precision));
                }
                this.B[i] = Number((this.B[i] - factor * this.B[c]).toPrecision(this.precision));
                this.print_step();
            }
            //backward elimination
            for (var i = c - 1; i >= 0; i--) {
                var factor = Number((this.A[i][c] / this.A[c][c]).toPrecision(this.precision));
                for (var j = c; j < this.n; j++) {
                    this.A[i][j] = Number((this.A[i][j] - factor * this.A[c][j]).toPrecision(this.precision));
                }
                this.B[i] = Number((this.B[i] - factor * this.B[c]).toPrecision(this.precision));
                this.print_step();
            }
        }
        //console.log(this.A);
        return rSub;
    }

    Sub(rSub) {
        for (var i in rSub) {
            var x = rSub[i];
            if (this.B[x] != 0) {
                this.gaussNoSol = true;
                return "there is no solution";
            } else {
                this.gaussInfiniteSol = true;
                this.B[x] = 0;
            }
        }
        return this.B;
    }

    solve() {
        var r = this.Elimination();
        //B vector will represent the solution vector
        return this.Sub(r);
    }

}

class GaussJordanScaling extends GaussEliminationScaling {
    //A coefficients matrix, B free variables vector
    //n number of rows
    //rows and cols start from 0 as usual
    jordanSInfiniteSol = false;
    jordanSNoSol = false;
    constructor(A, B, n, precision) {
        super(A, B, n, precision);
    }
    //function to apply forward elimination
    Elimination() {
        document.getElementById("steps").innerHTML += `<h2 style = "text-align: center;">steps taken</h2><hr>`
        var rSub = [];
        for (var c = 0; c < this.n; c++) {
            this.partialPivoting(c);
            //Normalization
            var divide = this.A[c][c];
            if (divide == 0) {
                rSub.push(c);
                continue;
            }
            for (var r = c; r < this.n; r++) {
                this.A[c][r] = Number((this.A[c][r] / divide).toPrecision(this.precision));
            }
            this.B[c] = Number((this.B[c] / divide).toPrecision(this.precision));
            this.print_step();
            //forward elimination
            for (var i = c + 1; i < this.n; i++) {
                var factor = Number((this.A[i][c] / this.A[c][c]).toPrecision(this.precision));
                for (var j = c; j < this.n; j++) {
                    this.A[i][j] = Number((this.A[i][j] - factor * this.A[c][j]).toPrecision(this.precision));
                }
                this.B[i] = Number((this.B[i] - factor * this.B[c]).toPrecision(this.precision));
                this.print_step();
            }
            //backward elimination
            for (var i = c - 1; i >= 0; i--) {
                var factor = Number((this.A[i][c] / this.A[c][c]).toPrecision(this.precision));
                for (var j = c; j < this.n; j++) {
                    this.A[i][j] = Number((this.A[i][j] - factor * this.A[c][j]).toPrecision(this.precision));
                }
                this.B[i] = Number((this.B[i] - factor * this.B[c]).toPrecision(this.precision));
                this.print_step();
            }
        }
        return rSub;
    }

    Sub(rSub) {
        for (var i in rSub) {
            var x = rSub[i];
            if (this.B[x] != 0) {
                this.gaussNoSol = true
                return "there is no solution";
            } else {
                this.gaussInfiniteSol = true;
                this.B[x] = 0;
            }
        }
        return this.B;
    }
    solve() {
        var r = this.Elimination();
        //B vector will represent the solution vector
        return this.Sub(r);
    }

}



// A = [[6,15,55],
//      [15,55,225],
//      [55,225,979]];

// B = [15,15,10];
// n = 3;
// let start = Date.now();
// g = new GaussElimination(A,B,n,100);
// var x = g.solve();
// document.getElementById("")
// console.log("ADel")
// //g = new GaussEliminationScaling(A,B,n,100);
// // g = new GaussJordan(A,B,n,100);
// // g = new GaussJordanScaling(A,B,n,100);
// if(g.gaussNoSol){
//     console.log("there is no solution");
// }else if(g.gaussInfiniteSol){
//     console.log("there are infinite number of solutions and one of them is:");
//     console.log(x);
// }else{
//     console.log("there is a unique solution:");
//     console.log(x);
// }
// let timeTaken = Date.now() - start;
// console.log("Total time taken : " + timeTaken + " milliseconds");



