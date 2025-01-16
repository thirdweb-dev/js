import { Button } from "@/components/ui/button";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import Image from "next/image";
import exploreFeatureImage from "../../../../public/assets/landingpage/explore-featured.png";
import heroIcon1 from "../../../../public/assets/product-pages/publish/hero-icon-1.png";
import heroIcon2 from "../../../../public/assets/product-pages/publish/hero-icon-2.png";

export const PublishUpsellCard: React.FC = () => {
  return (
    <div className="flex gap-10 rounded-xl border border-border bg-card p-8 shadow-lg md:p-10">
      <div className="flex flex-col gap-6">
        <h2 className="font-bold text-3xl tracking-tighter">
          Accelerate your protocol's growth
        </h2>

        <p className="text-muted-foreground">
          Publishing your contract is the best way to get your contracts in
          front of our 70k+ community of web3 developers.
        </p>

        <div className="flex gap-2">
          <Image className="hidden size-6 md:block" src={heroIcon1} alt="" />

          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              Save development time.{" "}
            </span>
            Focus on protocol development and save time by not having to build
            middleware layer yourself.
          </p>
        </div>

        <div className="flex gap-2">
          <Image className="hidden size-6 md:block" src={heroIcon2} alt="" />
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              Shareable landing page.{" "}
            </span>
            By publishing your contract, your contracts become easily shareable
            with a landing page for your contract.
          </p>
        </div>

        <div className="mt-auto flex gap-2 pt-4">
          <Button asChild>
            <TrackedLinkTW
              category="publish_upsell"
              label="contact_us"
              href="/contact-us"
              target="_blank"
            >
              Get In Touch
            </TrackedLinkTW>
          </Button>

          <Button asChild variant="outline">
            <TrackedLinkTW
              category="publish_upsell"
              label="learn_more"
              target="_blank"
              href="https://portal.thirdweb.com/contracts/publish/overview"
            >
              Learn More
            </TrackedLinkTW>
          </Button>
        </div>
      </div>
      <Image
        className="hidden w-[40%] grayscale invert md:block dark:filter-none"
        draggable={false}
        src={exploreFeatureImage}
        alt=""
      />
    </div>
  );
};
