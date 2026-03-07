import { NextRequest, NextResponse } from "next/server";
import { validateUserId } from "@/lib/telegram-validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, botToken } = body;

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { valid: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // botToken is optional - if provided, we can verify bot can reach user
    const result = await validateUserId(userId, botToken);

    return NextResponse.json(result);
  } catch (error) {
    console.error("User ID validation error:", error);
    return NextResponse.json(
      { valid: false, error: "Validation failed. Please try again." },
      { status: 500 }
    );
  }
}
