'use strict'

const StatusCode ={
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
}

const ReasonStatusCode = {
    OK: 'OK',
    CREATED: 'Created',
    NO_CONTENT: 'No Content',
}

class SuccessResponse{
    constructor(message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {}){
        this.message = !message ? reasonStatusCode : message;
        this.statusCode = statusCode;
        this.reasonStatusCode = reasonStatusCode;
        this.metadata = metadata;
    }

    send(res, headers = {}){
        res.status(this.statusCode).json({
            status: ReasonStatusCode.OK,
            statusCode: this.statusCode,
            message: this.message,
            metadata: this.metadata,
        })
    }
}

class OK extends SuccessResponse{
    constructor(message, metadata){
        super(message, StatusCode.OK, ReasonStatusCode.OK, metadata);
    }
}

class Created extends SuccessResponse{
    constructor(message, metadata){
        super(message, StatusCode.CREATED, ReasonStatusCode.CREATED, metadata);
    }
}

class NoContent extends SuccessResponse{
    constructor(message, metadata){
        super(message, StatusCode.NO_CONTENT, ReasonStatusCode.NO_CONTENT, metadata);
    }
}

module.exports = {
    OK,
    Created,
    NoContent,
}