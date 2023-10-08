type WalletSetupOptions = {
  imports: string[];
  thirdwebProvider: {
    supportedWallets?: string;
    authConfig?: string;
  };
  smartWalletOptions?: {
    gasless: boolean;
  };
  connectWallet: {
    theme?: string;
    btnTitle?: string;
    auth?: string;
    modalTitle?: string;
    switchToActiveChain?: string;
    modalSize?: string;
    modalTitleIconUrl?: string;
    welcomeScreen?: string;
    termsOfServiceUrl?: string;
    privacyPolicyUrl?: string;
  };
  baseTheme: "light" | "dark";
  colorOverrides: Record<string, string>;
};

export function getCode(options: WalletSetupOptions) {
  const hasThemeOverrides = Object.keys(options.colorOverrides).length > 0;
  let themeFn = "";
  if (hasThemeOverrides) {
    themeFn = options.baseTheme === "dark" ? "darkTheme" : "lightTheme";

    options.connectWallet.theme = `${themeFn}(${JSON.stringify({
      colors: options.colorOverrides,
    })})`;
  }

  return `\
import {
  ThirdwebProvider,
  ConnectWallet
  ${options.imports.length > 0 ? `, ${options.imports.join(",")}` : ""},
${themeFn}
} from "@thirdweb-dev/react";

${
  options.smartWalletOptions
    ? `const smartWalletOptions = {
  factoryAddress: 'YOUR_FACTORY_ADDRESS',
  gasless: ${options.smartWalletOptions.gasless},
}`
    : ""
}



export default function App() {
  return (
    <ThirdwebProvider activeChain="mumbai" clientId="YOUR_CLIENT_ID" ${renderProps(
      options.thirdwebProvider,
    )} >
      <ConnectWallet ${renderProps(options.connectWallet)}   />
    </ThirdwebProvider>
  );
}`;
}
function renderProps(obj: Record<string, string | undefined>) {
  return Object.entries(obj)
    .filter((x) => x[1] !== undefined)
    .map(([key, value]) => {
      return `${key}={${value}}`;
    })
    .join(" ");
}
