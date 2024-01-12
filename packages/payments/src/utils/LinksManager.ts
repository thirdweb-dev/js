// CHANGED: added clientId to link

import type { ICustomizationOptions, Locale } from "../constants/style";

export class LinksManager {
  private link: URL;

  constructor(baseLink: URL) {
    this.link = baseLink;
  }

  addStylingOptions(options: ICustomizationOptions) {
    if (options.colorPrimary) {
      this.link.searchParams.set("colorPrimary", options.colorPrimary);
    }
    if (options.colorBackground) {
      this.link.searchParams.set("colorBackground", options.colorBackground);
    }
    if (options.colorText) {
      this.link.searchParams.set("colorText", options.colorText);
    }
    if (options.borderRadius !== undefined) {
      this.link.searchParams.set(
        "borderRadius",
        options.borderRadius.toString(),
      );
    }
    if (options.fontFamily) {
      this.link.searchParams.set("fontFamily", options.fontFamily);
    }
    if (options.inputBackgroundColor) {
      this.link.searchParams.set(
        "inputBackgroundColor",
        options.inputBackgroundColor,
      );
    }
    if (options.inputBorderColor) {
      this.link.searchParams.set("inputBorderColor", options.inputBorderColor);
    }
  }

  addClientSecret(sdkClientSecret: string) {
    this.link.searchParams.set("sdkClientSecret", sdkClientSecret);
  }

  addClientId(clientId: string) {
    this.link.searchParams.set("clientId", clientId);
  }

  addLocale(locale?: Locale) {
    if (locale) {
      this.link.searchParams.set("locale", locale.toString());
    }
  }

  addAppName(appName?: string) {
    if (appName) {
      this.link.searchParams.set("appName", appName);
    }
  }

  addShowConnectWalletOptions(showConnectWalletOptions: boolean) {
    this.link.searchParams.append(
      "showConnectWalletOptions",
      showConnectWalletOptions.toString(),
    );
  }

  addReceivingWalletType(walletType?: string) {
    this.link.searchParams.append("walletType", walletType || "Preset");
  }

  addRecipientWalletAddress(address: string) {
    this.link.searchParams.set("recipientWalletAddress", address);
  }

  addPayerWalletAddress(address: string) {
    this.link.searchParams.append("payerWalletAddress", address);
  }

  getLink(): URL {
    return this.link;
  }
}
