"use client";
import styled from "@emotion/styled";
import { CrossCircledIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Fuse from "fuse.js";
import { useMemo, useRef, useState } from "react";
import type { ThirdwebClient } from "../../../../../client/client.js";
import walletInfos from "../../../../../wallets/__generated__/wallet-infos.js";
import { createWallet } from "../../../../../wallets/create-wallet.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import { iconSize, spacing } from "../../../../core/design-system/index.js";
import { useSetSelectionData } from "../../../providers/wallet-ui-states-provider.js";
import { sortWallets } from "../../../utils/sortWallets.js";
import { Container, ModalHeader } from "../../components/basic.js";
import { Input } from "../../components/formElements.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { Text } from "../../components/text.js";
import { useDebouncedValue } from "../../hooks/useDebouncedValue.js";
import { useShowMore } from "../../hooks/useShowMore.js";
import type { ConnectLocale } from "../locale/types.js";
import { WalletEntryButton } from "../WalletEntryButton.js";

/**
 *
 * @internal
 */
function AllWalletsUI(props: {
  onBack: () => void;
  onSelect: (wallet: Wallet) => void;
  specifiedWallets: Wallet[];
  size: "compact" | "wide";
  client: ThirdwebClient;
  recommendedWallets: Wallet[] | undefined;
  connectLocale: ConnectLocale;
  disableSelectionDataReset?: boolean;
}) {
  const { itemsToShow, lastItemRef } = useShowMore<HTMLLIElement>(10, 10);
  const setSelectionData = useSetSelectionData();

  const walletList = useMemo(() => {
    return walletInfos
      .filter((wallet) => {
        return (
          props.specifiedWallets.findIndex((x) => x.id === wallet.id) === -1
        );
      })
      .filter(
        (info) =>
          info.id !== "inApp" && info.id !== "embedded" && info.id !== "smart",
      );
  }, [props.specifiedWallets]);

  const fuseInstance = useMemo(() => {
    return new Fuse(walletList, {
      keys: [
        {
          name: "name",
          weight: 1,
        },
      ],
      threshold: 0.4,
    });
  }, [walletList]);

  const listContainer = useRef<HTMLDivElement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDebouncedValue(searchTerm, 300);

  const searchResults = deferredSearchTerm
    ? fuseInstance.search(deferredSearchTerm).map((result) => result.item)
    : walletList;

  const walletInfosToShow = useMemo(() => {
    return sortWallets(searchResults.slice(0, itemsToShow));
  }, [searchResults, itemsToShow]);

  return (
    <Container animate="fadein" flex="column" fullHeight>
      <Container p="lg">
        <ModalHeader onBack={props.onBack} title="Select Wallet" />
      </Container>

      <Spacer y="xs" />

      <Container px="lg">
        {/* Search */}
        <div
          style={{
            alignItems: "center",
            display: "flex",
            position: "relative",
          }}
        >
          <StyledMagnifyingGlassIcon height={iconSize.md} width={iconSize.md} />

          <Input
            onChange={(e) => {
              listContainer.current?.parentElement?.scroll({
                top: 0,
              });
              setSearchTerm(e.target.value);
            }}
            placeholder="Search Wallet"
            style={{
              padding: `${spacing.sm} ${spacing.sm} ${spacing.sm} ${spacing.xxl}`,
            }}
            tabIndex={-1}
            value={searchTerm}
            variant="outline"
          />
          {/* Searching Spinner */}
          {deferredSearchTerm !== searchTerm && (
            <div
              style={{
                position: "absolute",
                right: spacing.md,
              }}
            >
              <Spinner color="accentText" size="md" />
            </div>
          )}
        </div>
      </Container>

      {walletInfosToShow.length > 0 && (
        <>
          <Spacer y="md" />
          <Container animate="fadein" expand scrollY>
            <div
              ref={listContainer}
              style={{
                maxHeight: props.size === "compact" ? "400px" : undefined,
                paddingInline: spacing.md,
              }}
            >
              {walletInfosToShow.map((walletInfo, i) => {
                const isLast = i === walletInfosToShow.length - 1;
                const wallet = createWallet(walletInfo.id);

                return (
                  <li
                    key={walletInfo.id}
                    ref={isLast ? lastItemRef : undefined}
                    style={{
                      listStyle: "none",
                    }}
                  >
                    <WalletEntryButton
                      badge={undefined}
                      client={props.client}
                      connectLocale={props.connectLocale}
                      isActive={false}
                      recommendedWallets={props.recommendedWallets}
                      selectWallet={() => {
                        props.onSelect(wallet);
                        if (!props.disableSelectionDataReset) {
                          setSelectionData({});
                        }
                      }}
                      wallet={wallet}
                    />
                  </li>
                );
              })}
            </div>

            <Spacer y="xl" />
          </Container>
        </>
      )}

      {walletInfosToShow.length === 0 && (
        <Container
          animate="fadein"
          center="both"
          color="secondaryText"
          expand
          flex="column"
          gap="md"
          style={{
            minHeight: "250px",
          }}
        >
          <CrossCircledIcon height={iconSize.xl} width={iconSize.xl} />
          <Text> No Results </Text>
        </Container>
      )}
    </Container>
  );
}

const StyledMagnifyingGlassIcon = /* @__PURE__ */ styled(MagnifyingGlassIcon)(
  (_) => {
    const theme = useCustomTheme();
    return {
      color: theme.colors.secondaryText,
      left: spacing.sm,
      position: "absolute",
    };
  },
);

export default AllWalletsUI;
