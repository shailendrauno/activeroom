import User from '../models/User.js';
import crypto from 'crypto';
import transporter from '../config/mailer.js';
import {generateToken} from '../utils/token.js'

export const register = async (req,res) => {
  try {
    const {name, email, password, role} = req.body;
    const exists = await User.findOne({ email });
    if(exists) return res.status(400).json({message: "User already exist"});

    const verifyToken = crypto.randomBytes(32).toString("hex");
    
    await User.create ({
      name,
      email,
      password,
      role: role || "user",
      verifyToken,
    });
    
    const link = `${process.env.BASE_URL}/api/auth/verify/${verifyToken}`;


      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "verify your account",
         html: `<h3>Click to verify</h3><a href="${link}">${link}</a>`,
      });
    

    res.json({message: "Registered. please verify  your email"})

  } catch (err) {
    res.status(500).json({error: err.message})
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