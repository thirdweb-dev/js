"use client";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EcosystemHeader } from "./components/client/ecosystem-header.client";
import { useEcosystem } from "./hooks/use-ecosystem";

export default function Layout({
  children,
  params,
}: { children: React.ReactNode; params: { slug: string } }) {
  const { isLoggedIn, isLoading: isLoggedInLoading } = useLoggedInUser();
  const { ecosystem, error } = useEcosystem({ slug: params.slug });
  const router = useRouter();

  if (error) {
    if (error.res?.status === 404) {
      toast.error("Ecosystem not found");
    } else {
      toast.error(error?.message ?? "Failed to fetch ecosystem");
    }
    router.replace("/dashboard/connect/ecosystem");
  }

  if (!isLoggedIn && !isLoggedInLoading) {
    toast.error("Login to access this ecosystem");
    router.replace("/dashboard/connect/ecosystem");
    return null;
  }

  if (ecosystem?.status === "requested") {
    router.replace(`/dashboard/connect/ecosystem/${ecosystem.slug}/requested`);
    return null;
  }

  return (
    <div className="flex flex-col w-full gap-10 px-2 py-10 sm:px-4">
      <EcosystemHeader ecosystemSlug={params.slug} />
      {children}
    </div>
  );
}
