"use client";

import { DangerSettingCard } from "@/components/blocks/DangerSettingCard";
import { SettingsCard } from "@/components/blocks/SettingsCard";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { EllipsisIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FileInput } from "../../../components/shared/FileInput";

type MinimalAccount = Pick<
  Account,
  "name" | "email" | "emailConfirmedAt" | "unconfirmedEmail"
>;

export function AccountSettingsPageUI(props: {
  account: MinimalAccount;
  // TODO - remove hide props these when these fields are functional
  hideAvatar?: boolean;
  hideDeleteAccount?: boolean;
  sendEmail: (email: string) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  updateEmailWithOTP: (otp: string) => Promise<void>;
}) {
  return (
    <div className="flex flex-col gap-8">
      {!props.hideAvatar && <AccountAvatarFormControl />}
      <AccountNameFormControl
        name={props.account.name || ""}
        updateName={(name) => props.updateName(name)}
      />
      <AccountEmailFormControl
        email={props.account.email || ""}
        status={props.account.emailConfirmedAt ? "verified" : "unverified"}
        sendEmail={props.sendEmail}
        updateEmailWithOTP={props.updateEmailWithOTP}
      />

      {!props.hideDeleteAccount && <DeleteAccountCard />}
    </div>
  );
}

function AccountAvatarFormControl() {
  const [avatar, setAvatar] = useState<File>();

  // TODO - implement
  const updateAvatarMutation = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    },
  });

  function handleSave() {
    const promises = updateAvatarMutation.mutateAsync();
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
        isPending: updateAvatarMutation.isPending,
      }}
      noPermissionText={undefined}
      errorText={undefined}
    >
      <div className="flex flex-row gap-4 md:justify-between">
        <div>
          <h3 className="font-semibold text-xl tracking-tight">Avatar</h3>
          <p className="mt-1.5 mb-4 text-foreground text-sm leading-relaxed">
            This is your account's avatar. <br /> Click on the avatar to upload
            a custom one
          </p>
        </div>
        <FileInput
          accept={{ "image/*": [] }}
          value={avatar}
          setValue={setAvatar}
          className="w-20 rounded-full lg:w-28"
          disableHelperText
        />
      </div>
    </SettingsCard>
  );
}

function AccountNameFormControl(props: {
  name: string;
  updateName: (name: string) => Promise<void>;
}) {
  const [accountName, setAccountName] = useState(props.name);
  const maxAccountNameLength = 32;

  const updateAccountNameMutation = useMutation({
    mutationFn: props.updateName,
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
        isPending: updateAccountNameMutation.isPending,
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
      isPending={deleteAccount.isPending}
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
  status: "unverified" | "verified";
  sendEmail: (email: string) => Promise<void>;
  updateEmailWithOTP: (otp: string) => Promise<void>;
}) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  return (
    <SettingsCard
      header={{
        title: "Email",
        description:
          "Enter the email address you want to use to log in with thirdweb. This email will be used for account related notifications",
      }}
      bottomText="Emails must be verified to be able to login with them or be used as primary email"
      errorText={undefined}
      noPermissionText={undefined}
    >
      <div className="flex items-center justify-between gap-4 rounded-lg border bg-card p-4">
        {/* Start */}
        <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-center lg:gap-3">
          <p className="text-sm"> {props.email}</p>
          <Badge
            className="capitalize "
            variant={props.status === "unverified" ? "outline" : "default"}
          >
            {props.status}
          </Badge>
        </div>

        {/* End */}
        <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="!h-auto !w-auto p-1.5"
            >
              <EllipsisIcon className="size-5 text-muted-foreground" />
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0">
            <EmailUpdateDialogContent
              currentEmail={props.email}
              sendEmail={props.sendEmail}
              updateEmailWithOTP={props.updateEmailWithOTP}
              onSuccess={() => {
                setIsEmailModalOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </SettingsCard>
  );
}

const emailUpdateFormSchema = z.object({
  email: z.string().min(1, "Email can not be empty").max(100),
});

function EmailUpdateDialogContent(props: {
  currentEmail: string;
  sendEmail: (email: string) => Promise<void>;
  updateEmailWithOTP: (otp: string) => Promise<void>;
  onSuccess: () => void;
}) {
  const [isEmailSent, setIsEmailSent] = useState(false);

  if (isEmailSent) {
    return (
      <EnterEmailOTP
        updateEmailWithOTP={props.updateEmailWithOTP}
        onSuccess={props.onSuccess}
      />
    );
  }

  return (
    <SendEmailOTP
      onEmailSent={() => setIsEmailSent(true)}
      currentEmail={props.currentEmail}
      sendEmail={props.sendEmail}
    />
  );
}

function SendEmailOTP(props: {
  onEmailSent: () => void;
  currentEmail: string;
  sendEmail: (email: string) => Promise<void>;
}) {
  const form = useForm<z.infer<typeof emailUpdateFormSchema>>({
    resolver: zodResolver(emailUpdateFormSchema),
    values: {
      email: props.currentEmail,
    },
  });

  const [showSendError, setShowSendError] = useState(false);
  const sendEmail = useMutation({
    mutationFn: props.sendEmail,
  });

  function onSubmit(values: z.infer<typeof emailUpdateFormSchema>) {
    sendEmail.mutateAsync(values.email, {
      onSuccess: () => {
        props.onEmailSent();
      },
      onError: (e) => {
        console.error(e);
        setShowSendError(true);
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 p-6 pb-10">
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
                    onChange={(e) => {
                      field.onChange(e);
                      setShowSendError(false);
                    }}
                  />
                </FormControl>
                <FormMessage />
                {showSendError && (
                  <p className="text-destructive-text">
                    {sendEmail.error?.message || "Failed to send email"}
                  </p>
                )}
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="gap-4 border-t bg-muted/50 p-6 lg:gap-1">
          <DialogClose asChild>
            <Button variant="outline"> Cancel </Button>
          </DialogClose>
          <Button
            className="min-w-24 gap-2"
            type="submit"
            disabled={!form.formState.isDirty}
          >
            {sendEmail.isPending && <Spinner className="size-4" />}
            Update
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

function EnterEmailOTP(props: {
  updateEmailWithOTP: (otp: string) => Promise<void>;
  onSuccess: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [showOTPError, setShowOTPError] = useState(false);
  const updateEmail = useMutation({
    mutationFn: props.updateEmailWithOTP,
    onSuccess: () => {
      props.onSuccess();
      toast.success("Email updated successfully");
    },
    onError: () => {
      setShowOTPError(true);
    },
  });

  return (
    <div>
      <div className="flex flex-col p-6 pb-10">
        <DialogHeader className="pr-10">
          <DialogTitle className="text-2xl">Update Email</DialogTitle>
          <DialogDescription>
            Enter the OTP sent to new email address
          </DialogDescription>
        </DialogHeader>

        <div className="h-6" />

        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          value={otp}
          onChange={(v) => {
            setOtp(v);
            setShowOTPError(false);
          }}
          disabled={updateEmail.isPending}
        >
          <InputOTPGroup className="w-full">
            {new Array(6).fill(0).map((_, idx) => (
              <InputOTPSlot
                // biome-ignore lint/suspicious/noArrayIndexKey: static list
                key={idx}
                index={idx}
                className={cn("h-12 grow text-lg", {
                  "border-red-500": showOTPError,
                })}
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {showOTPError && (
          <p className="mt-3 text-center text-destructive-text">
            Failed to verify email with this OTP
          </p>
        )}
      </div>

      <DialogFooter className="gap-4 border-t bg-muted/50 p-6 lg:gap-1">
        <DialogClose asChild>
          <Button variant="outline"> Cancel </Button>
        </DialogClose>
        <Button
          className="min-w-24 gap-2"
          onClick={() => {
            updateEmail.mutate(otp);
          }}
        >
          {updateEmail.isPending && <Spinner className="size-4" />}
          Verify
        </Button>
      </DialogFooter>
    </div>
  );
}
