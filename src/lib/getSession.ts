import { cookies } from "next/headers";
import { scalekit } from "./scalekit";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const userCookie = cookieStore.get("user_session")?.value;

  if (!token && !userCookie) {
    return null;
  }

  // 1. Agar user_session cookie saved hai toh instant return karo
  if (userCookie) {
    try {
      const user = JSON.parse(userCookie);
      return user;
    } catch {
      // JSON parse fail hua toh niche fallback chalega
    }
  }

  // 2. Fallback: Agar cookie nahi mili toh token validate karke user fetch karo
  if (token) {
    try {
      const result: any = await scalekit.validateAccessToken(token);
      if (!result?.sub) {
        return null;
      }
      const user = await scalekit.user.getUser(result.sub);
      return user;
    } catch (error) {
      console.error("Scalekit session validation error:", error);
      return null;
    }
  }

  return null;
}