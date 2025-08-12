import { InfoIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { type ThirdwebContract, ZERO_ADDRESS } from "thirdweb";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsAdmin } from "@/hooks/useContractRoles";
import { cn } from "@/lib/utils";
import { PermissionEditor } from "./permissions-editor";

interface ContractPermissionProps {
  role: string;
  description: string;
  isPending: boolean;
  contract: ThirdwebContract;
}

export const ContractPermission: React.FC<ContractPermissionProps> = ({
  role,
  description,
  isPending,
  contract,
}) => {
  const form = useFormContext();

  const roleMembers: string[] = form.watch(role) || [];
  const isRestricted =
    !roleMembers.includes(ZERO_ADDRESS) ||
    (role !== "transfer" && role !== "lister" && role !== "asset");
  const isAdmin = useIsAdmin(contract);

  return (
    <div className="border-b border-dashed px-4 lg:px-6 py-6">
      {/* header */}
      <div
        className={cn(
          "flex flex-col lg:flex-row lg:justify-between gap-4 mb-2",
          description && "mb-4",
        )}
      >
        {/* left */}
        <div className="space-y-0.5">
          <h3 className="font-semibold text-lg tracking-tight capitalize">
            {role === "minter" ? "Minter / Creator" : role}
          </h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>

        {/* right */}
        {role === "transfer" && isAdmin && (
          <Select
            onValueChange={(value) => {
              if (value === "1") {
                form.setValue(
                  role,
                  roleMembers.filter((address) => address !== ZERO_ADDRESS),
                  { shouldDirty: true },
                );
              } else {
                form.setValue(role, [ZERO_ADDRESS, ...roleMembers], {
                  shouldDirty: true,
                });
              }
            }}
            value={isRestricted ? "1" : "0"}
          >
            <SelectTrigger className="bg-background rounded-full w-fit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-lg" sideOffset={4} align="end">
              <SelectItem value="1">Non-Transferable</SelectItem>
              <SelectItem value="0">Transferable</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* right */}
        {role === "lister" && isAdmin && (
          <Select
            onValueChange={(value) => {
              if (value === "1") {
                form.setValue(
                  role,
                  roleMembers.filter((address) => address !== ZERO_ADDRESS),
                  { shouldDirty: true },
                );
              } else {
                form.setValue(role, [ZERO_ADDRESS, ...roleMembers], {
                  shouldDirty: true,
                });
              }
            }}
            value={isRestricted ? "1" : "0"}
          >
            <SelectTrigger className="bg-background rounded-full w-fit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-lg" sideOffset={4} align="end">
              <SelectItem value="1">Only specific wallets</SelectItem>
              <SelectItem value="0">Any wallet</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* right */}
        {role === "asset" && isAdmin && (
          <Select
            onValueChange={(value) => {
              if (value === "1") {
                form.setValue(
                  role,
                  roleMembers.filter((address) => address !== ZERO_ADDRESS),
                  { shouldDirty: true },
                );
              } else {
                form.setValue(role, [ZERO_ADDRESS, ...roleMembers], {
                  shouldDirty: true,
                });
              }
            }}
            value={isRestricted ? "1" : "0"}
          >
            <SelectTrigger className="bg-background rounded-full w-fit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-lg" sideOffset={4} align="end">
              <SelectItem value="1">Only specific assets</SelectItem>
              <SelectItem value="0">Any asset</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-3">
        {/* alert */}
        {role === "transfer" && (
          <Alert variant="info" className="bg-background">
            <InfoIcon className="size-5" />
            <AlertTitle>
              {isRestricted ? (
                <>
                  The tokens in this contract are currently{" "}
                  <strong>non-transferable</strong>. Only wallets that you
                  explicitly add to the list below will be able to transfer
                  tokens
                </>
              ) : (
                <>
                  Transferring tokens in this contract is currently{" "}
                  <strong>not restricted</strong>. Everyone is free to transfer
                  their tokens
                </>
              )}
            </AlertTitle>
          </Alert>
        )}

        {/* alert */}
        {role === "lister" && (
          <Alert variant="info" className="bg-background">
            <InfoIcon className="size-5" />
            <AlertTitle>
              {isRestricted
                ? "Currently, only addresses specified below will be able to create listings on this marketplace."
                : "This marketplace is open for anyone to create listings."}
            </AlertTitle>
          </Alert>
        )}

        {/* alert */}
        {role === "asset" && (
          <Alert variant="info" className="bg-background">
            <InfoIcon className="size-5" />
            <AlertTitle>
              {isRestricted
                ? "Currently, only assets from the contracts specified below will be able to be used on this contract."
                : "This contract is open for people to list assets from any contract."}
            </AlertTitle>
          </Alert>
        )}

        {/* content */}
        {isPending ? (
          <Skeleton className="h-20 w-full" />
        ) : (
          isRestricted &&
          role && (
            <PermissionEditor
              contract={contract}
              role={role}
              isUserAdmin={isAdmin}
            />
          )
        )}
      </div>
    </div>
  );
};
