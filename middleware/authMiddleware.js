const { JWTAuthStrategy } = require("../strategies/authStrategy");
const { errorResponse } = require("../utils/responseHandler");
const User = require("../models/User"); // ✅ استيراد نموذج المستخدم

const authMiddleware = (strategy = new JWTAuthStrategy()) => {
    return async (req, res, next) => {
        try {
            const decoded = strategy.authenticate(req);
            if (!decoded.id) throw new Error("Invalid token structure");

            // ✅ جلب بيانات المستخدم من قاعدة البيانات
            const user = await User.findById(decoded.id).select("-password");
            if (!user) throw new Error("User not found");

            req.user = user; // ✅ تحديث `req.user` ليحمل بيانات المستخدم الفعلية
            next();
        } catch (error) {
            errorResponse(res, error.message, "Authentication failed", 401);
        }
    };
};

module.exports = authMiddleware;
