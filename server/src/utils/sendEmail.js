import 'dotenv/config';
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email, link) => {
  console.log("📨 Resend → sending email to:", email);

  const response = await resend.emails.send({
    from: "ActiveRoom <onboarding@resend.dev>",
    to: email,
    subject: "Verify your account",
    html: `
      <h2>Welcome to ActiveRoom</h2>
      <p>Click below to verify:</p>
      <a href="${link}">Verify Email</a>
    `,
  });

  console.log("✅ Resend response:", response);
  return response;
};
