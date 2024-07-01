class ResponseHandler {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    sender(code, message, data, error) {
        const isErrorStatusCode =
            String(code)?.length === 3 &&
            !["1", "2", "3"].includes(String(code).charAt(0))

        if (error) {
            if (error.code === "LIMIT_FILE_SIZE")
                return this.res
                    .status(STATUS_CODES.NOT_ALLOWED)
                    .json({
                        message: error.message
                    })
        }

        this.res
            .status(code)
            .json({
                message,
                data
            })
    }

    /* 
        ARGUMENTS : Status code, message, data object,  error object
    */
    custom(...args) { this.sender(...args) }

    /* 
        ARGUMENTS : data o̥̥bject, message, error object
    */

    // 2XX SUCCESS
    success(message, data) {
        this.sender(
            STATUS_CODES.SUCCESS,
            message || 'status_success',
            data
        )
    }

    created(message, data) {
        this.sender(
            STATUS_CODES.CREATED,
            message || 'status_created',
            data
        )
    }

    // 4XX CLIENT ERROR
    badRequest(message, data, error) {
        this.sender(
            STATUS_CODES.BAD_REQUEST,
            message || 'status_bad_request',
            data,
            error,
        )
    }

    unauthorized(message, data, error) {
        this.sender(
            STATUS_CODES.UNAUTHORIZED,
            message || 'status_unauthorized',
            data,
            error,
        )
    }

    forbidden(message, data, error) {
        this.sender(
            STATUS_CODES.FORBIDDEN,
            message || 'status_forbidden',
            data,
            error,
        )
    }

    notFound(message, data, error) {
        this.sender(
            STATUS_CODES.NOT_FOUND,
            message || 'status_not_found',
            data,
            error,
        )
    }

    conflict(message, data, error) {
        this.sender(
            STATUS_CODES.CONFLICT,
            message || 'status_conflict',
            data,
            error,
        )
    }

    preconditionFailed(message, data, error) {
        this.sender(
            STATUS_CODES.PRECONDITION_FAILED,
            message || 'status_precondition_failed',
            data,
            error,
        )
    }

    validationError(message, error) {
        this.sender(
            STATUS_CODES.VALIDATION_ERROR,
            message || 'status_validation_error',
            undefined,
            error
        )
    }

    // 5XX SERVER ERROR
    serverError(error, data) {
        this.sender(
            STATUS_CODES.SERVER_ERROR,
            'status_server_error',
            data,
            error,
        )
    }

    notAllowed(message, error) {
        this.sender(
            STATUS_CODES.NOT_ALLOWED,
            message || 'status_not_allowed',
            undefined,
            error
        )
    }

    serviceUnavailable(message, error) {
        this.sender(
            STATUS_CODES.SERVICE_UNAVAILABLE,
            message || 'status_service_unavailable',
            undefined,
            error
        )
    }
}

module.exports = ResponseHandler;

