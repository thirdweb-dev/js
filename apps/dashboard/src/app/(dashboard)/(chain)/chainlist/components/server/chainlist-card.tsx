import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleAlertIcon, TicketCheckIcon } from "lucide-react";
import Link from "next/link";
import { CopyTextButton } from "../../../../../../@/components/ui/CopyTextButton";
import { ChainIcon } from "../../../components/server/chain-icon";
import type { ChainSupportedService } from "../../../types/chain";
import { getChainMetadata } from "../../../utils";

type ChainListCardProps = {
  favoriteButton: JSX.Element;
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
      <Card className="w-full h-full hover:bg-muted">
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <div className="flex flex-row items-center gap-2">
            <ChainIcon iconUrl={iconUrl} className="size-6" />
            <Link
              className="static group before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-0 before:z-0"
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
            <tbody className="[&_td>*]:min-h-[25px] text-sm">
              <tr>
                <th className="font-normal text-left text-secondary-foreground">
                  Chain ID
                </th>
                <td className="text-right">
                  <CopyTextButton
                    textToCopy={chainId.toString()}
                    textToShow={chainId.toString()}
                    tooltip="Copy Chain ID"
                    className="inline-flex z-10 relative text-base translate-x-2 py-0.5"
                    variant="ghost"
                    copyIconPosition="left"
                  />
                </td>
              </tr>
              <tr>
                <th className="font-normal text-left text-secondary-foreground">
                  Native Token
                </th>
                <td className="text-right">
                  <div className="inline-flex items-center">
                    {currencySymbol}
                  </div>
                </td>
              </tr>
              <tr>
                <th className="font-normal text-left text-secondary-foreground">
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
            <div className="flex gap-5 pt-4 mt-5 border-t">
              {!isDeprecated && chainMetadata?.gasSponsored && (
                <div className="gap-1.5 flex items-center">
                  <TicketCheckIcon className="text-foreground size-5" />
                  <p className="text-sm">Gas Sponsored</p>
                </div>
              )}

              {isDeprecated && (
                <div className="gap-1.5 flex items-center">
                  <CircleAlertIcon className="text-destructive-foreground size-5" />
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
