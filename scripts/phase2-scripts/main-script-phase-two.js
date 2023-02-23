

let function_input = document.getElementById('function-area');
let select_method_field = document.getElementById('select-method');
let final_answer = document.getElementById('final-answer');
let result = document.getElementById("result");
let function_for_plot = "";
// import functionPlot from 'function-plot'
let function_for_evaluate;
let pre;
let tol;

document.getElementById('submit-function').onclick = function () {
    console.log(function_input.value);
    function_for_evaluate = function_handler();
    console.log(function_for_evaluate);
    pre = Math.trunc(Number(document.getElementById("precision-input").value));
    tol = Number(document.getElementById("tolerance-input").value);
    if (isNaN(pre) || isNaN(tol) || pre < 0 || tol < 0) {
        alert("Enter positive numeric values, please");
    }
    else {
        if (pre == 0) pre = 20;
        if (tol == 0) tol = 0.00001;
        console.log("precison: ", pre);
        console.log("tol: ", tol);
        select_method_field.style.display = "block";
        function_for_plot = construct_function_to_plot(function_input.value);
        console.log("plot: ", function_for_plot);
        var parameters = {
            title: 'Function graph plot',
            target: '#myFunction',
            data: [{
                fn: function_for_plot,
                graphType: "polyline",
                color: 'black',
            },
            ],
            grid: true,
            yAxis: { domain: [-10, 10] },
            xAxis: { domain: [-10, 10] }
        };
        functionPlot(parameters);
    }
}

function bisection() {
    final_answer.innerHTML = "";
    result.innerHTML = "";
    document.getElementById("steps-taken").innerHTML = "";
    document.getElementById("steps-taken-parent").style.display = "none";
    document.getElementById("method-name-header").innerText = "Bisection solver"
    document.getElementById("specific-plot").style.display = "none";
    document.getElementById("specific-method-plot").innerHTML = "";
    final_answer.innerHTML += `<h4>X<sub>L</sub> = <input id = "xl_bisection"></h4>`
    final_answer.innerHTML += `<h4 style = "margin-top:20px;">X<sub>U</sub> = <input id = "xu_bisection"></h4>`
    final_answer.innerHTML += `<h4 style = "margin-top:20px;">Max iterations = <input id = "iterations-bisection"></h4>`
    final_answer.innerHTML += `<button onclick = "solve_bisection()" class="clickme" id = "solve-bisection">Solve</button>`
}

function solve_bisection() {
    document.getElementById('solve-bisection').style.display = "none";
    let xl = Number(document.getElementById("xl_bisection").value);
    let xu = Number(document.getElementById("xu_bisection").value);
    document.getElementById("specific-plot").style.display = "block";
    var parameters = {
        title: 'bracketed plot',
        target: '#specific-method-plot',
        data: [{
            fn: function_for_plot,
            graphType: "polyline",
            color: 'black',
        },
        ],
        grid: true,
        yAxis: { domain: [-10, 10] },
        xAxis: { domain: [xl, xu] }
    };
    functionPlot(parameters);

    let it = Number(document.getElementById("iterations-bisection").value);
    if (it == 0) it = 50;
    console.log("xl = ", xl);
    console.log("xu = ", xu);
    console.log("it = ", it);
    let bisection_solver = new Bisection(function_for_evaluate, xl, xu, tol, it, pre);
    let start = Date.now();
    let xr = bisection_solver.solve();
    let time_taken = Date.now() - start;
    if (bisection_solver.nobracket) {
        result.innerHTML += `<span>Bracketing not possible</span>`
        return;
    }
    if (bisection_solver.div_by_zero_flag) {
        result.innerHTML += `<span>Division by zero occured here so the iterations have been forced to stop!</span>`
        if(xr == undefined)return;
    }
    result.innerHTML += `<h2>Root =  <span>${xr}<span></h2>`
    result.innerHTML += `<h2>Time taken = <span>${time_taken} ms<span></h2>`
}

function false_position() {
    final_answer.innerHTML = "";
    result.innerHTML = "";
    document.getElementById("steps-taken").innerHTML = "";
    document.getElementById("steps-taken-parent").style.display = "none";
    document.getElementById("method-name-header").innerText = "False position solver"
    document.getElementById("specific-plot").style.display = "none";
    document.getElementById("specific-method-plot").innerHTML = "";
    final_answer.innerHTML += `<h4>X<sub>L</sub> = <input id = "xl_false_position"></h4>`
    final_answer.innerHTML += `<h4 style = "margin-top:20px;">X<sub>U</sub> = <input id = "xu_false_position"></h4>`
    final_answer.innerHTML += `<h4 style = "margin-top:20px;">Max iterations = <input id = "iterations-false-position"></h4>`
    final_answer.innerHTML += `<button onclick = "solve_false_position()" class="clickme" id = "solve-false-position">Solve</button>`
}

function solve_false_position() {
    document.getElementById('solve-false-position').style.display = "none";
    let xl = Number(document.getElementById("xl_false_position").value);
    let xu = Number(document.getElementById("xu_false_position").value);
    document.getElementById("specific-plot").style.display = "block";

    var parameters = {
        title: 'bracketed plot',
        target: '#specific-method-plot',
        data: [{
            fn: function_for_plot,
            graphType: "polyline",
            color: 'black',
        },
        ],
        grid: true,
        yAxis: { domain: [-10, 10] },
        xAxis: { domain: [xl, xu] }
    };
    functionPlot(parameters);

    let it = Number(document.getElementById("iterations-false-position").value);
    if (it == 0) it = 50;
    console.log("xl = ", xl);
    console.log("xu = ", xu);
    console.log("it = ", it);
    let false_position_solver = new falsePosition(function_for_evaluate, xl, xu, tol, it, pre);
    let start = Date.now();
    let xr = false_position_solver.solve();
    console.log("false xr = ", xr);
    let time_taken = Date.now() - start;
    console.log("No bracket is: ", false_position_solver.nobracket)
    if (false_position_solver.noFalsi) {
        result.innerHTML += `<span>Bracketing not possible</span>`
        return;
    }
    if (false_position_solver.div_by_zero_flag) {
        result.innerHTML += `<span>Division by zero occured here so the iterations have been forced to stop!</span>`
        if(xr == undefined)return;
    }
    result.innerHTML += `<h2>Root =  <span>${xr}<span></h2>`
    result.innerHTML += `<h2>Time taken = <span>${time_taken} ms<span></h2>`
}

function fixed_point() {
    final_answer.innerHTML = "";
    result.innerHTML = "";
    document.getElementById("steps-taken").innerHTML = "";
    document.getElementById("steps-taken-parent").style.display = "none";
    document.getElementById("method-name-header").innerText = "Fixed point solver"
    document.getElementById("specific-plot").style.display = "none";
    document.getElementById("specific-method-plot").innerHTML = "";
    final_answer.innerHTML += `<h4>Initial guess = <input id = "initial-guess-fixed-point"></h4>`
    final_answer.innerHTML += `<h4 style = "margin-top:20px;">Max iterations = <input id = "iterations-fixed-point"></h4>`
    final_answer.innerHTML += `<button onclick = "solve_fixed_point()" class="clickme" id = "solve-fixed-point">Solve</button>`
}

function solve_fixed_point() {
    document.getElementById("solve-fixed-point").style.display = "none";
    console.log("hi from solve fixedpoint");
    let first_guess = Number(document.getElementById("initial-guess-fixed-point").value);
    document.getElementById("specific-plot").style.display = "block";

    var parameters = {
        title: 'G(X) intersection with Y = X',
        target: '#specific-method-plot',
        data: [{
            fn: function_for_plot,
            graphType: "polyline",
            color: 'black',
        }, {
            fn: 'x',
            graphType: "polyline",
            color: 'red',
        }
        ],
        grid: true,
        yAxis: { domain: [-10, 10] },
        xAxis: { domain: [-10, 10] }
    };
    functionPlot(parameters);

    let iterations_fixed_point = Number(document.getElementById("iterations-fixed-point").value);
    if (iterations_fixed_point == 0) iterations_fixed_point = 50;
    console.log("iterations fixed" + iterations_fixed_point);
    console.log("first guess fixed" + first_guess);
    let fixed_point_solver = new FixedPoint(function_for_evaluate, first_guess, iterations_fixed_point, tol, pre);
    let start = Date.now();
    let root = fixed_point_solver.Fixed_Point();
    console.log("false root = ", root);
    let time_taken = Date.now() - start;

    if (fixed_point_solver.divby0) {
        result.innerHTML += `<span>Error can not divide by zero!</span>`
        if(root == undefined)
            return;
    }

    result.innerHTML += `<h2>Root =  <span>${root}<span></h2>`
    result.innerHTML += `<h2>Time taken = <span>${time_taken} ms<span></h2>`
    if (fixed_point_solver.divflag) {
        result.innerHTML += `<span>Method diverges</span>`
    }
}

function newton() {
    final_answer.innerHTML = "";
    result.innerHTML = "";
    document.getElementById("steps-taken").innerHTML = "";
    document.getElementById("steps-taken-parent").style.display = "none";
    document.getElementById("method-name-header").innerText = "Newton Raphson solver"
    document.getElementById("specific-plot").style.display = "none";
    document.getElementById("specific-method-plot").innerHTML = "";
    final_answer.innerHTML += `<h4>X<sub>i</sub> = <input id = "xi_newton"></h4>`
    final_answer.innerHTML += `<h4 style = "margin-top:20px;">Max iterations = <input id = "iterations-newton"></h4>`
    final_answer.innerHTML += `<button onclick = "solve_newton()" class="clickme" id = "solve-newton">Solve</button>`
}

function solve_newton() {
    document.getElementById('solve-newton').style.display = "none";
    let xi = Number(document.getElementById("xi_newton").value);
    let it = Number(document.getElementById("iterations-newton").value);
    if (it == 0) it = 50;
    console.log("xi = ", xi);
    console.log("it = ", it);
    let newton_solver = new NewtonRaphson(function_for_evaluate, xi, tol, it, pre);
    let start = Date.now();
    let xr = newton_solver.solve();
    let time_taken = Date.now() - start;
    let derivative_to_plot = construct_function_to_plot(newton_solver.derv1.toString());
    document.getElementById("specific-plot").style.display = "block";

    var parameters = {
        title: 'The first derivate plot',
        target: '#specific-method-plot',
        data: [{
            fn: derivative_to_plot,
            graphType: "polyline",
            color: 'black',
        },
        ],
        grid: true,
        yAxis: { domain: [-10, 10] },
        xAxis: { domain: [-10, 10] }
    };
    functionPlot(parameters);

    console.log("The derivative should be here")
    console.log("the first derivative is: ", derivative_to_plot);
    if (newton_solver.div_by_zero_flag) {
        result.innerHTML += `<span>Division by zero occured here so the iterations have been forced to stop!</span>`
        if(xr == undefined)return;
    }
    result.innerHTML += `<h2>Root =  <span>${xr}<span></h2>`
    result.innerHTML += `<h2>Time taken = <span>${time_taken} ms<span></h2>`
}


function secant_method() {
    final_answer.innerHTML = "";
    result.innerHTML = "";
    document.getElementById("steps-taken").innerHTML = "";
    document.getElementById("steps-taken-parent").style.display = "none";
    document.getElementById("method-name-header").innerText = "Secant solver"
    document.getElementById("specific-plot").style.display = "none";
    document.getElementById("specific-method-plot").innerHTML = "";
    final_answer.innerHTML += `<h4>X<sub>i-1</sub> = <input id = "xi-1-secant"></h4>`
    final_answer.innerHTML += `<h4 style = "margin-top:20px;">X<sub>i</sub> = <input id = "xi_secant"></h4>`
    final_answer.innerHTML += `<h4 style = "margin-top:20px;">Max iterations = <input id = "iterations-secant"></h4>`
    final_answer.innerHTML += `<button onclick = "solve_secant()" class="clickme" id = "solve-secant">Solve</button>`
}

function solve_secant() {
    document.getElementById('solve-secant').style.display = "none";
    let xi_1 = Number(document.getElementById("xi-1-secant").value);
    let xi = Number(document.getElementById("xi_secant").value);
    let it = Number(document.getElementById("iterations-secant").value);
    if (it == 0) it = 50;
    console.log("xi-1 = ", xi_1);
    console.log("xi = ", xi);
    console.log("it = ", it);
    let secant_solver = new secant(function_for_evaluate, xi_1, xi, it, tol, pre);
    let start = Date.now();
    let xr = secant_solver.solve();
    console.log("the root of secant is : ", xr);
    let time_taken = Date.now() - start;

    console.log("secant derivative is: ", construct_function_to_plot(secant_solver.deriv1.toString()));
    let derivative_to_plot = construct_function_to_plot(secant_solver.deriv1.toString());
    document.getElementById("specific-plot").style.display = "block";
    var parameters = {
        title: 'The first derivate plot',
        target: '#specific-method-plot',
        data: [{
            fn: derivative_to_plot,
            graphType: "polyline",
            color: 'black',
        },
        ],
        grid: true,
        yAxis: { domain: [-10, 10] },
        xAxis: { domain: [-10, 10] }
    };
    functionPlot(parameters);


    if (secant_solver.div_by_zero_flag) {
        result.innerHTML += `<span>Error can not divide by zero!</span>`
        if(xr == undefined)return;
    }
    else {
        result.innerHTML += `<h2>Root =  <span>${xr}<span></h2>`
        result.innerHTML += `<h2>Time taken = <span>${time_taken} ms<span></h2>`
    }

}

function function_handler() {
    let s = "";
    s += function_input.value;
    s = s.replaceAll("x", "X");
    let isSin = s.indexOf("sin");
    let isCos = s.indexOf("cos");
    let isExp = s.indexOf("e**(");
    console.log(isExp);
    if (isSin != -1) {
        s = s.replaceAll("sin(", "Math.sin(");
    }
    if (isCos != -1) {
        s = s.replaceAll("cos(", "Math.cos(");
    }
    if (isExp != -1) {
        s = s.replaceAll("e**(", "Math.exp(");
    }
    console.log(s);
    return s;
}

function construct_function_to_plot(fn) {
    tmp = fn;
    tmp = tmp.replaceAll("**", "^");
    tmp = tmp.replaceAll("X", "x");
    tmp = tmp.replaceAll("e^(", "exp(");
    tmp = tmp.replaceAll(" ", "");
    return tmp;
}