import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { mobileViewport, storybookThirdwebClient } from "stories/utils";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccountSettingsPageUI } from "./AccountSettingsPageUI";

const meta = {
  component: Variants,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  title: "Account/Pages/Settings",
} satisfies Meta<typeof Variants>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {
    type: "desktop",
  },
};

export const Mobile: Story = {
  args: {
    type: "mobile",
  },
  parameters: {
    viewport: mobileViewport("iphone14"),
  },
};

function Variants() {
  const [isVerifiedEmail, setIsVerifiedEmail] = useState(true);
  const [sendEmailFails, setSendEmailFails] = useState(false);
  const [emailConfirmationFails, setEmailConfirmationFails] = useState(false);
  const [deleteAccountStatusResponse, setDeleteAccountStatusResponse] =
    useState<400 | 402 | 500 | 200>(200);

  const deleteAccountStub = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { status: deleteAccountStatusResponse };
  };

  return (
    <div className="container flex max-w-[1132px] flex-col gap-10 py-10">
      <div className="flex flex-col gap-2">
        <CheckboxWithLabel>
          <Checkbox
            checked={isVerifiedEmail}
            onCheckedChange={(v) => setIsVerifiedEmail(!!v)}
          />
          is Verified Email
        </CheckboxWithLabel>

        <CheckboxWithLabel>
          <Checkbox
            checked={sendEmailFails}
            onCheckedChange={(v) => setSendEmailFails(!!v)}
          />
          Sending Email Fails
        </CheckboxWithLabel>

        <CheckboxWithLabel>
          <Checkbox
            checked={emailConfirmationFails}
            onCheckedChange={(v) => setEmailConfirmationFails(!!v)}
          />
          Email Confirmation Fails
        </CheckboxWithLabel>

        <div className="mt-3 flex flex-col gap-2">
          <Label>Delete Account Response</Label>
          <Select
            onValueChange={(value) =>
              setDeleteAccountStatusResponse(
                Number(value) as 400 | 402 | 500 | 200,
              )
            }
            value={String(deleteAccountStatusResponse)}
          >
            <SelectTrigger className="min-w-[320px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="200">200 - Success</SelectItem>
              <SelectItem value="400">400 - Active Subscriptions</SelectItem>
              <SelectItem value="402">402 - Unpaid Invoices</SelectItem>
              <SelectItem value="500">500 - Unknown Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <AccountSettingsPageUI
        account={{
          email: "johndoe@gmail.com",
          emailConfirmedAt: isVerifiedEmail
            ? new Date().toISOString()
            : undefined,
          name: "John Doe",
        }}
        cancelSubscriptions={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
        client={storybookThirdwebClient}
        defaultTeamName="Foo"
        defaultTeamSlug="foo"
        deleteAccount={deleteAccountStub}
        onAccountDeleted={() => {
          console.log("Account deleted");
        }}
        sendEmail={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          if (sendEmailFails) {
            throw new Error("Email already exists");
          }
        }}
        updateAccountAvatar={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
        updateEmailWithOTP={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          if (emailConfirmationFails) {
            throw new Error("Invalid OTP");
          }
        }}
        updateName={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      />
    </div>
  );
}
