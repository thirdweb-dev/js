"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { EllipsisIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FileInput } from "../../../components/shared/FileInput";
import { DangerSettingCard } from "../../team/[team_slug]/(team)/~/settings/general/DangerSettingCard";
import { SettingsCard } from "../../team/[team_slug]/(team)/~/settings/general/SettingsCard";

type MinimalAccount = Pick<
  Account,
  "name" | "email" | "emailConfirmedAt" | "unconfirmedEmail"
>;

export function AccountSettingsPageUI(props: {
  account: MinimalAccount;
}) {
  return (
    <div className="flex flex-col gap-8">
      <AccountAvatarFormControl />
      <AccountNameFormControl name={props.account.name || ""} />
      <AccountEmailFormControl
        email={props.account.email || ""}
        // TODO - is this correct way to check this?
        status={props.account.emailConfirmedAt ? "verified" : "unverified"}
      />

      <DeleteAccountCard />
    </div>
  );
}

function AccountAvatarFormControl() {
  const [avatar, setAvatar] = useState<File>(); // TODO: prefill with account avatar

  // TODO - implement
  const updateAvatarMutation = useMutation({
    mutationFn: async (_avatar: File | undefined) => {
      // Fake loading
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log("Updating account image to", _avatar);
      throw new Error("Not implemented");
    },
  });

  function handleSave() {
    const promises = updateAvatarMutation.mutateAsync(avatar);
    toast.promise(promises, {
      success: "Account avatar updated successfully",
      error: "Failed to update account avatar",
    });
  }

  return (
    <SettingsCard
      bottomText="An avatar is optional but strongly recommended."
      saveButton={{
        onClick: handleSave,
        disabled: false,
        isLoading: updateAvatarMutation.isLoading,
      }}
      noPermissionText={undefined}
      errorText={undefined}
    >
      <div className="flex flex-row gap-4 md:justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">Avatar</h3>
          <p className="text-foreground text-sm mt-1.5 mb-4 leading-relaxed">
            This is your account's avatar. <br /> Click on the avatar to upload
            a custom one
          </p>
        </div>
        <FileInput
          accept={{ "image/*": [] }}
          value={avatar}
          setValue={setAvatar}
          className="w-20 lg:w-28 rounded-full"
          disableHelperText
        />
      </div>
    </SettingsCard>
  );
}

function AccountNameFormControl(props: {
  name: string;
}) {
  const [accountName, setAccountName] = useState(props.name);
  const maxAccountNameLength = 32;

  // TODO - implement
  const updateAccountNameMutation = useMutation({
    mutationFn: async (name: string) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log("Updating account name to", name);
      throw new Error("Not implemented");
    },
  });

  function handleSave() {
    const promises = updateAccountNameMutation.mutateAsync(accountName);
    toast.promise(promises, {
      success: "Account name updated successfully",
      error: "Failed to update account name",
    });
  }

  return (
    <SettingsCard
      header={{
        title: "Display Name",
        description: "This is your account's name displayed on thirdweb",
      }}
      bottomText={`Please use ${maxAccountNameLength} characters at maximum.`}
      saveButton={{
        onClick: handleSave,
        disabled: accountName.length === 0,
        isLoading: updateAccountNameMutation.isLoading,
      }}
      errorText={undefined}
      noPermissionText={undefined} // TODO
    >
      <Input
        value={accountName}
        onChange={(e) => {
          setAccountName(e.target.value.slice(0, maxAccountNameLength));
        }}
        className="md:w-[400px]"
      />
    </SettingsCard>
  );
}

function DeleteAccountCard() {
  const router = useDashboardRouter();
  const title = "Delete Account";
  const description =
    "Permanently remove your Personal Account and all of its contents from the thirdweb platform. This action is not reversible, please continue with caution.";

  // TODO
  const deleteAccount = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log("Deleting account");
      throw new Error("Not implemented");
    },
    onSuccess: () => {
      router.push("/team");
    },
  });

  function handleDelete() {
    const promises = deleteAccount.mutateAsync();
    toast.promise(promises, {
      success: "Account deleted successfully",
      error: "Failed to delete account",
    });
  }

  return (
    <DangerSettingCard
      title={title}
      description={description}
      buttonLabel={title}
      buttonOnClick={handleDelete}
      isLoading={deleteAccount.isLoading}
      confirmationDialog={{
        title: "Are you sure you want to delete your account?",
        description:
          "This action is not reversible and will delete all of your data.",
      }}
    />
  );
}

function AccountEmailFormControl(props: {
  email: string;
  status: "unverified" | "verfication-sent" | "verified";
}) {
  // TODO - query for account changes when the email is updated

  return (
    <SettingsCard
      header={{
        title: "Email",
        description:
          "Enter the email address you want to use to log in with thirdweb. This email will be used for account related notifications",
      }}
      bottomText={
        "Emails must be verified to be able to login with them or be used as primary email"
      }
      errorText={undefined}
      noPermissionText={undefined}
    >
      <div className="flex gap-4 justify-between items-center border rounded-lg p-4 bg-card">
        {/* Start */}
        <div className="flex flex-col lg:flex-row lg:items-center items-start gap-2 lg:gap-3">
          <p className="text-sm"> {props.email}</p>
          <Badge
            className="capitalize "
            variant={props.status === "unverified" ? "outline" : "default"}
          >
            {props.status}
          </Badge>
        </div>

        {/* End */}
        <EmailUpdateDialog
          currentEmail={props.email}
          trigger={
            <Button
              size="icon"
              variant="ghost"
              className="!h-auto !w-auto p-1.5"
            >
              <EllipsisIcon className="size-5 text-muted-foreground" />
            </Button>
          }
        />
      </div>
    </SettingsCard>
  );
}

const emailUpdateFormSchema = z.object({
  email: z.string().min(1, "Email can not be empty").max(100),
});

function EmailUpdateDialog(props: {
  currentEmail: string;
  trigger: React.ReactNode;
}) {
  const form = useForm<z.infer<typeof emailUpdateFormSchema>>({
    resolver: zodResolver(emailUpdateFormSchema),
    values: {
      email: props.currentEmail,
    },
  });

  // TODO - implement
  const updateEmailMutation = useMutation({
    mutationFn: async (_email: string) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log("Updating account email to", _email);
      throw new Error("Not implemented");
    },
  });

  function onSubmit(values: z.infer<typeof emailUpdateFormSchema>) {
    const promises = updateEmailMutation.mutateAsync(values.email);
    toast.promise(promises, {
      success: "Email updated successfully",
      error: "Failed to update email",
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>

      <DialogContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-6 flex flex-col gap-4 pb-10">
              <DialogHeader className="pr-10">
                <DialogTitle className="text-2xl">Update Email</DialogTitle>
                <DialogDescription>
                  A confirmation email will be sent to verify email address
                </DialogDescription>
              </DialogHeader>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        className="selection:bg-foreground/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-4 lg:gap-1 bg-muted/50 p-6 border-t">
              <DialogClose asChild>
                <Button variant="outline"> Cancel </Button>
              </DialogClose>
              <Button className="min-w-24 gap-2" type="submit">
                {updateEmailMutation.isLoading && (
                  <Spinner className="size-4" />
                )}
                {updateEmailMutation.isLoading ? "Saving" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
