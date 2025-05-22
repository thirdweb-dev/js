import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="p-0">
        <DialogHeader className="p-6">
          <DialogTitle className="font-semibold text-2xl tracking-tight">
            Are you sure you want to revoke this device?
          </DialogTitle>
        </DialogHeader>

        <DialogFooter className="gap-4 border-border border-t bg-card p-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => onSubmit(authorizedWalletId)}
          >
            Revoke
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
