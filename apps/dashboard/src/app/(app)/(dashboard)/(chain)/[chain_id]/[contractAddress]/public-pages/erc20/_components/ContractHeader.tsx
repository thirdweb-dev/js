import { Img } from "@/components/blocks/Img";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { Button } from "@/components/ui/button";
import { resolveSchemeWithErrorHandler } from "@/lib/resolveSchemeWithErrorHandler";
import { ChainIconClient } from "components/icons/ChainIcon";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";

export function ContractHeaderUI(props: {
  name: string;
  symbol: string | undefined;
  image: string | undefined;
  chainMetadata: ChainMetadata;
  clientContract: ThirdwebContract;
}) {
  const cleanedChainName = props.chainMetadata?.name
    ?.replace("Mainnet", "")
    .trim();

  const explorersToShow = getExplorersToShow(props.chainMetadata);

  return (
    <div className="flex items-start gap-4 border-b border-dashed py-8 lg:items-center">
      {props.image && (
        <Img
          className="size-16 shrink-0 rounded-full border bg-muted md:size-20"
          src={
            props.image
              ? resolveSchemeWithErrorHandler({
                  uri: props.image,
                  client: props.clientContract.client,
                })
              : ""
          }
          fallback={
            <div className="flex items-center justify-center font-bold text-3xl text-muted-foreground/80">
              {props.name[0]}
            </div>
          }
        />
      )}

      <div className="flex flex-col gap-3">
        {/* top row */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <h1 className="line-clamp-2 font-bold text-2xl tracking-tight lg:text-3xl">
              {props.name}
            </h1>

            <Link
              href={`/${props.chainMetadata.slug}`}
              className="flex w-fit shrink-0 items-center gap-2 rounded-3xl border border-border bg-card px-2.5 py-1.5 hover:bg-accent"
            >
              <ChainIconClient
                src={props.chainMetadata.icon?.url || ""}
                client={props.clientContract.client}
                className="size-4"
              />
              {cleanedChainName && (
                <span className="text-xs">{cleanedChainName}</span>
              )}
            </Link>
          </div>
        </div>

        {/* bottom row */}
        <div className="flex flex-row flex-wrap items-center gap-2">
          <CopyAddressButton
            address={props.clientContract.address}
            copyIconPosition="left"
            className="bg-card px-2.5 py-1.5 text-xs"
            variant="outline"
          />

          {explorersToShow?.map((validBlockExplorer) => (
            <BadgeLink
              key={validBlockExplorer.url}
              name={validBlockExplorer.name}
              href={`${validBlockExplorer.url.endsWith("/") ? validBlockExplorer.url : `${validBlockExplorer.url}/`}address/${props.clientContract.address}`}
            />
          ))}

          {/* TODO - render social links here */}
        </div>
      </div>
    </div>
  );
}

function getExplorersToShow(chainMetadata: ChainMetadata) {
  const validBlockExplorers = chainMetadata.explorers
    ?.filter((e) => e.standard === "EIP3091")
    ?.slice(0, 2);

  return validBlockExplorers;
}

function BadgeLink(props: {
  name: string;
  href: string;
}) {
  return (
    <Button
      variant="outline"
      asChild
      className="!h-auto gap-2 rounded-lg bg-card px-3 py-1.5 text-xs capitalize"
    >
      <Link href={props.href} target="_blank">
        {props.name}
        <ExternalLinkIcon className="size-3 text-muted-foreground" />
      </Link>
    </Button>
  );
}
