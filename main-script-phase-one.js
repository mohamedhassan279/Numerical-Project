
let system_size_field = document.getElementById('number-of-equations');
let input_equations_field = document.getElementById('input-equations-field');
let choose_method_field = document.getElementById('solving-methods');
let final_answer_field = document.getElementById('final-answer-field');
let result_field = document.getElementById("result-field");



var number_of_equations;
var precision;
var user_entered_string;
var A = [];
var B = [];

//taking the system size 
document.getElementById('submit-system-size').onclick = function () {

    number_of_equations = Math.trunc((system_size_field.value));
    precision = Math.trunc(document.getElementById('precision').value);
    if (isNaN(number_of_equations) || isNaN(precision) || precision < 0) {
        alert('enter an integer positive value, please');
    }
    else if (number_of_equations < 2) {
        alert('enter an integer positive value that is greater than one for n, please');
    }
    else {
        // final_answer_field.innerHTML = "";
        // choose_method_field.innerHTML = "";
        // result_field.innerHTML = "";
        if (precision == 0) precision = 20;
        console.log("precision = " + precision);
        console.log("n = " + number_of_equations);
        input_equations_field.style.display = "block";
        input_equations_field.innerHTML = "";
        input_equations_field.appendChild(document.createElement("hr"));
        for (let i = 0; i < number_of_equations; i++) {
            let tmp = document.createElement("h4");
            tmp.appendChild(document.createTextNode(`enter the parameters of equation ${i + 1}:`));
            input_equations_field.appendChild(tmp);
            for (let j = 0; j <= number_of_equations; j++) {
                let current_element = document.createElement("input");
                current_element.setAttribute("id", `element-${i}-${j}`);
                input_equations_field.appendChild(current_element);
                if (j < number_of_equations - 1) {
                    let xs = document.createElement("span");
                    let subscript = document.createElement("sub");
                    let operator = document.createElement("apan");
                    xs.appendChild(document.createTextNode(` X`))
                    subscript.appendChild(document.createTextNode(`${j + 1}`));
                    xs.appendChild(subscript);
                    operator.appendChild(document.createTextNode(" + "))
                    xs.appendChild(operator);
                    input_equations_field.appendChild(xs)
                }
                else if (j == number_of_equations - 1) {
                    let xs = document.createElement("span");
                    let subscript = document.createElement("sub");
                    let operator = document.createElement("apan");
                    xs.appendChild(document.createTextNode(` X`))
                    subscript.appendChild(document.createTextNode(`${j + 1}`));
                    xs.appendChild(subscript);
                    operator.appendChild(document.createTextNode(" = "))
                    xs.appendChild(operator);
                    input_equations_field.appendChild(xs)
                }
                console.log(current_element);
            }
            input_equations_field.appendChild(document.createElement("br"));
        }
        document.getElementById('submit-cooficients').style.display = "block";
        document.getElementById('seperator').style.display = "block"
    }
}


document.getElementById('submit-cooficients').onclick = function () {
    var count = 0;
    for (var i = 0; i < number_of_equations; i++) {
        var row = [];
        for (var j = 0; j <= number_of_equations; j++) {
            let s = "";
            s += `element-${i}-${j}`;
            tmp = (Number(document.getElementById(s).value));
            if (j == number_of_equations) B[count++] = tmp;
            else row[j] = tmp;
            if (isNaN(tmp)) user_entered_string = true;
            console.log(row[j]);
        }
        A[i] = row;
        row = [];
    }
    console.log(A);
    console.log(B);
    if (user_entered_string) {
        alert('enter a numeric values, please');
        user_entered_string = false;
    }
    else {
        document.getElementById('choose-method').style.display = "block";
    }
}

// if the gauess elimination button has been pressed
function G_E() {
    console.log("hi from GE");
    final_answer_field.innerHTML = "";
    result_field.innerHTML = "";
    document.getElementById("steps").innerHTML = "";
    document.getElementById("steps-taken-field").style.display = "none";
    document.getElementById("method-name-heading").innerText = "Gauess-Elimination solver"
    final_answer_field.innerHTML += `<span style = "font-weight:bold;">Select the solving technique:</span>`;
    final_answer_field.innerHTML += `<button  class="clickme" style = "margin-left:30px;" onclick = "ge_scaling()">solve with scaling</button>`
    final_answer_field.innerHTML += `<button  class="clickme" style = "margin-left:30px;" onclick = "ge_without_scaling()">solve without scaling</button><br><br>`
}

function ge_scaling() {
    console.log("lets solve GE with scaling");
    result_field.innerHTML = "";
    document.getElementById("method-name-heading").innerText = "Gauess-Elimination solver (with scaling)"
    let ge_scaling = new GaussEliminationScaling(make_copy_A(), B.slice(), number_of_equations, precision);
    let start = Date.now();
    document.getElementById("steps").innerHTML = "";
    let arr = ge_scaling.solve();
    let timeTaken = Date.now() - start;

    if (ge_scaling.gaussNoSol) {
        result_field.innerHTML += `<span>The given system has NO Solution</span>`
    }

    else if (ge_scaling.gaussInfiniteSol) {
        result_field.innerHTML += `<h2 style="color:#2fca4e;">The given system has infinitely many solutions</h2><br>`
        result_field.innerHTML += `<h2>And one of the solutions is:</h2><br>`
        result_field.innerHTML += `<span>[ </span>`
        for (let i = 0; i < number_of_equations; i++) {
            if (i != number_of_equations - 1)
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])}, </span>`
            else
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])} ]</span> <br>`
        }
    }

    else {
        result_field.innerHTML += `<h2>The solution of the given system is:</h2>`
        result_field.innerHTML += `<span>[ </span>`
        for (let i = 0; i < number_of_equations; i++) {
            if (i != number_of_equations - 1)
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])}, </span>`
            else
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])} ]</span> <br>`
        }
    }
    result_field.innerHTML += `<h2>Time taken by this algorithm is:<span>  ${timeTaken} ms<span></h2>`
}


function ge_without_scaling() {
    console.log("lets solve GE without scaling");
    result_field.innerHTML = "";
    document.getElementById("method-name-heading").innerText = "Gauess-Elimination solver (without scaling)"
    let ge_no_scaling = new GaussElimination(make_copy_A(), B.slice(), number_of_equations, precision);
    let start = Date.now();
    document.getElementById("steps").innerHTML = "";
    let arr = ge_no_scaling.solve();
    let timeTaken = Date.now() - start;
    console.log("B after GE", B);
    if (ge_no_scaling.gaussNoSol) {
        result_field.innerHTML += `<span>The given system has NO Solution</span>`
    }

    else if (ge_no_scaling.gaussInfiniteSol) {
        result_field.innerHTML += `<h2 style="color:#2fca4e;">The given system has infinitely many solutions</h2><br>`
        result_field.innerHTML += `<h2>And one of the solutions is:</h2><br>`
        result_field.innerHTML += `<span>[ </span>`
        for (let i = 0; i < number_of_equations; i++) {
            if (i != number_of_equations - 1)
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])}, </span>`
            else
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])} ]</span> <br>`
        }
    }

    else {
        result_field.innerHTML += `<h2>The solution of the given system is:</h2>`
        result_field.innerHTML += `<span>[ </span>`
        for (let i = 0; i < number_of_equations; i++) {
            if (i != number_of_equations - 1)
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])}, </span>`
            else
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])} ]</span> <br>`
        }
    }
    result_field.innerHTML += `<h2>Time taken by this algorithm is:<span>  ${timeTaken} ms<span></h2>`
}

//if the gauess jordan button has been pressed 
function G_J() {
    console.log("hi from GJ");
    final_answer_field.innerHTML = "";
    result_field.innerHTML = "";
    document.getElementById("steps").innerHTML = "";
    document.getElementById("steps-taken-field").style.display = "none";
    document.getElementById("method-name-heading").innerText = "Gauess-Jordan solver"
    final_answer_field.innerHTML += `<span style = "font-weight:bold;">Select the solving technique:</span>`;
    final_answer_field.innerHTML += `<button  class="clickme" style = "margin-left:30px;" onclick = "gj_scaling()">solve with scaling</button>`
    final_answer_field.innerHTML += `<button  class="clickme" style = "margin-left:30px;" onclick = "gj_without_scaling()">solve without scaling</button><br><br>`
}

function gj_scaling() {
    result_field.innerHTML = "";
    document.getElementById("method-name-heading").innerText = "Gauess-Jordan solver (with scaling)"
    let gj_scaling = new GaussJordanScaling(make_copy_A(), B.slice(), number_of_equations, precision);
    let start = Date.now();
    document.getElementById("steps").innerHTML = "";
    let arr = gj_scaling.solve();
    let timeTaken = Date.now() - start;

    if (gj_scaling.gaussNoSol) {
        result_field.innerHTML += `<span>The given system has NO Solution</span>`
    }

    else if (gj_scaling.gaussInfiniteSol) {
        result_field.innerHTML += `<h2 style="color:#2fca4e;">The given system has infinitely many solutions</h2><br>`
        result_field.innerHTML += `<h2>And one of the solutions is:</h2><br>`
        result_field.innerHTML += `<span>[ </span>`
        for (let i = 0; i < number_of_equations; i++) {
            if (i != number_of_equations - 1)
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])}, </span>`
            else
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])} ]</span> <br>`
        }
    }

    else {
        result_field.innerHTML += `<h2>The solution of the given system is:</h2>`
        result_field.innerHTML += `<span>[ </span>`
        for (let i = 0; i < number_of_equations; i++) {
            if (i != number_of_equations - 1)
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])}, </span>`
            else
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])} ]</span> <br>`
        }
    }
    result_field.innerHTML += `<h2>Time taken by this algorithm is:<span>  ${timeTaken} ms<span></h2>`
}

function gj_without_scaling() {
    result_field.innerHTML = "";
    document.getElementById("method-name-heading").innerText = "Gauess-Jordan solver (without scaling)"
    let gj_no_scaling = new GaussJordan(make_copy_A(), B.slice(), number_of_equations, precision);
    let start = Date.now();
    document.getElementById("steps").innerHTML = "";
    let arr = gj_no_scaling.solve();
    let timeTaken = Date.now() - start;

    if (gj_no_scaling.gaussNoSol) {
        result_field.innerHTML += `<span>The given system has NO Solution</span>`
    }

    else if (gj_no_scaling.gaussInfiniteSol) {
        result_field.innerHTML += `<h2 style="color:#2fca4e;">The given system has infinitely many solutions</h2><br>`
        result_field.innerHTML += `<h2>And one of the solutions is:</h2><br>`
        result_field.innerHTML += `<span>[ </span>`
        for (let i = 0; i < number_of_equations; i++) {
            if (i != number_of_equations - 1)
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])}, </span>`
            else
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])} ]</span> <br>`
        }
    }

    else {
        result_field.innerHTML += `<h2>The solution of the given system is:</h2>`
        result_field.innerHTML += `<span>[ </span>`
        for (let i = 0; i < number_of_equations; i++) {
            if (i != number_of_equations - 1)
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])}, </span>`
            else
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])} ]</span> <br>`
        }
    }
    result_field.innerHTML += `<h2>Time taken by this algorithm is:<span>  ${timeTaken} ms<span></h2>`
}

//if LU button has been pressed
function LU() {
    final_answer_field.innerHTML = "";
    result_field.innerHTML = "";
    document.getElementById("steps").innerHTML = "";
    document.getElementById("steps-taken-field").style.display = "none";
    document.getElementById("method-name-heading").innerText = "LU Decomposition solver"
    final_answer_field.innerHTML += `<span style = "font-weight:bold;">Select the format of L & U:</span>`;
    final_answer_field.innerHTML += `<button  class="clickme" style = "margin-left:30px;" onclick = "do_clicked()">Downlittle</button>`
    final_answer_field.innerHTML += `<button  class="clickme" style = "margin-left:30px;" onclick = "crout_clicked()">Crout</button>`
    final_answer_field.innerHTML += `<button  class="clickme" style = "margin-left:30px;" onclick = "cholesky()">Cholesky</button><br><br><br>`
    final_answer_field.innerHTML += `<div id="solving-tech"></div>`
}

function do_clicked() {
    document.getElementById("solving-tech").innerHTML = "";
    result_field.innerHTML = "";
    document.getElementById("steps-taken-field").style.display = "none";
    document.getElementById("method-name-heading").innerText = "LU Decomposition solver (Downlittle format)"
    document.getElementById("solving-tech").innerHTML += `<span style = "font-weight:bold;">Select the solving technique:</span>`;
    document.getElementById("solving-tech").innerHTML += `<button  class="clickme" style = "margin-left:30px;" onclick = "do_scaling()">solve with scaling</button>`
    document.getElementById("solving-tech").innerHTML += `<button  class="clickme" style = "margin-left:30px;" onclick = "do_without_scaling()">solve without scaling</button><br><br>`
}
function crout_clicked() {
    document.getElementById("solving-tech").innerHTML = "";
    result_field.innerHTML = "";
    document.getElementById("steps-taken-field").style.display = "none";
    document.getElementById("method-name-heading").innerText = "LU Decomposition solver (Crout format)"
    document.getElementById("solving-tech").innerHTML += `<span style = "font-weight:bold;">Select the solving technique:</span>`;
    document.getElementById("solving-tech").innerHTML += `<button  class="clickme" style = "margin-left:30px;" onclick = "crout_scaling()">solve with scaling</button>`
    document.getElementById("solving-tech").innerHTML += `<button  class="clickme" style = "margin-left:30px;" onclick = "crout_without_scaling()">solve without scaling</button><br><br>`
}


function do_scaling(Scaling = true) {
    console.log("Hi do with scaling")
    console.log("Scaling is: " + Scaling);
    result_field.innerHTML = "";
    let dolittle_solver;
    if (Scaling) {
        document.getElementById("method-name-heading").innerText = "LU Decomposition solver (Downlittle format with scaling)"
        dolittle_solver = new LUDolittleDecomposition(number_of_equations, make_copy_A(), B.slice(), true, precision);
    }
    else dolittle_solver = new LUDolittleDecomposition(number_of_equations, make_copy_A(), B.slice(), false, precision);
    document.getElementById("steps").innerHTML = "";
    var arr = dolittle_solver.solve();
    if (dolittle_solver.nosol) {
        result_field.innerHTML += `<span>The given system has NO Solution</span>`
    }
    else if (dolittle_solver.infinitesol) {
        result_field.innerHTML += `<h2 style="color:#2fca4e;">The given system has infinitely many solutions</h2><br>`
        result_field.innerHTML += `<h2>And one of the solutions is:</h2><br>`
        result_field.innerHTML += `<span>[ </span>`
        for (let i = 0; i < number_of_equations; i++) {
            if (i != number_of_equations - 1)
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])}, </span>`
            else
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])} ]</span> <br>`
        }
    }
    else {
        result_field.innerHTML += `<h2>The solution of the given system is:</h2>`
        result_field.innerHTML += `<span>[ </span>`
        for (let i = 0; i < number_of_equations; i++) {
            if (i != number_of_equations - 1)
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])}, </span>`
            else
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])} ]</span> <br>`
        }
    }
    result_field.innerHTML += `<h2>Time taken by this algorithm is:<span>  ${dolittle_solver.timetaken} ms<span></h2>`
}

function do_without_scaling() {
    console.log("A before no scaling", A);
    document.getElementById("method-name-heading").innerText = "LU Decomposition solver (Downlittle format without scaling)"
    do_scaling(false);
}

function crout_scaling(Scaling = true) {
    console.log("Hi crout with scaling")
    console.log("Scaling is: " + Scaling);
    result_field.innerHTML = "";
    let crout_solver;
    if (Scaling) {
        document.getElementById("method-name-heading").innerText = "LU Decomposition solver (Crout format with scaling)"
        crout_solver = new LUCroutDecomposition(number_of_equations, make_copy_A(), B.slice(), true, precision);
    }
    else crout_solver = new LUCroutDecomposition(number_of_equations, make_copy_A(), B.slice(), false, precision);

    let start = Date.now();
    document.getElementById("steps").innerHTML = "";
    var arr = crout_solver.solve();
    let timeTaken = Date.now() - start;

    if (crout_solver.nosol) {
        result_field.innerHTML += `<span>The given system has NO Solution</span>`
    }

    else if (crout_solver.infinitesol) {
        result_field.innerHTML += `<h2 style="color:#2fca4e;">The given system has infinitely many solutions</h2><br>`
        result_field.innerHTML += `<h2>And one of the solutions is:</h2><br>`
        result_field.innerHTML += `<span>[ </span>`
        for (let i = 0; i < number_of_equations; i++) {
            if (i != number_of_equations - 1)
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])}, </span>`
            else
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])} ]</span> <br>`
        }
    }

    else {
        result_field.innerHTML += `<h2>The solution of the given system is:</h2>`
        result_field.innerHTML += `<span>[ </span>`
        for (let i = 0; i < number_of_equations; i++) {
            if (i != number_of_equations - 1)
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])}, </span>`
            else
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])} ]</span> <br>`
        }
    }
    result_field.innerHTML += `<h2>Time taken by this algorithm is:<span>  ${timeTaken} ms<span></h2>`
}

function crout_without_scaling() {
    document.getElementById("method-name-heading").innerText = "LU Decomposition solver (Crout format without scaling)"
    crout_scaling(false);
}

function cholesky() {
    console.log("Hi cholesky")
    document.getElementById("solving-tech").innerHTML = "";
    document.getElementById("steps-taken-field").style.display = "none";
    document.getElementById("method-name-heading").innerText = "LU Decomposition solver (Cholesky format)"
    result_field.innerHTML = "";

    let chol = new Cholesky(number_of_equations, make_copy_A(), B.slice(), precision);
    let start = Date.now();
    document.getElementById("steps").innerHTML = "";
    let arr = chol.solve();
    console.log(arr);
    const timeTaken = Date.now() - start;
    if (chol.notsymm) {
        result_field.innerHTML += `<h2 style="color:#2fca4e;">The given system is not symmetric, hence Cholesky cannot be used</h2>`
        return;
    }
    else if (chol.notvalid) {
        result_field.innerHTML += `<h2 style="color:#2fca4e;">The given system is not Positive definite, hence Cholesky cannot be used</h2>`
        return;
    }
    else if (chol.nosol) {
        result_field.innerHTML += `<span>The given system has NO Solution</span>`
    }
    else if (chol.infinitesol) {
        result_field.innerHTML += `<h2 style="color:#2fca4e;">The given system has infinitely many solutions</h2><br>`
        result_field.innerHTML += `<h2>And one of the solutions is:</h2><br>`
        result_field.innerHTML += `<span>[ </span>`
        for (let i = 0; i < number_of_equations; i++) {
            if (i != number_of_equations - 1)
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])}, </span>`
            else
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])} ]</span> <br>`
        }
    }
    else {
        result_field.innerHTML += `<h2>The solution of the given system is:</h2>`
        result_field.innerHTML += `<span>[ </span>`
        for (let i = 0; i < number_of_equations; i++) {
            if (i != number_of_equations - 1)
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])}, </span>`
            else
                result_field.innerHTML += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])} ]</span> <br>`
        }
    }
    result_field.innerHTML += `<h2>Time taken by this algorithm is:<span>  ${timeTaken} ms<span></h2>`
}

// function cholesky_without_scaling(){
// console.log("Hi cholesky without scaling")
// result_field.innerHTML = "";
// }
//if the gauess seidel button has been pressed
function G_S() {
    final_answer_field.innerHTML = "";
    result_field.innerHTML = "";
    document.getElementById("steps").innerHTML = "";
    document.getElementById("steps-taken-field").style.display = "none";
    document.getElementById("method-name-heading").innerText = "Gauess seidel solver"
    let htmlstring = final_answer_field.innerHTML;
    htmlstring += `<h4>Enter the first guess:</h4>`
    htmlstring += `<br>`
    for (let i = 0; i < number_of_equations; i++) {
        htmlstring += `<span>X<sub>${i + 1}</sub> = </span>`;
        htmlstring += `<input id = "seidel-guess-${i + 1}"><br><br>`;
    }
    htmlstring += `<h4>Enter the number of iterations: <input id = "seidel-iterations"></h4>`
    htmlstring += `<h4>Enter the absolute relative error: <input id = "seidel-error"></h4>`
    htmlstring += `<button id = "solve-gs" class = "clickme" onclick = "solve_seidel()">Solve</button>`
    final_answer_field.innerHTML = htmlstring;
}

function solve_seidel() {
    var seidel_guess = [];
    var number_of_iterations;
    var absolute_relative_error;
    let wrong_value_entered;
    for (let i = 0; i < number_of_equations; i++) {
        let s = "";
        s += `seidel-guess-${i + 1}`;
        tmp = (Number(document.getElementById(s).value));
        if (isNaN(tmp)) wrong_value_entered = true;
        seidel_guess[i] = tmp;
    }
    number_of_iterations = Math.trunc((document.getElementById("seidel-iterations").value));
    absolute_relative_error = Number(document.getElementById("seidel-error").value);

    if (isNaN(number_of_iterations) || isNaN(absolute_relative_error) || number_of_iterations < 0 || absolute_relative_error < 0)
        wrong_value_entered = true;
    if (wrong_value_entered) {
        alert("Enter correct values, please");
        wrong_value_entered = false;
    }
    else {
        console.log("let's solve GS");
        document.getElementById("solve-gs").style.display = "none";
        console.log("Seidel guess is:" , seidel_guess);
        let iterative_solver = new Iterative_Methods(number_of_equations, A, B, seidel_guess, number_of_iterations, absolute_relative_error, precision);
        let start = Date.now();
        var arr = iterative_solver.gauss_siedel_method();
        let timetaken = Date.now() - start;
        console.log("time taken = " + timetaken);
        let htmlstring = result_field.innerHTML;
        if (iterative_solver.div_by_0_flag) {
            result_field.innerHTML = `<span>Can not be solved using Gauess seidel</span>`
            document.getElementById("steps-taken-field").style.display = "none";
            return
                ;
        }
        htmlstring += `<h2>The solution of the given system is:</h2>`
        // let htmlstring = final_answer_field.innerHTML;
        htmlstring += `<span>[ </span>`
        for (let i = 0; i < number_of_equations; i++) {
            if (i != number_of_equations - 1)
                htmlstring += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])}, </span>`
            else
                htmlstring += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])} ]</span> <br>`
        }
        htmlstring += `<h2>Time taken by this algorithm is:<span>  ${timetaken} ms</span></h2><br>`
        if(iterative_solver.divflag) htmlstring += `<span>System doesn't converge</span>`
        result_field.innerHTML = htmlstring;
    }
}
//end gauess seidel 



//if jacobi iterations has been pressed
function J_I() {
    final_answer_field.innerHTML = "";
    result_field.innerHTML = "";
    document.getElementById("steps").innerHTML = "";
    document.getElementById("steps-taken-field").style.display = "none";
    document.getElementById("method-name-heading").innerText = "Jacobi-Iteration solver"
    let htmlstring = final_answer_field.innerHTML;
    htmlstring += `<h4>Enter the first guess:</h4>`
    htmlstring += `<br>`
    for (let i = 0; i < number_of_equations; i++) {
        htmlstring += `<span>X<sub>${i + 1}</sub> = </span>`;
        htmlstring += `<input id = "jacobi-guess-${i + 1}"><br><br>`;
    }
    htmlstring += `<h4>Enter the number of iterations: <input id = "jacobi-iterations"></h4>`
    htmlstring += `<h4>Enter the absolute relative error: <input id = "jacobi-error"></h4>`
    htmlstring += `<button id = "solve-gs" class = "clickme" onclick = "solve_jacobi()">Solve</button>`
    final_answer_field.innerHTML = htmlstring;
}

function solve_jacobi() {
    var jacobi_guess = [];
    var number_of_iterations;
    var absolute_relative_error;
    let wrong_value_entered;
    for (let i = 0; i < number_of_equations; i++) {
        let s = "";
        s += `jacobi-guess-${i + 1}`;
        tmp = (Number(document.getElementById(s).value));
        if (isNaN(tmp)) wrong_value_entered = true;
        jacobi_guess[i] = tmp;
    }
    number_of_iterations = Math.trunc((document.getElementById("jacobi-iterations").value));
    absolute_relative_error = Number(document.getElementById("jacobi-error").value);

    if (isNaN(number_of_iterations) || isNaN(absolute_relative_error) || number_of_iterations < 0 || absolute_relative_error < 0)
        wrong_value_entered = true;
    if (wrong_value_entered) {
        alert("Enter correct values, please");
        wrong_value_entered = false;
    }
    else {
        console.log("let's solve JI");
        document.getElementById("solve-gs").style.display = "none";
        let iterative_solver = new Iterative_Methods(number_of_equations, A, B, jacobi_guess, number_of_iterations, absolute_relative_error, precision);
        let start = Date.now();
        var arr = iterative_solver.Jacobi_method();
        let timetaken = Date.now() - start;
        console.log("time taken = " + timetaken);
        let htmlstring = result_field.innerHTML;
        if (iterative_solver.div_by_0_flag) {
            result_field.innerHTML = `<span>Can not be solved using Jacobi iteration</span>`
            document.getElementById("steps-taken-field").style.display = "none";
            return
                ;
        }
        htmlstring += `<h2>The solution of the given system is:</h2>`
        // let htmlstring = final_answer_field.innerHTML;
        htmlstring += `<span>[ </span>`
        for (let i = 0; i < number_of_equations; i++) {
            if (i != number_of_equations - 1)
                htmlstring += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])}, </span>`
            else
                htmlstring += `<span>X<sub>${i + 1}</sub> = ${Number(arr[i])} ]</span> <br>`
        }
        htmlstring += `<h2>Time taken by this algorithm is:<span>  ${timetaken} ms</span></h2>`
        if(iterative_solver.divflag) htmlstring += `<span>System doesn't converge</span>`
        result_field.innerHTML = htmlstring;
    }
}

function make_copy_A() {
    var tmp = [];
    for (let i = 0; i < number_of_equations; i++) {
        tmp[i] = A[i].slice();
    }
    return tmp;
}

//end of jacobi iteration