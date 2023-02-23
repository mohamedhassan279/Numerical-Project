class NewtonRaphson {
    fun = "";            // the function f(x)
    f;                   // evaluation of f(x)
    derv1;               // first derivative
    df;                  // evaluation of first derivative 
    derv2;               // second derivative
    ddf;                 // evaluation of second derivative 
    x1;                  // initial guess
    x2;                  // the answer
    ea;                  // absolute approx. error
    es;                  // tolerance to stop
    imax;                // max. # of iterations
    div_by_zero_flag
    constructor(fun, x1, es, imax, precision) {
        this.fun = fun;
        this.derv1 = math.derivative(fun.replaceAll('**', '^'), 'X');
        this.derv2 = math.derivative(this.derv1, 'X');
        this.x1 = x1;
        this.es = es;
        this.imax = imax;
        this.precision = precision;
        this.div_by_zero_flag = false;
    }

    solve() {
        this.f = eval(this.fun.replaceAll('X', 'this.x1'));
        if(isNaN(this.f) || !isFinite(this.f)) {
            this.div_by_zero_flag = true;
            return this.x2;
        }
        this.df = this.derv1.evaluate({ X: this.x1 });
        if(isNaN(this.df) || !isFinite(this.df)) {
            this.div_by_zero_flag = true;
            return this.x2;
        }
        this.ddf = this.derv2.evaluate({ X: this.x1 });
        if(isNaN(this.ddf) || !isFinite(this.ddf)) {
            this.div_by_zero_flag = true;
            return this.x2;
        }
        this.x2 = this.x1;

        for (var i = 2; i <= this.imax; i++) {
            console.log(this.x2, this.f, this.df, this.ddf);
            if (Math.pow(this.df, 2) - this.f * this.ddf == 0){
                this.div_by_zero_flag = true;
                break;
            }
            this.x2 = Number((this.x1 - (this.f * this.df) / (Math.pow(this.df, 2) - this.f * this.ddf)).toPrecision(this.precision));
            this.f = eval(this.fun.replaceAll('X', 'this.x2'));
            if(isNaN(this.f) || !isFinite(this.f)) {
                this.div_by_zero_flag = true;
                return this.x2;
            }
            this.df = this.derv1.evaluate({ X: this.x2 });
            if(isNaN(this.df) || !isFinite(this.df)) {
                this.div_by_zero_flag = true;
                return this.x2;
            }
            this.ddf = this.derv2.evaluate({ X: this.x2 });
            if(isNaN(this.ddf) || !isFinite(this.ddf)) {
                this.div_by_zero_flag = true;
                return this.x2;
            }
            this.ea = Math.abs(this.x2 - this.x1);
            if (this.ea < this.es) {
                return this.x2;
            }
            this.x1 = this.x2;
        }
        return this.x2;
    }
}

// f = "x**5-11*x**4+46*x**3-90*x**2+81*x-27";
// let tmp = new NewtonRaphson(f, 0, 1e-3, 100, 5);
// console.log("ans", tmp.solve());