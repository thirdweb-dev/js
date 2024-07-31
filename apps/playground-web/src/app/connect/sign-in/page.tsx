import { Button } from "@/components/ui/button";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CodeExample } from "../../../components/code/code-example";
import { CustomizedConnect } from "../../../components/sign-in/custom";
import { HooksPreview } from "../../../components/sign-in/hooks";
import { StyledConnectButton } from "../../../components/styled-connect-button";
import { StyledConnectEmbed } from "../../../components/styled-connect-embed";

export const metadata: Metadata = {
  metadataBase,
  title: "Sign In, Account Abstraction and SIWE Auth | thirdweb Connect",
  description:
    "Let users sign up with their email, phone number, social media accounts or directly with a wallet. Seemlessly integrate account abstraction and SIWE auth.",
};

export default function Page() {
  return (
    <main className="flex-1 content-center relative py-12 md:py-24 lg:py-32 xl:py-48 space-y-12 md:space-y-24">
      <section className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4 min-h-[100%]">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-inter mb-6 text-balance">
                Sign in
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-300 mb-6 font-inter">
                Create a login experience tailor-made for your app. Add your
                wallets of choice, enable web2 sign-in options and create a
                modal that fits your brand.
              </p>
            </div>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link
                  target="_blank"
                  href="https://portal.thirdweb.com/connect/sign-in/overview"
                >
                  View docs
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link target="_blank" href="https://thirdweb.com/contact-us">
                  Book a Demo
                </Link>
              </Button>
            </div>
          </div>
          <div className="w-full mx-auto my-auto sm:w-full order-first lg:order-last relative flex flex-col space-y-2">
            <div className="max-w-full sm:max-w-[600px]">
              <Image
                src={"/connectors.png"}
                width={600}
                height={400}
                objectFit={"contain"}
                alt=""
                priority={true}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4 md:px-6 space-y-8">
        <ButtonComponent />
      </section>

      <section className="container px-4 md:px-6 space-y-8">
        <EmbedComponent />
      </section>

      <section className="container px-4 md:px-6 space-y-8">
        <CustomizedComponent />
      </section>

      <section className="container px-4 md:px-6 space-y-8">
        <Hooks />
      </section>
    </main>
  );
}

function ButtonComponent() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Button Component
        </h2>
        <p className="max-w-[600px]">
          When clicked opens a modal and allows users to connect to various
          wallets.
          <br />
          Extremely customizable and easy to use.
        </p>
      </div>

      <CodeExample
        preview={<StyledConnectButton />}
        code={`import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";

const THIRDWEB_CLIENT = createThirdwebClient({
clientId: "<YOUR_CLIENT_ID>"
});

function App(){
return (
<ConnectButton client={THIRDWEB_CLIENT} />
);
};`}
        lang="tsx"
      />
    </>
  );
}

function EmbedComponent() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Embed Component
        </h2>
        <p className="max-w-[600px]">
          Inline component to connect to various wallets.
          <br />
          Use this to create your own full screen login page.
        </p>
      </div>

      <CodeExample
        preview={<StyledConnectEmbed />}
        code={`import { createThirdwebClient } from "thirdweb";
import { ConnectEmbed } from "thirdweb/react";

const THIRDWEB_CLIENT = createThirdwebClient({
clientId: "<YOUR_CLIENT_ID>"
});

function App(){
return (
<ConnectEmbed client={THIRDWEB_CLIENT} />
);
};`}
        lang="tsx"
      />
    </>
  );
}

function CustomizedComponent() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Customized Component
        </h2>
        <p className="max-w-[600px]">
          Change the look and feel of the connect button without rewriting your
          own.
        </p>
      </div>

      <CodeExample
        preview={<CustomizedConnect />}
        code={`import { createThirdwebClient } from "thirdweb";
import { ConnectEmbed } from "thirdweb/react";

const THIRDWEB_CLIENT = createThirdwebClient({
clientId: "<YOUR_CLIENT_ID>"
});

function App(){
return (
<ConnectButton
      client={THIRDWEB_CLIENT}
      connectButton={{
        label: "Custom Connect Button",
      }}
      showAllWallets={false}
      connectModal={{
        title: "Custom Connect Modal",
        size: "compact",
      }}
      theme={darkTheme({
        colors: {
          modalBg: "#281866",
          accentButtonBg: "#281866",
          connectedButtonBgHover: "#281866",
          borderColor: "rgba(256, 256,256, 0.1)",
          accentText: "rgba(256, 256,256, 0.1)",
          connectedButtonBg: "#281866",
          tertiaryBg: "rgba(256, 256,256, 0.1)",
          primaryButtonBg: "#281866",
          secondaryButtonBg: "rgba(256, 256,256, 0.1)",
          primaryButtonText: "#E7E8E9",
          primaryText: "#E7E8E9",
          separatorLine: "rgba(256, 256,256, 0.1)",
        },
      })}
    />
);
};`}
        lang="tsx"
      />
    </>
  );
}

function Hooks() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Custom UI
        </h2>
        <p className="max-w-[600px]">
          Build your own connect UI using react hooks.
          <br />
          Wallet state management is all handled for you.
        </p>
      </div>

      <CodeExample
        preview={<HooksPreview />}
        code={`// Using your own UI
        import { useConnect } from "thirdweb/react";
        import { createWallet } from "thirdweb/wallets";
      
        function App(){
          const { connect } = useConnect();
      
          return (<>
      <button onClick={() => connect(async () => {
        // 350+ wallets supported with id autocomplete
        const wallet = createWallet("io.metamask");
        await wallet.connect({ client });
        return wallet;
      })}>Connect with Metamask</button>
      </>);
      };`}
        lang="tsx"
      />
    </>
  );
}
