import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Spinner } from "@/components/ui/Spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { WalletCredential } from "@/hooks/useEngine";
import { EditWalletCredentialButton } from "./edit-wallet-credential-button";

interface WalletCredentialsTableProps {
  credentials: WalletCredential[];
  isPending: boolean;
  isFetched: boolean;
  instanceUrl: string;
  authToken: string;
}

export const WalletCredentialsTable: React.FC<WalletCredentialsTableProps> = ({
  credentials,
  isPending,
  isFetched,
  instanceUrl,
  authToken,
}) => {
  if (isPending && !isFetched) {
    return (
      <div className="flex min-h-[300px] grow items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (credentials.length === 0) {
    return (
      <div className="flex min-h-[300px] grow items-center justify-center">
        <p className="text-muted-foreground text-sm">No credentials found</p>
      </div>
    );
  }

  return (
    <TableContainer className="border-none">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Default</TableHead>
            <TableHead className="w-0" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {credentials.map((credential) => (
            <TableRow key={credential.id}>
              <TableCell>
                <CopyTextButton
                  className="font-mono text-xs"
                  copyIconPosition="right"
                  textToCopy={credential.id}
                  textToShow={`${credential.id.slice(0, 8)}...`}
                  tooltip="Copy credential ID"
                  variant="secondary"
                />
              </TableCell>
              <TableCell>{credential.label || "-"}</TableCell>
              <TableCell>
                <Badge variant="outline">{credential.type}</Badge>
              </TableCell>
              <TableCell>
                {format(new Date(credential.createdAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                {format(new Date(credential.updatedAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                {credential.isDefault ? (
                  <Badge variant="success">Yes</Badge>
                ) : (
                  <Badge variant="outline">No</Badge>
                )}
              </TableCell>
              <TableCell>
                <EditWalletCredentialButton
                  authToken={authToken}
                  credential={credential}
                  instanceUrl={instanceUrl}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
