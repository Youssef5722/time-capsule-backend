const jwt = require("jsonwebtoken");

class AuthStrategy {
    authenticate(req) {
        throw new Error("Authenticate method must be implemented");
    }
}

class JWTAuthStrategy extends AuthStrategy {
    authenticate(req) {
        const token = req.header("Authorization");
        if (!token) throw new Error("No token provided");

        try {
            const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
            return decoded;
        } catch (error) {
            throw new Error("Invalid or expired token");
        }
    }
}

module.exports = { JWTAuthStrategy };
