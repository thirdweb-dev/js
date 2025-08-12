"use client";

import type { ThirdwebContract } from "thirdweb";
import { CreateListingButton } from "../components/list-button";
import { DirectListingsTable } from "./components/table";

export function ContractDirectListingsPage(props: {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
  isInsightSupported: boolean;
}) {
  return (
    <DirectListingsTable
      contract={props.contract}
      isLoggedIn={props.isLoggedIn}
      cta={
        <CreateListingButton
          contract={props.contract}
          createText="Create Direct Listing"
          isInsightSupported={props.isInsightSupported}
          isLoggedIn={props.isLoggedIn}
          type="direct-listings"
        />
      }
    />
  );
}
