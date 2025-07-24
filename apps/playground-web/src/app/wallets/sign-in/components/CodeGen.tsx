import { lazy, Suspense } from "react";
import { CodeLoading } from "../../../../components/code/code.client";
import type { ConnectPlaygroundOptions } from "./types";

const CodeClient = lazy(
  () => import("../../../../components/code/code.client"),
);

export function CodeGen(props: { connectOptions: ConnectPlaygroundOptions }) {
  return (
    <div className="flex w-full grow flex-col">
      <Suspense fallback={<CodeLoading />}>
        <CodeClient
          className="xl:h-[calc(100vh-100px)]"
          code={getCode(props.connectOptions)}
          lang="tsx"
          // Need to add max-h in both places - TODO figure out a better way
          loader={<CodeLoading />}
          scrollableClassName="xl:h-[calc(100vh-100px)]"
        />
      </Suspense>
    </div>
  );
}

function getCode(connectOptions: ConnectPlaygroundOptions) {
  const walletCodes: string[] = [];
  const imports = {
    chains: [] as string[],
    react: [] as string[],
    thirdweb: [] as string[],
    wallets: [] as string[],
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
    imports.wallets.push("inAppWallet");
  }

  for (const wallet of connectOptions.walletIds) {
    walletCodes.push(`createWallet("${wallet}")`);
  }

  if (connectOptions.walletIds.length > 0) {
    imports.wallets.push("createWallet");
  }

  let themeProp: string | undefined;
  if (
    connectOptions.theme.type === "dark" &&
    Object.keys(connectOptions.theme.darkColorOverrides || {}).length > 0
  ) {
    themeProp = `darkTheme({
      colors: ${JSON.stringify(connectOptions.theme.darkColorOverrides)},
    })`;
    imports.react.push("darkTheme");
  }

  if (connectOptions.theme.type === "light") {
    if (
      Object.keys(connectOptions.theme.lightColorOverrides || {}).length > 0
    ) {
      themeProp = `lightTheme({
        colors: ${JSON.stringify(connectOptions.theme.lightColorOverrides)},
      })`;
      imports.react.push("lightTheme");
    } else {
      themeProp = quotes("light");
    }
  }

  if (connectOptions.enableAccountAbstraction) {
    imports.chains.push("ethereum");
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
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
${imports.react.length > 0 ? `import { ${imports.react.join(", ")} } from "thirdweb/react";` : ""}
${imports.wallets.length > 0 ? `import { ${imports.wallets.join(", ")} } from "thirdweb/wallets";` : ""}
${imports.chains.length > 0 ? `import { ${imports.chains.join(", ")} } from "thirdweb/chains";` : ""}

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

function stringifyIgnoreFalsy(
  value: Record<string, string | undefined | boolean>,
) {
  const _value: Record<string, string | boolean> = {};

  for (const key in value) {
    if (value[key] !== undefined && value[key] !== "") {
      _value[key] = value[key];
    }
  }

  return JSON.stringify(_value);
}

function stringifyProps(props: Record<string, string | undefined | boolean>) {
  const _props: Record<string, string | undefined | boolean> = {};

  for (const key in props) {
    if (props[key] !== undefined && props[key] !== "") {
      _props[key] = props[key];
    }
  }

  return Object.entries(_props)
    .map(([key, value]) => `${key}={${value}}`)
    .join("\n");
}

function quotes(value: string) {
  return `"${value}"`;
}
