// CHANGED: Import packageJSON + sdk-version only
import type {
  ICheckoutWithCardConfigs,
  PaperSDKError,
  PriceSummary,
  ReviewResult,
  ICustomizationOptions,
  Locale,
} from "@thirdweb-dev/payments";
import {
  createCheckoutWithCardElement,
  DEFAULT_BRAND_OPTIONS,
} from "@thirdweb-dev/payments";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePaymentsSDKContext } from "../Provider";
import { iframeContainer } from "../lib/utils/styles";
import { SpinnerWrapper } from "./common/SpinnerWrapper";

import packageJson from "../../../package.json";

interface CheckoutWithCardProps {
  clientId?: string;
  sdkClientSecret?: string;
  onPaymentSuccess: (result: { transactionId: string }) => void;
  appName?: string;
  options?: ICustomizationOptions;
  onReview?: (result: ReviewResult) => void;
  onError?: (error: PaperSDKError) => void;
  onBeforeModalOpen?: (props: { url: string }) => void;
  onPriceUpdate?: (priceSummary: PriceSummary) => void;
  configs?: ICheckoutWithCardConfigs;

  /**
   * @deprecated No longer used.
   */
  experimentalUseAltDomain?: boolean;

  /**
   * Sets the locale to a supported language.
   * NOTE: Localization is in early alpha and many languages are not yet supported.
   *
   * Defaults to English.
   */
  locale?: Locale;
}

export const CheckoutWithCard = ({
  clientId,
  sdkClientSecret,
  appName,
  options = {
    ...DEFAULT_BRAND_OPTIONS,
  },
  onPaymentSuccess,
  onReview,
  onError,
  onBeforeModalOpen,
  onPriceUpdate,
  locale,
  configs,
}: CheckoutWithCardProps): React.ReactElement => {
  const { appName: appNameContext } = usePaymentsSDKContext();
  const [isCardDetailIframeLoading, setIsCardDetailIframeLoading] =
    useState<boolean>(true);
  const onCardDetailLoad = useCallback(() => {
    setIsCardDetailIframeLoading(false);
  }, []);
  const CheckoutWithCardIframeContainerRef = useRef<HTMLDivElement>(null);
  const appNameToUse = appName || appNameContext;

  // force hide spinner if iframe taking too long
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCardDetailIframeLoading(false);
    }, 1000);
    return () => {
      clearTimeout(timer); // Clear the timer if the component unmounts before the delay
    };
  }, []);
  // Handle message events from the popup. Pass along the message to the iframe as well
  useEffect(() => {
    if (!CheckoutWithCardIframeContainerRef.current) {
      return;
    }
    createCheckoutWithCardElement({
      clientId,
      sdkClientSecret,
      appName: appNameToUse,
      elementOrId: CheckoutWithCardIframeContainerRef.current,
      locale,
      onError,
      onLoad: onCardDetailLoad,
      onPaymentSuccess,
      onReview,
      onBeforeModalOpen,
      onPriceUpdate,
      options,
      configs,
    });
  }, [CheckoutWithCardIframeContainerRef.current]);

  return (
    <>
      <div
        className={iframeContainer}
        ref={CheckoutWithCardIframeContainerRef}
        // Label the package version.
        data-thirdweb-sdk-version={`${packageJson.name}@${packageJson.version}`}
      >
        {isCardDetailIframeLoading && <SpinnerWrapper />}
      </div>
    </>
  );
};
