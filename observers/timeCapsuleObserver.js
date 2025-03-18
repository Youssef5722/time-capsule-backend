class TimeCapsuleObserver {
    constructor() {
        this.subscribers = [];
    }

    subscribe(subscriber) {
        this.subscribers.push(subscriber);
    }

    notify(capsule) {
        this.subscribers.forEach((subscriber) => subscriber.update(capsule));
    }
}

// ✅ إنشاء `Observer` عام لمتابعة الكبسولات
const timeCapsuleObserver = new TimeCapsuleObserver();

module.exports = timeCapsuleObserver;
