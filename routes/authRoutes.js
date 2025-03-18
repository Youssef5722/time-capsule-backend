const express = require("express");
const {
    registerController,
    loginController,
    getMeController,
    updatePasswordController,
    refreshTokenController,
    logoutController
} = require("../controllers/authController");
const { JWTAuthStrategy } = require("../strategies/authStrategy");
const authMiddleware = require("../middleware/authMiddleware");
const wrapMiddleware = require("../middleware/wrapMiddleware");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", wrapMiddleware(authMiddleware), logoutController);
router.get("/me", authMiddleware(new JWTAuthStrategy()), (req, res) => {
    res.json({ user: req.user });
});router.put("/update-password", wrapMiddleware(authMiddleware), updatePasswordController);
router.post("/refresh", refreshTokenController);

module.exports = router;
