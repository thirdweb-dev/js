import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { AssetPageView } from "../_components/asset-page-view";
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
  contractCreator: string | null;
}) {
  return (
    <div className="flex grow flex-col">
      <AssetPageView assetType="nft" chainId={props.chainMetadata.chainId} />
      <PageHeader containerClassName="max-w-8xl" />
      <div className="border-b">
        <div className="container max-w-8xl">
          <ContractHeaderUI
            chainMetadata={props.chainMetadata}
            clientContract={props.clientContract}
            contractCreator={props.contractCreator}
            image={
              typeof props.contractMetadata.image === "string"
                ? props.contractMetadata.image
                : undefined
            }
            name={props.contractMetadata.name}
            socialUrls={
              typeof props.contractMetadata.social_urls === "object" &&
              props.contractMetadata.social_urls !== null
                ? props.contractMetadata.social_urls
                : {}
            }
            symbol={props.contractMetadata.symbol}
          />
        </div>
      </div>
      <div className="container flex max-w-8xl grow flex-col">
        {props.children}
      </div>
    </div>
  );
}
