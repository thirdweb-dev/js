import { ChakraNextImage } from "components/Image";
import { useTrack } from "hooks/analytics/useTrack";
import { SearchIcon, WandIcon } from "lucide-react";
import { Heading, LinkButton } from "tw-components";

interface HackathonEarnFooterProps {
  TRACKING_CATEGORY: string;
}

export const HackathonEarnFooter = ({
  TRACKING_CATEGORY,
}: HackathonEarnFooterProps) => {
  const trackEvent = useTrack();

  return (
    <div className="flex w-full flex-col items-center gap-10 rounded-t-[50px] bg-[url('/assets/hackathon/footer-bg.png')] bg-center bg-cover bg-no-repeat px-6 py-20">
      <ChakraNextImage
        src={require("../../../public/assets/landingpage/earnxtw.svg")}
        alt="Hackathon"
        w="full"
        maxW={{ base: "full", lg: "5xl" }}
      />

      <Heading
        size="title.xl"
        color="white"
        letterSpacing={5}
        textAlign="center"
      >
        GDC HACKATHON
      </Heading>

      <Heading
        size="title.sm"
        color="white"
        opacity={0.7}
        letterSpacing={5}
        textAlign="center"
      >
        FEBRUARY 27 — MARCH 16
      </Heading>

      <div className="flex flex-row flex-wrap items-center justify-center gap-5">
        <LinkButton
          href="https://hackathons.deform.cc/thirdweb"
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
          href="https://hackathons.deform.cc/submission"
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
          leftIcon={<SearchIcon className="size-5" />}
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
      </div>
    </div>
  );
};
