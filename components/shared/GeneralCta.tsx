import { LinkButton } from "./LinkButton";
import { useWeb3 } from "@3rdweb-sdk/react";
import { Flex, Icon } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { IoRocketOutline } from "react-icons/io5";
import { VscDashboard } from "react-icons/vsc";

interface GeneralCtaProps {
  size?: string;
}

export const GeneralCta: React.FC<GeneralCtaProps> = ({ size = "md" }) => {
  const { address } = useWeb3();
  const { trackEvent } = useTrack();

  return (
    <Flex w="100%" justifyContent="center">
      {address ? (
        <LinkButton
          leftIcon={<Icon as={VscDashboard} />}
          bgColor="primary.500"
          color="white"
          _hover={{ bgColor: "primary.400" }}
          _focus={{ bgColor: "primary.400" }}
          _active={{ bgColor: "primary.400" }}
          px={12}
          onClick={() =>
            trackEvent({
              category: "cta-button",
              action: "click",
              label: "go-to-dashboard",
            })
          }
          textAlign="center"
          size={size}
          href="/dashboard"
        >
          Go to dashboard
        </LinkButton>
      ) : (
        <LinkButton
          leftIcon={<Icon as={IoRocketOutline} />}
          bgColor="purple.500"
          color="white"
          _hover={{ bgColor: "purple.600" }}
          _focus={{ bgColor: "purple.600" }}
          _active={{ bgColor: "purple.600" }}
          px={12}
          onClick={() =>
            trackEvent({
              category: "cta-button",
              action: "click",
              label: "start",
            })
          }
          textAlign="center"
          size={size}
          href="/start"
        >
          Start building
        </LinkButton>
      )}
    </Flex>
  );
};
