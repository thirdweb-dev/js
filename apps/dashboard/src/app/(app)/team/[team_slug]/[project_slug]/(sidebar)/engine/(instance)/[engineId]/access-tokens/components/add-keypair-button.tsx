import { InfoIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CodeClient } from "@/components/ui/code/code.client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type KeypairAlgorithm, useEngineAddKeypair } from "@/hooks/useEngine";
import { parseError } from "@/utils/errorParser";

const KEYPAIR_ALGORITHM_DETAILS: Record<
  KeypairAlgorithm,
  {
    name: string;
    privateKeyInstructions: string;
    publicKeyInstructions: string;
  }
> = {
  ES256: {
    name: "ECDSA",
    privateKeyInstructions:
      "openssl ecparam -name prime256v1 -genkey -noout -out private.key",
    publicKeyInstructions: "openssl ec -in private.key -pubout -out public.key",
  },
  PS256: {
    name: "RSASSA-PSS",
    privateKeyInstructions:
      "openssl genpkey -algorithm RSA-PSS -out private.key -pkeyopt rsa_keygen_bits:2048 -pkeyopt rsa_pss_keygen_md:sha256",
    publicKeyInstructions:
      "openssl rsa -pubout -in private.key -out public.key",
  },
  RS256: {
    name: "RSASSA-PKCS1-v1_5",
    privateKeyInstructions:
      "openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048",
    publicKeyInstructions:
      "openssl rsa -pubout -in private.key -out public.key",
  },
};

export function AddKeypairButton({
  instanceUrl,
  authToken,
}: {
  instanceUrl: string;
  authToken: string;
}) {
  const [publicKey, setPublicKey] = useState("");
  const [algorithm, setAlgorithm] = useState<KeypairAlgorithm>("ES256");
  const [label, setLabel] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const importKeypairMutation = useEngineAddKeypair({
    authToken,
    instanceUrl,
  });

  const onClick = async () => {
    try {
      await importKeypairMutation.mutateAsync({
        algorithm,
        label,
        publicKey,
      });
      toast.success("Public key added successfully.");
      setPublicKey("");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to add public key.", {
        description: parseError(error),
      });
      console.error(error);
    }
  };

  return (
    <>
      <Button className="w-fit gap-2" onClick={() => setIsOpen(true)}>
        <PlusIcon className="size-4" /> Add Public Key
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="!max-w-2xl p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-4 lg:p-6 border-b border-dashed">
            <DialogTitle className="text-lg font-semibold">
              Add Public Key
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 max-h-[600px] overflow-y-auto px-4 lg:px-6 pb-6 pt-4">
            {/* instruction */}
            <div className="space-y-2">
              {/* create private key */}
              <div className="space-y-2">
                <span className="text-sm">Generate a public key</span>
                <Select
                  value={algorithm}
                  onValueChange={(v) => setAlgorithm(v as KeypairAlgorithm)}
                >
                  <SelectTrigger className="bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent id="algorithm">
                    {(
                      Object.keys(
                        KEYPAIR_ALGORITHM_DETAILS,
                      ) as KeypairAlgorithm[]
                    ).map((key) => (
                      <SelectItem key={key} value={key}>
                        {key} ({KEYPAIR_ALGORITHM_DETAILS[key].name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <CodeClient
                  lang="bash"
                  code={`\
# create private key
${KEYPAIR_ALGORITHM_DETAILS[algorithm].privateKeyInstructions}

# extract public key
${KEYPAIR_ALGORITHM_DETAILS[algorithm].publicKeyInstructions}

# print public key
cat public.key
`}
                />
              </div>
            </div>

            {/* public key input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="publicKey">
                Public Key ({KEYPAIR_ALGORITHM_DETAILS[algorithm].name}){" "}
                <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="publicKey"
                className="font-mono bg-card"
                rows={6}
                placeholder={
                  "-----BEGIN PUBLIC KEY-----\n...\n...\n...\n...\n-----END PUBLIC KEY-----"
                }
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                required
              />
            </div>

            {/* label */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium" htmlFor="key-label">
                Label
              </label>
              <Input
                id="key-label"
                placeholder="Enter a description for this keypair"
                className="bg-card"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>

            {/* alert */}
            <Alert variant="info">
              <InfoIcon className="size-5" />
              <AlertTitle>Keep your private key secure</AlertTitle>
              <AlertDescription>
                Your backend will sign access tokens with this private key which
                Engine verifies with this public key.
              </AlertDescription>
            </Alert>
          </div>

          <div className="flex justify-end gap-3 border-t p-4 lg:p-6 bg-card">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button
              disabled={!publicKey}
              onClick={onClick}
              type="submit"
              className="gap-2"
            >
              {importKeypairMutation.isPending && (
                <Spinner className="size-4" />
              )}
              Add Public Key
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
