require("dotenv").config();
const express = require("express"); // ✅ أضف هذا السطر
const http = require("http");
const { createServer } = require("./config/serverFactory");
const connectDB = require("./config/db");
const { initializeSocket } = require("./config/socket");
const authRoutes = require("./routes/authRoutes");
const timeCapsuleRoutes = require("./routes/timeCapsuleRoutes");
const { notFoundHandler, globalErrorHandler } = require("./middleware/errorHandler");

// ✅ إنشاء الخادم باستخدام `Factory Pattern`
const app = createServer();
const server = http.createServer(app);

connectDB();

// ✅ إعداد المسارات
app.use("/api/auth", authRoutes);
app.use("/api/capsules", timeCapsuleRoutes);
app.use("/uploads", express.static("uploads"));

// ✅ التعامل مع الأخطاء
app.use(notFoundHandler);
app.use(globalErrorHandler);

// ✅ تشغيل الخادم
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

initializeSocket(server);
