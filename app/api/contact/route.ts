import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    console.log("New Vocaglob support request:", data);

    return NextResponse.json({
      success: true,
      message: "Complaint received successfully",
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error processing request" },
      { status: 500 }
    );
  }
}