const TimeCapsule = require("../models/TimeCapsule");

class TimeCapsuleRepository {
    // ✅ إنشاء كبسولة جديدة
    async create(data) {
        return await new TimeCapsule(data).save();
    }

    // ✅ البحث عن جميع الكبسولات الخاصة بمستخدم معين
    async findByUser(userId) {
        return await TimeCapsule.find({ user: userId })
            .select("title releaseDate isReleased createdAt")
            .sort({ createdAt: -1 });
    }

    // ✅ البحث عن كبسولة بواسطة ID
    async findById(capsuleId) {
        return await TimeCapsule.findById(capsuleId);
    }

    // ✅ تحديث بيانات كبسولة معينة
    async update(id, updates) {
        return await TimeCapsule.findByIdAndUpdate(id, updates, { new: true });
    }

    // ✅ حذف كبسولة
    async delete(id) {
        return await TimeCapsule.findByIdAndDelete(id);
    }

    // ✅ جلب حالة الكبسولة (هل تم فتحها أم لا)
    async getCapsuleStatus(id) {
        return await TimeCapsule.findById(id).select("releaseDate isReleased");
    }

    // ✅ الحصول على رابط الكبسولة
    async getCapsuleLink(id) {
        return { shareableLink: `${process.env.BASE_URL}/api/capsules/${id}/content` };
    }

    // ✅ حساب العد التنازلي
    async getCapsuleCountdown(id) {
        const capsule = await TimeCapsule.findById(id);
        if (!capsule) throw new Error("Capsule not found");

        const now = new Date();
        const releaseDate = new Date(capsule.releaseDate);
        let timeLeft = releaseDate - now;

        if (timeLeft <= 0) {
            if (!capsule.isReleased) {
                capsule.isReleased = true;
                await capsule.save();
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
    }

    // ✅ البحث عن محتوى الكبسولة إذا كانت مفتوحة
    async getCapsuleContent(id) {
        const capsule = await TimeCapsule.findById(id);
        if (!capsule) throw new Error("Capsule not found");

        if (new Date() < new Date(capsule.releaseDate)) {
            throw new Error("The capsule is not yet open!");
        }

        return { title: capsule.title, content: capsule.content };
    }

    // ✅ رفع صورة للكبسولة
    async uploadImage(id, imageUrl) {
        return await TimeCapsule.findByIdAndUpdate(id, { imageUrl }, { new: true });
    }

    // ✅ جلب رابط الصورة الخاصة بالكبسولة
    async getCapsuleImage(id) {
        const capsule = await TimeCapsule.findById(id);
        if (!capsule || !capsule.imageUrl) throw new Error("Image not found");
        return { imageUrl: capsule.imageUrl };
    }
}

module.exports = new TimeCapsuleRepository();
