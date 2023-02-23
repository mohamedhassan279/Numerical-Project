class LUDolittleDecomposition {
  isscaling = false;  // boolean for scaling
  tol = 1e-7;            //smallest possible scaled pivot allowed
  precision;      // number of significant figures
  n;               // number of equations
  matrix = [];              //coefficients matrix
  b = [];              //array of bs
  er = 0;              //if the matrix is singular will return -1
  scales = [];         //array of scaling factors
  o = [];              //array of index of rows
  infinitesol = false; // boolean for infinite number of solutions
  nosol = false;       //boolean for no solution
  start = 0; timetaken = 0;


  constructor(n, matrix, b, isscaling = false, precision) {
    this.n = n;
    this.matrix = matrix;
    this.b = b;
    this.isscaling = isscaling;
    this.precision = precision;
    console.log("is scaling is: " + this.isscaling);
  }


  print_step() {
    document.getElementById("steps-taken-field").style.display = "block";
    var steps = document.getElementById("steps");
    // steps.innerHTML = ""
    var accumulator = steps.innerHTML;
    for (let i = 0; i < this.n; i++) {
      var arr = [];
      for (let j = 0; j < this.n; j++) {
        let tmp = (this.matrix[i][j]).toPrecision(5);
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
    let big = Math.abs(this.matrix[this.o[k]][k]);
    if (this.scales[this.o[k]] != 0) {
      big = big / this.scales[this.o[k]];
    }
    for (let i = k + 1; i < this.n; i++) {
      if (this.scales[this.o[i]] == 0) {
        dummy = Math.abs(this.matrix[this.o[i]][k]);
      }
      else {
        dummy = Math.abs(this.matrix[this.o[i]][k]) / this.scales[this.o[i]];
      }
      if (dummy > big) {
        big = dummy;
        pivot = i;
      }
    }
    //change the rows for os
    dummy = this.o[pivot];
    this.o[pivot] = this.o[k];
    this.o[k] = dummy;
  }

  scaling() {
    for (let i = 0; i < this.n; i++) {
      this.o[i] = i;
      if (!this.isscaling) {
        this.scales[i] = 1;
      }
      else {
        this.scales[i] = Math.abs(this.matrix[i][0]);
        for (let j = 1; j < this.n; j++) {
          if (Math.abs(this.matrix[i][j]) > this.scales[i])
            this.scales[i] = Math.abs(this.matrix[i][j]);
        }
      }
    }
  }

  Decompostion_A_to_LU() {
    document.getElementById("steps").innerHTML += `<h2 style = "text-align: center;">steps taken</h2><hr>`
    document.getElementById("steps").innerHTML += `<span>start decomposing A to LU</span><br><br>`
    this.start = Date.now();
    this.scaling();
    console.log("O after scaling is: ", this.o);
    // this.print_step();
    for (var k = 0; k < (this.n - 1); k++) {
      //make partial pivote for each iteration
      this.partialPivoting(k);
      // this.print_step();
      if ((Math.abs(this.matrix[this.o[k]][k]) / this.scales[this.o[k]]) < this.tol) {
        this.er = -1;
        continue;
      }
      for (var i = k + 1; i < this.n; i++) {
        var factor = Number((this.matrix[this.o[i]][k] / this.matrix[this.o[k]][k]).toPrecision(this.precision));
        //will store L matrix
        this.matrix[this.o[i]][k] = factor;
        // this.print_step();
        for (var j = k + 1; j < this.n; j++) {
          //will store U matrix in the same matrix LU
          this.matrix[this.o[i]][j] = Number((this.matrix[this.o[i]][j] - factor * this.matrix[this.o[k]][j]).toPrecision(this.precision));
        }
        this.print_step();
      }
      // Check for singular or near-singular case
      if (Math.abs(this.matrix[this.o[this.n - 1]][this.n - 1]) / this.scales[this.o[this.n - 1]] < this.tol) {
        this.er = -1;
      }
    }
  }

  subsitution() {
    //forward subsitution
    document.getElementById("steps").innerHTML += `<span>start solving for y</span><br><br>`
    let y = [];
    let x = [];
    for (let i = 0; i < this.n; i++) {
      y[i] = 0;
      x[i] = 0;
    }
    y[this.o[0]] = Number(this.b[this.o[0]].toPrecision(this.precision));
    console.log("Y = ", y);
    this.print_step_y(y, "y");
    for (let i = 1; i < this.n; i++) {
      let sum = this.b[this.o[i]];
      for (let j = 0; j < i; j++) {
        sum = sum - this.matrix[this.o[i]][j] * y[this.o[j]];
      }
      y[this.o[i]] = Number(sum.toPrecision(this.precision));
      this.print_step_y(y, "y");
    }
    //back subsitution
    document.getElementById("steps").innerHTML += `<hr>`
    document.getElementById("steps").innerHTML += `<span>start solving for x</span><br><br>`

    if (y[this.o[this.n - 1]] == 0 && this.matrix[this.o[this.n - 1]][this.n - 1] == 0) {
      this.infinitesol = true;
      x[this.n - 1] = 1;
    }
    else if (this.matrix[this.o[this.n - 1]][this.n - 1] == 0) {
      this.nosol = true;
      return;
    }

    else {
      x[this.n - 1] = Number((y[this.o[this.n - 1]] / this.matrix[this.o[this.n - 1]][this.n - 1]).toPrecision(this.precision));
    }
    this.print_step_y(x, "x");
    for (let i = this.n - 2; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < this.n; j++) {
        sum = sum + (this.matrix[this.o[i]][j] * x[j]);
      }
      if ((y[this.o[i]] - sum) == 0 && this.matrix[this.o[i]][i] == 0) {
        this.infinitesol = true;
        x[i] = 1;
      }
      else if (this.matrix[this.o[i]][i] == 0) {
        this.nosol = true;
        return;
      }
      else {
        x[i] = Number(((y[this.o[i]] - sum) / this.matrix[this.o[i]][i]).toPrecision(this.precision));
        this.print_step_y(x, "x");
      }
    }
    return x;
  }

  solve() {
    console.log("A = ", this.matrix);
    console.log("B = ", this.b);
    console.log("scaling ", this.isscaling);
    console.log("n =  ", this.n);
    this.Decompostion_A_to_LU();
    console.log("LU", this.matrix);
    let x = this.subsitution();
    this.timetaken = Date.now() - this.start;
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


// A = [[25,5,1],
// [64,8,1],
// [144,12,1]];
// // let A = [[1, 2, 3, 1],
// // [0, 0, 4, 5],
// // [0, 0, 2, 4],
// // [0, 0, 0, 1]];
// let B = [5, 8, 10];
// let n = 3;
// let g = new LUDolittleDecomposition(n,A,B,false,10);
// let v = g.solve();