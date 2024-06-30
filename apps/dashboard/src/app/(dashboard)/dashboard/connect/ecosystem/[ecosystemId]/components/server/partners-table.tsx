import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import type { Ecosystem, Partner } from "../../../types";
import { useDeletePartner } from "../../hooks/use-delete-partner";
import { usePartners } from "../../hooks/use-partners";

export function PartnersTable({ ecosystem }: { ecosystem: Ecosystem }) {
  const { partners, isLoading } = usePartners({ ecosystemId: ecosystem.id });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
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
          <TableHeading>Domains</TableHeading>
          <TableHeading>Bundle ID</TableHeading>
          <TableHeading>Partner Key</TableHeading>
          <TableHeading>Permissions</TableHeading>
          {/* Empty space for delete button */}
          <th />
        </tr>
      </thead>
      <tbody>
        {partners?.map((partner: Partner) => (
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
  const { deletePartner, isLoading: isDeleting } = useDeletePartner();

  return (
    <tr
      className={cn(
        "relative border-b hover:bg-secondary",
        isDeleting && "animate-pulse",
      )}
    >
      <TableData>{props.partner.name}</TableData>
      <TableData>{props.partner.allowlistedDomains.join(", ")}</TableData>
      <TableData>{props.partner.allowlistedBundleIds.join(", ")}</TableData>
      <TableData>{props.partner.id}</TableData>
      <TableData>{props.partner.permissions}</TableData>
      <td className="py-1">
        <ConfirmationDialog
          title={`Are you sure you want to delete the partner ${props.partner.name}?`}
          description={
            <span>
              Their partner key will no longer be able to use your ecosystem
              wallet. Their users will still have access to their assets at{" "}
              <Link
                href={`https://${props.ecosystem.slug.split(".")[1]}.ecosystem.thirdweb.com`}
                target="_blank"
                className="text-primary"
              >
                {props.ecosystem.slug.split(".")[1]}.ecosystem.thirdweb.com
              </Link>
            </span>
          }
          onSubmit={(): void => {
            deletePartner({
              ecosystemId: props.ecosystem.id,
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
          </Button>
        </ConfirmationDialog>
      </td>
    </tr>
  );
}

function TableData({ children }: { children: React.ReactNode }) {
  return <td className="p-4 text-muted-foreground">{children}</td>;
}
