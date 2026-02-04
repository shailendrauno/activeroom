import User from '../models/User.js';
import crypto from 'crypto';
import { generateToken } from '../utils/token.js';
import { sendVerificationEmail } from "../utils/sendEmail.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exist" });
    }

    const verifyToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      name,
      email,
      password,
      role: role || "user",
      verifyToken,
      isVerified: false,
    });

    // ✅ Respond immediately (NO blocking)
    res.json({
      message: "Registered successfully. Please check your email to verify.",
    });

    // ✅ Send email in background
    const link = `${process.env.BASE_URL}/api/auth/verify/${verifyToken}`;

    sendVerificationEmail(newUser.email, link)
      .then(() => {
        console.log("✅ Verification email sent to", newUser.email);
      })
      .catch((err) => {
        console.error("❌ Resend email failed:", err.message);
      });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verifyToken: token });
    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.isVerified = true;
    user.verifyToken = undefined;
    await user.save();

    res.json({ message: "Email verified. You can login now." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    // generate new token
    const verifyToken = crypto.randomBytes(32).toString("hex");

    user.verifyToken = verifyToken;
    await user.save();

    // respond immediately
    res.json({ message: "Verification email resent successfully" });

    // send email in background
    const link = `${process.env.BASE_URL}/api/auth/verify/${verifyToken}`;

    sendVerificationEmail(user.email, link)
      .then(() => {
        console.log("✅ Verification email resent to", user.email);
      })
      .catch((err) => {
        console.error("❌ Resend email failed:", err.message);
      });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // if (!user.isVerified)
    //   return res.status(403).json({ message: "Verify your email first" });

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
