import { ButtonGroup, Flex, Icon, useDisclosure } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  useMintToken,
  useProgramMetadata,
  useTokenBalance,
} from "@thirdweb-dev/react/solana";
import type { CurrencyValue } from "@thirdweb-dev/sdk/evm";
import type { Token } from "@thirdweb-dev/sdk/solana";
import { TokenMintFormLayout } from "contract-ui/tabs/tokens/components/mint-form";
import { TokenSupplyLayout } from "contract-ui/tabs/tokens/components/supply-layout";
import { BigNumber } from "ethers";
import { FiPlus } from "react-icons/fi";
import { Button, Drawer, Heading } from "tw-components";

export const TokenPanel: React.FC<{
  program: Token;
}> = ({ program }) => {
  return (
    <Flex direction="column" gap={6}>
      <Flex direction="row" justify="space-between" align="center">
        <Heading size="title.sm">Contract Tokens</Heading>
        <ButtonGroup
          flexDirection={{ base: "column", md: "row" }}
          gap={2}
          w="inherit"
        >
          <TokenMintButton program={program} />
        </ButtonGroup>
      </Flex>
      <TokenSupply program={program} />
    </Flex>
  );
};

export const TokenMintButton: React.FC<{ program: Token }> = ({
  program,
  ...restButtonProps
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Drawer
        allowPinchZoom
        preserveScrollBarGap
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
      >
        <TokenMintForm program={program} />
      </Drawer>
      <Button
        colorScheme="primary"
        leftIcon={<Icon as={FiPlus} />}
        {...restButtonProps}
        onClick={onOpen}
      >
        Mint
      </Button>
    </>
  );
};

export const TokenMintForm: React.FC<{ program: Token }> = ({ program }) => {
  const wallet = useWallet();
  const mint = useMintToken(program);
  const decimals = useProgramMetadata(program);

  return (
    <TokenMintFormLayout
      ecosystem="solana"
      mintQuery={mint}
      decimals={decimals.data?.decimals as number | undefined}
      address={wallet?.publicKey?.toBase58()}
    />
  );
};

export const TokenSupply: React.FC<{
  program: Token;
}> = ({ program }) => {
  const wallet = useWallet();
  const address = wallet?.publicKey?.toBase58();
  const metadataQuery = useProgramMetadata(program);
  const ownedTokensQuery = useTokenBalance(program, address || null);
  return (
    <TokenSupplyLayout
      isTokenSupplySuccess={metadataQuery.isSuccess}
      tokenSupply={toDashboardSupply(metadataQuery)}
      isOwnedBalanceSuccess={ownedTokensQuery.isSuccess}
      address={address}
      ownedBalance={toDashboardSupply(metadataQuery, ownedTokensQuery)}
    />
  );
};

// TODO (SOL) - consolidate schema types between sol and sdk
const toDashboardSupply = (
  query: ReturnType<typeof useProgramMetadata>,
  ownedTokensQuery?: ReturnType<typeof useTokenBalance>,
): CurrencyValue | undefined => {
  const data = query.data;
  if (!data) {
    return undefined;
  }
  return {
    name: data.name?.toString() || "",
    symbol: (data?.symbol as string | undefined) || "",
    value: BigNumber.from(0),
    decimals: (data?.decimals as number | undefined) || 0,
    displayValue: ownedTokensQuery?.data
      ? ownedTokensQuery?.data?.displayValue
      : // eslint-disable-next-line line-comment-position
        (data as any).supply.displayValue, // TODO (SOL) remove this cast once its exported properly
  };
};
