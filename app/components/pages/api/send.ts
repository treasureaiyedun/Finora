import type { NextApiRequest, NextApiResponse } from "next";
import { EmailTemplate } from "@/app/components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, firstName, confirmationUrl } = req.body;

  if (!email || !firstName || !confirmationUrl) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const data = await resend.emails.send({
      from: "Finora <noreply@finora.app>",
      to: [email],
      subject: "Verify your Finora account ✅",
      react: EmailTemplate({ firstName, confirmationUrl }),
    });

    res.status(200).json({ message: "Verification email sent", data });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};