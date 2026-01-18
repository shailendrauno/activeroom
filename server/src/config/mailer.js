import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,   // must match .env
    pass: process.env.EMAIL_PASS,   // must match .env
  },
});


export default transporter;
