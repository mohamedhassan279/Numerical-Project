class secant {
  precision;  // number of significant figures
  fun = "";   // the function f(x)
  xi0;       // xi-1
  xi;        // xi
  xi2;       //xi+1
  iteration; //number of iterations
  ea;        //the relative error (xi+1 - xi)
  epsilon;   //the tolerance to stop
  div_by_zero_flag;
  deriv1;
  constructor(f, xi0, xi, iteration = 50, ep = 0.00001, precision = 5) {
    this.fun = f;
    this.xi0 = xi0;
    this.xi = xi;
    this.deriv1 = math.derivative(f.replaceAll('**', '^'), 'X');
    this.iteration = iteration;
    this.epsilon = ep;
    this.precision = precision;
    this.div_by_zero_flag = false;
  }
  function(x2) {
    return eval(this.fun.replaceAll('X', 'x2'));
  }
  secant(xi0, xi) {
    let sol;
    if(isNaN(this.function(xi0)) || !isFinite(this.function(xi0))) {
      this.div_by_zero_flag = true;
      return null;
    }
    if(isNaN(this.function(xi)) || !isFinite(this.function(xi))) {
      this.div_by_zero_flag = true;
      return null;
    }
    if (this.function(xi0) == this.function(xi)) {
      this.div_by_zero_flag = true;
      console.log("secant can't solve change xi-1 , xi");
      return null;
    }
    else {
      sol = xi - (this.function(xi) * (xi0 - xi) / (this.function(xi0) - this.function(xi)));
      return sol;
    }
  }
  solve() {
    while (this.iteration) {
      this.xi2 = (this.secant(this.xi0, this.xi));
      if (this.xi2 == null)
        break;
      else {
        this.xi2 = Number(this.xi2.toPrecision(this.precision));
        console.log("xi-1 = ", this.xi0, "xi = ", this.xi, "xi+1 = ", this.xi2);
        this.ea = Math.abs(this.xi2 - this.xi);
        console.log("ea", this.ea);
        if ((this.ea < this.epsilon))
          break;
        this.xi0 = this.xi;
        this.xi = this.xi2;
        this.iteration--;
      }
    }
    return this.xi2;
  }

}


// f="(x+1)**2";
// var tmp = new secant(f,0.1,-2,100,0.00001);
//  var x2 = tmp.solve();
