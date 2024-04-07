type WalletSetupOptions = {
  imports: string[];
  wallets?: string;
  recommendedWallets?: string;
  thirdwebProvider: {
    locale: string;
    authConfig?: string;
  };
  smartWalletOptions?: {
    gasless: boolean;
  };
  connectWallet: {
    theme?: string;
    connectButton?: string;
    connectModal?: string;
    auth?: string;
    modalTitle?: string;
    chain?: string;
    modalTitleIconUrl?: string;
    welcomeScreen?: string;
    termsOfServiceUrl?: string;
    privacyPolicyUrl?: string;
    showThirdwebBranding?: string;
  };
  baseTheme: "light" | "dark";
  colorOverrides: Record<string, string>;
};

export function getCode(options: WalletSetupOptions) {
  const hasThemeOverrides = Object.keys(options.colorOverrides).length > 0;
  if (hasThemeOverrides) {
    const themeFn = options.baseTheme === "dark" ? "darkTheme" : "lightTheme";

    options.connectWallet.theme = `${themeFn}(${JSON.stringify({
      colors: options.colorOverrides,
    })})`;

    options.imports.push(themeFn);
  }

  if (options.thirdwebProvider.locale !== "en()") {
    options.imports.push(options.thirdwebProvider.locale.slice(0, -2));
  }

  return `\
import { ThirdwebProvider, ConnectButton } from "thirdweb/react";
import { sepolia } from "thirdweb/chains";
${options.imports.length > 0 ? `import { ${options.imports.join(",")} } from "thirdweb/wallets";` : ""}

const client = createThirdwebClient({
  clientId: "YOUR_CLIENT_ID",
});

export const wallets = ${options.wallets};

${
  options.smartWalletOptions
    ? `const accountAbstraction = {
  chain: sepolia,
  factoryAddress: 'YOUR_FACTORY_ADDRESS',
  gasless: ${options.smartWalletOptions.gasless},
}`
    : ""
}

export default function App() {
  return (
    <ThirdwebProvider>
      <ConnectButton client={client} wallets={wallets} ${
        options.smartWalletOptions
          ? `accountAbstraction={accountAbstraction}`
          : ""
      } ${renderProps(options.connectWallet)} />
    </ThirdwebProvider>
  );
}`;
}
function renderProps(obj: Record<string, string | undefined>): string {
  return Object.entries(obj)
    .filter((x) => x[1] !== undefined)
    .map(([key, value]) => {
      return `${key}={${value}}`;
    })
    .join(" ");
}
