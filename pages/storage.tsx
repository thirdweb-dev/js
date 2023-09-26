import { Container, Flex } from "@chakra-ui/react";
import { LandingEndCTA } from "components/landing-pages/end-cta";
import { LandingGridSection } from "components/landing-pages/grid-section";
import { LandingGuidesShowcase } from "components/landing-pages/guide-showcase";
import { LandingHeroWithSideImage } from "components/landing-pages/hero-with-side-image";
import { LandingIconSectionItem } from "components/landing-pages/icon-section-item";
import { LandingLayout } from "components/landing-pages/layout";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { PageId } from "page-id";
import { Card } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "storage-landing";

const GUIDES = [
  {
    title: "Host Your Web Application On IPFS",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/03/How-to-Host-Your-App-On-IPFS.png",
    link: "https://blog.thirdweb.com/guides/how-to-host-your-web-app-on-ipfs/",
  },
  {
    title: "What Is IPFS and How Does it Store NFT Metadata?",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2022/08/thumbnail-43.png",
    link: "https://blog.thirdweb.com/guides/securing-pinning-your-nft-with-ipfs/",
  },
];

const CASE_STUDIES = [
  {
    title: "Tally Builds DAO Platform for the Decentralized Web",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/07/Tally-Launches-a-Fully-Decentralized-DAO-Voting-App-with-IPFS-1.jpg",
    link: "https://blog.thirdweb.com/case-studies/tally-expands-the-decentralized-web-with-dao-tools/",
  },
  {
    title:
      "Base Launches its First Builder Quest & Brings New Developers Onchain",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/05/Base-Launches-its-First-Builder-Quest-and-Brings-New-Developers-Onchain---thirdweb-Case-Study-1.png",
    link: "https://blog.thirdweb.com/case-studies/base-builder-quest-brings-developers-onchain/",
  },
  {
    title:
      "Mirror Empowers Creators to Build Engaged Audiences with Subscriber NFTs",
    image:
      "https://blog.thirdweb.com/content/images/size/w2000/2023/02/Mirror-case-study.png",
    link: "https://blog.thirdweb.com/case-studies/mirror-creators-build-loyal-audiences-with-subscriber-nfts/",
  },
];

const InteractLanding: ThirdwebNextPage = () => {
  return (
    <LandingLayout
      bgColor="#0F0F0F"
      seo={{
        title: "Decentralized Storage with IPFS, Made Simple",
        description:
          "Upload & pin files to IPFS without the complexity of decentralized file management. Ultra-fast upload speeds with industry-leading infra.",
        openGraph: {
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/storage.png`,
              width: 1200,
              height: 630,
              alt: "Decentralized Storage with IPFS, Made Simple",
            },
          ],
        },
      }}
    >
      <Container
        maxW="container.page"
        as={Flex}
        flexDir="column"
        gap={{ base: "80px", md: "120px" }}
      >
        <LandingHeroWithSideImage
          miniTitle="Storage"
          title="Decentralized file storage,"
          titleWithGradient="made simple"
          subtitle="Easily upload and pin files to IPFS, without the complexity of decentralized file management. Ultra-fast upload speeds with industry-leading infrastructure."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="/dashboard/infrastructure/storage"
          contactUsTitle="Book Demo"
          gradient="linear(to-r, #BFA3DA, #84309C, #C735B0)"
          image={require("public/assets/product-pages/hero/desktop-hero-storage.png")}
          mobileImage={require("public/assets/product-pages/hero/mobile-hero-storage.png")}
        />

        <LandingGridSection title={<></>}>
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/infra/icon-ship.svg")}
            title="Go-to-market faster"
            description="Save development time by uploading files without fetching from multiple IPFS gateways or worrying about file and metadata upload formats."
          />
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/infra/icon-efficient.svg")}
            title="Fast, high availability"
            description="Get fast upload and download speeds enabled by industry leading infrastructure. Upload and forget — we ensure that your files are always accessible."
          />
          <LandingIconSectionItem
            icon={require("public/assets/product-pages-icons/infra/icon-dashboard.svg")}
            title="Full flexibility"
            description="Choose how to upload your files. Upload directly through the dashboard, with your CLI or using our SDKs."
          />
        </LandingGridSection>
        <LandingGridSection title={<></>}>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/infra/icon-image.svg")}
              title="All file types supported"
              description="Includes 3D images, video, music, HTML, text, etc."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/infra/icon-automatic-file-upload.svg")}
              title="Faster file uploads"
              description="Optimized upload latency to increase speed of file uploads."
            />
          </Card>
          <Card p={8}>
            <LandingIconSectionItem
              icon={require("public/assets/product-pages-icons/infra/icon-manage.svg")}
              title="Manage pinned files"
              description="Pin and unpin files from IPFS."
            />
          </Card>
        </LandingGridSection>
        <LandingGuidesShowcase
          title="Learn how to build with decentralized storage"
          description="Launch web3 apps using IPFS file storage, hosting, & management"
          category={TRACKING_CATEGORY}
          guides={GUIDES}
        />

        <LandingGuidesShowcase
          title="The best web3 apps use thirdweb's smart contract tools"
          description="Seamlessly integrate your smart contracts into any app so you can focus on building a great user experience."
          category={TRACKING_CATEGORY}
          guides={CASE_STUDIES}
          caseStudies
        />

        <LandingEndCTA
          title="Start building"
          titleWithGradient="today."
          trackingCategory={TRACKING_CATEGORY}
          ctaLink="/dashboard/infrastructure/storage"
          gradient="linear(to-r, #BFA3DA, #84309C, #C735B0)"
        />
      </Container>
    </LandingLayout>
  );
};

InteractLanding.pageId = PageId.InteractLanding;

export default InteractLanding;
