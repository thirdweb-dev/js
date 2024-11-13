import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../lib/auth";

export default async function Layout({
  children,
  params,
}: { children: React.ReactNode; params: Promise<{ ecosystem: string }> }) {
  const { ecosystem } = await params;
  const userAddress = await getCurrentUser();
  if (userAddress) {
    redirect(`${ecosystem}/wallet/${userAddress}`);
  }

  return (
    <main className="flex w-full flex-col items-center justify-center">
      {children}
    </main>
  );
}
