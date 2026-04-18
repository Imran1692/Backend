class ApiError extends errpr {
    constructor(
        statusCode,
        massage="something went wrong",
        errors=[],
        statck=""
    ){
        super(massage)
        this.statusCode = statusCode
        this.data = null
        this.massage =massage
        this.success = false;
        this.errors = errors

        if(statck){
            this.stack = this.stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}