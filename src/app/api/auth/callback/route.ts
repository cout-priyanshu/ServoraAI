import { scalekit } from "@/src/lib/scalekit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ message: "code is not found" }, { status: 400 });
  }

  try {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`;

    const session = await scalekit.authenticateWithCode(code, redirectUri);

    const redirectUrl = process.env.NEXT_PUBLIC_APP_URL || "/";
    const response = NextResponse.redirect(new URL(redirectUrl, req.url));

    response.cookies.set("access_token", session.accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60, // 24 hours in seconds
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { message: "Authentication failed" },
      { status: 500 }
    );
  }
}