import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            // For security, don't reveal if email exists, but here the user wants it to work.
            return NextResponse.json({ error: "No account found with this email" }, { status: 404 });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        await prisma.user.update({
            where: { email },
            data: {
                otpCode: otp,
                otpExpires: expires,
            }
        });

        // Send email
        // IMPORTANT: Make sure you add EMAIL_USER and EMAIL_PASS to your .env
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: '"Glow of Zia Support" <no-reply@glowofzia.com>',
            to: email,
            subject: "Your Password Reset OTP - Glow of Zia",
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #000; color: #fff;">
          <h2 style="color: #d4af37;">Glow of Zia</h2>
          <p>You requested a password reset. Use the OTP below to verify your account:</p>
          <div style="font-size: 24px; font-weight: bold; padding: 10px; background: #111; border: 1px solid #d4af37; text-align: center; color: #d4af37; letter-spacing: 5px;">
            ${otp}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: "OTP sent successfully" });

    } catch (error: any) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
