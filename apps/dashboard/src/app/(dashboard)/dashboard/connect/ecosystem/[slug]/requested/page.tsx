"use client";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useRouter } from "next/navigation";
import { useEcosystem } from "../(active)/hooks/use-ecosystem";

export default function Page({ params }: { params: { slug: string } }) {
  const { ecosystem } = useEcosystem({
    slug: params.slug,
    refetchInterval: 3000,
    refetchOnWindowFocus: true,
  });
  const router = useRouter();

  if (ecosystem?.status === "active") {
    router.replace(`/dashboard/connect/ecosystem/${ecosystem.slug}`);
  }

  if (ecosystem?.status === "paymentFailed") {
    router.replace(
      `/dashboard/connect/ecosystem/${ecosystem.slug}/payment-failed`,
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4 px-2 py-10 sm:px-4">
      <Spinner className="size-12" />
      <p className="max-w-sm text-center text-balance text-muted-foreground">
        Your payment is being processed and ecosystem is being created. Please
        wait.
      </p>
    </div>
  );
}
