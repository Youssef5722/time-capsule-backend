const { successResponse, errorResponse } = require("../utils/responseHandler");
const authService = require("../services/authService");

const registerController = async (req, res) => {
    try {
        const user = await authService.registerUser(req.body.username, req.body.email, req.body.password);
        successResponse(res, "Registration successful", user, 201);
    } catch (error) {
        errorResponse(res, error.message, "Registration failed", 400);
    }
};

const loginController = async (req, res) => {
    try {
        const authData = await authService.loginUser(req.body.email, req.body.password);

        res.cookie("refreshToken", authData.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        successResponse(res, "Login successful", { accessToken: authData.accessToken, user: authData.user });
    } catch (error) {
        errorResponse(res, error.message, "Login failed", 400);
    }
};

const getMeController = async (req, res) => {
    try {
        const user = await authService.getUserProfile(req.user.id);
        successResponse(res, "User data retrieved successfully", user);
    } catch (error) {
        errorResponse(res, error.message, "Failed to fetch user data", 404);
    }
};

const updatePasswordController = async (req, res) => {
    try {
        const response = await authService.updatePassword(req.user.id, req.body.oldPassword, req.body.newPassword);

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        });

        successResponse(res, response.message + ". Please login again.");
    } catch (error) {
        errorResponse(res, error.message, "Password update failed", 400);
    }
};

const refreshTokenController = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        const newTokens = await authService.refreshAccessToken(refreshToken);
        successResponse(res, "Access token refreshed", newTokens);
    } catch (error) {
        errorResponse(res, error.message, "Token refresh failed", 401);
    }
};

const logoutController = (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict"
    });
    successResponse(res, "Logged out successfully");
};

module.exports = {
    registerController,
    loginController,
    getMeController,
    updatePasswordController,
    refreshTokenController,
    logoutController
};
