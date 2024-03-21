import {
  embeddedWalletMetadata,
  embeddedWallet,
} from "../../../../wallets/embedded/core/wallet/index.js";
import type {
  ConnectUIProps,
  SelectUIProps,
  WalletConfig,
} from "../../../core/types/wallets.js";
import { useScreenContext } from "../../ui/ConnectWallet/Modal/screen.js";
import { WalletEntryButton } from "../../ui/ConnectWallet/WalletSelector.js";
import { reservedScreens } from "../../ui/ConnectWallet/constants.js";
import { asyncLocalStorage } from "../../../core/utils/asyncLocalStorage.js";
import {
  EmbeddedWalletFormUI,
  EmbeddedWalletFormUIScreen,
} from "./EmbeddedWalletFormUI.js";
import { EmbeddedWalletOTPLoginUI } from "./EmbeddedWalletOTPLoginUI.js";
import { EmbeddedWalletSocialLogin } from "./EmbeddedWalletSocialLogin.js";
import type {
  EmbeddedWalletAuth,
  EmbeddedWalletSelectUIState,
} from "./types.js";
import type { LocaleId } from "../../ui/types.js";
import type { EmbeddedWalletLocale } from "./locale/types.js";
import { getEmbeddedWalletLocale } from "./locale/getEmbeddedWalletLocale.js";
import { useWalletConnectionCtx } from "../../../core/hooks/others/useWalletConnectionCtx.js";
import { useEffect, useState } from "react";
import { LoadingScreen } from "../shared/LoadingScreen.js";

export type EmbeddedWalletConfigOptions = {
  /**
   * If `true`, EmbeddedWallet will be shown as "recommended" to the user in [`ConnectButton`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton)
   * or [`ConnectEmbed`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectEmbed) 's UI
   */
  recommended?: boolean;
  /**
   * Configure which authentication options to show in the Embedded Wallet UI
   * By default all options are enabled. This includes "email", "google", "apple", "facebook"
   *
   * You can customize it by passing an array of type [`EmbeddedWalletAuth`](https://portal.thirdweb.com/references/typescript/v5/EmbeddedWalletAuth) options.
   * @example
   * ```tsx
   * embeddedWalletConfig({
   *  auth: {
   *    options: ["email", "google"]
   *  }
   * })
   * ```
   */
  auth?: {
    options: EmbeddedWalletAuth[];
  };
};

/**
 * Integrate Embedded wallet connection in
 * [`ConnectButton`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectButton)
 * or [`ConnectEmbed`](https://portal.thirdweb.com/typescript/v5/react/components/ConnectEmbed) by configuring it in `wallets` prop.
 * @param options - Options for configuring the Embedded wallet.
 * Refer to [`EmbeddedWalletConfigOptions`](https://portal.thirdweb.com/references/typescript/v5/EmbeddedWalletConfigOptions) for more details.
 * @example
 * ```tsx
 * import { ConnectButton, embeddedWalletConfig } from "thirdweb/react";
 *
 * function Example() {
 *   return (
 *     <ConnectButton
 *      client={client}
 *      wallets={[embeddedWalletConfig()]}
 *      appMetadata={appMetadata}
 *     />
 *   );
 * }
 * ```
 * @returns `WalletConfig` object which can be added to the `wallets` prop in either `ConnectButton` or `ConnectEmbed` component.
 * @walletConfig
 */
export const embeddedWalletConfig = (
  options?: EmbeddedWalletConfigOptions,
): WalletConfig => {
  const defaultAuthOptions: EmbeddedWalletAuth[] = [
    "email",
    "google",
    "apple",
    "facebook",
  ];
  const authOptions = options?.auth?.options || defaultAuthOptions;
  const hasEmail = authOptions.includes("email");
  const hasSocial =
    (hasEmail && authOptions.length > 1) ||
    (!hasEmail && authOptions.length > 0);

  let prefetchedLocaleId: LocaleId;
  let prefetchedLocale: EmbeddedWalletLocale;

  const config: WalletConfig = {
    category: "socialLogin",
    recommended: options?.recommended,
    metadata: {
      ...embeddedWalletMetadata,
      name:
        hasEmail && hasSocial
          ? "Email & Socials"
          : hasEmail
            ? "Email"
            : hasSocial
              ? "Social Login"
              : "Embedded Wallet",
    },
    create(createOptions) {
      return embeddedWallet({
        client: createOptions.client,
        storage: asyncLocalStorage,
      });
    },
    selectUI(props) {
      return (
        <EmbeddedWalletSelectionUI
          selectUIProps={props}
          saveState={props.selection.saveData}
          authOptions={authOptions}
          select={props.selection.select}
          prefetchedLocaleId={prefetchedLocaleId}
          prefetchedLocale={prefetchedLocale}
        />
      );
    },
    connectUI(props) {
      return (
        <EmbeddedWalletConnectUI
          connectUIProps={props}
          authOptions={authOptions}
          prefetchedLocaleId={prefetchedLocaleId}
          prefetchedLocale={prefetchedLocale}
        />
      );
    },
    async prefetch(localeId) {
      const locale = await getEmbeddedWalletLocale(localeId);
      prefetchedLocale = locale;
      prefetchedLocaleId = localeId;
    },
  };

  return config;
};

function EmbeddedWalletSelectionUI(props: {
  selectUIProps: SelectUIProps;
  saveState: (state: EmbeddedWalletSelectUIState) => void;
  authOptions: EmbeddedWalletAuth[];
  select: () => void;
  prefetchedLocaleId?: LocaleId;
  prefetchedLocale?: EmbeddedWalletLocale;
}) {
  const { screen } = useScreenContext();
  const { size } = props.selectUIProps.screenConfig;
  const { walletConfig } = props.selectUIProps;
  const locale = useEmbeddedWalletLocale(
    props.prefetchedLocaleId,
    props.prefetchedLocale,
  );

  // do not show the "selectUI" if
  // modal is compact or
  // it is being rendered in Safe wallet
  if (
    size === "wide" ||
    (screen !== reservedScreens.main && size === "compact")
  ) {
    return (
      <WalletEntryButton
        walletConfig={walletConfig}
        selectWallet={() => {
          props.saveState({});
          props.select();
        }}
      />
    );
  }

  if (!locale) {
    return <LoadingScreen height="300px" />;
  }

  return (
    <EmbeddedWalletFormUI
      connectUIProps={{
        connection: props.selectUIProps.connection,
        screenConfig: props.selectUIProps.screenConfig,
        walletConfig: props.selectUIProps.walletConfig,
        selection: {
          data: props.selectUIProps.selection.data,
          saveData: props.selectUIProps.selection.saveData,
        },
      }}
      authOptions={props.authOptions}
      saveState={props.saveState}
      select={props.selectUIProps.selection.select}
      locale={locale}
    />
  );
}

function EmbeddedWalletConnectUI(props: {
  connectUIProps: ConnectUIProps;
  authOptions: EmbeddedWalletAuth[];
  prefetchedLocaleId?: LocaleId;
  prefetchedLocale?: EmbeddedWalletLocale;
}) {
  const state = props.connectUIProps.selection
    .data as EmbeddedWalletSelectUIState;

  const locale = useEmbeddedWalletLocale(
    props.prefetchedLocaleId,
    props.prefetchedLocale,
  );

  if (!locale) {
    return <LoadingScreen />;
  }

  if (state?.emailLogin) {
    return (
      <EmbeddedWalletOTPLoginUI
        email={state.emailLogin}
        connectUIProps={props.connectUIProps}
        locale={locale}
      />
    );
  }

  if (state?.socialLogin) {
    return (
      <EmbeddedWalletSocialLogin
        connectUIProps={props.connectUIProps}
        socialAuth={state.socialLogin.type}
        state={state}
        locale={locale}
      />
    );
  }

  return (
    <EmbeddedWalletFormUIScreen
      connectUIProps={props.connectUIProps}
      authOptions={props.authOptions}
      saveState={props.connectUIProps.selection.saveData}
      select={() => {}}
      locale={locale}
    />
  );
}

function useEmbeddedWalletLocale(
  prefetchedLocaleId?: LocaleId,
  prefetchedLocale?: EmbeddedWalletLocale,
) {
  const localeId = useWalletConnectionCtx().locale;
  const [locale, setLocale] = useState<EmbeddedWalletLocale | undefined>(
    prefetchedLocaleId === localeId ? prefetchedLocale : undefined,
  );

  useEffect(() => {
    getEmbeddedWalletLocale(localeId).then((l) => {
      setLocale(l);
    });
  }, [locale, localeId, prefetchedLocaleId]);

  return locale;
}
