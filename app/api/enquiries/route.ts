import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Enquiry } from "@/models/Enquiry";
import { sendEnquiryEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, productInterest, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: "Name, phone, and message are required" },
        { status: 400 }
      );
    }

    if (process.env.MONGODB_URI) {
      await connectDB();
      await Enquiry.create({
        name,
        phone,
        email,
        productInterest,
        message,
        source: "contact-form",
      });
    }

    await sendEnquiryEmail({
      name,
      phone,
      email,
      productInterest,
      message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Enquiry error:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}
