import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { mobileViewport } from "../../../stories/utils";
import { AccountSettingsPageUI } from "./AccountSettingsPageUI";

const meta = {
  title: "Account/Pages/Settings",
  component: Variants,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
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

const client = getThirdwebClient();

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
            value={String(deleteAccountStatusResponse)}
            onValueChange={(value) =>
              setDeleteAccountStatusResponse(
                Number(value) as 400 | 402 | 500 | 200,
              )
            }
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
        defaultTeamSlug="foo"
        defaultTeamName="Foo"
        getBillingPortalUrl={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return { status: 200 };
        }}
        account={{
          name: "John Doe",
          email: "johndoe@gmail.com",
          emailConfirmedAt: isVerifiedEmail
            ? new Date().toISOString()
            : undefined,
        }}
        client={client}
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
        sendEmail={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          if (sendEmailFails) {
            throw new Error("Email already exists");
          }
        }}
        deleteAccount={deleteAccountStub}
        onAccountDeleted={() => {
          console.log("Account deleted");
        }}
        cancelSubscriptions={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      />
    </div>
  );
}
