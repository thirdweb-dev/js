"use client";

import {
  type Account,
  useAccountCredits,
} from "@3rdweb-sdk/react/hooks/useApi";
import { DelayedDisplay } from "components/delayed-display/delayed-display";
import { useTrack } from "hooks/analytics/useTrack";
import { useLocalStorage } from "hooks/useLocalStorage";
import { Suspense, lazy, useMemo } from "react";

const OpCreditsGrantedModal = lazy(() => import("./OpCreditsGrantedModal"));

export const OpCreditsGrantedModalWrapper = (props: {
  twAccount: Account;
}) => {
  const trackEvent = useTrack();
  const { data: credits } = useAccountCredits();

  const opCredit = credits?.find((credit) => credit.name.startsWith("OP -"));
  const [sawYouGotCredits, setSawYouGotCredits] = useLocalStorage(
    `sawYouGotCredits-${props.twAccount.id}`,
    false,
  );

  const redeemedAtTimestamp = useMemo(() => {
    return opCredit ? new Date(opCredit.redeemedAt).getTime() : 0;
  }, [opCredit]);
  const oneWeekAgoTimestamp = Date.now() - 7 * 24 * 60 * 60 * 1000;

  if (
    !opCredit ||
    sawYouGotCredits ||
    redeemedAtTimestamp < oneWeekAgoTimestamp
  ) {
    return null;
  }

  trackEvent({
    category: "op-sponsorship",
    action: "modal",
    label: "you-got-credits",
  });

  return (
    <DelayedDisplay delay={500}>
      <Suspense fallback={null}>
        <OpCreditsGrantedModal
          setSawYouGotCredits={setSawYouGotCredits}
          creditValue={opCredit?.originalGrantUsdCents}
        />
      </Suspense>
    </DelayedDisplay>
  );
};
