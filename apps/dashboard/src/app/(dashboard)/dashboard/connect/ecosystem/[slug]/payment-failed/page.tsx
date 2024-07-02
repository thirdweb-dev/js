"use client";
import { XCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEcosystem } from "../(active)/hooks/use-ecosystem";

export default function Page({ params }: { params: { slug: string } }) {
  const { ecosystem } = useEcosystem({
    slug: params.slug,
    refetchInterval: 60000,
  });
  const router = useRouter();

  if (ecosystem?.status === "active") {
    router.replace(`/dashboard/connect/ecosystem/${ecosystem.slug}`);
  }

  if (ecosystem?.status === "requested") {
    router.replace(`/dashboard/connect/ecosystem/${ecosystem.slug}/requested`);
  }

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4 px-2 py-10 sm:px-4">
      <XCircleIcon className="text-destructive size-12" />
      <p className="max-w-sm text-center text-balance text-muted-foreground">
        Your payment failed. Please update your payment method and contact
        support@thirdweb.com
      </p>
    </div>
  );
}
