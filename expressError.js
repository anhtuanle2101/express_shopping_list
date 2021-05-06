class ExpressError extends Erorr{
    consturctor(msg, status){
        super();
        this.msg = msg;
        this.status = status;
        console.error(this.msg);
        console.error(this.stack);
    }
}

module.exports = ExpressError;