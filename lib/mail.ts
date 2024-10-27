import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain=process.env.NEXT_PUBLIC_APP_URL;

export const sendVerificationMail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;
  console.log(email, "RECEIVER");
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "confirmation mail",
    html: `<p>Click <a href="${confirmLink}">here</a>to confirm email.</p>`,
  });
};
export const sendPasswordResetMail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;
  console.log("to test",domain)
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a>reset password.</p>`,
  });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "2AF Code",
    html: `<p>Your 2AF code: ${token}</p>`,
  });
};
