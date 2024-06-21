import { Flex, Icon, useBreakpointValue } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Heading } from "tw-components";
import CaseStudyStatic, { type CaseStudyStaticProps } from "./CaseStudyStatic";

const ArrowRight = ({
  isFocused,
  ...rest
}: {
  isFocused: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  onClick: () => any;
}) => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill={isFocused ? "#fff" : "none"}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <title>right</title>
      <circle
        cx="24"
        cy="24"
        r="23"
        transform="rotate(-180 24 24)"
        stroke={isFocused ? "#0E0E0E" : "#626262"}
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.2929 31.7071C22.9024 31.3166 22.9024 30.6834 23.2929 30.2929L29.5858 24L23.2929 17.7071C22.9024 17.3166 22.9024 16.6834 23.2929 16.2929C23.6834 15.9024 24.3166 15.9024 24.7071 16.2929L31.7071 23.2929C32.0976 23.6834 32.0976 24.3166 31.7071 24.7071L24.7071 31.7071C24.3166 32.0976 23.6834 32.0976 23.2929 31.7071Z"
        fill={isFocused ? "#000" : "#626262"}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32 24C32 24.5523 31.5523 25 31 25L17 25C16.4477 25 16 24.5523 16 24C16 23.4477 16.4477 23 17 23L31 23C31.5523 23 32 23.4477 32 24Z"
        fill={isFocused ? "#000" : "#626262"}
      />
    </svg>
  );
};

const ArrowLeft = ({
  isFocused,
  ...rest
}: {
  isFocused: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  onClick: () => any;
}) => {
  return (
    <svg
      width="48"
      height="49"
      viewBox="0 0 48 49"
      fill={isFocused ? "#fff" : "none"}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <title>left</title>
      <circle
        cx="24"
        cy="24.0869"
        r="23"
        stroke={isFocused ? "#0E0E0E" : "#626262"}
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.7071 16.3798C25.0976 16.7703 25.0976 17.4035 24.7071 17.794L18.4142 24.0869L24.7071 30.3798C25.0976 30.7703 25.0976 31.4035 24.7071 31.794C24.3166 32.1845 23.6834 32.1845 23.2929 31.794L16.2929 24.794C15.9024 24.4035 15.9024 23.7703 16.2929 23.3798L23.2929 16.3798C23.6834 15.9893 24.3166 15.9893 24.7071 16.3798Z"
        fill={isFocused ? "#000" : "#626262"}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 24.0869C16 23.5346 16.4477 23.0869 17 23.0869H31C31.5523 23.0869 32 23.5346 32 24.0869C32 24.6392 31.5523 25.0869 31 25.0869H17C16.4477 25.0869 16 24.6392 16 24.0869Z"
        fill={isFocused ? "#000" : "#626262"}
      />
    </svg>
  );
};

interface LandingCaseStudyStaticSectionProps {
  studies: Omit<CaseStudyStaticProps, "TRACKING_CATEGORY">[];
  TRACKING_CATEGORY: string;
}
const CARD_WIDTH = 341;
const GAP = 24;

const LandingCaseStudyStaticSection = ({
  studies,
  TRACKING_CATEGORY,
}: LandingCaseStudyStaticSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isTablet = useBreakpointValue({ base: true, xl: false });
  const [isFocusedRight, setIsFocusedRight] = useState(false);
  const [isFocusedLeft, setIsFocusedLeft] = useState(false);

  const scroll = (direction: "right" | "left") => {
    const container = containerRef.current;
    if (container) {
      const scrollDistance = CARD_WIDTH + GAP + (!isTablet ? 16 : 0);
      const currentScroll = container.scrollLeft;

      const newScroll =
        direction === "left"
          ? currentScroll - scrollDistance
          : currentScroll + scrollDistance;
      container.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <Flex flexDir="column" w="full">
      <Flex
        alignItems="center"
        justifyContent={{ base: "center", md: "space-between" }}
        flexDir={{ base: "column", md: "row" }}
        gap={{ base: "24px", md: 0 }}
      >
        <Heading
          maxW={{ base: "100%", md: "558px" }}
          fontSize={[30, 40]}
          color="white"
          textAlign={{ base: "center", md: "left" }}
        >
          Smart contracts for every use case
        </Heading>

        <Flex alignItems="center" gap="16px">
          <Icon
            cursor="pointer"
            as={ArrowLeft}
            onClick={() => scroll("left")}
            fontSize="48px"
            isFocused={isFocusedLeft}
            onMouseOver={() => setIsFocusedLeft(true)}
            onMouseLeave={() => setIsFocusedLeft(false)}
          />
          <Icon
            cursor="pointer"
            as={ArrowRight}
            onClick={() => scroll("right")}
            transition="250ms ease"
            fontSize="48px"
            isFocused={isFocusedRight}
            onMouseOver={() => setIsFocusedRight(true)}
            onMouseLeave={() => setIsFocusedRight(false)}
          />
        </Flex>
      </Flex>

      <Flex
        alignItems="stretch"
        gap="24px"
        overflowX="auto"
        maxW="container.page"
        py={4}
        px={4}
        w="full"
        ref={containerRef}
        sx={{
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
        mt={{ base: "42px", md: "64px" }}
      >
        {studies.map(({ title, description, image, href, label }, idx) => (
          <CaseStudyStatic
            // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
            key={idx}
            title={title}
            description={description}
            image={image}
            label={label}
            href={href}
            TRACKING_CATEGORY={TRACKING_CATEGORY}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default LandingCaseStudyStaticSection;
