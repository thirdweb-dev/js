import {
  NATIVE_TOKEN_ADDRESS,
  useBalance,
  useChain,
  useChainId,
} from "@thirdweb-dev/react-core";
import React, { useState } from "react";
import { TokenInfo, SupportedTokens } from "./defaultTokens";
import { utils } from "ethers";
import Box from "../base/Box";
import { ModalHeaderTextClose } from "../base/modal/ModalHeaderTextClose";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  TextInput,
} from "react-native";
import { SelectTokenButton } from "./SelectTokenButton";
import CloseIcon from "../../assets/close";
import Text from "../base/Text";
import { useGlobalTheme, useLocale } from "../../providers/ui-context-provider";

export function useToken(tokenAddress: string): {
  isLoading: boolean;
  data: TokenInfo | undefined;
} {
  const balanceQuery = useBalance(
    utils.isAddress(tokenAddress) ? tokenAddress : undefined,
  );
  const chain = useChain();

  if (!utils.isAddress(tokenAddress)) {
    return {
      isLoading: false,
      data: undefined,
    };
  }

  if (balanceQuery.isLoading) {
    return {
      isLoading: true,
      data: undefined,
    };
  }

  if (balanceQuery.data) {
    return {
      isLoading: false,
      data: {
        name: balanceQuery.data.name,
        symbol: balanceQuery.data.symbol,
        address: tokenAddress,
        icon: chain?.icon?.url || "",
      },
    };
  }

  return {
    isLoading: false,
    data: undefined,
  };
}

function useNativeToken(): TokenInfo | undefined {
  const balanceQuery = useBalance();
  const chain = useChain();

  if (balanceQuery.data) {
    return {
      name: balanceQuery.data.name,
      symbol: balanceQuery.data.symbol,
      address: NATIVE_TOKEN_ADDRESS,
      icon: chain?.icon?.url || "",
    };
  }
}

const MODAL_HEIGHT = Dimensions.get("window").height * 0.5;

export function TokenSelector(props: {
  onTokenSelect: (token?: TokenInfo) => void;
  onBack: () => void;
  supportedTokens: SupportedTokens;
}) {
  const l = useLocale();
  const theme = useGlobalTheme();
  const [input, setInput] = useState("");
  const chainId = useChainId();
  const nativeTokenInfo = useNativeToken();
  const { data: foundToken, isLoading: findingToken } = useToken(input);

  let tokenList = (chainId ? props.supportedTokens[chainId] : undefined) || [];

  if (nativeTokenInfo) {
    tokenList = [nativeTokenInfo, ...tokenList];
  }

  if (foundToken) {
    tokenList = [foundToken, ...tokenList];
  }

  const filteredList = input
    ? tokenList.filter((t) => {
        const inputStr = input.toLowerCase();
        return (
          t.name.toLowerCase().includes(inputStr) ||
          t.symbol.toLowerCase().includes(inputStr) ||
          t.address.includes(input)
        );
      })
    : tokenList;

  return (
    <Box
      flexDirection="column"
      backgroundColor="background"
      maxHeight={MODAL_HEIGHT}
      borderRadius="md"
      p="lg"
    >
      <Box>
        <ModalHeaderTextClose
          onBackPress={props.onBack}
          headerText={l.connect_wallet_details.select_token}
        />

        <Box
          mt="xs"
          mb="md"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          borderColor="border"
          borderWidth={1}
          borderRadius="md"
          pr="xs"
        >
          <TextInput
            returnKeyType={"done"}
            clearTextOnFocus={false}
            onChangeText={setInput}
            style={{
              color: theme.colors.textPrimary,
              textAlign: "left",
              flex: 1,
              height: 40,
              paddingHorizontal: 16,
            }}
            placeholder="Search or paste token address"
            placeholderTextColor={theme.colors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Box>
      </Box>

      {filteredList.length > 0 && (
        <Box
          flexDirection="column"
          paddingTop="none"
          maxHeight={MODAL_HEIGHT - 150}
        >
          <ScrollView>
            {filteredList.map((token) => {
              return (
                <SelectTokenButton
                  onPress={() => props.onTokenSelect(token)}
                  token={token}
                  key={token.address}
                />
              );
            })}
          </ScrollView>
        </Box>
      )}

      {findingToken && (
        <Box
          p="lg"
          flexDirection="column"
          gap="md"
          alignItems="center"
          justifyContent="center"
          minHeight={150}
          paddingTop="none"
        >
          <ActivityIndicator size="large" color={theme.colors.textSecondary} />
        </Box>
      )}

      {filteredList.length === 0 && !findingToken && (
        <Box
          p="lg"
          flexDirection="column"
          gap="md"
          alignItems="center"
          justifyContent="center"
          minHeight={150}
          paddingTop="none"
        >
          <CloseIcon width={16} height={16} color={theme.colors.border} />
          <Text variant="bodySmall">
            {l.connect_wallet_details.no_tokens_found}
          </Text>
        </Box>
      )}
    </Box>
  );
}
