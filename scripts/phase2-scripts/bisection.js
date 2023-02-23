class Bisection {
    f = "";                 // the function f(x)
    xl; xu; xr; 
    ea;                     // absolute approx. error
    es;                     // tolerance to stop
    imax;                   // max. # of iterations
    nobracket = false;      // indicates no bracket
    div_by_zero_flag
    constructor(f, xl, xu, es, imax, precision) {
        this.f = f;
        this.xl = xl;
        this.xu = xu;
        this.es = es;
        this.imax = imax;
        this.precision = precision;
        this.  div_by_zero_flag = false;
    }

    solve() {
        if(isNaN(eval(this.f.replaceAll('X', 'this.xl'))) || !isFinite(eval(this.f.replaceAll('X', 'this.xl')))){
            this.div_by_zero_flag = true;
            return;
        }
        if(isNaN(eval(this.f.replaceAll('X', 'this.xu'))) || !isFinite(eval(this.f.replaceAll('X', 'this.xu')))){
            this.div_by_zero_flag = true;
            return;
        }
        // first check bracketing
        if(eval(this.f.replaceAll('X', 'this.xl')) * eval(this.f.replaceAll('X', 'this.xu')) > 0) {
            this.nobracket = true;
            return;
        }
        for (let i = 1; i <= this.imax; i++) {
            let xrold = this.xr;
            this.xr = Number(((this.xu + this.xl)/2).toPrecision(this.precision));
            if(isNaN(eval(this.f.replaceAll('X', 'this.xl'))) || !isFinite(eval(this.f.replaceAll('X', 'this.xl')))){
                this.div_by_zero_flag = true;
                return this.xr;
            }
            if(isNaN(eval(this.f.replaceAll('X', 'this.xr'))) || !isFinite(eval(this.f.replaceAll('X', 'this.xr')))){
                this.div_by_zero_flag = true;
                return this.xr;
            }
            var test = eval(this.f.replaceAll('X', 'this.xl')) * eval(this.f.replaceAll('X', 'this.xr'));
            if (test < 0)
                this.xu = this.xr;
            else
                this.xl = this.xr;
            if (test == 0){
                this.ea = 0;
                return this.xr;
            }
            if (i > 1) {
                this.ea = Math.abs(this.xr - xrold);
                if(this.ea < this.es)
                    return this.xr;
            } 
        }
        return this.xr;
    }
}

// f = "x4-2*x3-4x**2+4x+4";
// var tmp = new Bisection(f, -2, -1, 1e-3, 10, 5);
// console.log(tmp.solve());