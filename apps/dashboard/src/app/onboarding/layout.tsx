import { getThirdwebClient } from "@/constants/thirdweb.server";
import { AutoConnect } from "thirdweb/react";

export default function OnboardingLayout({
  children,
}: { children: React.ReactNode }) {
  const thirdwebClient = getThirdwebClient();

  return (
    <>
      <AutoConnect client={thirdwebClient} />
      {children}
    </>
  );
}
