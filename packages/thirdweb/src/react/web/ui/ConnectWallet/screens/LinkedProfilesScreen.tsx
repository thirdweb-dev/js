"use client";
import { Cross2Icon } from "@radix-ui/react-icons";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { useUnlinkProfile } from "../../../../../react/web/hooks/wallets/useUnlinkProfile.js";
import { shortenAddress } from "../../../../../utils/address.js";
import type { Profile } from "../../../../../wallets/in-app/core/authentication/types.js";
import { fontSize, iconSize } from "../../../../core/design-system/index.js";
import { useSocialProfiles } from "../../../../core/social/useSocialProfiles.js";
import { getSocialIcon } from "../../../../core/utils/walletIcon.js";
import { useProfiles } from "../../../hooks/wallets/useProfiles.js";
import { LoadingScreen } from "../../../wallets/shared/LoadingScreen.js";
import { Img } from "../../components/Img.js";
import { Spacer } from "../../components/Spacer.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { IconButton } from "../../components/buttons.js";
import { Text } from "../../components/text.js";
import { Blobbie } from "../Blobbie.js";
import { MenuButton } from "../MenuButton.js";
import { AddUserIcon } from "../icons/AddUserIcon.js";
import { EmailIcon } from "../icons/EmailIcon.js";
import { FingerPrintIcon } from "../icons/FingerPrintIcon.js";
import { PhoneIcon } from "../icons/PhoneIcon.js";
import type { ConnectLocale } from "../locale/types.js";
import type { WalletDetailsModalScreen } from "./types.js";

function getProfileDisplayName(profile: Profile) {
  switch (true) {
    case profile.type === "email" && profile.details.email !== undefined:
      return profile.details.email;
    case profile.type === "google" && profile.details.email !== undefined:
      return profile.details.email;
    case profile.type === "phone" && profile.details.phone !== undefined:
      return profile.details.phone;
    case profile.details.address !== undefined:
      return shortenAddress(profile.details.address, 6);
    case (profile.type as string) === "cognito" &&
      profile.details.email !== undefined:
      return profile.details.email;
    case (profile.type as string).toLowerCase() === "custom_auth_endpoint":
      return "Custom Profile";
    default:
      return profile.type.slice(0, 1).toUpperCase() + profile.type.slice(1);
  }
}

/**
 * @internal
 */
export function LinkedProfilesScreen(props: {
  onBack: () => void;
  setScreen: (screen: WalletDetailsModalScreen) => void;
  locale: ConnectLocale;
  client: ThirdwebClient;
}) {
  const { data: connectedProfiles, isLoading } = useProfiles({
    client: props.client,
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Container
      style={{
        minHeight: "300px",
      }}
    >
      <Container p="lg">
        <ModalHeader
          title={props.locale.manageWallet.linkedProfiles}
          onBack={props.onBack}
        />
      </Container>
      <Line />

      <Container
        scrollY
        style={{
          height: "300px",
        }}
      >
        <Spacer y="md" />
        <Container px="sm">
          <MenuButton
            onClick={() => {
              props.setScreen("link-profile");
            }}
            style={{
              fontSize: fontSize.sm,
            }}
          >
            <AddUserIcon size={iconSize.lg} />
            <Text color="primaryText">
              {props.locale.manageWallet.linkProfile}
            </Text>
          </MenuButton>
          <Spacer y="xs" />
          {/* Exclude guest as a profile */}
          {connectedProfiles
            ?.filter(
              (profile) =>
                profile.type.toLowerCase() !== "guest" &&
                profile.type.toLowerCase() !== "custom_jwt" &&
                profile.type.toLowerCase() !== "custom_auth_endpoint",
            )
            .map((profile) => (
              <LinkedProfile
                key={`${JSON.stringify(profile)}`}
                enableUnlinking={connectedProfiles.length > 1}
                profile={profile}
                client={props.client}
              />
            ))}
        </Container>
        <Spacer y="md" />
      </Container>
    </Container>
  );
}

function LinkedProfile({
  profile,
  enableUnlinking,
  client,
}: {
  profile: Profile;
  enableUnlinking: boolean;
  client: ThirdwebClient;
}) {
  const { data: socialProfiles } = useSocialProfiles({
    client,
    address: profile.details.address,
  });
  const { mutate: unlinkProfileMutation, isPending } = useUnlinkProfile();

  return (
    <MenuButton
      style={{
        fontSize: fontSize.sm,
        cursor: "default",
      }}
      as={"div"}
      disabled // disabled until we have more data to show on a dedicated profile screen
    >
      {socialProfiles?.some((p) => p.avatar) ? (
        <Img
          src={socialProfiles?.find((p) => p.avatar)?.avatar}
          width={iconSize.lg}
          height={iconSize.lg}
          loading="eager"
          client={client}
          style={{
            borderRadius: "100%",
          }}
        />
      ) : profile.details.address !== undefined ? (
        <Container
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "100%",
            overflow: "hidden",
          }}
        >
          <Blobbie address={profile.details.address} size={32} />
        </Container>
      ) : profile.type === "passkey" ? (
        <FingerPrintIcon size={iconSize.lg} />
      ) : profile.type === "email" ? (
        <EmailIcon size={iconSize.lg} />
      ) : profile.type === "phone" ? (
        <PhoneIcon size={iconSize.lg} />
      ) : (
        <Img
          src={getSocialIcon(profile.type)}
          width={iconSize.lg}
          height={iconSize.lg}
          loading="eager"
          client={client}
        />
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flexGrow: 1,
        }}
      >
        <Text color="primaryText">
          {socialProfiles?.find((p) => p.avatar)?.name ||
            getProfileDisplayName(profile)}
        </Text>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {socialProfiles?.find((p) => p.avatar)?.name &&
            profile.details.address && (
              <Text color="secondaryText" size="sm">
                {shortenAddress(profile.details.address, 4)}
              </Text>
            )}
          {enableUnlinking && (
            <IconButton
              autoFocus
              type="button"
              aria-label="Unlink"
              onClick={() =>
                unlinkProfileMutation({
                  client,
                  profileToUnlink: profile,
                })
              }
              style={{
                pointerEvents: "auto",
              }}
              disabled={isPending}
            >
              <Cross2Icon
                width={iconSize.md}
                height={iconSize.md}
                style={{
                  color: "inherit",
                }}
              />
            </IconButton>
          )}
        </div>
      </div>
    </MenuButton>
  );
}
