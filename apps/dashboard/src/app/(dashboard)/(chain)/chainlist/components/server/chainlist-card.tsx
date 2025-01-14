import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleAlertIcon, TicketCheckIcon } from "lucide-react";
import Link from "next/link";
import { ChainIcon } from "../../../components/server/chain-icon";
import type { ChainSupportedService } from "../../../types/chain";
import { getChainMetadata } from "../../../utils";

import type { JSX } from "react";

type ChainListCardProps = {
  favoriteButton: JSX.Element | undefined;
  chainId: number;
  chainSlug: string;
  chainName: string;
  enabledServices: ChainSupportedService[];
  currencySymbol: string;
  isDeprecated: boolean;
  iconUrl?: string;
};

export async function ChainListCard({
  isDeprecated,
  chainId,
  chainName,
  chainSlug,
  currencySymbol,
  enabledServices,
  favoriteButton,
  iconUrl,
}: ChainListCardProps) {
  const chainMetadata = await getChainMetadata(chainId);

  return (
    <div className="relative h-full">
      <Card className="h-full w-full bg-muted/50 hover:bg-muted">
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <div className="flex flex-row items-center gap-2">
            <ChainIcon iconUrl={iconUrl} className="size-6" />
            <Link
              className="group static before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:z-0 before:content-['']"
              href={`/${chainSlug}`}
            >
              <CardTitle className="text-xl">{chainName}</CardTitle>
            </Link>
          </div>

          {favoriteButton}
        </CardHeader>

        <CardContent className="px-4 pt-0 pb-4">
          {/* table of `chain id` `native token` `managed support`, header row on left value row on right */}
          <table className="w-full">
            <tbody className="text-sm [&_td>*]:min-h-[25px]">
              <tr>
                <th className="text-left font-normal text-muted-foreground">
                  Chain ID
                </th>
                <td className="text-right">
                  <CopyTextButton
                    textToCopy={chainId.toString()}
                    textToShow={chainId.toString()}
                    tooltip="Copy Chain ID"
                    className="relative z-10 inline-flex translate-x-2 py-0.5 text-base"
                    variant="ghost"
                    copyIconPosition="left"
                  />
                </td>
              </tr>
              <tr>
                <th className="text-left font-normal text-muted-foreground">
                  Native Token
                </th>
                <td className="text-right">
                  <div className="inline-flex items-center">
                    {currencySymbol}
                  </div>
                </td>
              </tr>
              <tr>
                <th className="text-left font-normal text-muted-foreground">
                  Available Services
                </th>

                <td className="text-right">
                  <div className="inline-flex items-center">
                    {enabledServices.length}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {(isDeprecated || chainMetadata?.gasSponsored) && (
            <div className="mt-5 flex gap-5 border-t pt-4">
              {!isDeprecated && chainMetadata?.gasSponsored && (
                <div className="flex items-center gap-1.5">
                  <TicketCheckIcon className="size-5 text-foreground" />
                  <p className="text-sm">Gas Sponsored</p>
                </div>
              )}

              {isDeprecated && (
                <div className="flex items-center gap-1.5">
                  <CircleAlertIcon className="size-5 text-destructive-text" />
                  <p className="text-sm">Deprecated</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
