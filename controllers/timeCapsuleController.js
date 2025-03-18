const { successResponse, errorResponse } = require("../utils/responseHandler");
const timeCapsuleService = require("../services/timeCapsuleService");

// ✅ دالة موحدة للتعامل مع الطلبات وتجنب تكرار try/catch
const handleRequest = async (res, serviceFunction, successMessage, ...params) => {
    try {
        const data = await serviceFunction(...params);
        successResponse(res, successMessage, data);
    } catch (error) {
        errorResponse(res, error.message || "An unexpected error occurred", "Request failed", 500);
    }
};

const createTimeCapsuleController = (req, res) => handleRequest(
    res, timeCapsuleService.createTimeCapsule, "Capsule created successfully", req.user.id, req.body.title, req.body.content, req.body.releaseDate
);

const getUserCapsulesController = (req, res) => handleRequest(
    res, timeCapsuleService.getUserCapsules, "User capsules retrieved successfully", req.user.id
);

const getCapsuleByIdController = (req, res) => handleRequest(
    res, timeCapsuleService.getCapsuleById, "Capsule retrieved successfully", req.params.id, req.user.id
);

const updateCapsuleController = (req, res) => handleRequest(
    res, timeCapsuleService.updateCapsule, "Capsule updated successfully", req.params.id, req.user.id, req.body
);

const deleteCapsuleController = (req, res) => handleRequest(
    res, timeCapsuleService.deleteCapsule, "Capsule deleted successfully", req.params.id, req.user.id
);

const getCapsuleStatusController = (req, res) => handleRequest(
    res, timeCapsuleService.getCapsuleStatus, "Capsule status retrieved successfully", req.params.id
);

const getCapsuleLinkController = (req, res) => handleRequest(
    res, timeCapsuleService.getCapsuleLink, "Capsule link generated successfully", req.params.id
);

const getCapsuleCountdownController = (req, res) => handleRequest(
    res, timeCapsuleService.getCapsuleCountdown, "Capsule countdown retrieved successfully", req.params.id
);

const getCapsuleContentController = async (req, res) => {
    try {
        const capsule = await timeCapsuleService.getCapsuleById(req.params.id, req.user.id);
        
        if (!capsule.isReleased) {
            const countdown = await timeCapsuleService.getCapsuleCountdown(req.params.id);
            return successResponse(res, "Capsule is not yet open, showing countdown", countdown);
        }

        const content = await timeCapsuleService.getCapsuleContent(req.params.id);
        successResponse(res, "Capsule content retrieved successfully", content);
    } catch (error) {
        errorResponse(res, error.message, "Error fetching capsule content", 500);
    }
};


const uploadImageController = (req, res) => handleRequest(
    res, timeCapsuleService.uploadImage, "Image uploaded successfully", req.params.id, req.user.id, req.file
);

const getCapsuleImageController = (req, res) => handleRequest(
    res, timeCapsuleService.getCapsuleImage, "Capsule image retrieved successfully", req.params.id
);

module.exports = {
    createTimeCapsuleController,
    getUserCapsulesController,
    getCapsuleByIdController,
    updateCapsuleController,
    deleteCapsuleController,
    getCapsuleStatusController,
    getCapsuleLinkController,
    getCapsuleCountdownController,
    getCapsuleContentController ,
    uploadImageController,
    getCapsuleImageController
};
