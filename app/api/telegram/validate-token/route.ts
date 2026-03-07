import { NextRequest, NextResponse } from "next/server";
import { validateBotToken } from "@/lib/telegram-validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { valid: false, error: "Bot token is required" },
        { status: 400 }
      );
    }

    const result = await validateBotToken(token);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      { valid: false, error: "Validation failed. Please try again." },
      { status: 500 }
    );
  }
}
