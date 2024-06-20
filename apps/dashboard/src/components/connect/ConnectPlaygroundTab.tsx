import { Tab } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import type { ReactNode } from "react";
import { Heading } from "tw-components";

interface ConnectPlaygroundTabProps {
  children: ReactNode;
  label: string;
  TRACKING_CATEGORY: string;
}

const ConnectPlaygroundTab = ({
  children,
  label,
  TRACKING_CATEGORY,
}: ConnectPlaygroundTabProps) => {
  const trackEvent = useTrack();

  return (
    <Tab
      gap={2}
      flex={1}
      border="1px solid transparent"
      fontWeight="normal"
      bg="transparent"
      minWidth="80px"
      boxShadow="0 0 1px 1px rgba(255, 255, 255, 0.0)"
      borderRadius={{ base: "4px", md: "6px" }}
      fontSize={{ base: "12px", md: "14px" }}
      position="relative"
      height="auto"
      px={4}
      py={{ base: 2, lg: 2 }}
      _hover={{
        bg: "rgba(255,255,255, 0.1)",
      }}
      onClick={() => {
        trackEvent({
          category: TRACKING_CATEGORY,
          action: "switch-tab",
          label,
        });
      }}
    >
      <Heading
        color="inherit"
        my={1}
        size="label.md"
        fontFamily="mono"
        fontSize={{ base: "12px", lg: "14px" }}
      >
        {children}
      </Heading>
    </Tab>
  );
};

export default ConnectPlaygroundTab;
