import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSession } from "@/src/lib/getSession";
import DashboardClient from "@/src/components/DashboardClient";

// Next.js 16 dynamic / runtime data handling
export const instant = false;

export default async function DashboardPage() {
  await connection();

  const session = await getSession();

  // Agar user logged in nahi hai toh home pe redirect karo
  if (!session) {
    redirect("/");
  }

  const ownerId = session?.id || session?.sub || session?.user?.id || "";

  return <DashboardClient ownerId={ownerId} />;
}