import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  CheckIcon,
  CircleAlertIcon,
  TicketCheckIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { CopyTextButton } from "../../../../../../@/components/ui/CopyTextButton";
import { ChainIcon } from "../../../components/server/chain-icon";
import { products } from "../../../components/server/products";
import type { ChainSupportedService } from "../../../types/chain";
import { getChainMetadata } from "../../../utils";

type ChainListRowProps = {
  favoriteButton: JSX.Element;
  chainId: number;
  chainSlug: string;
  chainName: string;
  enabledServices: ChainSupportedService[];
  currencySymbol: string;
  isDeprecated: boolean;
  iconUrl?: string;
};

export async function ChainListRow({
  isDeprecated,
  chainId,
  chainName,
  chainSlug,
  currencySymbol,
  enabledServices,
  favoriteButton,
  iconUrl,
}: ChainListRowProps) {
  const chainMetadata = await getChainMetadata(chainId);
  const productsWithoutFaucet = products.filter((p) => p.id !== "faucet");
  return (
    <tr className="border-b relative hover:bg-secondary">
      <TableData>{favoriteButton}</TableData>
      {/* Name */}
      <TableData>
        <div className="flex flex-row items-center gap-4 w-[370px]">
          <div className="flex items-center gap-2">
            <ChainIcon iconUrl={iconUrl} className="size-6" />
            <Link
              href={`/${chainSlug}`}
              className="static group before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-0 before:z-0"
            >
              {chainName}
            </Link>

            {!isDeprecated && chainMetadata?.gasSponsored && (
              <ToolTipLabel label="Gas Sponsored">
                <TicketCheckIcon className="text-link-foreground size-5 z-10 " />
              </ToolTipLabel>
            )}

            {isDeprecated && (
              <ToolTipLabel label="Deprecated">
                <CircleAlertIcon className="text-destructive-foreground size-5 z-10 " />
              </ToolTipLabel>
            )}
          </div>
        </div>
      </TableData>

      <TableData>
        <CopyTextButton
          textToCopy={chainId.toString()}
          textToShow={chainId.toString()}
          tooltip="Copy Chain ID"
          className="z-10 relative text-base"
          variant="ghost"
          copyIconPosition="right"
        />
      </TableData>

      <TableData>{currencySymbol}</TableData>

      <TableData>
        <div className="flex flex-row gap-14 items-center w-[520px] ">
          <div className="flex items-center gap-7 z-10">
            {productsWithoutFaucet.map((p) => {
              return (
                <ProductIcon
                  key={p.name}
                  icon={p.icon}
                  label={p.name}
                  href={`/${chainSlug}/${p.id === "contracts" ? "" : p.id}`}
                  isEnabled={enabledServices.includes(p.id)}
                />
              );
            })}
          </div>
        </div>
      </TableData>
    </tr>
  );
}

function TableData({ children }: { children: React.ReactNode }) {
  return <td className="p-4">{children}</td>;
}

function ProductIcon(props: {
  icon: React.FC<{ className?: string }>;
  label: string;
  href: string;
  isEnabled: boolean;
}) {
  return (
    <ToolTipLabel
      label={props.label}
      leftIcon={
        props.isEnabled ? (
          <CheckIcon className="text-success-foreground size-4" />
        ) : (
          <XIcon className="text-destructive-foreground size-4" />
        )
      }
    >
      <Link href={props.href}>
        <props.icon className={cn("size-8", !props.isEnabled && "grayscale")} />
      </Link>
    </ToolTipLabel>
  );
}
