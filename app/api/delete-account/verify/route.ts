import { NextResponse } from "next/server";
import crypto from "crypto";

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

function decryptRequest(token: string) {
  const key = getEncryptionKey();

  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid verification token.");
  }

  const [ivPart, authTagPart, encryptedPart] = parts;

  const iv = Buffer.from(ivPart, "base64url");
  const authTag = Buffer.from(authTagPart, "base64url");
  const encrypted = Buffer.from(
    encryptedPart,
    "base64url"
  );

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    iv
  );

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString("utf8")) as {
    name: string;
    email: string;
    signupDate: string;
    reason: string;
    expiresAt: string;
  };
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
    console.error(
      "Brevo deletion notification error:",
      errorText
    );

    throw new Error(
      "Deletion request notification could not be sent."
    );
  }

  return response.json();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const token = String(body.token || "").trim();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification link.",
        },
        { status: 400 }
      );
    }

    let requestData;

    try {
      requestData = decryptRequest(token);
    } catch (error) {
      console.error(
        "Deletion token verification failed:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "This verification link is invalid or has expired.",
        },
        { status: 400 }
      );
    }

    const expiresAt = Number(requestData.expiresAt);

    if (
      !Number.isFinite(expiresAt) ||
      expiresAt < Date.now()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This verification link has expired. Please submit a new deletion request.",
        },
        { status: 400 }
      );
    }

    if (
      !requestData.name ||
      !requestData.email ||
      !requestData.signupDate
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This deletion request is incomplete.",
        },
        { status: 400 }
      );
    }

    /*
     * The successful verification establishes ownership
     * of the email address because the verification link
     * was sent to that address.
     *
     * The verified request is forwarded to VOCAGLOB Support
     * for account identification and deletion processing.
     */

    const supportEmail =
      process.env.DELETE_REQUEST_SUPPORT_EMAIL ||
      "support@vocaglob.com";

    const reasonHtml = requestData.reason
      ? escapeHtml(requestData.reason)
      : "No reason provided.";

    await sendBrevoEmail({
      to: supportEmail,
      subject:
        "Verified VOCAGLOB Account Deletion Request",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Verified VOCAGLOB Account Deletion Request</h2>

          <p>
            A user has completed email verification for an
            account deletion request.
          </p>

          <h3>User Information</h3>

          <p>
            <strong>Name:</strong>
            ${escapeHtml(requestData.name)}
          </p>

          <p>
            <strong>VOCAGLOB Account Email:</strong>
            ${escapeHtml(requestData.email)}
          </p>

          <p>
            <strong>Signup Date:</strong>
            ${escapeHtml(requestData.signupDate)}
          </p>

          <p>
            <strong>Reason for Deletion:</strong><br />
            ${reasonHtml}
          </p>

          <hr />

          <p>
            <strong>Ownership verification:</strong>
            Successful
          </p>

          <p>
            The user demonstrated control of the submitted
            VOCAGLOB account email address by completing the
            verification link sent to that address.
          </p>

          <p>
            Please identify the corresponding VOCAGLOB
            account and process the deletion request.
          </p>

          <p>
            VOCAGLOB Account Deletion System
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message:
        "Your email has been verified. Your VOCAGLOB account deletion request has been received and will be processed by VOCAGLOB Support.",
    });
  } catch (error) {
    console.error(
      "Deletion verification error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "We could not verify your request at this time. Please try again later.",
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