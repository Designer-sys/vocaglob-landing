import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  try {
    const rawKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

    if (!rawKey) {
      return NextResponse.json(
        {
          success: false,
          error: "FIREBASE_ADMIN_PRIVATE_KEY is missing",
        },
        { status: 500 }
      );
    }

    // Normalize the same way firebaseAdmin.ts does.
    const normalizedKey = rawKey.replace(/\\n/g, "\n");

    const fingerprint = crypto
      .createHash("sha256")
      .update(normalizedKey)
      .digest("hex");

    const beginMarker = normalizedKey.startsWith(
      "-----BEGIN PRIVATE KEY-----"
    );

    const endMarker = normalizedKey.includes(
      "-----END PRIVATE KEY-----"
    );

    return NextResponse.json({
      success: true,
      privateKeyPresent: true,
      beginsCorrectly: beginMarker,
      endsCorrectly: endMarker,
      fingerprint,
      length: normalizedKey.length,
    });
  } catch (error) {
    console.error("Firebase key diagnostic error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Diagnostic failed",
      },
      { status: 500 }
    );
  }
}