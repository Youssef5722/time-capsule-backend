const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const generateTokens = (userId) => {
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
        throw new Error("Missing JWT secrets in environment variables");
    }

    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

    return { accessToken, refreshToken };
};

const registerUser = async (username, email, password) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("Email is already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return { id: newUser._id, username, email };
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const tokens = generateTokens(user._id);

    return { ...tokens, user: { id: user._id, username: user.username, email: user.email } };
};

module.exports = { registerUser, loginUser };
