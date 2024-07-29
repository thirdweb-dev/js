import Image from "next/image";
import { Button } from "../../../@/components/ui/button";
import { TrackedLinkTW } from "../../../@/components/ui/tracked-link";

export const PublishUpsellCard: React.FC = () => {
  return (
    <div className="border border-border rounded-xl p-8 md:p-10 flex gap-10 shadow-lg">
      <div className="flex flex-col gap-6">
        <h2 className="text-3xl tracking-tigher font-bold">
          {"Accelerate your protocol's growth"}
        </h2>

        <p className="text-secondary-foreground">
          Publishing your contract is the best way to get your contracts in
          front of our 70k+ community of web3 developers.
        </p>

        <div className="flex gap-2">
          <Image
            className="size-6 hidden md:block"
            src={require("/public/assets/product-pages/publish/hero-icon-1.png")}
            alt=""
          />

          <p className="text-secondary-foreground">
            <span className="font-semibold text-foreground">
              Save development time.{" "}
            </span>
            Focus on protocol development and save time by not having to build
            middleware layer yourself.
          </p>
        </div>

        <div className="flex gap-2">
          <Image
            className="size-6 hidden md:block"
            src={require("/public/assets/product-pages/publish/hero-icon-2.png")}
            alt=""
          />
          <p className="text-secondary-foreground">
            <span className="font-semibold text-foreground">
              Shareable landing page.{" "}
            </span>
            By publishing your contract, your contracts become easily shareable
            with a landing page for your contract.
          </p>
        </div>

        <div className="flex gap-2 mt-auto pt-4">
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
        className="hidden md:block grayscale invert dark:filter-none w-[40%]"
        draggable={false}
        src={require("../../../../public/assets/landingpage/explore-featured.png")}
        alt=""
      />
    </div>
  );
};
