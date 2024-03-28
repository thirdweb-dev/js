import { useContext, useMemo, useRef, useState } from "react";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import { Spacer } from "../../components/Spacer.js";
import { Container, ModalHeader } from "../../components/basic.js";
import { Input } from "../../components/formElements.js";
import { useDebouncedValue } from "../../hooks/useDebouncedValue.js";
import { Spinner } from "../../components/Spinner.js";
import { iconSize, spacing } from "../../design-system/index.js";
import { useCustomTheme } from "../../design-system/CustomThemeProvider.js";
import styled from "@emotion/styled";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { WalletEntryButton } from "../WalletEntryButton.js";
import { createWallet } from "../../../../../wallets/create-wallet.js";
import { useShowMore } from "../../hooks/useShowMore.js";
import { sortWallets } from "../../../utils/sortWallets.js";
import { useWalletConnectionCtx } from "../../../../core/hooks/others/useWalletConnectionCtx.js";
import { ModalConfigCtx } from "../../../providers/wallet-ui-states-provider.js";
import Fuse from "fuse.js";
import walletInfos from "../../../../../wallets/__generated__/wallet-infos.js";
import { Text } from "../../components/text.js";
import { CrossCircledIcon } from "@radix-ui/react-icons";

/**
 *
 * @internal
 */
function AllWalletsUI(props: {
  onBack: () => void;
  onSelect: (wallet: Wallet) => void;
}) {
  const recommendedWallets = useWalletConnectionCtx().recommendedWallets;
  const { modalSize } = useContext(ModalConfigCtx);

  const fuseInstance = useMemo(() => {
    return new Fuse(walletInfos, {
      threshold: 0.4,
      keys: [
        {
          name: "name",
          weight: 1,
        },
      ],
    });
  }, []);

  const listContainer = useRef<HTMLDivElement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDebouncedValue(searchTerm, 300);

  const walletInfosWithSearch = deferredSearchTerm
    ? fuseInstance.search(deferredSearchTerm).map((result) => result.item)
    : walletInfos;

  console.log({ walletInfosWithSearch });
  const sortedWallets = sortWallets(walletInfosWithSearch, recommendedWallets);

  const { itemsToShow, lastItemRef } = useShowMore<HTMLLIElement>(10, 10);

  const walletInfosToShow = sortedWallets.slice(0, itemsToShow);

  console.log({ walletInfosToShow });

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
          <Spacer y="lg" />
          <Container animate="fadein" expand scrollY>
            <div
              ref={listContainer}
              style={{
                maxHeight: modalSize === "compact" ? "400px" : undefined,
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
        >
          <CrossCircledIcon width={iconSize.xl} height={iconSize.xl} />
          <Text> No Results </Text>
        </Container>
      )}
    </Container>
  );
}

const StyledMagnifyingGlassIcon = /* @__PURE__ */ styled(MagnifyingGlassIcon)(
  () => {
    const theme = useCustomTheme();
    return {
      color: theme.colors.secondaryText,
      position: "absolute",
      left: spacing.sm,
    };
  },
);

export default AllWalletsUI;
