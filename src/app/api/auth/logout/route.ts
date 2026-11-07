import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });

  const clearOptions = {
    httpOnly: true,
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax" as const,
  };

  // Dono cookies ko explicitly expire karo
  response.cookies.set("access_token", "", clearOptions);
  response.cookies.set("user_session", "", clearOptions);

  return response;
}