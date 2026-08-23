import { NextResponse } from "next/server";
import crypto from "crypto";

const TOKEN_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

function getEncryptionKey() {
  const secret = process.env.DELETE_REQUEST_SECRET;

  if (!secret) {
    throw new Error("DELETE_REQUEST_SECRET is not configured.");
  }

  return crypto
    .createHash("sha256")
    .update(secret)
    .digest();
}

function encryptRequest(data: Record<string, string>) {
  const key = getEncryptionKey();

  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    key,
    iv
  );

  const plaintext = JSON.stringify(data);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64url"),
    authTag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
}

async function sendBrevoEmail({
  to,
  toName,
  subject,
  htmlContent,
}: {
  to: string;
  toName?: string;
  subject: string;
  htmlContent: string;
}) {
  const response = await fetch(
    "https://api.brevo.com/v3/smtp/email",
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY || "",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          email: process.env.BREVO_SENDER_EMAIL,
          name: process.env.BREVO_SENDER_NAME,
        },
        to: [
          {
            email: to,
            name: toName || undefined,
          },
        ],
        subject,
        htmlContent,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Brevo error:", errorText);
    throw new Error("Email could not be sent.");
  }

  return response.json();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const signupDate = String(body.signupDate || "").trim();
    const reason = String(body.reason || "").trim();
    const confirmation = body.confirmation === true;

    if (!name || !email || !signupDate || !confirmation) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide your full name, VOCAGLOB account email, signup date, and confirmation.",
        },
        { status: 400 }
      );
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide a valid VOCAGLOB account email address.",
        },
        { status: 400 }
      );
    }

    const requestData = {
      name,
      email,
      signupDate,
      reason,
      expiresAt: String(
        Date.now() + TOKEN_EXPIRY_MS
      ),
    };

    const token = encryptRequest(requestData);

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://www.vocaglob.com";

    const verificationUrl =
      `${siteUrl}/delete-account/verify?token=${encodeURIComponent(token)}`;

    await sendBrevoEmail({
      to: email,
      toName: name,
      subject:
        "VOCAGLOB account deletion verification",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>VOCAGLOB Account Deletion Request</h2>

          <p>Hello ${escapeHtml(name)},</p>

          <p>
            We received a request to delete your VOCAGLOB account.
          </p>

          <p>
            To verify that you control the email address
            associated with the request, please click the
            button below.
          </p>

          <p>
            <a
              href="${verificationUrl}"
              style="
                display:inline-block;
                padding:12px 20px;
                background:#148b80;
                color:white;
                text-decoration:none;
                border-radius:6px;
              "
            >
              Verify Account Deletion Request
            </a>
          </p>

          <p>
            This verification link expires in 30 minutes.
          </p>

          <p>
            If you did not request account deletion,
            you can safely ignore this email.
          </p>

          <p>
            VOCAGLOB Support<br />
            support@vocaglob.com
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message:
        "If the email address is associated with a VOCAGLOB account, a verification email will be sent to that address.",
    });
  } catch (error) {
    console.error(
      "Deletion request error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "We could not process the request at this time. Please try again later.",
      },
      { status: 500 }
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}