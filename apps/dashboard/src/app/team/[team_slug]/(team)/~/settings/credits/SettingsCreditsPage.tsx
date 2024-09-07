"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { Flex } from "@chakra-ui/react";
import { ApplyForOpCreditsModal } from "components/onboarding/ApplyForOpCreditsModal";
import { Heading, LinkButton } from "tw-components";

export const SettingsGasCreditsPage = () => {
  const { isLoading } = useLoggedInUser();

  if (isLoading) {
    return (
      <div className="grid w-full min-h-[400px] place-items-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <Flex flexDir="column" gap={8}>
      <Flex direction="row" gap={4} align="center">
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
      </Flex>

      <ApplyForOpCreditsModal />
    </Flex>
  );
};
