"use client";

import type { ThirdwebContract } from "thirdweb";
import { CreateListingButton } from "../components/list-button";
import { EnglishAuctionsTable } from "./components/table";

export function ContractEnglishAuctionsPage(props: {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
  isInsightSupported: boolean;
}) {
  return (
    <EnglishAuctionsTable
      contract={props.contract}
      isLoggedIn={props.isLoggedIn}
      cta={
        <CreateListingButton
          contract={props.contract}
          createText="Create English Auction"
          isInsightSupported={props.isInsightSupported}
          isLoggedIn={props.isLoggedIn}
          type="english-auctions"
        />
      }
    />
  );
}
