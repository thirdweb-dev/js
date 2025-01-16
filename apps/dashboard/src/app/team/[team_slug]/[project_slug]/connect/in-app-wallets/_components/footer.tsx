import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { ArrowRightIcon } from "lucide-react";
import { SupportedPlatformLink } from "../../../../../../../components/wallets/SupportedPlatformLink";

export function InAppWalletFooterSection(props: {
  trackingCategory: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <ViewDocs trackingCategory={props.trackingCategory} />
      <Templates trackingCategory={props.trackingCategory} />
    </div>
  );
}

function ViewDocs(props: {
  trackingCategory: string;
}) {
  const TRACKING_CATEGORY = props.trackingCategory;
  return (
    <div className="rounded-lg border border-border bg-card p-4 lg:p-6">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">View Docs</h3>
        <ArrowRightIcon className="size-4" />
      </div>

      <div className="h-4" />

      <div className="grid grid-cols-2 gap-4">
        <SupportedPlatformLink
          trackingCategory={TRACKING_CATEGORY}
          platform="React"
          href="https://portal.thirdweb.com/connect/in-app-wallet/overview"
        />

        <SupportedPlatformLink
          trackingCategory={TRACKING_CATEGORY}
          platform="Unity"
          href="https://portal.thirdweb.com/unity/wallets/providers/embedded-wallet"
        />
        <SupportedPlatformLink
          trackingCategory={TRACKING_CATEGORY}
          platform="React Native"
          href="https://portal.thirdweb.com/react/v5/in-app-wallet/get-started"
        />
        <SupportedPlatformLink
          trackingCategory={TRACKING_CATEGORY}
          platform="TypeScript"
          href="https://portal.thirdweb.com/connect/in-app-wallet/overview"
        />
      </div>

      <div className="h-6" />

      <div className="flex items-center gap-2">
        <h3 className="font-semibold">Relevant Guides</h3>
        <ArrowRightIcon className="size-4" />
      </div>

      <div className="h-4" />

      <div className="flex flex-col gap-3">
        <GuideLink
          href="https://blog.thirdweb.com/what-are-embedded-wallets/"
          label="what-is-an-embedded-wallet"
          trackingCategory={TRACKING_CATEGORY}
        >
          What is an in-app wallet?
        </GuideLink>

        <GuideLink
          href="https://portal.thirdweb.com/connect/in-app-wallet/get-started"
          label="sdks-get-started"
          trackingCategory={TRACKING_CATEGORY}
        >
          Get started with In-App Wallets
        </GuideLink>

        <GuideLink
          href="https://portal.thirdweb.com/connect/in-app-wallet/how-to/connect-users"
          label="how-to-connect-your-users"
          trackingCategory={TRACKING_CATEGORY}
        >
          Using In-App Wallets with Connect
        </GuideLink>

        <GuideLink
          href="https://portal.thirdweb.com/connect/in-app-wallet/how-to/build-your-own-ui"
          label="how-to-build-your-own-ui"
          trackingCategory={TRACKING_CATEGORY}
        >
          How to Build Your Own UI
        </GuideLink>

        <GuideLink
          href="https://portal.thirdweb.com/connect/in-app-wallet/custom-auth/custom-auth-server"
          label="how-to-custom-auth-server"
          trackingCategory={TRACKING_CATEGORY}
        >
          Create a custom auth server
        </GuideLink>
      </div>
    </div>
  );
}

function GuideLink(props: {
  label: string;
  children: React.ReactNode;
  href: string;
  trackingCategory: string;
}) {
  return (
    <TrackedLinkTW
      category={props.trackingCategory}
      label="guide"
      trackingProps={{
        guide: props.label,
      }}
      href={props.href}
      className="!text-muted-foreground hover:!text-foreground text-sm"
      target="_blank"
    >
      {props.children}
    </TrackedLinkTW>
  );
}

function Templates(props: {
  trackingCategory: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 lg:p-6">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">Relevant Templates</h3>
        <ArrowRightIcon className="size-4" />
      </div>

      <div className="h-6" />

      <div className="flex flex-col gap-3">
        <GuideLink
          href="https://github.com/thirdweb-example/embedded-smart-wallet"
          label="embedded-smart-wallet"
          trackingCategory={props.trackingCategory}
        >
          In-App Wallet + Account Abstraction Starter Kit
        </GuideLink>

        <GuideLink
          href="https://github.com/thirdweb-example/catattacknft"
          label="embedded-cat-attack"
          trackingCategory={props.trackingCategory}
        >
          Cat Attack [Demo Web Game]
        </GuideLink>

        <GuideLink
          href="https://github.com/thirdweb-example/embedded-wallet-custom-ui"
          label="embedded-wallet-with-custom-ui-react"
          trackingCategory={props.trackingCategory}
        >
          In-App Wallet With Custom UI [React]
        </GuideLink>

        <GuideLink
          href="https://github.com/thirdweb-example/embedded-wallet-custom-ui-react-native"
          label="embedded-wallet-with-custom-ui-react-native"
          trackingCategory={props.trackingCategory}
        >
          In-App Wallet With Custom UI [ReactNative]
        </GuideLink>
      </div>
    </div>
  );
}
