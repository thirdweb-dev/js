"use client";

// TODO - convert to RSC

import { useAccountCredits } from "@/hooks/useApi";
import { CreditsItem } from "./CreditsItem";

export const CreditsInfoCard = () => {
  const { data: credits } = useAccountCredits();

  if (!credits) {
    return null;
  }

  const restCredits = credits.filter((crd) => !crd.name.startsWith("OP -"));

  if (restCredits.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      {restCredits.map((credit) => (
        <CreditsItem credit={credit} key={credit.couponId} />
      ))}
    </section>
  );
};
