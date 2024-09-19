import { ChakraNextImage } from "components/Image";
import { LandingGridSection } from "components/landing-pages/grid-section";
import { Heading, Text } from "tw-components";

const MajorSection = () => {
  return (
    <div className="w-full flex flex-col xl:flex-row items-center xl:items-start gap-[60px]">
      <Heading
        size="title.lg"
        fontWeight="semibold"
        flex="1"
        textAlign={{ base: "center", xl: "left" }}
      >
        However, there are two major obstacles to mass adoption.
      </Heading>
      <div className="flex flex-row max-w-[96rem]">
        <LandingGridSection desktopColumns={2}>
          <div className="flex flex-col gap-6">
            <ChakraNextImage
              src={require("../../../public/assets/landingpage/mobile/complexity.png")}
              alt="img-one"
            />
            <div className="flex flex-col gap-4">
              <Text size="body.xl" color="white" fontWeight="bold">
                Developer complexity
              </Text>
              To build a web3 app, developers need to piece together 10+
              different tools that don&apos;t natively talk to each other —
              creating a messy, fragmented DX that stifles innovation.
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <ChakraNextImage
              src={require("../../../public/assets/landingpage/mobile/user-experience.png")}
              alt="img-one"
            />
            <div className="flex flex-col gap-4">
              <Text size="body.xl" color="white" fontWeight="bold">
                User experience
              </Text>
              To interact with an onchain app, users must create a wallet, store
              their private keys, purchase & transfer crypto, pay gas, and sign
              a transaction for every action — creating a daunting onboarding
              process that stifles adoption.
            </div>
          </div>
        </LandingGridSection>
      </div>
    </div>
  );
};

export default MajorSection;
