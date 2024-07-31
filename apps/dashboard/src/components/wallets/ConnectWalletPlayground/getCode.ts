type WalletSetupOptions = {
  imports: string[];
  wallets?: string;
  recommendedWallets?: string;
  smartWalletOptions?: {
    gasless: boolean;
  };
  connectWallet: {
    locale?: string;
    theme?: string;
    connectButton?: string;
    connectModal?: string;
    // auth?: string;
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
  const reactImports = [];

  if (hasThemeOverrides) {
    const themeFn = options.baseTheme === "dark" ? "darkTheme" : "lightTheme";

    options.connectWallet.theme = `${themeFn}(${JSON.stringify({
      colors: options.colorOverrides,
    })})`;

    reactImports.push(themeFn);
  }

  const imports = [...new Set(options.imports)];

  return `\
import { ThirdwebProvider, ConnectButton, ${reactImports.join(", ")} } from "thirdweb/react";${options.smartWalletOptions ? `\nimport { sepolia } from "thirdweb/chains"` : ""}
${imports.length > 0 ? `import { ${imports.join(",")} } from "thirdweb/wallets";` : ""}

const client = createThirdwebClient({
  clientId: "YOUR_CLIENT_ID",
});

${options.wallets ? `const wallets = ${options.wallets};` : ""}

export default function App() {
  return (
    <ThirdwebProvider>
      <ConnectButton client={client} ${options.wallets ? "wallets={wallets}" : ""}   ${
        options.smartWalletOptions
          ? `accountAbstraction={{
            chain: sepolia,
            factoryAddress: 'YOUR_FACTORY_ADDRESS',
            gasless: ${options.smartWalletOptions.gasless},
          }}`
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
