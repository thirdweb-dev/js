import { Spinner } from "@/components/ui/Spinner/Spinner";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { type ApiKey, useApiKeys } from "@3rdweb-sdk/react/hooks/useApi";
import { useEmbeddedWallets } from "@3rdweb-sdk/react/hooks/useEmbeddedWallets";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { AppLayout } from "components/app-layouts/app";
import { EmbeddedWallets } from "components/embedded-wallets";
import { ApiKeysMenu } from "components/settings/ApiKeys/Menu";
import { NoApiKeys } from "components/settings/ApiKeys/NoApiKeys";
import { ConnectSidebar } from "core-ui/sidebar/connect";
import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/router";
import { PageId } from "page-id";
import { useMemo, useState } from "react";
import type { ThirdwebNextPage } from "utils/types";
import { Analytics } from "../../../components/embedded-wallets/Users/Analytics";
import { SupportedPlatformLink } from "../../../components/wallets/SupportedPlatformLink";

const TRACKING_CATEGORY = "embedded-wallet";

const DashboardConnectEmbeddedWallets: ThirdwebNextPage = () => {
  const router = useRouter();
  const defaultTabIndex = Number.parseInt(router.query.tab?.toString() || "0");
  const defaultClientId = router.query.clientId?.toString();
  const { isLoading } = useLoggedInUser();
  const keysQuery = useApiKeys();

  const [selectedKey_, setSelectedKey] = useState<undefined | ApiKey>();

  const apiKeys = useMemo(() => {
    return (keysQuery?.data || []).filter((key) => {
      return !!(key.services || []).find(
        (srv) => srv.name === "embeddedWallets",
      );
    });
  }, [keysQuery]);

  const hasApiKeys = apiKeys.length > 0;

  // compute the actual selected key based on if there is a state, if there is a query param, or otherwise the first one
  const selectedKey = useMemo(() => {
    if (selectedKey_) {
      return selectedKey_;
    }
    if (apiKeys.length) {
      if (defaultClientId) {
        return apiKeys.find((k) => k.key === defaultClientId);
      }
      return apiKeys[0];
    }
    return undefined;
  }, [apiKeys, defaultClientId, selectedKey_]);

  const walletsQuery = useEmbeddedWallets(selectedKey?.key as string);

  const wallets = walletsQuery?.data || [];

  if (isLoading) {
    return (
      <div className="grid w-full place-items-center">
        <Spinner className="size-14" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex lg:justify-between gap-4 flex-col lg:flex-row">
        <div>
          <h1 className="font-semibold text-3xl tracking-tigher">
            In-App Wallets
          </h1>

          <div className="h-3" />

          <p className="max-w-[500px] text-muted-foreground ">
            A wallet infrastructure that enables apps to create, manage, and
            control their users wallets. Email login, social login, and
            bring-your-own auth supported.{" "}
            <TrackedLinkTW
              target="_blank"
              href="https://portal.thirdweb.com/connect/in-app-wallet/overview"
              label="learn-more"
              category={TRACKING_CATEGORY}
              className="text-link-foreground hover:text-foreground"
            >
              Learn more
            </TrackedLinkTW>
          </p>
        </div>

        <div>
          {hasApiKeys && selectedKey && (
            <ApiKeysMenu
              apiKeys={apiKeys}
              selectedKey={selectedKey}
              onSelect={setSelectedKey}
            />
          )}
        </div>
      </div>

      <div className="h-8" />

      {keysQuery.isLoading ? (
        <div className="flex h-[500px] items-center justify-center">
          <Spinner className="size-10" />
        </div>
      ) : (
        <>
          {!hasApiKeys && <NoApiKeys service="in-app wallets" />}

          {hasApiKeys && selectedKey && (
            <EmbeddedWallets
              apiKey={selectedKey}
              wallets={wallets}
              isLoading={walletsQuery.isLoading}
              isFetched={walletsQuery.isFetched}
              trackingCategory={TRACKING_CATEGORY}
              defaultTabIndex={defaultTabIndex}
            />
          )}
        </>
      )}

      <div className="h-16" />
      <Analytics trackingCategory={TRACKING_CATEGORY} />
      <div className="h-5" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ViewDocs />
        <Templates />
      </div>
    </div>
  );
};

function ViewDocs() {
  return (
    <div className="p-4 lg:p-6 bg-muted/50 border border-border rounded-lg">
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
        >
          What is an in-app wallet?
        </GuideLink>

        <GuideLink
          href="https://portal.thirdweb.com/connect/in-app-wallet/get-started"
          label="sdks-get-started"
        >
          Get started with In-App Wallets
        </GuideLink>

        <GuideLink
          href="https://portal.thirdweb.com/connect/in-app-wallet/how-to/connect-users"
          label="how-to-connect-your-users"
        >
          Using In-App Wallets with Connect
        </GuideLink>

        <GuideLink
          href="https://portal.thirdweb.com/connect/in-app-wallet/how-to/build-your-own-ui"
          label="how-to-build-your-own-ui"
        >
          How to Build Your Own UI
        </GuideLink>

        <GuideLink
          href="https://portal.thirdweb.com/connect/in-app-wallet/custom-auth/custom-auth-server"
          label="how-to-custom-auth-server"
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
}) {
  return (
    <TrackedLinkTW
      category={TRACKING_CATEGORY}
      label={"guide"}
      trackingProps={{
        guide: props.label,
      }}
      href={props.href}
      className="text-sm !text-muted-foreground hover:!text-foreground"
      target="_blank"
    >
      {props.children}
    </TrackedLinkTW>
  );
}

function Templates() {
  return (
    <div className="p-4 lg:p-6 bg-muted/50 border border-border rounded-lg">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">Relevant Templates</h3>
        <ArrowRightIcon className="size-4" />
      </div>

      <div className="h-6" />

      <div className="flex flex-col gap-3">
        <GuideLink
          href="https://github.com/thirdweb-example/embedded-smart-wallet"
          label="embedded-smart-wallet"
        >
          In-App Wallet + Account Abstraction Starter Kit
        </GuideLink>

        <GuideLink
          href="https://github.com/thirdweb-example/catattacknft"
          label="embedded-cat-attack"
        >
          Cat Attack [Demo Web Game]
        </GuideLink>

        <GuideLink
          href="https://github.com/thirdweb-example/embedded-wallet-custom-ui"
          label="embedded-wallet-with-custom-ui-react"
        >
          In-App Wallet With Custom UI [React]
        </GuideLink>

        <GuideLink
          href="https://github.com/thirdweb-example/embedded-wallet-custom-ui-react-native"
          label="embedded-wallet-with-custom-ui-react-native"
        >
          In-App Wallet With Custom UI [ReactNative]
        </GuideLink>
      </div>
    </div>
  );
}

DashboardConnectEmbeddedWallets.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <ConnectSidebar activePage="embedded-wallets" />
    {page}
  </AppLayout>
);

DashboardConnectEmbeddedWallets.pageId = PageId.DashboardConnectEmbeddedWallets;

export default DashboardConnectEmbeddedWallets;
