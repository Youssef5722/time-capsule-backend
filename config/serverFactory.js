const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const createServer = () => {
    const app = express();

    // ✅ إعداد CORS للسماح فقط بالدومينات المحددة
    const corsOptions = {
        origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
        credentials: true,
    };
    app.use(cors(corsOptions));

    // ✅ تهيئة الميدل وير
    app.use(express.json());
    app.use(cookieParser());
    app.use(morgan("dev"));
    app.use(helmet());

    // ✅ تقييد معدل الطلبات لحماية API
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: "🚫 Rate limit exceeded. Please try again later!",
    });
    app.use(limiter);

    return app;
};

module.exports = { createServer };
