"use client";
import styled from "@emotion/styled";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import Fuse from "fuse.js";
import { useMemo, useRef, useState } from "react";
import type { ThirdwebClient } from "../../../../../client/client.js";
import walletInfos from "../../../../../wallets/__generated__/wallet-infos.js";
import { createWallet } from "../../../../../wallets/create-wallet.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import { useCustomTheme } from "../../../../core/design-system/CustomThemeProvider.js";
import { iconSize, spacing } from "../../../../core/design-system/index.js";
import { sortWallets } from "../../../utils/sortWallets.js";
import { Spacer } from "../../components/Spacer.js";
import { Spinner } from "../../components/Spinner.js";
import { Container, ModalHeader } from "../../components/basic.js";
import { Input } from "../../components/formElements.js";
import { Text } from "../../components/text.js";
import { useDebouncedValue } from "../../hooks/useDebouncedValue.js";
import { useShowMore } from "../../hooks/useShowMore.js";
import { WalletEntryButton } from "../WalletEntryButton.js";
import type { ConnectLocale } from "../locale/types.js";

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
}) {
  const { itemsToShow, lastItemRef } = useShowMore<HTMLLIElement>(10, 10);

  const walletList = useMemo(() => {
    return walletInfos.filter((wallet) => {
      return props.specifiedWallets.findIndex((x) => x.id === wallet.id) === -1;
    });
  }, [props.specifiedWallets]);

  const fuseInstance = useMemo(() => {
    return new Fuse(walletList, {
      threshold: 0.4,
      keys: [
        {
          name: "name",
          weight: 1,
        },
      ],
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
    <Container fullHeight flex="column" animate="fadein">
      <Container p="lg">
        <ModalHeader title="Select Wallet" onBack={props.onBack} />
      </Container>

      <Spacer y="xs" />

      <Container px="lg">
        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <StyledMagnifyingGlassIcon width={iconSize.md} height={iconSize.md} />

          <Input
            style={{
              padding: `${spacing.sm} ${spacing.md} ${spacing.sm} ${spacing.xxl}`,
            }}
            tabIndex={-1}
            variant="outline"
            placeholder={"Search Wallet"}
            value={searchTerm}
            onChange={(e) => {
              listContainer.current?.parentElement?.scroll({
                top: 0,
              });
              setSearchTerm(e.target.value);
            }}
          />
          {/* Searching Spinner */}
          {deferredSearchTerm !== searchTerm && (
            <div
              style={{
                position: "absolute",
                right: spacing.md,
              }}
            >
              <Spinner size="md" color="accentText" />
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

                return (
                  <li
                    ref={isLast ? lastItemRef : undefined}
                    key={walletInfo.id}
                    style={{
                      listStyle: "none",
                    }}
                  >
                    <WalletEntryButton
                      walletId={walletInfo.id}
                      selectWallet={() => {
                        const wallet = createWallet(walletInfo.id);
                        props.onSelect(wallet);
                      }}
                      client={props.client}
                      recommendedWallets={props.recommendedWallets}
                      connectLocale={props.connectLocale}
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
          flex="column"
          gap="md"
          center="both"
          color="secondaryText"
          animate="fadein"
          expand
          style={{
            minHeight: "250px",
          }}
        >
          <CrossCircledIcon width={iconSize.xl} height={iconSize.xl} />
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
      position: "absolute",
      left: spacing.sm,
    };
  },
);

export default AllWalletsUI;
