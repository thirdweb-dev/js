import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { WalletCredential } from "@3rdweb-sdk/react/hooks/useEngine";
import { format } from "date-fns";
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
                  textToCopy={credential.id}
                  textToShow={`${credential.id.slice(0, 8)}...`}
                  variant="secondary"
                  className="font-mono text-xs"
                  tooltip="Copy credential ID"
                  copyIconPosition="right"
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
                  credential={credential}
                  instanceUrl={instanceUrl}
                  authToken={authToken}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
