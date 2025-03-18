const wrapMiddleware = (...middlewares) => {
    return (req, res, next) => {
        const execute = (index) => {
            if (index >= middlewares.length) return next();
            middlewares[index](req, res, () => execute(index + 1));
        };
        execute(0);
    };
};

module.exports = wrapMiddleware;
