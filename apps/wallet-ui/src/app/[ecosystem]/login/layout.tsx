import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../lib/auth";

export default async function Layout({
  children,
}: { children: React.ReactNode }) {
  const userAddress = await getCurrentUser();
  if (userAddress) {
    redirect(`/wallet/${userAddress}`);
  }

  return (
    <main className="flex w-full flex-col items-center justify-center">
      {children}
    </main>
  );
}
