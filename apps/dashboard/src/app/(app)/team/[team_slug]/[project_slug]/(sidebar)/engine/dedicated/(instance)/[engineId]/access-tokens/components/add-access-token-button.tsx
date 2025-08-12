import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import { PlainTextCodeBlock } from "@/components/ui/code/plaintext-code";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useEngineCreateAccessToken } from "@/hooks/useEngine";
import { parseError } from "@/utils/errorParser";

export function AddAccessTokenButton({
  instanceUrl,
  authToken,
}: {
  instanceUrl: string;
  authToken: string;
}) {
  const [accessToken, setAccessToken] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const createAccessToken = useEngineCreateAccessToken({
    authToken,
    instanceUrl,
  });
  const [hasStoredToken, setHasStoredToken] = useState(false);

  return (
    <>
      <Button
        className="gap-2"
        onClick={() => {
          createAccessToken.mutate(undefined, {
            onError: (error) => {
              toast.error("Failed to create access token", {
                description: parseError(error),
              });
              console.error(error);
            },
            onSuccess: (response) => {
              toast.success("Access token created successfully");
              setAccessToken(response.accessToken);
              setIsOpen(true);
            },
          });
        }}
      >
        {createAccessToken.isPending ? (
          <Spinner className="size-4" />
        ) : (
          <PlusIcon className="size-4" />
        )}
        Create Access Token
      </Button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setAccessToken("");
        }}
      >
        <DialogContent className="p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-4 lg:p-6">
            <DialogTitle>Access token</DialogTitle>
            <DialogDescription>
              This access token will not be shown again.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 overflow-hidden px-4 lg:px-6">
            <PlainTextCodeBlock code={accessToken} className="max-w-full" />
            <CheckboxWithLabel>
              <Checkbox
                checked={hasStoredToken}
                onCheckedChange={(val) => setHasStoredToken(!!val)}
              />
              <span>I have securely stored this access token.</span>
            </CheckboxWithLabel>
          </div>

          <div className="p-4 lg:p-6 border-t bg-card mt-8 flex justify-end">
            <Button
              disabled={!hasStoredToken}
              onClick={() => {
                setIsOpen(false);
                setAccessToken("");
              }}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
