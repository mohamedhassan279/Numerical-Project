f = "x**4-2*x**3-4*x**2+4*x+4";
var tmp = new Bisection(f, -2, -1, 1e-3, 10, 5);
console.log(tmp.solve());
