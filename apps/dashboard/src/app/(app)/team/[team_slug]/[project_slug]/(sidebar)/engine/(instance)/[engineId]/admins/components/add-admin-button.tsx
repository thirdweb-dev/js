import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isAddress } from "thirdweb";
import { z } from "zod";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner";
import { useEngineGrantPermissions } from "@/hooks/useEngine";
import { parseError } from "@/utils/errorParser";

const addAdminSchema = z.object({
  walletAddress: z
    .string()
    .refine((address) => isAddress(address), "Invalid address"),
  label: z.string().optional(),
});

type AddAdminFormData = z.infer<typeof addAdminSchema>;

export function AddAdminButton({
  instanceUrl,
  authToken,
}: {
  instanceUrl: string;
  authToken: string;
}) {
  const [open, setOpen] = useState(false);
  const grantPermissionsMutation = useEngineGrantPermissions({
    authToken,
    instanceUrl,
  });

  const form = useForm<AddAdminFormData>({
    resolver: zodResolver(addAdminSchema),
    defaultValues: {},
  });

  const onSubmit = (data: AddAdminFormData) => {
    grantPermissionsMutation.mutate(
      {
        ...data,
        permissions: "ADMIN",
      },
      {
        onError: (error) => {
          toast.error("Failed to add admin.", {
            description: parseError(error),
          });
          console.error(error);
        },
        onSuccess: () => {
          toast.success("Admin added successfully.");
          setOpen(false);
          form.reset();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-fit gap-2">
          <PlusIcon className="size-4" />
          Add Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 overflow-hidden gap-0">
        <DialogHeader className="p-4 lg:p-6">
          <DialogTitle>Add Admin</DialogTitle>
          <DialogDescription>
            Add a new admin to your engine instance.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 px-4 lg:px-6 pb-8">
              {/* wallet address */}
              <FormField
                control={form.control}
                name="walletAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wallet Address</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-card"
                        placeholder="0x..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* label */}
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-card"
                        placeholder="label for this admin"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-3 p-4 lg:p-6 bg-card border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-2">
                {grantPermissionsMutation.isPending && (
                  <Spinner className="size-4" />
                )}
                Add Admin
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
