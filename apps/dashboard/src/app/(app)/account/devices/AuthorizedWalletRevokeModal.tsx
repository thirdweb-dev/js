import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AuthorizedWalletRevokeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (authorizedWalletId: string) => void;
  authorizedWalletId: string;
};

export const AuthorizedWalletRevokeModal: React.FC<
  AuthorizedWalletRevokeModalProps
> = ({ isOpen, onClose, onSubmit, authorizedWalletId }) => {
  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      open={isOpen}
    >
      <DialogContent className="p-0">
        <DialogHeader className="p-6">
          <DialogTitle>Revoke Device Access</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Are you sure you want to revoke this device?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-4 border-border border-t bg-card p-6">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit(authorizedWalletId)}
            variant="destructive"
          >
            Revoke
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
