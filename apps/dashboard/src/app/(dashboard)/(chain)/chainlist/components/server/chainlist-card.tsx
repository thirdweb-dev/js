import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleAlertIcon, TicketCheckIcon } from "lucide-react";
import Link from "next/link";
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
      <Card className="h-full w-full hover:bg-muted">
        <CardHeader className="flex flex-row justify-between items-center p-4">
          <div className="flex flex-row items-center space-x-2">
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

        <CardContent className="pt-0 px-4 pb-4">
          {/* table of `chain id` `native token` `managed support`, header row on left value row on right */}
          <table className="w-full">
            <tbody className="[&_td]:py-0.5 text-sm">
              <tr>
                <th className="text-left font-normal text-secondary-foreground">
                  Chain ID
                </th>
                <td className="text-right">{chainId}</td>
              </tr>
              <tr>
                <th className="text-left font-normal text-secondary-foreground">
                  Native Token
                </th>
                <td className="text-right">{currencySymbol}</td>
              </tr>
              <tr>
                <th className="text-left font-normal text-secondary-foreground">
                  Available Services
                </th>

                <td className="text-right">{enabledServices.length}</td>
              </tr>
            </tbody>
          </table>

          {(isDeprecated || chainMetadata?.gasSponsored) && (
            <div className="mt-5 flex gap-5 border-t pt-4">
              {!isDeprecated && chainMetadata?.gasSponsored && (
                <div className="gap-1.5 flex items-center">
                  <TicketCheckIcon className="text-primary-foreground size-5" />
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
