import { lazy, Suspense } from "react";
import {
  quotes,
  stringifyIgnoreFalsy,
  stringifyImports,
  stringifyProps,
} from "@/lib/code-gen";
import { LoadingDots } from "../../../../components/ui/LoadingDots";
import type { ConnectPlaygroundOptions } from "./types";

const CodeClient = lazy(() =>
  import("../../../../components/code/code.client").then((m) => ({
    default: m.CodeClient,
  })),
);

function CodeLoading() {
  return (
    <div className="flex min-h-[300px] grow items-center justify-center rounded-lg border bg-card">
      <LoadingDots />
    </div>
  );
}

export function CodeGen(props: { connectOptions: ConnectPlaygroundOptions }) {
  return (
    <div className="flex w-full grow flex-col">
      <Suspense fallback={<CodeLoading />}>
        <CodeClient
          className="xl:h-[calc(100vh-100px)]"
          code={getCode(props.connectOptions)}
          lang="tsx"
          scrollableClassName="xl:h-[calc(100vh-100px)]"
        />
      </Suspense>
    </div>
  );
}

function getCode(connectOptions: ConnectPlaygroundOptions) {
  const walletCodes: string[] = [];
  const imports = {
    "thirdweb/chains": [] as string[],
    "thirdweb/react": ["ConnectButton"] as string[],
    thirdweb: ["createThirdwebClient"] as string[],
    "thirdweb/wallets": [] as string[],
  };

  if (
    connectOptions.inAppWallet.enabled &&
    connectOptions.inAppWallet.methods.length > 0
  ) {
    walletCodes.push(`inAppWallet({
      auth: {
        options: ${JSON.stringify(connectOptions.inAppWallet.methods)},
      },
    })`);
    imports["thirdweb/wallets"].push("inAppWallet");
  }

  for (const wallet of connectOptions.walletIds) {
    walletCodes.push(`createWallet("${wallet}")`);
  }

  if (connectOptions.walletIds.length > 0) {
    imports["thirdweb/wallets"].push("createWallet");
  }

  let themeProp: string | undefined;
  if (
    connectOptions.theme.type === "dark" &&
    Object.keys(connectOptions.theme.darkColorOverrides || {}).length > 0
  ) {
    themeProp = `darkTheme({
      colors: ${JSON.stringify(connectOptions.theme.darkColorOverrides)},
    })`;
    imports["thirdweb/react"].push("darkTheme");
  }

  if (connectOptions.theme.type === "light") {
    if (
      Object.keys(connectOptions.theme.lightColorOverrides || {}).length > 0
    ) {
      themeProp = `lightTheme({
        colors: ${JSON.stringify(connectOptions.theme.lightColorOverrides)},
      })`;
      imports["thirdweb/react"].push("lightTheme");
    } else {
      themeProp = quotes("light");
    }
  }

  if (connectOptions.enableAccountAbstraction) {
    imports["thirdweb/chains"].push("ethereum");
  }

  const props: Record<string, string | undefined> = {
    accountAbstraction: connectOptions.enableAccountAbstraction
      ? accountAbstractCode
      : undefined,
    auth: connectOptions.enableAuth ? authPlaceholder : undefined,
    client: "client",
    connectButton: connectOptions.buttonLabel
      ? stringifyIgnoreFalsy({
          label: connectOptions.buttonLabel,
        })
      : undefined,
    connectModal: stringifyIgnoreFalsy({
      privacyPolicyUrl: connectOptions.privacyPolicyLink,
      showThirdwebBranding: !connectOptions.ShowThirdwebBranding
        ? false
        : undefined,
      size: connectOptions.modalSize,
      termsOfServiceUrl: connectOptions.termsOfServiceLink,
      title: connectOptions.modalTitle,
      titleIcon: connectOptions.modalTitleIcon,
    }),
    locale:
      connectOptions.localeId === "en_US"
        ? undefined
        : quotes(connectOptions.localeId),
    theme: themeProp,
    wallets: "wallets",
  };

  return `\
${stringifyImports(imports)}

const client = createThirdwebClient({
  clientId: "....",
});

const wallets = [${walletCodes.join(", ")}];

function Example() {
  return (
    <ConnectButton ${stringifyProps(props)} />
  );
}`;
}

const authPlaceholder = `
{
  async doLogin(params) {
    // call your backend to verify the signed payload passed in params
  },
  async doLogout() {
    // call your backend to logout the user if needed
  },
  async getLoginPayload(params) {
    // call your backend and return the payload
  },
  async isLoggedIn() {
    // call your backend to check if the user is logged in
  },
}
`;

const accountAbstractCode = `\
{
  chain: ethereum, // replace with the chain you want
  sponsorGas: true
}
`;
