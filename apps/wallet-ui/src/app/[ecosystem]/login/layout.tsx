import { getCurrentUser } from "@/lib/auth";
import { redirect } from "@/lib/redirect";

export default async function Layout({
  children,
  params,
}: { children: React.ReactNode; params: Promise<{ ecosystem: string }> }) {
  const { ecosystem } = await params;

  const userAddress = await getCurrentUser();
  if (userAddress) {
    redirect(`/wallet/${userAddress}`, ecosystem);
  }

  return (
    <main className="flex w-full flex-col items-center justify-center">
      {children}
    </main>
  );
}
