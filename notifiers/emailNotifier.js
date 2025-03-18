const nodemailer = require("nodemailer");

class EmailNotifier {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async update(capsule) {
        const mailOptions = {
            from: "no-reply@example.com",
            to: capsule.userEmail,
            subject: "⏳ Time Capsule Opened!",
            text: `🎉 Your time capsule titled "${capsule.title}" is now available!`
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`📧 Email sent to ${capsule.userEmail}`);
        } catch (error) {
            console.error("❌ Failed to send email:", error);
        }
    }
}

module.exports = EmailNotifier;
