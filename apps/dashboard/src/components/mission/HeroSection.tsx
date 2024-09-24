import { LandingDesktopMobileImage } from "components/landing-pages/desktop-mobile-image";
import { Heading } from "tw-components";

const HeroSection = ({ text }: { text: string }) => {
  return (
    <div className="mt-5 flex flex-col items-center md:mt-[140px]">
      <LandingDesktopMobileImage
        image={require("../../../public/assets/landingpage/desktop/xl-logo.png")}
        mobileImage={require("../../../public/assets/landingpage/mobile/xl-logo.png")}
        alt="thirdweb"
        maxW="80%"
      />
      <Heading
        size="title.lg"
        maxW="xl"
        fontWeight="semibold"
        textAlign="center"
        mt={46}
      >
        {text}
      </Heading>
    </div>
  );
};

export default HeroSection;
