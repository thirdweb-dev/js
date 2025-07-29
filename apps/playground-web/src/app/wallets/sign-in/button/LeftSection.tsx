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
import { useId } from "react";
import { CustomRadioGroup } from "@/components/ui/CustomRadioGroup";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "../../../../components/ui/switch";
import { CollapsibleSection } from "../components/CollapsibleSection";
import { ColorFormGroup } from "../components/ColorFormGroup";
import { InAppWalletFormGroup } from "../components/InAppWalletFormGroup";
import { LocaleFormControl } from "../components/LocaleFormControl";
import type { ConnectPlaygroundOptions } from "../components/types";
import { WalletsSelection } from "../components/WalletsSelection";

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

  const modalSizeId = useId();
  const modalTitleId = useId();
  const modalTitleIconId = useId();
  const tosLinkId = useId();
  const privacyLinkId = useId();
  const showThirdwebBrandingId = useId();
  const requireApprovalId = useId();
  const themeId = useId();
  const btnLabelId = useId();

  return (
    <div className="flex flex-col gap-4">
      <CollapsibleSection
        defaultOpen
        icon={WalletCardsIcon}
        title="Wallets"
        triggerContainerClassName="pt-0"
      >
        <div className="h-3" />
        <InAppWalletFormGroup {...props} />
        <div className="h-4" />
        <WalletsSelection {...props} />
      </CollapsibleSection>

      <CollapsibleSection icon={Settings2Icon} title="Modal Options">
        <div className="flex flex-col gap-6 pt-5">
          {/* Modal Size */}
          <section className="flex flex-col gap-3">
            <Label htmlFor={modalSizeId}> Modal Size </Label>
            <CustomRadioGroup
              id={modalSizeId}
              onValueChange={setModalSize}
              options={[
                { label: "Compact", value: "compact" },
                { label: "Wide", value: "wide" },
              ]}
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
              <Label htmlFor={modalTitleId}> Modal Title </Label>
              <Input
                id={modalTitleId}
                onChange={(e) =>
                  setConnectOptions((v) => ({
                    ...v,
                    modalTitle: e.target.value,
                  }))
                }
                placeholder="Sign in"
                value={connectOptions.modalTitle}
              />
            </div>

            {/* Modal Title Icon */}
            <div className="flex flex-col gap-2">
              <Label htmlFor={modalTitleIconId}> Modal Title Icon </Label>
              <Input
                id={modalTitleIconId}
                onChange={(e) =>
                  setConnectOptions((v) => ({
                    ...v,
                    modalTitleIcon: e.target.value,
                  }))
                }
                placeholder="https://..."
                value={connectOptions.modalTitleIcon}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-4">
            {/* TOS link */}
            <div className="flex flex-col gap-2">
              <Label htmlFor={tosLinkId}> Terms of Service Link </Label>
              <Input
                id={tosLinkId}
                onChange={(e) =>
                  setConnectOptions((v) => ({
                    ...v,
                    termsOfServiceLink: e.target.value,
                  }))
                }
                placeholder="https://..."
                value={connectOptions.termsOfServiceLink}
              />
            </div>

            {/* Privacy Policy Link */}
            <div className="flex flex-col gap-2">
              <Label htmlFor={privacyLinkId}> Privacy Policy Link </Label>
              <Input
                id={privacyLinkId}
                onChange={(e) =>
                  setConnectOptions((v) => ({
                    ...v,
                    privacyPolicyLink: e.target.value,
                  }))
                }
                placeholder="https://..."
                value={connectOptions.privacyPolicyLink}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-4">
            {/* Thirdweb Branding */}
            <section className="flex items-center gap-2">
              <Checkbox
                checked={connectOptions.ShowThirdwebBranding}
                id={showThirdwebBrandingId}
                onCheckedChange={(checkState) => {
                  setConnectOptions((v) => ({
                    ...v,
                    ShowThirdwebBranding: checkState === true,
                  }));
                }}
              />
              <Label htmlFor={showThirdwebBrandingId}>
                Show thirdweb branding
              </Label>
            </section>

            {/* Require Approval */}
            <section className="flex items-center gap-2">
              <Checkbox
                checked={connectOptions.requireApproval}
                id={requireApprovalId}
                onCheckedChange={(checkState) => {
                  setConnectOptions((v) => ({
                    ...v,
                    requireApproval: checkState === true,
                  }));
                }}
              />
              <Label htmlFor={requireApprovalId}>Require TOS approval</Label>
            </section>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection icon={PaletteIcon} title="Appearance">
        {/* Theme */}
        <section className="flex flex-col gap-3 pt-6">
          <Label htmlFor={themeId}> Theme </Label>
          <CustomRadioGroup
            id={themeId}
            onValueChange={setThemeType}
            options={[
              { label: "Dark", value: "dark" },
              { label: "Light", value: "light" },
            ]}
            value={theme.type}
          />
        </section>

        <div className="h-6" />

        {/* Colors */}
        <ColorFormGroup
          onChange={(newTheme) => {
            setConnectOptions((v) => ({
              ...v,
              theme: newTheme,
            }));
          }}
          theme={connectOptions.theme}
        />
      </CollapsibleSection>

      <CollapsibleSection icon={KeyRoundIcon} title="Auth (SIWE)">
        <div className="mt-4 flex items-start gap-2">
          <div className="flex flex-col gap-2">
            <span>
              Enforce the users to sign a message to authenticate themselves
              after connecting wallet
            </span>
            <Link
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              href="https://portal.thirdweb.com/wallets/auth?utm_source=playground"
              target="_blank"
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

      <CollapsibleSection icon={FuelIcon} title="Sponsor gas fees">
        <div className="mt-4 flex items-start gap-6">
          <div className="flex flex-col gap-2">
            <p className="">
              Abstract away gas fees for users of your app by enabling ERC-4337
              Account Abstraction
            </p>

            <Link
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              href="https://portal.thirdweb.com/wallets/sponsor-gas?utm_source=playground"
              target="_blank"
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

      <CollapsibleSection icon={RectangleHorizontalIcon} title="Button Options">
        <div className="flex flex-col gap-2 pt-5">
          <Label htmlFor={btnLabelId}> Button Label </Label>
          <Input
            id={btnLabelId}
            onChange={(e) =>
              setConnectOptions((v) => ({
                ...v,
                buttonLabel: e.target.value,
              }))
            }
            placeholder="Connect"
            value={connectOptions.buttonLabel}
          />
        </div>
      </CollapsibleSection>
    </div>
  );
}
