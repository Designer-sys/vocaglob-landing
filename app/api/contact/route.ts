// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { db } from "../../lib/firebaseConfig"; // Firestore
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const data = await req.json(); // Expecting { name, email, signupDate, message }

    // Validation
    if (!data.name || !data.email || !data.message || !data.signupDate) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save to Firestore
    await addDoc(collection(db, "contacts"), {
      name: data.name,
      email: data.email,
      signupDate: data.signupDate, // <-- now saved
      message: data.message,
      createdAt: serverTimestamp(),
    });

    console.log("New Vocaglob contact request saved:", data);

    return NextResponse.json({
      success: true,
      message: "Contact received successfully",
    });

  } catch (error) {
    console.error("Error saving contact request:", error);
    return NextResponse.json(
      { success: false, message: "Error processing request" },
      { status: 500 }
    );
  }
}