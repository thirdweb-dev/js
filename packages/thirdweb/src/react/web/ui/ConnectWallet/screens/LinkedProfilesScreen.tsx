"use client";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { shortenAddress } from "../../../../../utils/address.js";
import type { Profile } from "../../../../../wallets/in-app/core/authentication/types.js";
import { fontSize, iconSize } from "../../../../core/design-system/index.js";
import { useProfiles } from "../../../../core/hooks/others/useProfiles.js";
import { getWalletIcon } from "../../../../core/utils/walletIcon.js";
import { LoadingScreen } from "../../../wallets/shared/LoadingScreen.js";
import { Img } from "../../components/Img.js";
import { Spacer } from "../../components/Spacer.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { Text } from "../../components/text.js";
import { Blobbie } from "../Blobbie.js";
import { MenuButton } from "../MenuButton.js";
import { AddUserIcon } from "../icons/AddUserIcon.js";
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
  const { data: connectedProfiles, isLoading } = useProfiles();

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
      {isLoading ? (
        <LoadingScreen />
      ) : (
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
              <AddUserIcon size={iconSize.md} />
              <Text color="primaryText">
                {props.locale.manageWallet.linkProfile}
              </Text>
            </MenuButton>
            <Spacer y="xs" />
            {connectedProfiles?.map((profile) => (
              <MenuButton
                key={`${profile.type}-${getProfileDisplayName(profile)}`}
                onClick={() => {
                  props.setScreen("linked-profiles");
                }}
                style={{
                  fontSize: fontSize.sm,
                  cursor: "default",
                }}
                disabled // disabled until we have more data to show on a dedicated profile screen
              >
                {profile.type === "wallet" && profile.details.address ? (
                  <Container
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <Blobbie address={profile.details.address} size={24} />
                  </Container>
                ) : (
                  <Img
                    src={getWalletIcon(profile.type)}
                    width={iconSize.md}
                    height={iconSize.md}
                    loading="eager"
                    client={props.client}
                  />
                )}
                <Text color="primaryText">
                  {getProfileDisplayName(profile)}
                </Text>
              </MenuButton>
            ))}
          </Container>
          <Spacer y="md" />
        </Container>
      )}
    </Container>
  );
}
