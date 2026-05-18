import nodemailer from "nodemailer";

export async function sendEnquiryEmail(data: {
  name: string;
  phone: string;
  email?: string;
  productInterest?: string;
  message: string;
}) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    console.warn("Email not configured — skipping notification");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: user,
    to: user,
    subject: `New AEC Enquiry from ${data.name}`,
    html: `
      <h2>New Contact Form Enquiry</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Email:</strong> ${data.email || "—"}</p>
      <p><strong>Product Interest:</strong> ${data.productInterest || "—"}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
    `,
  });
}
