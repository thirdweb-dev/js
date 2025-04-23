import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { CopyButton } from "@/components/ui/CopyButton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "tw-components/link";
import type { Ecosystem, Partner } from "../../../../../types";
import { usePartners } from "../../../hooks/use-partners";
import { useDeletePartner } from "../../hooks/use-delete-partner";

export function PartnersTable({
  ecosystem,
  authToken,
  teamSlug,
  teamId,
}: {
  ecosystem: Ecosystem;
  authToken: string;
  teamSlug: string;
  teamId: string;
}) {
  const { partners, isPending } = usePartners({
    ecosystem,
    authToken,
    teamId,
  });

  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static list with index as key
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Domains</TableHead>
            <TableHead className="hidden md:table-cell">Bundle ID</TableHead>
            <TableHead className="hidden sm:table-cell">Partner ID</TableHead>

            {/* Empty space for delete button */}
            <th className="table-cell" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...partners].reverse().map((partner: Partner) => (
            <PartnerRow
              key={partner.id}
              partner={partner}
              ecosystem={ecosystem}
              authToken={authToken}
              teamSlug={teamSlug}
              teamId={teamId}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function PartnerRow(props: {
  partner: Partner;
  ecosystem: Ecosystem;
  teamSlug: string;
  authToken: string;
  teamId: string;
}) {
  const router = useDashboardRouter();
  const { mutateAsync: deletePartner, isPending: isDeleting } =
    useDeletePartner(
      {
        authToken: props.authToken,
        teamId: props.teamId,
      },
      {
        onError: (error) => {
          const message =
            error instanceof Error ? error.message : "Failed to delete partner";
          toast.error(message);
        },
      },
    );

  return (
    <TableRow
      linkBox
      className={cn("hover:bg-card", isDeleting && "animate-pulse")}
    >
      <TableCell className="max-w-32 truncate align-center">
        {props.partner.name}
      </TableCell>
      <TableCell className="hidden max-w-32 text-wrap align-center md:table-cell">
        {props.partner.allowlistedDomains.map((domain) => (
          <div key={domain}>{domain}</div>
        ))}
      </TableCell>
      <TableCell className="hidden max-w-32 align-center md:table-cell">
        {props.partner.allowlistedBundleIds.map((domain) => (
          <div key={domain} className="truncate">
            {domain}
          </div>
        ))}
      </TableCell>
      <TableCell className="hidden max-w-32 align-center sm:table-cell">
        <ToolTipLabel label={props.partner.id}>
          <div className="flex items-center ">
            <CopyButton text={props.partner.id} className="mr-1" />
            <span className="truncate">{props.partner.id}</span>
          </div>
        </ToolTipLabel>
      </TableCell>

      <td className="table-cell py-3 align-middle">
        <div className="flex justify-end gap-3 pr-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="text-accent-foreground/50 hover:bg-accent hover:text-accent-foreground"
            disabled={isDeleting}
            onClick={() => {
              router.push(
                `/team/${props.teamSlug}/~/ecosystem/${props.ecosystem.slug}/configuration/partners/${props.partner.id}/edit`,
              );
            }}
          >
            <Pencil className="size-4" />
            <span className="sr-only">Edit</span>
          </Button>
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
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
              disabled={isDeleting}
            >
              <Trash2 className="size-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </ConfirmationDialog>
        </div>
      </td>
    </TableRow>
  );
}
