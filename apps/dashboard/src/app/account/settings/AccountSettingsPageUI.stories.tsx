import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Toaster } from "sonner";
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

function Variants() {
  const [isVerifiedEmail, setIsVerifiedEmail] = useState(true);
  const [sendEmailFails, setSendEmailFails] = useState(false);
  const [emailConfirmationFails, setEmailConfirmationFails] = useState(false);

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
      </div>

      <AccountSettingsPageUI
        account={{
          name: "John Doe",
          email: "johndoe@gmail.com",
          emailConfirmedAt: isVerifiedEmail
            ? new Date().toISOString()
            : undefined,
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
      />
      <Toaster richColors />
    </div>
  );
}
