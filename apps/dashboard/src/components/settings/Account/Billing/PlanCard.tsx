"use client";

// TODO - convert to RSC

import {
  type Account,
  useAccountCredits,
} from "@3rdweb-sdk/react/hooks/useApi";
import { CreditsItem } from "./CreditsItem";

export const CreditsInfoCard = (props: {
  twAccount: Account;
}) => {
  const { data: credits } = useAccountCredits();

  if (!credits) {
    return null;
  }

  const opCredit = credits.find((crd) => crd.name.startsWith("OP -"));
  const restCredits = credits.filter((crd) => !crd.name.startsWith("OP -"));

  return (
    <section className="flex flex-col gap-4">
      <CreditsItem
        credit={opCredit}
        isOpCreditDefault={true}
        twAccount={props.twAccount}
      />
      {restCredits?.map((credit) => (
        <CreditsItem
          key={credit.couponId}
          credit={credit}
          twAccount={props.twAccount}
        />
      ))}
    </section>
  );
};
