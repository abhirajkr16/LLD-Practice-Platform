function errorMiddleware(error, req, res, next) {
    console.error(error);

    if (error.code === "NOT_FOUND") {
        return res.status(404).json({
            error: {
                code: error.code,
                message: error.message
            }
        });
    }

    if (
        error.code === "INVALID_REQUEST" ||
        error.code === "INVALID_PROBLEM_ID" ||
        error.code === "INVALID_ATTEMPT_ID" ||
        error.code === "INVALID_PREDECESSOR_ATTEMPT"
    ) {
        return res.status(422).json({
            error: {
                code: error.code,
                message: error.message
            }
        });
    }

    return res.status(500).json({
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred."
        }
    });
}

module.exports = errorMiddleware;