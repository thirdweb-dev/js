"use client";

import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DEFAULT_ACCOUNT_FACTORY_V0_6,
  DEFAULT_ACCOUNT_FACTORY_V0_7,
} from "thirdweb/wallets/smart";

export function DefaultFactoriesSection() {
  const data = [
    {
      name: "AccountFactory (v0.6)",
      address: DEFAULT_ACCOUNT_FACTORY_V0_6,
      entrypointVersion: "0.6",
    },
    {
      name: "AccountFactory (v0.7)",
      address: DEFAULT_ACCOUNT_FACTORY_V0_7,
      entrypointVersion: "0.7",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        <h3 className="font-semibold text-xl tracking-tight">
          Default Account Factories
        </h3>
        <p className="text-muted-foreground text-sm">
          Ready to use account factories that are pre-deployed on each chain.{" "}
          <UnderlineLink
            href="https://playground.thirdweb.com/connect/account-abstraction/connect"
            target="_blank"
            rel="noreferrer"
          >
            Learn how to use these in your apps
          </UnderlineLink>
        </p>
      </div>

      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Network</TableHead>
              <TableHead>Contract address</TableHead>
              <TableHead>Entrypoint Version</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.address}>
                <TableCell>{row.name}</TableCell>
                <TableCell>All networks</TableCell>
                <TableCell>
                  <CopyAddressButton
                    address={row.address}
                    copyIconPosition="left"
                    variant="ghost"
                    className="-translate-x-2"
                  />
                </TableCell>
                <TableCell>{row.entrypointVersion}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
