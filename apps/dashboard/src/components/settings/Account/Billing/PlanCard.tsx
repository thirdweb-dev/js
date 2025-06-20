"use client";

// TODO - convert to RSC

import {
  type Account,
  useAccountCredits,
} from "@3rdweb-sdk/react/hooks/useApi";
import type { ThirdwebClient } from "thirdweb";
import { CreditsItem } from "./CreditsItem";

export const CreditsInfoCard = (props: {
  twAccount: Account;
  client: ThirdwebClient;
  teamSlug: string;
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
        client={props.client}
        credit={opCredit}
        isOpCreditDefault={true}
        teamSlug={props.teamSlug}
        twAccount={props.twAccount}
      />
      {restCredits?.map((credit) => (
        <CreditsItem
          client={props.client}
          credit={credit}
          key={credit.couponId}
          teamSlug={props.teamSlug}
          twAccount={props.twAccount}
        />
      ))}
    </section>
  );
};
