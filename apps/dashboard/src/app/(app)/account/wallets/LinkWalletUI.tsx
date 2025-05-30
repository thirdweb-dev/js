"use client";

import { apiServerProxy } from "@/actions/proxies";
import type { LinkedWallet } from "@/api/linked-wallets";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { useMutation } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { MinusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { SearchInput } from "../components/SearchInput";

export function LinkWallet(props: {
  wallets: LinkedWallet[];
  accountEmail: string | undefined;
  client: ThirdwebClient;
}) {
  const router = useDashboardRouter();
  return (
    <LinkWalletUI
      client={props.client}
      wallets={props.wallets}
      accountEmail={props.accountEmail}
      unlinkWallet={async (walletId) => {
        const res = await apiServerProxy({
          pathname: `/v1/account/wallets/${walletId}`,
          method: "DELETE",
        });

        if (!res.ok) {
          console.error(res.error);
          throw new Error(res.error);
        }

        router.refresh();
      }}
    />
  );
}

export function LinkWalletUI(props: {
  wallets: LinkedWallet[];
  unlinkWallet: (walletId: string) => Promise<void>;
  accountEmail: string | undefined;
  client: ThirdwebClient;
}) {
  const [deletedWalletIds, setDeletedWalletIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  let walletsToShow = !searchValue
    ? props.wallets
    : props.wallets.filter((v) => {
        return v.walletAddress
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });

  walletsToShow = walletsToShow.filter((v) => !deletedWalletIds.includes(v.id));

  return (
    <div>
      <SearchInput
        placeholder="Search wallet address"
        value={searchValue}
        onValueChange={setSearchValue}
      />

      <div className="h-4" />

      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Wallet Address</TableCell>
              <TableCell>Linked on</TableCell>
              <TableCell>Unlink</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {walletsToShow.map((wallet) => (
              <TableRow key={wallet.walletAddress}>
                <TableCell>
                  <WalletAddress
                    address={wallet.walletAddress}
                    className="text-muted-foreground"
                    client={props.client}
                  />
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(wallet.createdAt, "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <UnlinkButton
                    client={props.client}
                    wallet={wallet}
                    unlinkWallet={props.unlinkWallet}
                    accountEmail={props.accountEmail}
                    onUnlinkSuccess={() => {
                      setDeletedWalletIds([...deletedWalletIds, wallet.id]);
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}

            {walletsToShow.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-[200px] text-center">
                  <div className="flex flex-col gap-3">
                    <p className="text-sm">No Wallets Found</p>
                    {searchValue && (
                      <p className="text-muted-foreground text-sm">
                        Your search for {`"${searchValue}"`} did not match any
                        wallets
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

function UnlinkButton(props: {
  wallet: LinkedWallet;
  unlinkWallet: (walletId: string) => Promise<void>;
  onUnlinkSuccess: () => void;
  accountEmail: string | undefined;
  client: ThirdwebClient;
}) {
  const [open, setOpen] = useState(false);
  const unlinkWallet = useMutation({
    mutationFn: props.unlinkWallet,
    onSuccess: () => {
      props.onUnlinkSuccess();
      setOpen(false);
      toast.success("Wallet unlinked successfully");
    },
    onError: () => {
      toast.error("Failed to unlink wallet");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <MinusIcon className="size-4" />
          Unlink
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 p-0">
        <div className="p-6 pb-2">
          <DialogHeader>
            <DialogTitle>Unlink Wallet</DialogTitle>
            <DialogDescription>
              <span className="block">
                Are you sure you want to unlink this wallet?
              </span>
            </DialogDescription>
          </DialogHeader>

          {/* biome-ignore lint/a11y/noNoninteractiveTabindex: prevents autofocus inside this div to prevent hover card from opening */}
          <div className="py-2" tabIndex={0}>
            <WalletAddress
              address={props.wallet.walletAddress}
              className="text-muted-foreground"
              client={props.client}
            />
          </div>
        </div>

        <div className="border-t p-6 py-4">
          <p className="text-muted-foreground text-sm">
            This wallet can be linked again by logging in dashboard with this
            wallet and providing the confirmation code sent to{" "}
            {props.accountEmail || "email address associated with this account"}
          </p>
        </div>

        <div className="flex justify-end gap-4 rounded-b-lg border-t bg-card p-6">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={unlinkWallet.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              unlinkWallet.mutate(props.wallet.id);
            }}
            disabled={unlinkWallet.isPending}
          >
            {unlinkWallet.isPending ? (
              <Spinner className="mr-2 size-4" />
            ) : (
              <MinusIcon className="mr-2 size-4" />
            )}
            Unlink Wallet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
