import { scalekit } from "@/src/lib/scalekit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Agar user ne auth cancel kiya ya Scalekit ne error bheja
  if (error) {
    console.error("Scalekit OAuth error:", error, errorDescription);
    return NextResponse.redirect(new URL("/?error=auth_failed", req.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", req.url));
  }

  try {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`;
    const session = await scalekit.authenticateWithCode(code, redirectUri);

    const token = session.accessToken || (session as any).access_token;
    if (!token) {
      throw new Error("Access token not found in Scalekit response");
    }

    const redirectUrl = process.env.NEXT_PUBLIC_APP_URL || "/";
    const response = NextResponse.redirect(new URL(redirectUrl, req.url));

    const cookieOptions = {
      httpOnly: true,
      maxAge: 24 * 60 * 60, // 24 hours
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax" as const,
    };

    // 1. Access Token cookie set karo
    response.cookies.set("access_token", token, cookieOptions);

    // 2. User info (email, id) direct cookie me store karo (Instant session load ke liye)
    if (session.user) {
      response.cookies.set("user_session", JSON.stringify(session.user), cookieOptions);
    }

    return response;
  } catch (error) {
    console.error("Authentication callback error:", error);
    return NextResponse.redirect(new URL("/?error=auth_error", req.url));
  }
}