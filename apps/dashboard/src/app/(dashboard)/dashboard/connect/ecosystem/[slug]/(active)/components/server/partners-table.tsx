import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { CopyButton } from "@/components/ui/CopyButton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { Ecosystem, Partner } from "../../../../types";
import { useDeletePartner } from "../../hooks/use-delete-partner";
import { usePartners } from "../../hooks/use-partners";
import { UpdatePartnerModal } from "../client/update-partner-modal.client";

export function PartnersTable({ ecosystem }: { ecosystem: Ecosystem }) {
  const { partners, isLoading } = usePartners({ ecosystem });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static list with index as key
          <Skeleton key={i} className="w-full h-10 rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b bg-muted">
          <TableHeading>Name</TableHeading>
          <TableHeading className="hidden md:table-cell">Domains</TableHeading>
          <TableHeading className="hidden md:table-cell">
            Bundle ID
          </TableHeading>
          <TableHeading className="hidden sm:table-cell">
            Partner ID
          </TableHeading>
          <TableHeading className="hidden lg:table-cell">
            Wallet Prompts
          </TableHeading>
          {/* Empty space for delete button */}
          <th className="table-cell" />
        </tr>
      </thead>
      <tbody>
        {[...partners].reverse().map((partner: Partner) => (
          <TableRow key={partner.id} partner={partner} ecosystem={ecosystem} />
        ))}
      </tbody>
    </table>
  );
}

function TableHeading(props: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "text-xs p-4 font-semibold tracking-wide text-left uppercase text-muted-foreground",
        props.className,
      )}
    >
      {props.children}
    </th>
  );
}

function TableRow(props: {
  partner: Partner;
  ecosystem: Ecosystem;
}) {
  const { deletePartner, isLoading: isDeleting } = useDeletePartner({
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to delete partner";
      toast.error(message);
    },
  });

  return (
    <tr
      className={cn(
        "relative border-b hover:bg-secondary",
        isDeleting && "animate-pulse",
      )}
    >
      <TableData className="truncate align-top max-w-32">
        {props.partner.name}
      </TableData>
      <TableData className="hidden align-top md:table-cell max-w-32 text-wrap">
        {props.partner.allowlistedDomains.map((domain) => (
          <div key={domain}>{domain}</div>
        ))}
      </TableData>
      <TableData className="hidden align-top max-w-32 md:table-cell">
        {props.partner.allowlistedBundleIds.map((domain) => (
          <div key={domain} className="truncate">
            {domain}
          </div>
        ))}
      </TableData>
      <TableData className="hidden align-top max-w-32 sm:table-cell">
        <ToolTipLabel label={props.partner.id}>
          <div className="truncate">
            <CopyButton text={props.partner.id} className="mr-1" />
            {props.partner.id}
          </div>
        </ToolTipLabel>
      </TableData>
      <TableData className="hidden align-top lg:table-cell">
        {props.partner.permissions.includes("PROMPT_USER_V1")
          ? "Prompt user"
          : "Never prompt"}
      </TableData>
      <td className="table-cell py-1 align-middle">
        <div className="flex gap-1.5 justify-end">
          <UpdatePartnerModal
            partner={props.partner}
            ecosystem={props.ecosystem}
          >
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="text-accent-foreground/50 hover:text-accent-foreground hover:bg-accent"
              disabled={isDeleting}
            >
              <Pencil className="size-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </UpdatePartnerModal>
          <ConfirmationDialog
            title={`Are you sure you want to delete the partner ${props.partner.name}?`}
            description={
              <span>
                Their partner key will no longer be able to use your ecosystem
                wallet. Their users will still have access to their assets at{" "}
                <Link
                  href={`https://${props.ecosystem.slug}.ecosystem.thirdweb.com`}
                  target="_blank"
                  className="text-primary"
                >
                  {props.ecosystem.slug.split(".")[1]}.ecosystem.thirdweb.com
                </Link>
              </span>
            }
            onSubmit={(): void => {
              deletePartner({
                ecosystem: props.ecosystem,
                partnerId: props.partner.id,
              });
            }}
            variant="destructive"
          >
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
              disabled={isDeleting}
            >
              <Trash2 className="size-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </ConfirmationDialog>
        </div>
      </td>
    </tr>
  );
}

function TableData({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <td className={cn("p-4 text-muted-foreground", className)}>{children}</td>
  );
}
