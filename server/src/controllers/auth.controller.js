import User from '../models/User.js';
import crypto from 'crypto';
import transporter from '../config/mailer.js';
import { generateToken } from '../utils/token.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exist" });

    const verifyToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      name,
      email,
      password,
      role: role || "user",
      verifyToken,
      isVerified: false,
    });

    // 🔥 SEND RESPONSE IMMEDIATELY
    res.json({
      message: "Registered successfully. Please check your email to verify.",
    });

    // 🔥 SEND EMAIL IN BACKGROUND (NO await)
    const link = `${process.env.BASE_URL}/api/auth/verify/${verifyToken}`;

    transporter
      .sendMail({
        from: `"ActiveRoom" <${process.env.EMAIL_USER}>`,
        to: newUser.email,
        subject: "Verify your account",
        html: `
          <h2>Welcome to ActiveRoom</h2>
          <p>Click the button below to verify your account:</p>
          <a href="${link}" style="padding:10px 20px;background:#2563eb;color:white;text-decoration:none;border-radius:5px">
            Verify Email
          </a>
        `,
      })
      .then(() => {
        console.log("Verification email sent to", newUser.email);
      })
      .catch((err) => {
        console.error("Email failed:", err.message);
      });

  } catch (err) {
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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.isVerified)
      return res.status(403).json({ message: "Verify your email first" });

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
