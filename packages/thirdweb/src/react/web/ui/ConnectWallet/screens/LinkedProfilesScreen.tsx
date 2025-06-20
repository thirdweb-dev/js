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
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { IconButton } from "../../components/buttons.js";
import { Img } from "../../components/Img.js";
import { Spacer } from "../../components/Spacer.js";
import { Text } from "../../components/text.js";
import { Blobbie } from "../Blobbie.js";
import { AddUserIcon } from "../icons/AddUserIcon.js";
import { EmailIcon } from "../icons/EmailIcon.js";
import { FingerPrintIcon } from "../icons/FingerPrintIcon.js";
import { PhoneIcon } from "../icons/PhoneIcon.js";
import type { ConnectLocale } from "../locale/types.js";
import { MenuButton } from "../MenuButton.js";
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
          onBack={props.onBack}
          title={props.locale.manageWallet.linkedProfiles}
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
                client={props.client}
                enableUnlinking={connectedProfiles.length > 1}
                key={`${JSON.stringify(profile)}`}
                profile={profile}
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
    address: profile.details.address,
    client,
  });
  const { mutate: unlinkProfileMutation, isPending } = useUnlinkProfile();

  return (
    <MenuButton
      as={"div"}
      disabled
      style={{
        cursor: "default",
        fontSize: fontSize.sm,
      }} // disabled until we have more data to show on a dedicated profile screen
    >
      {socialProfiles?.some((p) => p.avatar) ? (
        <Img
          client={client}
          height={iconSize.lg}
          loading="eager"
          src={socialProfiles?.find((p) => p.avatar)?.avatar}
          style={{
            borderRadius: "100%",
          }}
          width={iconSize.lg}
        />
      ) : profile.details.address !== undefined ? (
        <Container
          style={{
            borderRadius: "100%",
            height: "32px",
            overflow: "hidden",
            width: "32px",
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
          client={client}
          height={iconSize.lg}
          loading="eager"
          src={getSocialIcon(profile.type)}
          width={iconSize.lg}
        />
      )}
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
          flexGrow: 1,
          justifyContent: "space-between",
        }}
      >
        <Text color="primaryText">
          {socialProfiles?.find((p) => p.avatar)?.name ||
            getProfileDisplayName(profile)}
        </Text>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
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
              aria-label="Unlink"
              autoFocus
              disabled={isPending}
              onClick={() =>
                unlinkProfileMutation({
                  client,
                  profileToUnlink: profile,
                })
              }
              style={{
                pointerEvents: "auto",
              }}
              type="button"
            >
              <Cross2Icon
                height={iconSize.md}
                style={{
                  color: "inherit",
                }}
                width={iconSize.md}
              />
            </IconButton>
          )}
        </div>
      </div>
    </MenuButton>
  );
}
