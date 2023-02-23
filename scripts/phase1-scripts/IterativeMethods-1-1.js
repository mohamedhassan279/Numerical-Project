class Iterative_Methods {

    div_by_0_flag = false;
    divflag = false;

    constructor(n, Matrix, b, guess, iterations, toleranceerror, percesion) {
        this.n = n;
        this.Matrix = Matrix;
        this.b = b;

        if (guess == 0) {
            this.guess = [];
            for (let i = 0; i < this.n; i++) {
                this.guess.push(0);
            }
        }
        else { this.guess = guess; }


        this.iterations = iterations;

        this.toleranceerror = toleranceerror;

        if (percesion == 0) { this.precision = 20; }
        else { this.percesion = percesion; }


        if (this.iterations == 0 && this.toleranceerror == 0) {
            this.iterations = 100;
            this.toleranceerror = true;
        }
        if (this.toleranceerror != 0 && this.iterations == 0) {
            this.iterations = 100;
        }
        if (this.iterations != 0 && this.toleranceerror == 0) {
            this.toleranceerror = true;
        }


        console.log("guess is: ", this.guess);
        console.log("iterations = : ", this.iterations);
        console.log("tolerance error is: ", this.toleranceerror);
        console.log("precision is: ", this.percesion);
    }




    Diagonally_Dominant() {
        for (var i = 0; i < this.n; i++) {
            var sum = 0;//to get the sigma of all row elements, which aren’t in main diagonal
            for (var j = 0; j < this.n; j++) {
                if (i == j)
                    continue;

                sum += Math.abs(this.Matrix[i][j]);
            }
            if (Math.abs(this.Matrix[i][i]) < sum)//if any diagonal element is less than sigma row elements then matrix isn’t a diagonally dominant.
                return false;
        }
        return true;//Matrix is diagonally dominant.
    }
    check_div(current) {
        if (current * 100 > 10) {
            return true;
        }
        return false;
    }
    Jacobi_method() {
        if (this.iterations == 0) return this.guess;
        this.divflag = false;

        var steps = document.getElementById("steps");
        document.getElementById("steps-taken-field").style.display = "block";
        var accumulator = steps.innerHTML;
        accumulator += `<h2 style = "text-align: center;">steps taken</h2><hr>`
        console.log("JACOBI METHOD: ");
        var iter = 0;//A counter to count the iteratios that has been executed in code.
        var typeiter = this.iterations;//To indicate if the user enters number of iterations or we will set it by “true”.
        var err = this.toleranceerror;//to store the relative error that user enter
        var oldb = [];
        oldb = this.guess.slice();//previous result initialized with the guess that user enters.
        var newb = new Array(this.n);//the result vector
        var errArr = new Array(this.n);//to put the relative errors of the variables each iteration

        while (typeiter) {
            if (typeof (typeiter) != Boolean) { typeiter--; console.log("hi") }//decrement the iterations if it is a number.
            iter++;//increases the counter to print it in steps.
            console.log("Iteration", iter, ":");//print the current iteration
            accumulator += `<div>Iteration${iter}:</div>`
            var maximum = 0;//variable to state the maximum relative error in the solution vector in each iteration
            for (var i = 0; i < this.n; i++) {
                if (this.Matrix[i][i] == 0) { console.log("Division by zero! can't be solved."); this.div_by_0_flag = true; return; }//if division by zero occurs.
                var sum = 0;//to get Σj=0,j≠i (old[j]*Matrix[i][j])
                var print = "";
                print += String(this.b[i]); print += "-";
                for (var j = 0; j < this.n; j++) {
                    if (j == i)
                        continue;//if i==j continue looping without execution.

                    print += "("; print += String(this.Matrix[i][j]); print += "*"; print += String(oldb[j]); print += ")";
                    if (i == 0 && j == 1) print += "-";
                    if (j < (this.n - 2)) print += "-";
                    sum += this.Matrix[i][j] * oldb[j];
                    sum = Number(sum.toPrecision(this.percesion));
                }
                print += "/("; print += String(this.Matrix[i][i]); print += ") = ";
                newb[i] = Number(((this.b[i] - sum) / this.Matrix[i][i]).toPrecision(this.percesion));//Get the new Xi.
                //Get relative error of the new Xi
                errArr[i] = Math.abs((newb[i] - oldb[i]) / newb[i]);
                maximum = Math.max(maximum, errArr[i]);//Get the maximum relative error in the vector
                console.log("X", i + 1, " = ", print, newb[i]);
                accumulator += `<div>X<sub>${i + 1}</sub> = ${print} ${newb[i]}</div>`
            }

            if (this.check_div(maximum)) this.divflag = true;
            else this.divflag = false;

            oldb = newb.slice();//make the old vector to be the new one after each iteration
            if (this.toleranceerror != true)//if the user enters the relative error then check whether the maximum relative error has reached to the bound or not.
            {
                console.log("hi");
                if (maximum < err)
                    break;//break if the maximum error has reached to the bound.
            }
            accumulator += `<hr>`
        }//end of the iteration.
        if (this.divflag) console.log("Solution isn't convergent");
        console.log("Solution : ", newb, iter, maximum);//print the solution vector and number of iterations it takes.
        accumulator += `<div>Solution : [ ${newb} ]</div>`
        accumulator += `<div>Total iterations taken: ${iter}</div>`
        steps.innerHTML = accumulator;
        return newb;
    }//end of algorithm


    gauss_siedel_method() {
        if (this.iterations == 0) return this.guess;
        this.divflag = false;
        var steps = document.getElementById("steps");
        document.getElementById("steps-taken-field").style.display = "block";
        var accumulator = steps.innerHTML;
        accumulator += `<h2 style = "text-align: center;">steps taken</h2><hr>`
        console.log("Gauss-Siedel Method :");
        var iter = 0;//A counter to count the iteratios that has been executed in code.
        var typeiter = this.iterations;//To indicate if the user enters number of iterations or we will set it by “true”.
        var err = this.toleranceerror;//to store the relative error that user enter
        var oldb = [];
        oldb = this.guess.slice();//previous result initialized with the guess that user enters.
        console.log("guess", this.guess);//previous result initialized with the guess that user enters.
        var newb = new Array(this.n);//the result vector
        var errArr = new Array(this.n);//to put the relative errors of the variables each iteration
        if (this.Diagonally_Dominant()) {//to check if the matrix is diagonally dominant
            console.log("Diagonally Dominant matrix, solution will converge.");
            accumulator += `<div>Diagonally Dominant matrix, so solution will converge.<div>`
        }

        while (typeiter) {
            if (typeof (typeiter) != Boolean) typeiter--;//decrement the iterations if it is a number.
            iter++;//increases the counter to print it in steps.
            console.log("Iteration", iter, ":");//print the current iteration
            accumulator += `<div>Iteration ${iter}:<div>`
            var maximum = 0;//variable to state the maximum relative error in the solution vector in each iteration
            for (var i = 0; i < this.n; i++) {
                if (this.Matrix[i][i] == 0) { console.log("Division by zero! can't be solved."); this.div_by_0_flag = true; return -1; }//if division by zero occurs.
                var sum = 0;//to get Σj=0,j≠i old[j]*Matrix[i][j]
                var print = "";
                print += String(this.b[i]); print += "-";
                for (var j = 0; j < this.n; j++) {
                    if (j == i)
                        continue;//if i==j continue looping without execution.
                    print += "("; print += String(this.Matrix[i][j]); print += "*"; print += String(oldb[j]); print += ")";
                    if (i == 0 && j == 1) print += "-";
                    if (j < (this.n - 2)) print += "-";
                    sum += this.Matrix[i][j] * oldb[j];
                    sum = Number(sum.toPrecision(this.percesion));
                }
                print += "/("; print += String(this.Matrix[i][i]); print += ") = ";
                //Get the new Xi.
                newb[i] = Number(((this.b[i] - sum) / this.Matrix[i][i]).toPrecision(this.percesion));

                errArr[i] = Math.abs((newb[i] - oldb[i]) / newb[i]); //Get relative error of the new Xi
                oldb[i] = Number((newb[i]).toPrecision(this.percesion));//Update the old values of Xi to substitute by them in next iteration.
                maximum = Math.max(maximum, errArr[i]);//Get the maximum relative error in the vector
                console.log("X", i + 1, " = ", print, newb[i]);
                accumulator += `<div>X<sub>${i + 1}</sub> = ${print} ${newb[i]}</div>`
            }
            if (this.check_div(maximum)) this.divflag = true;
            else this.divflag = false;

            if (this.toleranceerror != true)//if the user enters the relative error then check whether the maximum relative error has reached to the bound or not.
            {
                console.log("hi");
                if (maximum < err)
                    break;//break if the maximum error has reached to the bound.
            }
            accumulator += `<hr>`
        }//end of the iteration.
        if (this.divflag) console.log("Solution isn't convergent");
        console.log("Solution : ", newb, iter, maximum);
        accumulator += `<div>Solution : [ ${newb} ]</div>`
        accumulator += `<div>Total iterations taken: ${iter}</div>`
        steps.innerHTML = accumulator;
        return newb;
    }//end of algorithm

}

// // var n=4;
  //var M=[[6,15,55],
  //    [15,55,225],[55,225,997]
  //    ];
   //var b=[15,15,10];
//   var guess=[0,0];
// //  var iter=20;
 //let obj=new Iterative_Methods(3,M,b,0,0,0,0);
  //x=obj.Jacobi_method();console.log(x);
// //  y=obj.gauss_siedel_method();console.log(y);