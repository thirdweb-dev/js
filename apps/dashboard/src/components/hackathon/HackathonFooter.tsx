import { Flex, Icon } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { useTrack } from "hooks/analytics/useTrack";
import { WandIcon } from "lucide-react";
import { FiSearch } from "react-icons/fi";
import { Heading, LinkButton } from "tw-components";

interface HackathonFooterProps {
  TRACKING_CATEGORY: string;
}

export const HackathonFooter = ({
  TRACKING_CATEGORY,
}: HackathonFooterProps) => {
  const trackEvent = useTrack();

  return (
    <div className="flex w-full flex-col items-center gap-10 rounded-t-[50px] bg-[url('/assets/hackathon/footer-bg.png')] bg-center bg-cover bg-no-repeat px-6 py-20">
      <ChakraNextImage
        src={require("../../../public/assets/landingpage/thirdwebw.svg")}
        alt="hackathon-partner"
        w={{ base: "300px", md: "400px" }}
        objectFit="contain"
      />
      <ChakraNextImage
        src={require("../../../public/assets/landingpage/consumer-crypto-logo.svg")}
        alt="Hackathon"
        maxW={{ base: "full", lg: "5xl" }}
      />

      <Heading
        size="title.sm"
        color="white"
        opacity={0.7}
        letterSpacing={5}
        textAlign="center"
      >
        FEBRUARY 16 - 18
      </Heading>

      <Flex
        alignItems="center"
        justifyContent="center"
        gap="20px"
        flexWrap="wrap"
      >
        <LinkButton
          href="https://docs.google.com/forms/d/1CT8LPG1DrcpTKAW38ScVzTcyBNwS6ANOk6xpfjpXLAs/edit"
          onClick={() =>
            trackEvent({
              category: TRACKING_CATEGORY,
              action: "click",
              label: "register-now",
            })
          }
          h="68px"
          w={{ base: "90%", md: 80 }}
          fontSize="20px"
          leftIcon={<WandIcon className="size-6" />}
          color="black"
          flexShrink={0}
          background="rgba(255,255,255,1)"
          _hover={{
            background: "rgba(255,255,255,0.9)!important",
          }}
          isExternal
          noIcon
        >
          Register now
        </LinkButton>

        <LinkButton
          href="https://thirdweb.deform.cc/consumer-crypto-hackathon/"
          onClick={() =>
            trackEvent({
              category: TRACKING_CATEGORY,
              action: "click",
              label: "register-now",
            })
          }
          h="68px"
          w={{ base: "90%", md: 80 }}
          fontSize="20px"
          leftIcon={<Icon as={FiSearch} />}
          color="black"
          flexShrink={0}
          background="rgba(255,255,255,1)"
          _hover={{
            background: "rgba(255,255,255,0.9)!important",
          }}
          isExternal
          noIcon
        >
          Submission
        </LinkButton>
      </Flex>
    </div>
  );
};
