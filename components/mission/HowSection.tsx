import { Container, Flex } from "@chakra-ui/react";
import { LandingDesktopMobileImage } from "components/landing-pages/desktop-mobile-image";
import { LandingFAQ } from "components/landing-pages/faq";
import React, { useEffect, useRef, useState } from "react";
import { Heading, Text } from "tw-components";

interface HowSectionProps {
  TRACKING_CATEGORY: string;
}

const faqs = [
  {
    title: "Digital Asset Ownership",
    description: (
      <Text>
        From digital assets like skins and weapons in games to the tokenization
        of real world assets like watches and Pokemon cards, blockchain enables
        owners to truly own their digital assets in the same way they would own
        physical assets.
      </Text>
    ),
  },
  {
    title: "A better social media",
    description: (
      <Text>
        Web3 inverts the ownership model of content from being owned by
        platforms in walled gardens to being owned by the users who create them.
        Any content published onto the blockchain can be displayed on any
        client, and all social graphs are preserved across apps.
      </Text>
    ),
  },
  {
    title: "An open internet",
    description: (
      <Text>
        Building partnerships with validation is frequently a painful business
        and technical problem. The blockchain solves this by enabling
        permission-less integration. Let&apos;s look at AMEX. They frequently
        need to onboard new partners into their network to provide additional
        benefits to their members. This is a large value prop of their product,
        and only by doing this well, can they encourage re-subscription (paying
        the annual card fee).
      </Text>
    ),
  },
];

const HowSection = ({ TRACKING_CATEGORY }: HowSectionProps) => {
  const [offsetY, setOffsetY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (ref.current) {
      const elementTop =
        ref.current.getBoundingClientRect().top + window.pageYOffset;

      const startOffset = window.innerHeight / 2;
      const scrollPosition = window.pageYOffset;

      if (scrollPosition > elementTop - startOffset) {
        const newOffset = Math.min(
          (scrollPosition - elementTop + startOffset) * 0.2,
          150,
        );
        setOffsetY(newOffset);
      } else {
        setOffsetY(0);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      position="relative"
      flexDir={{ base: "column", xl: "row" }}
      gap={{ base: "80px", xl: 0 }}
      ref={ref}
    >
      <LandingDesktopMobileImage
        image={require("public/assets/landingpage/mobile/parallax-left-v2.png")}
        mobileImage={require("public/assets/landingpage/mobile/parallax-left-v2.png")}
        alt="parallax-one"
        maxW={{ base: "100%", xl: "412px", "2xl": "512px" }}
        transform={{
          base: "auto",
          xl: `translateY(${-offsetY + 200}px)`,
        }}
        transition="transform 0.8s cubic-bezier(0.33, 1, 0.68, 1)"
      />

      <Container
        as={Flex}
        flexDir="column"
        maxW="container.page"
        alignItems="center"
        position="relative"
        zIndex={5}
      >
        <Heading textAlign="center" size="title.lg">
          But how?
        </Heading>
        <Text mt={3} maxW="640px" size="body.xl" textAlign="center">
          Web3 enables developers to build internet products with public
          backends. This unlocks some powerful new digital experiences:
        </Text>

        <LandingFAQ
          hideMarginTop
          TRACKING_CATEGORY={TRACKING_CATEGORY}
          title=""
          faqs={faqs}
          titleSize="title.2xl"
        />
      </Container>

      <LandingDesktopMobileImage
        image={require("public/assets/landingpage/desktop/parallax-right-v2.png")}
        mobileImage={require("public/assets/landingpage/desktop/parallax-right-v2.png")}
        alt="parallax-one"
        maxW={{ base: "100%", xl: "412px", "2xl": "512px" }}
        transform={{
          base: "auto",
          xl: `translateY(${-offsetY + 200}px)`,
        }}
        transition="transform 0.8s cubic-bezier(0.33, 1, 0.68, 1)"
      />
    </Flex>
  );
};

export default HowSection;
