const express = require("express");
const {
    createTimeCapsuleController,
    getUserCapsulesController,
    getCapsuleByIdController,
    updateCapsuleController,
    deleteCapsuleController,
    getCapsuleStatusController,
    getCapsuleLinkController,
    getCapsuleCountdownController,
    getCapsuleContentController,
    uploadImageController,
    getCapsuleImageController
} = require("../controllers/timeCapsuleController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../config/multer");

const router = express.Router();

// ✅ مسارات CRUD للكبسولات الزمنية
router.post("/", authMiddleware, createTimeCapsuleController);
router.get("/", authMiddleware, getUserCapsulesController);
router.get("/:id", authMiddleware, getCapsuleByIdController);
router.put("/:id", authMiddleware, updateCapsuleController);
router.delete("/:id", authMiddleware, deleteCapsuleController);

// ✅ مسارات الحالة والروابط
router.get("/:id/status", authMiddleware, getCapsuleStatusController);
router.get("/:id/link", authMiddleware, getCapsuleLinkController);
router.get("/:id/countdown", getCapsuleCountdownController);
router.get("/:id/content", getCapsuleContentController);

// ✅ مسارات رفع الصور وجلبها
router.post("/:id/upload", authMiddleware, upload.single("image"), uploadImageController);
router.get("/:id/image", getCapsuleImageController);

module.exports = router;
