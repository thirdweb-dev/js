"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { ThirdwebContract } from "thirdweb";
import { ClaimFeesCard } from "./ClaimFeesCard";
import ConfigureSplit from "./ConfigureSplitFees";
import { SplitFeesCard } from "./SplitFeesCard";

type Split = {
  splitWallet: string;
  recipients: readonly string[];
  allocations: readonly bigint[];
  controller: string;
  referenceContract: string;
};

function SplitFees(props: {
  splitFeesCore: ThirdwebContract;
  splits: Split[];
  coreContract: ThirdwebContract;
}) {
  const [tab, setTab] = useState<"splitFeesCard" | "claimFeesCard">(
    "splitFeesCard",
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <button type="button" onClick={() => setTab("splitFeesCard")}>
          Split Fees
        </button>
        <button type="button" onClick={() => setTab("claimFeesCard")}>
          Claim Fees
        </button>
      </div>
      {tab === "splitFeesCard" &&
        props.splits.map((split) => (
          <ClaimFeesCard
            {...split}
            splitFeesCore={props.splitFeesCore}
            key={split.splitWallet}
          />
        ))}

      {tab === "claimFeesCard" && (
        <>
          {props.splits.map((split) => (
            <SplitFeesCard
              {...split}
              referenceContract={props.coreContract}
              key={split.splitWallet}
            />
          ))}

          <ConfigureSplit isNewSplit referenceContract={props.coreContract}>
            <Button size="sm" className="self-end">
              Create Split
            </Button>
          </ConfigureSplit>
        </>
      )}
    </div>
  );
}

export default SplitFees;
