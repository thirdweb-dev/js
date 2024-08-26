import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { useTrack } from "hooks/analytics/useTrack";
import { useCallback, useEffect, useState } from "react";
import { Carousel as ReactResponsiveCarousel } from "react-responsive-carousel";
import { PlaygroundMenu } from "./PlaygroundMenu";

const showcaseMenus = [
  {
    id: "connect-icon",
    title: "Onboard users",
    href: "https://playground.thirdweb.com/connect/sign-in/button",
    description: "Onboard anyone with every sign-in option for web2 & web3.",
    image: require("../../../public/assets/product-pages/connect/icon-connect.png"),
  },
  {
    id: "account-abstraction-icon",
    title: "Abstract complexity",
    href: "https://portal.thirdweb.com/connect/in-app-wallet/overview",
    description:
      "Make your app easy to use with in-app wallets & account abstraction.",
    image: require("../../../public/assets/product-pages/connect/icon-aa.png"),
  },
  {
    id: "pay-icon",
    title: "Generate revenue",
    href: "https://portal.thirdweb.com/connect/pay/buy-with-crypto",
    description:
      "The easiest way for users to transact in your app with fiat & cross-chain crypto.",
    image: require("../../../public/assets/product-pages/connect/icon-pay.png"),
  },
];

const showcaseImages = [
  require("../../../public/assets/product-pages/connect/connect.png"),
  require("../../../public/assets/product-pages/connect/account-abstraction.png"),
  require("../../../public/assets/product-pages/connect/pay.png"),
];

const Carousel = ({ TRACKING_CATEGORY }: { TRACKING_CATEGORY: string }) => {
  const [selectedShowCaseIdx, setSelectedShowCaseIdx] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(false);
  const [canAnimate, setCanAnimate] = useState(false);

  const trackEvent = useTrack();

  const increment = useCallback(() => {
    setSelectedShowCaseIdx((idx) => (idx === 2 ? 0 : idx + 1));
  }, []);

  // FIXME: this can likely be achieved fully via CSS
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (!hoveredCard) {
      const timer = setInterval(increment, 3500);

      return () => clearInterval(timer);
    }
  }, [hoveredCard, increment]);

  // FIXME: this can likely be achieved fully via CSS
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (selectedShowCaseIdx > 0 && !canAnimate) {
      setCanAnimate(true);
    }
  }, [selectedShowCaseIdx, canAnimate]);

  return (
    <Flex
      flexDir={{ base: "column", md: "row" }}
      gap={{ base: "24px", md: 0 }}
      alignItems="stretch"
      w="full"
    >
      <Box
        w="full"
        display={{ base: "flex", md: "none" }}
        className="sliderWrapper"
      >
        <ReactResponsiveCarousel
          swipeable
          centerMode
          infiniteLoop={false}
          showThumbs={false}
          autoPlay={false}
          showArrows={false}
          showStatus={false}
          showIndicators={false}
          selectedItem={selectedShowCaseIdx}
          onChange={(idx) => {
            setSelectedShowCaseIdx(idx);
          }}
          onSwipeMove={() => {
            if (!hoveredCard) {
              setHoveredCard(true);
            }
            return true;
          }}
        >
          {showcaseMenus.map(({ id, title, description, href, image }, idx) => (
            <PlaygroundMenu
              key={id}
              title={title}
              description={description}
              image={image}
              href={href}
              isSelected={idx === selectedShowCaseIdx}
              onClick={() => {
                setSelectedShowCaseIdx(idx);
                setHoveredCard(true);
              }}
            />
          ))}
        </ReactResponsiveCarousel>
      </Box>

      <SimpleGrid
        columns={1}
        marginRight={{ base: "0", md: "24px" }}
        width="full"
        maxW={{ base: "full", md: "330px" }}
        gap="24px"
        display={{ base: "none", md: "grid" }}
      >
        {showcaseMenus.map(({ id, title, description, image, href }, idx) => {
          return (
            <PlaygroundMenu
              key={id}
              title={title}
              description={description}
              image={image}
              href={href}
              isSelected={idx === selectedShowCaseIdx}
              onMouseOver={() => {
                setSelectedShowCaseIdx(idx);
                setHoveredCard(true);
              }}
              onMouseOut={() => {
                setHoveredCard(false);
              }}
              onClick={() => {
                setSelectedShowCaseIdx(idx);
                setHoveredCard(true);
                trackEvent({
                  category: TRACKING_CATEGORY,
                  action: "click",
                  label: id,
                });
              }}
            />
          );
        })}
      </SimpleGrid>
      <Flex width="full" maxW="786px">
        {showcaseImages.map((img, idx) => (
          <ChakraNextImage
            // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
            key={idx}
            width="full"
            src={img}
            display={idx === selectedShowCaseIdx ? "block" : "none"}
            sx={{
              "@keyframes fadeIn": {
                from: { opacity: 0 },
                to: { opacity: 1 },
              },
              animation:
                idx === selectedShowCaseIdx && canAnimate
                  ? "fadeIn 0.75s ease-in-out"
                  : "none",
            }}
            alt=""
            priority
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default Carousel;
