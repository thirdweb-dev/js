import { CustomRadioGroup } from "@/components/ui/CustomRadioGroup";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ExternalLinkIcon,
  FuelIcon,
  KeyRoundIcon,
  PaletteIcon,
  RectangleHorizontalIcon,
  Settings2Icon,
  WalletCardsIcon,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { Switch } from "../../../../components/ui/switch";
import { CollapsibleSection } from "../components/CollapsibleSection";
import { ColorFormGroup } from "../components/ColorFormGroup";
import { InAppWalletFormGroup } from "../components/InAppWalletFormGroup";
import { LocaleFormControl } from "../components/LocaleFormControl";
import { WalletsSelection } from "../components/WalletsSelection";
import type { ConnectPlaygroundOptions } from "../components/types";

export function LeftSection(props: {
  connectOptions: ConnectPlaygroundOptions;
  setConnectOptions: React.Dispatch<
    React.SetStateAction<ConnectPlaygroundOptions>
  >;
}) {
  const { connectOptions, setConnectOptions } = props;
  const { theme, modalSize } = connectOptions;
  const setThemeType = (themeType: "dark" | "light") => {
    setConnectOptions((v) => ({
      ...v,
      theme: {
        ...v.theme,
        type: themeType,
      },
    }));
  };

  const setModalSize = (modalSize: "compact" | "wide") =>
    setConnectOptions((v) => ({ ...v, modalSize }));

  return (
    <div className="flex flex-col gap-4">
      <CollapsibleSection
        title="Wallets"
        icon={WalletCardsIcon}
        defaultOpen
        triggerContainerClassName="pt-0"
      >
        <div className="h-3" />
        <InAppWalletFormGroup {...props} />
        <div className="h-4" />
        <WalletsSelection {...props} />
      </CollapsibleSection>

      <CollapsibleSection title="Modal Options" icon={Settings2Icon}>
        <div className="flex flex-col gap-6 pt-5">
          {/* Modal Size */}
          <section className="flex flex-col gap-3">
            <Label htmlFor="modal-size"> Modal Size </Label>
            <CustomRadioGroup
              id="modal-size"
              options={[
                { value: "compact", label: "Compact" },
                { value: "wide", label: "Wide" },
              ]}
              onValueChange={setModalSize}
              value={modalSize}
            />
          </section>

          {/* Locale */}
          <LocaleFormControl
            connectOptions={connectOptions}
            setConnectOptions={setConnectOptions}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-4">
            {/* Modal title */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="modal-title"> Modal Title </Label>
              <Input
                id="modal-title"
                placeholder="Sign in"
                value={connectOptions.modalTitle}
                onChange={(e) =>
                  setConnectOptions((v) => ({
                    ...v,
                    modalTitle: e.target.value,
                  }))
                }
              />
            </div>

            {/* Modal Title Icon */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="modal-title"> Modal Title Icon </Label>
              <Input
                id="modal-title"
                placeholder="https://..."
                value={connectOptions.modalTitleIcon}
                onChange={(e) =>
                  setConnectOptions((v) => ({
                    ...v,
                    modalTitleIcon: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-4">
            {/* TOS link */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="tos-link"> Terms of Service Link </Label>
              <Input
                id="tos-link"
                placeholder="https://..."
                value={connectOptions.termsOfServiceLink}
                onChange={(e) =>
                  setConnectOptions((v) => ({
                    ...v,
                    termsOfServiceLink: e.target.value,
                  }))
                }
              />
            </div>

            {/* Privacy Policy Link */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="privacy-link"> Privacy Policy Link </Label>
              <Input
                id="privacy-link"
                placeholder="https://..."
                value={connectOptions.privacyPolicyLink}
                onChange={(e) =>
                  setConnectOptions((v) => ({
                    ...v,
                    privacyPolicyLink: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-4">
            {/* Thirdweb Branding */}
            <section className="flex items-center gap-2">
              <Checkbox
                id="show-thirdweb-branding"
                checked={connectOptions.ShowThirdwebBranding}
                onCheckedChange={(checkState) => {
                  setConnectOptions((v) => ({
                    ...v,
                    ShowThirdwebBranding: checkState === true,
                  }));
                }}
              />
              <Label htmlFor="show-thirdweb-branding">
                Show thirdweb branding
              </Label>
            </section>

            {/* Require Approval */}
            <section className="flex items-center gap-2">
              <Checkbox
                id="require-approval"
                checked={connectOptions.requireApproval}
                onCheckedChange={(checkState) => {
                  setConnectOptions((v) => ({
                    ...v,
                    requireApproval: checkState === true,
                  }));
                }}
              />
              <Label htmlFor="require-approval">Require TOS approval</Label>
            </section>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Appearance" icon={PaletteIcon}>
        {/* Theme */}
        <section className="flex flex-col gap-3 pt-6">
          <Label htmlFor="theme"> Theme </Label>
          <CustomRadioGroup
            id="theme"
            options={[
              { value: "dark", label: "Dark" },
              { value: "light", label: "Light" },
            ]}
            onValueChange={setThemeType}
            value={theme.type}
          />
        </section>

        <div className="h-6" />

        {/* Colors */}
        <ColorFormGroup
          theme={connectOptions.theme}
          onChange={(newTheme) => {
            setConnectOptions((v) => ({
              ...v,
              theme: newTheme,
            }));
          }}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Auth (SIWE)" icon={KeyRoundIcon}>
        <div className="mt-4 flex items-start gap-2">
          <div className="flex flex-col gap-2">
            <span>
              Enforce the users to sign a message to authenticate themselves
              after connecting wallet
            </span>
            <Link
              href="https://portal.thirdweb.com/connect/auth"
              target="_blank"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              Learn more about Auth
              <ExternalLinkIcon className="size-4" />
            </Link>
          </div>
          <Switch
            checked={connectOptions.enableAuth}
            onCheckedChange={(checked) => {
              setConnectOptions((v) => ({
                ...v,
                enableAuth: checked,
              }));
            }}
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Sponsor gas fees" icon={FuelIcon}>
        <div className="mt-4 flex items-start gap-6">
          <div className="flex flex-col gap-2">
            <p className="">
              Abstract away gas fees for users of your app by enabling ERC-4337
              Account Abstraction
            </p>

            <Link
              href="https://portal.thirdweb.com/connect/account-abstraction/overview"
              target="_blank"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              Learn more about Account Abstraction
              <ExternalLinkIcon className="size-4" />
            </Link>
          </div>
          <Switch
            checked={connectOptions.enableAccountAbstraction}
            onCheckedChange={(checked) => {
              setConnectOptions((v) => ({
                ...v,
                enableAccountAbstraction: checked,
              }));
            }}
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Button Options" icon={RectangleHorizontalIcon}>
        <div className="flex flex-col gap-2 pt-5">
          <Label htmlFor="btn-label"> Button Label </Label>
          <Input
            id="btn-label"
            placeholder="Connect"
            value={connectOptions.buttonLabel}
            onChange={(e) =>
              setConnectOptions((v) => ({
                ...v,
                buttonLabel: e.target.value,
              }))
            }
          />
        </div>
      </CollapsibleSection>
    </div>
  );
}
