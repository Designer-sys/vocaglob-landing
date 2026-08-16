import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "../../../lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import crypto from "crypto";

function hashToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
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

    if (!name || !email || !confirmation) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide your name, VOCAGLOB account email, and confirmation.",
        },
        { status: 400 }
      );
    }

    // Look up the account server-side.
    // We deliberately do not reveal whether an account exists.
    let user;

    try {
      user = await adminAuth.getUserByEmail(email);
    } catch (error: any) {
      if (error?.code === "auth/user-not-found") {
        return NextResponse.json({
          success: true,
          message:
            "If the email address is associated with a VOCAGLOB account, a verification email will be sent to that address.",
        });
      }

      throw error;
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(verificationToken);

    const expiresAt = new Date(
      Date.now() + 30 * 60 * 1000
    );

    const requestRef = await adminDb
      .collection("deletionRequests")
      .add({
        uid: user.uid,
        email,
        name,
        signupDate: signupDate || null,
        reason: reason || null,

        status: "pending_email_verification",

        tokenHash,

        createdAt: FieldValue.serverTimestamp(),
        expiresAt,
        verifiedAt: null,
        processedAt: null,
      });

    const verificationUrl =
      `${process.env.NEXT_PUBLIC_SITE_URL}` +
      `/delete-account/verify?request=${requestRef.id}&token=${verificationToken}`;

    await sendBrevoEmail({
      to: email,
      toName: name,
      subject: "VOCAGLOB account deletion verification",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>VOCAGLOB Account Deletion Request</h2>

          <p>Hello ${escapeHtml(name)},</p>

          <p>
            We received a request to delete your VOCAGLOB account.
          </p>

          <p>
            To confirm that you have access to the email address
            associated with your VOCAGLOB account, please click the
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
            If you did not request account deletion, you can safely
            ignore this email.
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
    console.error("Deletion request error:", error);

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