import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email, link) => {
  return resend.emails.send({
    from: "ActiveRoom <onboarding@resend.dev>",
    to: email,
    subject: "Verify your account",
    html: `
      <h2>Welcome to ActiveRoom</h2>
      <p>Click below to verify:</p>
      <a href="${link}">Verify Email</a>
    `,
  });
};
