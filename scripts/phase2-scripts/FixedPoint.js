//const math = require('mathjs');

class FixedPoint
{
    Gfun = "";            // the function f(x)
    f;                   // evaluation of f(x)
    guess;               //initial guess
    divflag;            //flag to trace convergence rate
    iter;               //no. of iterations
    es;                 //tolerance relative error percentage
    precision;          //no. of signficant figures
    divby0;             //division by 0 detector
    constructor(Gfun,guess,iter,es,precision)
    {
        
        this.Gfun=Gfun;
        if(guess)
        {
            this.guess=guess;
        }
        else this.guess = 0;//default_guess();

        this.iter=iter;
        this.es=es;

        if(precision == 0) this.precision=16;//system default
        else this.precision=precision;

        if(iter==0&&es!=0) {this.iter=50;}//max iterations
        else if(iter!=0&&es==0) {this.iter=iter;es=0.00001;}//least tolerance error
        else if(iter!=0&&es!=0){this.iter=iter;this.es=es;}
        else {this.iter=50;this.es=0.00001;}
    }
    
   /* Check_Conv(Gfun,root)
    {
        this.derv1 = math.derivative(Gfun.replaceAll('X','root'), 'root');
        let x =this.derv1.evaluate({X: root});
        if(Math.abs(x)<1) return true;
        return false;
        
    }*/

    Fixed_Point()
    {
        this.divby0=false;//initially false
        this.divflag=false;//initially false
        var root=this.guess;//the Xi+1 (root) of the equation initialized by 0
        let func=this.Gfun.replaceAll('X', 'root');// the g(x) function
        this.f=root - eval(func);//evaluate the function at root i.e. get f(root).
        if(Math.abs(this.f) == Infinity) {console.log("Errorr!!!! Division by zero");this.divby0=true;return;}//return if the denominator is zero 
        if(Math.abs(this.f)==0) return root;//to check if g(x)=x, then stop x is the root.
        var oldroot;//the Xi
        var iter=0;//counter to trace no. of iterations
        var err=0;//variable to trace the error
        var olderr;//temp variable to help us knowing whether the function diverges
        do
        {
            oldroot=Number(root).toPrecision(this.precision);//Xi=Xi+1 each iteraion
            this.f = eval(func.replaceAll('root', 'oldroot'));//get g(x) function
            if(Math.abs(this.f) == Infinity && !this.divflag) {console.log("Errorr!!!! Division by zero");this.divby0=true;return;}//return if the denominator is zero
            root=Number(this.f).toPrecision(this.precision);//evaluate Xi+1=g(Xi);
            if(root!=0)
            {
                olderr=err;//the previous error=err;
                err=(Math.abs((root-oldroot)/root));//get the new relative error
                if(err>=olderr) this.divflag=true;//set divflag by true if (the current error > previous one)
                else this.divflag=false;//set it false if (the current error <= previous one)
            }
            iter++;//increment the iteration counter
            console.log("Iteration ",iter,":  ","X",iter,"= ",root,",,,  er= ",err,",,,  G(X",(iter+1),")= ",eval(func));
        }
        while(iter<this.iter&&err>this.es);//stop if no. of iterations>max no. of iterations or we reached to the tolerance error given otherwise continue
        if(this.divflag) console.log("The method diverges!!!");//at the end of the algorithm, if divflag is true then the method definetly diverges
        return root;//get the root
    }
}
//g='3/X';
//let obj=new FixedPoint(g,0,50,0,5);
//console.log(0.999999986544444444444444444444444444444444444444444444444444444.toPrecision());
//console.log("ans",obj.Fixed_Point());