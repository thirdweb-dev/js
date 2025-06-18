"use client";

import { Button } from "@/components/ui/button";
import {
  type AuthorizedWallet,
  useRevokeAuthorizedWallet,
} from "@3rdweb-sdk/react/hooks/useApi";
import { createColumnHelper } from "@tanstack/react-table";
import { TWTable } from "components/shared/TWTable";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { isAddress } from "thirdweb/utils";
import type { ComponentWithChildren } from "types/component-with-children";
import { shortenString } from "utils/usedapp-external";
import { AuthorizedWalletRevokeModal } from "./AuthorizedWalletRevokeModal";

interface AuthorizedWalletsTableProps {
  authorizedWallets: AuthorizedWallet[];
  isPending: boolean;
  isFetched: boolean;
}

const columnHelper = createColumnHelper<AuthorizedWallet>();

export const AuthorizedWalletsTable: ComponentWithChildren<
  AuthorizedWalletsTableProps
> = ({ authorizedWallets, isPending, isFetched }) => {
  const { mutateAsync: revokeAccess } = useRevokeAuthorizedWallet();
  const [revokeAuthorizedWalletId, setRevokeAuthorizedWalletId] = useState<
    string | undefined
  >(undefined);
  const [isOpen, setIsOpen] = useState(false);

  const columns = [
    columnHelper.accessor("deviceName", {
      header: "Device Name",
      cell: (cell) => {
        const value = cell.getValue();
        if (!value) {
          return;
        }
        if (isAddress(value)) {
          return <span className="text-sm">{shortenString(value, false)}</span>;
        }
        return <span className="text-sm">{value}</span>;
      },
    }),

    columnHelper.accessor("createdAt", {
      header: "Authorized at",
      cell: (cell) => {
        const value = cell.getValue();

        if (!value) {
          return;
        }
        const createdDate = format(new Date(value), "MMM dd, yyyy");
        return <span className="text-sm">{createdDate}</span>;
      },
    }),

    columnHelper.accessor("id", {
      header: "",
      cell: (cell) => {
        const value = cell.getValue();
        if (!value) {
          return;
        }
        return (
          <Button
            onClick={() => handleOpen(value)}
            variant="destructive"
            size="sm"
          >
            Revoke Access
          </Button>
        );
      },
    }),
  ];

  const handleOpen = (authorizedWalletId: AuthorizedWallet["id"]) => {
    setRevokeAuthorizedWalletId(authorizedWalletId);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setRevokeAuthorizedWalletId(undefined);
  };

  const handleSubmit = async () => {
    if (!revokeAuthorizedWalletId) {
      return;
    }

    try {
      await revokeAccess({
        authorizedWalletId: revokeAuthorizedWalletId,
      });

      toast.success("The selected device has been revoked.");
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong while revoking the device", {
        description:
          "Please visit our support site: https://thirdweb.com/support",
      });
    } finally {
      handleClose();
    }
  };

  return (
    <>
      {revokeAuthorizedWalletId && (
        <AuthorizedWalletRevokeModal
          isOpen={isOpen}
          onClose={handleClose}
          authorizedWalletId={revokeAuthorizedWalletId || ""}
          onSubmit={handleSubmit}
        />
      )}

      <TWTable
        title="Authorized Devices"
        columns={columns}
        data={authorizedWallets}
        isPending={isPending}
        isFetched={isFetched}
      />
    </>
  );
};
