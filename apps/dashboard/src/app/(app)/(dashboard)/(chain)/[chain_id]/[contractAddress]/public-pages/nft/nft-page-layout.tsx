import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { PageHeader } from "../_components/PageHeader";
import { ContractHeaderUI } from "../erc20/_components/ContractHeader";

export function NFTPublicPageLayout(props: {
  clientContract: ThirdwebContract;
  chainMetadata: ChainMetadata;
  contractMetadata: {
    name: string;
    symbol: string;
    [key: string]: unknown;
  };
  children: React.ReactNode;
}) {
  return (
    <div className="flex grow flex-col">
      <PageHeader containerClassName="max-w-8xl" />
      <div className="container flex max-w-8xl grow flex-col">
        <ContractHeaderUI
          chainMetadata={props.chainMetadata}
          imageClassName="rounded-lg"
          clientContract={props.clientContract}
          image={
            typeof props.contractMetadata.image === "string"
              ? props.contractMetadata.image
              : undefined
          }
          name={props.contractMetadata.name}
          symbol={props.contractMetadata.symbol}
          socialUrls={
            typeof props.contractMetadata.social_urls === "object" &&
            props.contractMetadata.social_urls !== null
              ? props.contractMetadata.social_urls
              : {}
          }
        />
        {props.children}
      </div>
    </div>
  );
}
