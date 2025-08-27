import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ThirdwebClient } from "thirdweb";
import { isAddress, shortenAddress } from "thirdweb/utils";
import { z } from "zod";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { useAllChainsData } from "@/hooks/chains/allChains";
import {
  type CreateRelayerInput,
  useEngineBackendWallets,
  useEngineCreateRelayer,
} from "@/hooks/useEngine";
import { parseError } from "@/utils/errorParser";

const addRelayerFormSchema = z.object({
  chainId: z.number().min(1, "Chain is required"),
  backendWalletAddress: z.string().min(1, "Backend wallet is required"),
  name: z.string().optional(),
  allowedContractsRaw: z.string().optional(),
  allowedForwardersRaw: z.string().optional(),
});

type AddRelayerFormData = z.infer<typeof addRelayerFormSchema>;

interface AddRelayerButtonProps {
  instanceUrl: string;
  authToken: string;
  client: ThirdwebClient;
}

export function AddRelayerButton({
  instanceUrl,
  authToken,
  client,
}: AddRelayerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-fit gap-2">
        <PlusIcon className="size-4" />
        Add Relayer
      </Button>

      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent className="p-0 overflow-hidden">
          <AddModalContent
            authToken={authToken}
            client={client}
            instanceUrl={instanceUrl}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

function AddModalContent({
  instanceUrl,
  setIsOpen,
  authToken,
  client,
}: {
  instanceUrl: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  authToken: string;
  client: ThirdwebClient;
}) {
  const { idToChain } = useAllChainsData();
  const createRelayer = useEngineCreateRelayer({
    authToken,
    instanceUrl,
  });
  const { data: backendWallets } = useEngineBackendWallets({
    authToken,
    instanceUrl,
  });

  const form = useForm<AddRelayerFormData>({
    resolver: zodResolver(addRelayerFormSchema),
    defaultValues: {
      chainId: 11155111, // sepolia chain id
    },
  });

  const onSubmit = (data: AddRelayerFormData) => {
    const createRelayerData: CreateRelayerInput = {
      allowedContracts: data.allowedContractsRaw
        ? parseAddressListRaw(data.allowedContractsRaw)
        : undefined,
      allowedForwarders: data.allowedForwardersRaw
        ? parseAddressListRaw(data.allowedForwardersRaw)
        : undefined,
      backendWalletAddress: data.backendWalletAddress,
      chain: idToChain.get(data.chainId)?.slug ?? "unknown",
      name: data.name,
    };

    createRelayer.mutate(createRelayerData, {
      onError: (error) => {
        toast.error("Failed to create relayer", {
          description: parseError(error),
        });
        console.error(error);
      },
      onSuccess: () => {
        toast.success("Relayer created successfully");
        setIsOpen(false);
      },
    });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="p-4 lg:p-6">
            <DialogHeader className="mb-5">
              <DialogTitle>Add Relayer</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="chainId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chain</FormLabel>
                    <FormControl>
                      <SingleNetworkSelector
                        chainId={field.value}
                        disableDeprecated
                        disableChainId
                        className="bg-card"
                        client={client}
                        onChange={(val) => field.onChange(val)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="backendWalletAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Backend Wallet</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="bg-card">
                          <SelectValue placeholder="Select a backend wallet to use as a relayer" />
                        </SelectTrigger>
                        <SelectContent>
                          {backendWallets?.map((wallet) => (
                            <SelectItem
                              key={wallet.address}
                              value={wallet.address}
                            >
                              {shortenAddress(wallet.address)}
                              {wallet.label && ` (${wallet.label})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-card"
                        placeholder="Enter a description for this relayer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allowedContractsRaw"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allowed Contracts</FormLabel>
                    <FormControl>
                      <Textarea
                        className="bg-card"
                        placeholder="Enter a comma or newline-separated list of contract addresses"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Allow all contracts if omitted.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allowedForwardersRaw"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allowed Forwarders</FormLabel>
                    <FormControl>
                      <Textarea
                        className="bg-card"
                        placeholder="Enter a comma or newline-separated list of forwarder addresses"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Allow all forwarders if omitted.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 p-4 lg:p-6 border-t bg-card">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              {createRelayer.isPending && <Spinner className="size-4" />}
              Add
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

/**
 * Returns a list of valid addresses from a comma or newline-separated string.
 *
 * Example:
 *  input: 0xa5B8492D8223D255dB279C7c3ebdA34Be5eC9D85,0x4Ff9aa707AE1eAeb40E581DF2cf4e14AffcC553d
 *  output:
 *  [
 *    0xa5B8492D8223D255dB279C7c3ebdA34Be5eC9D85,
 *    0x4Ff9aa707AE1eAeb40E581DF2cf4e14AffcC553d,
 *  ]
 */
export const parseAddressListRaw = (raw: string): string[] | undefined => {
  const addresses = raw
    .split(/[,\n]/)
    .map((entry) => entry.trim())
    .filter((entry) => isAddress(entry));
  return addresses.length > 0 ? addresses : undefined;
};
