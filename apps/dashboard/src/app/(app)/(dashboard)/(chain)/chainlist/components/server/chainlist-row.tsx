import {
  CheckIcon,
  CircleAlertIcon,
  TicketCheckIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import type { JSX } from "react";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { TableCell, TableRow } from "@/components/ui/table";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ChainSupportedService } from "@/types/chain";
import { ChainIcon } from "../../../components/server/chain-icon";
import { products } from "../../../components/server/products";
import { getChainMetadata } from "../../../utils";

type ChainListRowProps = {
  favoriteButton: JSX.Element | undefined;
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
  return (
    <TableRow className="hover:bg-accent/50" linkBox>
      {/* Name */}
      <TableCell>
        <div className="flex w-[370px] flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            {favoriteButton && <div className="mr-6"> {favoriteButton} </div>}
            <ChainIcon className="size-6" iconUrl={iconUrl} />
            <Link
              className="group static before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:z-0 before:content-['']"
              href={`/${chainSlug}`}
            >
              {chainName}
            </Link>

            {!isDeprecated && chainMetadata?.gasSponsored && (
              <ToolTipLabel label="Gas Sponsored">
                <TicketCheckIcon className="z-10 size-5 text-link-foreground " />
              </ToolTipLabel>
            )}

            {isDeprecated && (
              <ToolTipLabel label="Deprecated">
                <CircleAlertIcon className="z-10 size-5 text-destructive-text " />
              </ToolTipLabel>
            )}
          </div>
        </div>
      </TableCell>

      <TableCell>
        <CopyTextButton
          className="relative z-10 text-base"
          copyIconPosition="right"
          textToCopy={chainId.toString()}
          textToShow={chainId.toString()}
          tooltip="Copy Chain ID"
          variant="ghost"
        />
      </TableCell>

      <TableCell>{currencySymbol}</TableCell>

      <TableCell>
        <div className="flex w-[520px] flex-row items-center gap-14 ">
          <div className="z-10 flex items-center gap-4">
            {products.map((p) => {
              return (
                <ProductIcon
                  href={p.link}
                  icon={p.icon}
                  isEnabled={enabledServices.includes(p.id)}
                  key={p.name}
                  label={p.name}
                />
              );
            })}
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
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
          <CheckIcon className="size-4 text-success-text" />
        ) : (
          <XIcon className="size-4 text-destructive-text" />
        )
      }
    >
      <Link
        className="group rounded-lg p-2 hover:bg-accent"
        href={props.href}
        target={props.href.startsWith("http") ? "_blank" : undefined}
      >
        <props.icon
          className={cn(
            "size-6 text-foreground group-hover:text-link-foreground",
            !props.isEnabled &&
              "text-muted-foreground opacity-50 group-hover:opacity-100",
          )}
        />
      </Link>
    </ToolTipLabel>
  );
}
