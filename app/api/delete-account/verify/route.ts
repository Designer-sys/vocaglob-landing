import { NextResponse } from "next/server";
import { adminDb } from "../../../lib/firebaseAdmin";
import crypto from "crypto";
import { FieldValue } from "firebase-admin/firestore";

function hashToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const requestId = String(body.requestId || "").trim();
    const token = String(body.token || "").trim();

    if (!requestId || !token) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification request.",
        },
        { status: 400 }
      );
    }

    const requestRef = adminDb
      .collection("deletionRequests")
      .doc(requestId);

    const requestSnap = await requestRef.get();

    if (!requestSnap.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "This verification request is invalid or has expired.",
        },
        { status: 400 }
      );
    }

    const data = requestSnap.data();

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "This verification request is invalid.",
        },
        { status: 400 }
      );
    }

    if (data.status !== "pending_email_verification") {
      return NextResponse.json({
        success: false,
        message:
          "This deletion request has already been processed or verified.",
      });
    }

    if (!data.expiresAt) {
      return NextResponse.json(
        {
          success: false,
          message: "This verification request is invalid.",
        },
        { status: 400 }
      );
    }

    const expiresAt = data.expiresAt.toDate();

    if (expiresAt.getTime() < Date.now()) {
      await requestRef.update({
        status: "expired",
        updatedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "This verification link has expired. Please submit a new deletion request.",
        },
        { status: 400 }
      );
    }

    const suppliedHash = hashToken(token);

    if (suppliedHash !== data.tokenHash) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification request.",
        },
        { status: 400 }
      );
    }

    await requestRef.update({
      status: "verified",
      verifiedAt: FieldValue.serverTimestamp(),
      tokenHash: null,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message:
        "Your email has been verified. Your VOCAGLOB account deletion request has been received and will be processed by VOCAGLOB Support.",
    });
  } catch (error) {
    console.error("Deletion verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "We could not verify this request. Please try again later.",
      },
      { status: 500 }
    );
  }
}