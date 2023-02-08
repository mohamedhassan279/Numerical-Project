class falsePosition {
    f = "";                 // the function f(x)
    xl; xu; xr;
    ea;                     // approx. error
    es;                     // tolerance to stop
    imax;                   // max. # of iterations
    noFalsi = false;      // indicates false position method can't be used
    div_by_zero_flag;
    constructor(f, xl, xu, es, imax, precision) {
        this.f = f;
        this.xl = xl;
        this.xu = xu;
        this.div_by_zero_flag = false;
        this.es = es;
        this.imax = imax;
        this.precision = precision;
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
        // first check false position possibility
        if (eval(this.f.replaceAll('X', 'this.xl')) * eval(this.f.replaceAll('X', 'this.xu')) > 0) {
            this.noFalsi = true;
            return;
        }
        for (let i = 1; i <= this.imax; i++) {
            let xrold = this.xr;
            let fu = eval(this.f.replaceAll('X', 'this.xu'));       //f(xu)
            let fl = eval(this.f.replaceAll('X', 'this.xl'));       //f(xl)
            if(isNaN(fu) || !isFinite(fu)) {
                this.div_by_zero_flag = true;
                break;
            }
            if(isNaN(fl) || !isFinite(fl)) {
                this.div_by_zero_flag = true;
                break;
            }
            if (fu == fl) {
                this.div_by_zero_flag = true;
                break;
            }
            //calculate xr using false position method
            this.xr = Number((((this.xl * fu) - (this.xu * fl)) / (fu - fl)).toPrecision(this.precision));
            //check which need to move xl or xu
            var test = Number((eval(this.f.replaceAll('X', 'this.xl')) * eval(this.f.replaceAll('X', 'this.xr'))).toPrecision(this.precision));
            if (test < 0)
                this.xu = this.xr;
            else
                this.xl = this.xr;
            //check if test reached f(x) = 0
            if (test == 0) {
                this.ea = 0;
                return this.xr;
            }
            //check if curr error smaller than tolerance error
            if (i > 1) {
                //calculate curr aboslte approx. error
                this.ea = Math.abs(this.xr - xrold);
                if (this.ea < this.es)
                    return this.xr;
            }
        }
        return this.xr;
    }
}

// f = "3*x**4+6.1*x**3-2*x**2+3*x+2";
// var tmp = new falsePosition(f, -1, -3, 0.01, 50, 20);
// console.log(tmp.solve());