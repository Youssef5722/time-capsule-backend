const { errorResponse } = require("../utils/responseHandler");
const logger = require("../utils/logger");

const notFoundHandler = (req, res, next) => {
    errorResponse(res, "Route not found", `Cannot ${req.method} ${req.originalUrl}`, 404);
};

const globalErrorHandler = (err, req, res, next) => {
    logger.error(`${req.method} ${req.originalUrl} - ${err.message}`);
    errorResponse(res, "Internal Server Error", err.message || "Something went wrong!", 500);
};

module.exports = { notFoundHandler, globalErrorHandler };
