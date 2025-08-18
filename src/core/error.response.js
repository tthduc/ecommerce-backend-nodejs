'use strict';

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409,
    BAD_REQUEST: 400
}

const ReasonStatusCode = {
    FORBIDDEN: 'Forbidden',
    CONFLICT: 'Conflict',
    BAD_REQUEST: 'Bad Request'
}

/**
 * Custom error response class
 * Call super(message) to set the error message and status code
 * this.status = status means setting the HTTP status code for the error response, because Error does not have a status code by default
 */
class ErrorResponse extends Error{
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ConflicRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.BAD_REQUEST, statusCode = StatusCode.BAD_REQUEST) {
        super(message, statusCode);
    }
}

module.exports = {
    ConflicRequestError,
    BadRequestError
};
