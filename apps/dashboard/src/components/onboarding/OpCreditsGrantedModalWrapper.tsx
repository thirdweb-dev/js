import { useAccount, useAccountCredits } from "@3rdweb-sdk/react/hooks/useApi";
import { DelayedDisplay } from "components/delayed-display/delayed-display";
import { useTrack } from "hooks/analytics/useTrack";
import { useLocalStorage } from "hooks/useLocalStorage";
import { useMemo } from "react";
import { OpCreditsGrantedModal } from "./OpCreditsGrantedModal";

export const OpCreditsGrantedModalWrapper = () => {
  const trackEvent = useTrack();
  const { data: credits } = useAccountCredits();
  const { data: account } = useAccount();

  const opCredit = credits?.find((credit) => credit.name.startsWith("OP -"));
  const [sawYouGotCredits, setSawYouGotCredits] = useLocalStorage(
    `sawYouGotCredits-${account?.id}`,
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
      <OpCreditsGrantedModal
        setSawYouGotCredits={setSawYouGotCredits}
        creditValue={opCredit?.originalGrantUsdCents}
      />
    </DelayedDisplay>
  );
};
