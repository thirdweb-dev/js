"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { ApplyForOpCreditsModal } from "components/onboarding/ApplyForOpCreditsModal";
import { Heading, LinkButton } from "tw-components";

export const SettingsGasCreditsPage = () => {
  const { isPending } = useLoggedInUser();

  if (isPending) {
    return (
      <div className="grid min-h-[400px] w-full place-items-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-row items-center gap-4">
        <Heading size="title.lg" as="h1">
          Apply to the Optimism Superchain App Accelerator
        </Heading>
        <LinkButton
          display={{ base: "none", md: "inherit" }}
          isExternal
          href="https://blog.thirdweb.com/accelerating-the-superchain-with-optimism/"
          size="sm"
          variant="outline"
        >
          Learn More
        </LinkButton>
      </div>

      <ApplyForOpCreditsModal />
    </div>
  );
};
