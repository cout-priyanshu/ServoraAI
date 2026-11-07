import { connection } from "next/server";
import HomeClient from "../components/HomeClient";
import { getSession } from "../lib/getSession";

// Next.js 16 dynamic route setting
export const instant = false;

export default async function Home() {
  await connection();

  const session = await getSession();

  // Terminal me check karne ke liye ki exact object kya aa raha hai
  if (process.env.NODE_ENV !== "production") {
    console.log("Session in page.tsx:", session);
  }

  // Scalekit ke har possible email path ko safely cover kiya hai
  const userEmail =
    (typeof session?.email === "string" ? session.email : null) ||
    (typeof session?.primaryEmail === "string" ? session.primaryEmail : null) ||
    (typeof session?.user?.email === "string" ? session.user.email : null) ||
    (Array.isArray(session?.identities) && session.identities[0]?.email) ||
    "";

  return (
    <main>
      <HomeClient email={userEmail} />
    </main>
  );
}