"use client";

import { WalletAddress } from "@/components/blocks/wallet-address";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllRoleMembers } from "contract-ui/hooks/permissions";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import {
  type ThirdwebClient,
  type ThirdwebContract,
  ZERO_ADDRESS,
} from "thirdweb";
import { useReadContract } from "thirdweb/react";
import type { ProjectMeta } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { buildContractPagePath } from "../../_utils/contract-page-path";

export function PermissionsTable(props: {
  contract: ThirdwebContract;
  chainSlug: string;
  projectMeta: ProjectMeta | undefined;
}) {
  const permissionsHref = buildContractPagePath({
    projectMeta: props.projectMeta,
    chainIdOrSlug: props.chainSlug,
    contractAddress: props.contract.address,
    subpath: "/permissions",
  });

  const allRoleMembers = useReadContract(getAllRoleMembers, {
    contract: props.contract,
  });

  const members = useMemo(() => {
    return (
      Object.entries(allRoleMembers.data || {}).reduce(
        (acc, [role, roleMembers]) => {
          // biome-ignore lint/complexity/noForEach: FIXME
          roleMembers.forEach((member) => {
            return !acc.find((m) => m.member === member)
              ? acc.push({ member, roles: [role] })
              : acc[acc.findIndex((m) => m.member === member)]?.roles.push(
                  role,
                );
          });

          return acc;
        },
        [] as { member: string; roles: string[] }[],
      ) || []
    ).filter((m) => m.member !== ZERO_ADDRESS);
  }, [allRoleMembers.data]);

  return (
    <PermissionsTableUI
      members={members}
      isPending={allRoleMembers.isPending}
      viewMoreLink={permissionsHref}
      client={props.contract.client}
    />
  );
}

export function PermissionsTableUI(props: {
  viewMoreLink: string;
  members: { member: string; roles: string[] }[];
  isPending: boolean;
  client: ThirdwebClient;
}) {
  return (
    <div className="rounded-lg border bg-card">
      {/* header */}
      <div className="flex w-full items-center justify-between border-b px-6 py-4">
        <h2 className="font-semibold text-xl tracking-tight">Permissions</h2>
        <Button asChild variant="outline" size="sm" className="bg-background">
          <Link
            href={props.viewMoreLink}
            className="flex items-center gap-2 text-muted-foreground text-sm"
          >
            View all <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
      </div>

      {/* table */}
      <TableContainer className="w-full border-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Roles</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {props.members.map((data) => (
              <TableRow key={data.member}>
                <TableCell>
                  <WalletAddress address={data.member} client={props.client} />
                </TableCell>
                <TableCell>
                  <div className="flex w-max flex-wrap gap-2">
                    {data.roles.map((role) => (
                      <Badge
                        variant="outline"
                        key={role}
                        className="bg-background py-1 font-normal text-sm capitalize"
                      >
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {props.members.length === 0 && (
        <div className="flex h-48 items-center justify-center text-sm">
          {props.isPending ? (
            <Spinner className="size-8" />
          ) : (
            <p>No Permissions</p>
          )}
        </div>
      )}
    </div>
  );
}
