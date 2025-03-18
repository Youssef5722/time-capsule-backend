const timeCapsuleRepository = require("../repositories/timeCapsuleRepository");
const { getIo } = require("../config/socket");
const timeCapsuleObserver = require("../observers/timeCapsuleObserver");
const EmailNotifier = require("../notifiers/emailNotifier");
// ✅ إضافة `EmailNotifier` كمشترك في `Observer`
const emailNotifier = new EmailNotifier();
timeCapsuleObserver.subscribe(emailNotifier);

const createTimeCapsule = async (userId, title, content, releaseDate) => {
    if (!title || !content || !releaseDate) {
        throw new Error("Please fill in all fields");
    }
    if (new Date(releaseDate) <= new Date()) {
        throw new Error("Release date must be in the future");
    }
    return await timeCapsuleRepository.create({ user: userId, title, content, releaseDate });
};

const getUserCapsules = async (userId) => {
    return await timeCapsuleRepository.findByUser(userId);
};

const getCapsuleById = async (capsuleId, userId) => {
    const capsule = await timeCapsuleRepository.findById(capsuleId);
    if (!capsule) throw new Error("Capsule not found");
    if (capsule.user.toString() !== userId) throw new Error("Unauthorized access");
    return capsule;
};

const updateCapsule = async (capsuleId, userId, updates) => {
    return await timeCapsuleRepository.update(capsuleId, updates);
};

const deleteCapsule = async (capsuleId, userId) => {
    return await timeCapsuleRepository.delete(capsuleId);
};

const getCapsuleStatus = async (capsuleId) => {
    return await timeCapsuleRepository.getCapsuleStatus(capsuleId);
};

const getCapsuleLink = async (capsuleId) => {
    return await timeCapsuleRepository.getCapsuleLink(capsuleId);
};

const getCapsuleCountdown = async (capsuleId) => {
    try {
        const capsule = await timeCapsuleRepository.findById(capsuleId);
        if (!capsule) throw new Error("Capsule not found");

        const now = new Date();
        const releaseDate = new Date(capsule.releaseDate);
        let timeLeft = releaseDate - now;

        if (timeLeft <= 0) {
            if (!capsule.isReleased) {
                // ✅ تحديث حالة الكبسولة إذا لم تكن محدثة بالفعل
                capsule.isReleased = true;
                await capsule.save();

                // ✅ إشعار المشتركين عبر WebSocket
                getIo().emit(`capsule_${capsuleId}`, { isReleased: true, message: "🎉 The capsule is now available!" });

                // ✅ إشعار المستخدم عبر البريد الإلكتروني باستخدام `Observer Pattern`
                timeCapsuleObserver.notify({ ...capsule.toObject(), userEmail: capsule.userEmail });
            }
            return { isReleased: true, message: "🎉 The capsule is now available!" };
        }

        return {
            isReleased: false,
            timeLeft: {
                days: Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
                hours: Math.floor((timeLeft / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((timeLeft / (1000 * 60)) % 60),
                seconds: Math.floor((timeLeft / 1000) % 60),
            },
        };
    } catch (error) {
        throw new Error(error.message);
    }
};


const getCapsuleContent = async (capsuleId) => {
    return await timeCapsuleRepository.getCapsuleContent(capsuleId);
};

const uploadImage = async (capsuleId, file) => {
    return await timeCapsuleRepository.uploadImage(capsuleId, `/uploads/${file.filename}`);
};

const getCapsuleImage = async (capsuleId) => {
    return await timeCapsuleRepository.getCapsuleImage(capsuleId);
};

module.exports = {
    createTimeCapsule,
    getUserCapsules,
    getCapsuleById,
    updateCapsule,
    deleteCapsule,
    getCapsuleStatus,
    getCapsuleLink,
    getCapsuleCountdown,
    getCapsuleContent,
    uploadImage,
    getCapsuleImage
};
