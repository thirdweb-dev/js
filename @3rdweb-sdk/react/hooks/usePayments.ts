import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Arbitrum,
  ArbitrumGoerli,
  ArbitrumNova,
  ArbitrumSepolia,
  Avalanche,
  AvalancheFuji,
  Base,
  BaseGoerli,
  Binance,
  BinanceTestnet,
  Ethereum,
  FrameTestnet,
  Goerli,
  Mumbai,
  Optimism,
  OptimismGoerli,
  Polygon,
  RarichainTestnet,
  Sepolia,
  Xai,
  XaiSepolia,
  Zora,
  ZoraTestnet,
} from "@thirdweb-dev/chains";
import { useAddress } from "@thirdweb-dev/react";
import { Abi, FeatureName, SmartContract } from "@thirdweb-dev/sdk";
import { detectFeatures } from "components/contract-components/utils";
import { CURRENCIES, CurrencyMetadata } from "constants/currencies";
import { PROD_OR_DEV_URL } from "constants/rpc";
import { THIRDWEB_PAYMENTS_API_HOST } from "constants/urls";
import { BaseContract } from "ethers";
import {
  InsertWebhookMutationVariables,
  useInsertWebhookMutation,
  useUpdateSellerMutation,
  UpdateWebhookMutationVariables,
  useUpdateWebhookMutation,
  ApiSecretKeysByOwnerIdQuery,
  CheckoutsByContractAddressQueryVariables,
  useCheckoutsByContractAddressLazyQuery,
  ContractsByOwnerIdQueryVariables,
  useContractsByOwnerIdLazyQuery,
  DetailedAnalyticsQueryVariables,
  useDetailedAnalyticsLazyQuery,
  SellerDocument,
  SellerQueryVariables,
  useSellerLazyQuery,
  WebhooksBySellerIdDocument,
  WebhooksBySellerIdQueryVariables,
  useWebhooksBySellerIdLazyQuery,
} from "graphql/generated";
import { getEVMThirdwebSDK } from "lib/sdk";
import invariant from "tiny-invariant";
import { OtherAddressZero } from "utils/zeroAddress";
import { paymentsKeys } from "../cache-keys";
import { useMutationWithInvalidate } from "./query/useQueryWithNetwork";
import { useApiAuthToken } from "./useApi";

const paymentsExtensions: FeatureName[] = [
  "ERC721SharedMetadata",
  "ERC721ClaimPhasesV2",
  "ERC721ClaimConditionsV2",
  "ERC1155ClaimPhasesV1",
  "ERC1155ClaimPhasesV2",
];

const hasPaymentsDetectedExtensions = (
  contract: SmartContract<BaseContract> | undefined,
) => {
  return detectFeatures(contract, paymentsExtensions);
};

// TODO: Get this from API
export const validPaymentsChainIdsMainnets: number[] = [
  Ethereum.chainId,
  Polygon.chainId,
  Avalanche.chainId,
  Optimism.chainId,
  Arbitrum.chainId,
  Binance.chainId,
  Base.chainId,
  Zora.chainId,
  ArbitrumNova.chainId,
];

const validPaymentsChainIdsTestnets: number[] = [
  Goerli.chainId,
  Sepolia.chainId,
  Mumbai.chainId,
  AvalancheFuji.chainId,
  OptimismGoerli.chainId,
  ArbitrumGoerli.chainId,
  BinanceTestnet.chainId,
  BaseGoerli.chainId,
  ZoraTestnet.chainId,
  ArbitrumSepolia.chainId,
  FrameTestnet.chainId,
  RarichainTestnet.chainId,
  Xai.chainId,
  XaiSepolia.chainId,
];

export const validPaymentsChainIds: number[] = [
  ...validPaymentsChainIdsMainnets,
  ...validPaymentsChainIdsTestnets,
];

// type for validcheckoutchainids
type PaymentChainId = (typeof validPaymentsChainIds)[number];

const ChainIdToPaperChain: Record<PaymentChainId, string> = {
  [Ethereum.chainId]: "Ethereum",
  [Goerli.chainId]: "Goerli",
  [Sepolia.chainId]: "Sepolia",
  [Polygon.chainId]: "Polygon",
  [Mumbai.chainId]: "Mumbai",
  [Avalanche.chainId]: "Avalanche",
  [AvalancheFuji.chainId]: "AvalancheFuji",
  [Optimism.chainId]: "Optimism",
  [OptimismGoerli.chainId]: "OptimismGoerli",
  [Arbitrum.chainId]: "ArbitrumOne",
  [ArbitrumNova.chainId]: "ArbitrumNova",
  [ArbitrumGoerli.chainId]: "ArbitrumGoerli",
  [ArbitrumSepolia.chainId]: "ArbitrumSepolia",
  [Binance.chainId]: "BSC",
  [BinanceTestnet.chainId]: "BSCTestnet",
  [Base.chainId]: "Base",
  [BaseGoerli.chainId]: "BaseGoerli",
  [Zora.chainId]: "Zora",
  [ZoraTestnet.chainId]: "ZoraTestnet",
  [FrameTestnet.chainId]: "FrameTestnet",
  [RarichainTestnet.chainId]: "RariChainTestnet",
  [Xai.chainId]: "Xai",
  [XaiSepolia.chainId]: "XaiSepolia",
};

export const PaperChainToChainId: Record<string, number> = {
  Ethereum: Ethereum.chainId,
  Goerli: Goerli.chainId,
  Sepolia: Sepolia.chainId,
  Polygon: Polygon.chainId,
  Mumbai: Mumbai.chainId,
  Avalanche: Avalanche.chainId,
  AvalancheFuji: AvalancheFuji.chainId,
  Optimism: Optimism.chainId,
  OptimismGoerli: OptimismGoerli.chainId,
  ArbitrumOne: Arbitrum.chainId,
  ArbitrumNova: ArbitrumNova.chainId,
  ArbitrumGoerli: ArbitrumGoerli.chainId,
  ArbitrumSepolia: ArbitrumSepolia.chainId,
  BSC: Binance.chainId,
  BSCTestnet: BinanceTestnet.chainId,
  Base: Base.chainId,
  BaseGoerli: BaseGoerli.chainId,
  Zora: Zora.chainId,
  ZoraTestnet: ZoraTestnet.chainId,
  FrameTestnet: FrameTestnet.chainId,
  RariChainTestnet: RarichainTestnet.chainId,
  Xai: Xai.chainId,
  XaiSepolia: XaiSepolia.chainId,
};

interface SupportedCurrenciesMap {
  [key: number]: string[];
}

const supportedCurrenciesMap: SupportedCurrenciesMap = {
  [Ethereum.chainId]: ["ETH", "USDC", "WETH", "MATIC"],
  [Goerli.chainId]: ["ETH", "USDC", "WETH"],
  [Sepolia.chainId]: ["ETH"],
  [Polygon.chainId]: ["MATIC", "WETH", "USDC", "USDC.e"],
  [Mumbai.chainId]: ["MATIC", "USDC", "USDC.e", "DERC20", "CDOL"],
  [Avalanche.chainId]: ["AVAX", "USDC", "USDC.e"],
  [AvalancheFuji.chainId]: ["AVAX", "USDC"],
  [Optimism.chainId]: ["ETH", "USDC"],
  [OptimismGoerli.chainId]: ["ETH"],
  [Arbitrum.chainId]: ["ETH", "USDC"],
  [ArbitrumNova.chainId]: ["ETH"],
  [ArbitrumGoerli.chainId]: ["AGOR", "USDC"],
  [ArbitrumSepolia.chainId]: ["ETH", "DERC20"],
  [Binance.chainId]: ["BNB", "USDC", "USDT"],
  [BinanceTestnet.chainId]: ["TBNB", "USDT"],
  [Base.chainId]: ["ETH"],
  [BaseGoerli.chainId]: ["ETH"],
  [Zora.chainId]: ["ETH"],
  [ZoraTestnet.chainId]: ["ETH"],
  [FrameTestnet.chainId]: ["ETH"],
  [RarichainTestnet.chainId]: ["ETH"],
  [Xai.chainId]: ["XAI"],
  [XaiSepolia.chainId]: ["XAI"],
};

const ChainSymbolToChainName: Record<string, string> = {
  ETH: "Ether",
  MATIC: "Matic",
  AVAX: "Avalanche",
  AGOR: "Arbitrum Goerli Ether",
  XAI: "XAI",
};

export const ChainIdToSupportedCurrencies: Record<number, CurrencyMetadata[]> =
  Object.keys(supportedCurrenciesMap).reduce<
    Record<number, CurrencyMetadata[]>
  >((acc, chainIdStr) => {
    const chainId = parseInt(chainIdStr, 10);

    if (!isNaN(chainId)) {
      const chainCurrencies = CURRENCIES[chainId] || [];
      const supportedCurrencies = supportedCurrenciesMap[chainId] || [];

      if (supportedCurrencies.length > 0) {
        const firstSupportedCurrencyName = supportedCurrencies[0];

        const defaultCurrency: CurrencyMetadata = {
          address: OtherAddressZero.toLowerCase(),
          name: ChainSymbolToChainName[firstSupportedCurrencyName] || "Ether",
          symbol: firstSupportedCurrencyName,
        };

        acc[chainId] = [
          defaultCurrency,
          ...chainCurrencies.filter(
            (currency) =>
              supportedCurrencies.includes(currency.symbol) &&
              currency.symbol !== firstSupportedCurrencyName,
          ),
        ] as CurrencyMetadata[];
      }
    }

    return acc;
  }, {});

type RegisterContractInput = {
  chain: string;
  contractAddress: string;
  contractType?: "CUSTOM_CONTRACT" | "THIRDWEB";
  contractDefinition?: Abi;
  displayName?: string;
};

const apiDate = "2022-08-12";

function usePaymentsApi() {
  const fetchFromApi = async <T>(
    token: string,
    method: string,
    endpoint: string,
    body?: T,
    options?: {
      isGenerateSignedUrl?: boolean;
      isCreateVerificationSession?: boolean;
      isSellerDocumentCount?: boolean;
      isSellerVerificationStatus?: boolean;
      isGetImageUploadLink?: boolean;
      isSellerApiKey?: boolean;
      isWebhookTest?: boolean;
    },
  ) => {
    const res = await fetch(`${THIRDWEB_PAYMENTS_API_HOST}/api/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      ...(body && { body: JSON.stringify(body) }),
    });
    const json = await res.json();

    if (json.error) {
      throw new Error(json.message);
    }

    if (options?.isGenerateSignedUrl) {
      return json.url;
    }

    if (options?.isCreateVerificationSession) {
      return json as { clientSecret: string; id: string };
    }

    if (options?.isSellerDocumentCount) {
      return json as { fileNames: string[]; count: number };
    }

    if (options?.isSellerVerificationStatus) {
      return json as { status: { type: string; message: string } };
    }

    if (options?.isGetImageUploadLink) {
      return json as {
        data: { imageId: string; uploadLink: string };
        success: boolean;
      };
    }

    if (options?.isSellerApiKey) {
      return json as {
        data: { data: ApiSecretKeysByOwnerIdQuery; decrypted_key: string };
        success: boolean;
      };
    }

    if (options?.isWebhookTest) {
      return json as {
        status: number;
        responseBody: string;
      };
    }

    return json.result;
  };

  return fetchFromApi;
}

export function usePaymentsRegisterContract() {
  const { token } = useApiAuthToken();
  const fetchFromPaymentsAPI = usePaymentsApi();
  const queryClient = useQueryClient();
  const address = useAddress();

  return useMutationWithInvalidate(
    async (input: RegisterContractInput) => {
      invariant(token, "No token found");
      invariant(address, "No wallet address found");
      invariant(input.chain, "No chain found");
      const sdk = getEVMThirdwebSDK(
        parseInt(input.chain),
        `https://${input.chain}.rpc.${PROD_OR_DEV_URL}`,
      );
      invariant(sdk, "No SDK found");

      const contract = await sdk.getContract(input.contractAddress);
      invariant(contract?.abi, "No contract ABI found");

      const hasDetectedExtensions = hasPaymentsDetectedExtensions(contract);
      const contractType = hasDetectedExtensions
        ? "THIRDWEB"
        : "CUSTOM_CONTRACT";

      let displayName;
      try {
        const metadata = await contract.metadata.get();
        displayName = metadata.name;
      } catch (e) {
        console.error(`Failed to get contract metadata`);
      }

      const body: RegisterContractInput = {
        ...input,
        contractDefinition: contract.abi,
        contractAddress: input.contractAddress,
        chain: ChainIdToPaperChain[parseInt(input.chain)],
        contractType,
        displayName,
      };

      return fetchFromPaymentsAPI<RegisterContractInput>(
        token,
        "POST",
        `${apiDate}/register-contract`,
        body,
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          paymentsKeys.contracts(address as string),
        );
      },
    },
  );
}

export type CreateUpdateCheckoutInput = {
  contractId: string;
  title: string;
  description?: string;
  imageUrl?: string;
  limitPerTransaction?: number;
  twitterHandleOverride?: string;
  successCallbackUrl?: string;
  redirectAfterPayment?: boolean;
  cancelCallbackUrl?: string;
  mintMethod?: {
    name: string;
    args: { [key: string]: string };
    payment: {
      currency: string;
      value: string;
    };
  };
  eligibilityMethod?: {
    name: string;
    args: string[];
  };
  tokenId?: string;
  listingId?: string;
  contractArgs?: string;
  hideNativeMint?: boolean;
  hidePaperWallet?: boolean;
  hideExternalWallet?: boolean;
  hidePayWithCard?: boolean;
  hidePayWithCrypto?: boolean;
  hidePayWithIdeal?: boolean;
  sendEmailOnTransferSucceeded?: boolean;
  brandDarkMode?: boolean;
  brandButtonShape?: "full" | "lg" | "none";
  brandColorScheme?:
    | "gray"
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "teal"
    | "blue"
    | "cyan"
    | "purple"
    | "pink";
  thirdwebClientId: string;
  checkoutId?: string;
};

export function usePaymentsCreateUpdateCheckout(contractAddress: string) {
  const { token } = useApiAuthToken();
  const fetchFromPaymentsAPI = usePaymentsApi();
  const queryClient = useQueryClient();
  const address = useAddress();

  return useMutationWithInvalidate(
    async (input: CreateUpdateCheckoutInput) => {
      invariant(token, "No token found");
      invariant(address, "No wallet address found");

      return fetchFromPaymentsAPI<CreateUpdateCheckoutInput>(
        token,
        "POST",
        `${apiDate}/shareable-checkout-link${
          input?.checkoutId ? `/${input.checkoutId} ` : ""
        }`,
        input,
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          paymentsKeys.checkouts(contractAddress, address as string),
        );
      },
    },
  );
}

type RemoveCheckoutInput = {
  checkoutId: string;
};

export function usePaymentsRemoveCheckout(contractAddress: string) {
  const { token } = useApiAuthToken();
  const fetchFromPaymentsAPI = usePaymentsApi();
  const queryClient = useQueryClient();
  const address = useAddress();

  return useMutationWithInvalidate(
    async (input: RemoveCheckoutInput) => {
      invariant(token, "No token found");
      invariant(address, "No wallet address found");
      invariant(input.checkoutId, "No checkoutId found");

      return fetchFromPaymentsAPI<RemoveCheckoutInput>(
        token,
        "DELETE",
        `${apiDate}/shareable-checkout-link/${input.checkoutId}`,
      );
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(
          paymentsKeys.checkouts(contractAddress, address as string),
        );
      },
    },
  );
}

export function usePaymentsUploadKybFiles() {
  const { token } = useApiAuthToken();
  const fetchFromPaymentsAPI = usePaymentsApi();
  const queryClient = useQueryClient();
  const address = useAddress();

  return useMutationWithInvalidate(
    async (input: { files: File[] }) => {
      invariant(token, "No token found");
      invariant(address, "No wallet address found");
      invariant(input.files.length > 0, "No files found");

      for (const file of input.files) {
        const url = await fetchFromPaymentsAPI(
          token,
          "POST",
          "storage/generate-signed-url",
          { fileName: file.name, fileType: file.type },
          { isGenerateSignedUrl: true },
        );

        if (!url) {
          throw new Error("Unable to generate presigned URL");
        }

        const res = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (res.status !== 200) {
          throw new Error(`Unexpected status ${res.status}`);
        }
      }
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(
          paymentsKeys.kybStatus(address as string),
        );
      },
    },
  );
}

const getBlobFromBase64Image = async (strBase64: string): Promise<Blob> => {
  if (!strBase64.startsWith("data:image/")) {
    return Promise.reject("Invalid base64 image format");
  }

  const imageBase64Response = await fetch(strBase64);
  return imageBase64Response.blob();
};

interface UploadLinkResponse {
  uploadLink: string;
  imageId: string;
}

interface UploadImageResponse {
  result: {
    id: string;
    meta: { [field: string]: string };
    variants: string[];
  };
  success: boolean;
  errors: any;
  messages: any;
}

export function usePaymentsUploadToCloudflare() {
  const { token } = useApiAuthToken();
  const fetchFromPaymentsAPI = usePaymentsApi();
  const queryClient = useQueryClient();
  const address = useAddress();

  return useMutationWithInvalidate(
    async (dataBase64: string) => {
      invariant(token, "No token found");
      invariant(address, "No wallet address found");
      invariant(dataBase64, "No file found");
      const file = await getBlobFromBase64Image(dataBase64);
      const res = await fetchFromPaymentsAPI(
        token,
        "GET",
        "storage/get-image-upload-link",
        undefined,
        { isGetImageUploadLink: true },
      );

      const { uploadLink, imageId } = res.data as UploadLinkResponse;
      if (!uploadLink || uploadLink === "") {
        throw new Error("Unable to get upload link.");
      }

      // Append the data to the form and upload to cloudflare.
      const uploadForm = new FormData();
      uploadForm.append("file", file, imageId);

      // Upload the image to cloudflare.
      const response = await fetch(uploadLink, {
        method: "POST",
        body: uploadForm,
      });

      if (response.status !== 200) {
        throw new Error("Failed to upload image.");
      }
      const responseData = (await response.json()) as UploadImageResponse;
      const imageUrl =
        responseData.result.variants[1] ||
        responseData.result.variants[0] ||
        "";
      if (imageUrl === "") {
        throw new Error("Unable to generate image URL.");
      }

      // Return the string URL.
      return imageUrl;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(
          paymentsKeys.kycStatus(address as string),
        );
      },
    },
  );
}

export type SellerValueInput = {
  twitter_handle: string;
  company_name: string;
  company_logo_url: string;
  support_email: string;
  is_sole_proprietor: boolean;
};

type UpdateSellerByIdInput = {
  id: string;
  sellerValue: SellerValueInput;
};

export function usePaymentsUpdateSellerById(id: string) {
  const queryClient = useQueryClient();
  const address = useAddress();

  const [updateSellerById] = useUpdateSellerMutation({
    refetchQueries: [SellerDocument],
  });

  return useMutationWithInvalidate(
    async (input: UpdateSellerByIdInput) => {
      invariant(address, "No wallet address found");
      invariant(id, "No id found");

      return updateSellerById({
        variables: {
          id: input.id,
          sellerValue: input.sellerValue,
        } as UpdateSellerByIdInput,
      });
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(paymentsKeys.settings(id));
      },
    },
  );
}

export function usePaymentsKybStatus() {
  const { token } = useApiAuthToken();
  const fetchFromPaymentsAPI = usePaymentsApi();
  const address = useAddress();

  return useQuery(
    paymentsKeys.kybStatus(address as string),
    async () => {
      invariant(token, "No token found");
      invariant(address, "No wallet address found");
      return fetchFromPaymentsAPI(
        token,
        "GET",
        "seller-verification/seller-document-count",
        undefined,
        { isSellerDocumentCount: true },
      );
    },
    { enabled: !!address && !!token },
  );
}

export function usePaymentsGetVerificationSession(sellerId: string) {
  const { token } = useApiAuthToken();
  const fetchFromPaymentsAPI = usePaymentsApi();
  const address = useAddress();

  return useQuery(
    paymentsKeys.verificationSession(address as string),
    async () => {
      invariant(token, "No token found");
      invariant(address, "No wallet address found");
      invariant(sellerId, "No sellerId found");
      return fetchFromPaymentsAPI(
        token,
        "POST",
        "seller-verification/create-verification-session",
        { sellerId },
        { isCreateVerificationSession: true },
      );
    },
    { enabled: !!address && !!sellerId && !!token },
  );
}

export function usePaymentsKycStatus(sessionId: string) {
  const { token } = useApiAuthToken();
  const fetchFromPaymentsAPI = usePaymentsApi();
  const address = useAddress();

  return useQuery(
    paymentsKeys.kycStatus(address as string),
    async () => {
      invariant(token, "No token found");
      invariant(address, "No wallet address found");
      invariant(sessionId, "No sessionId found");
      return fetchFromPaymentsAPI(
        token,
        "POST",
        "seller-verification/status",
        {
          verificationSessionId: sessionId,
        },
        { isSellerVerificationStatus: true },
      );
    },
    { enabled: !!address && !!token },
  );
}

export function usePaymentsEnabledContracts() {
  const address = useAddress();
  const { paymentsSellerId } = useApiAuthToken();
  const [getContractsByOwnerId] = useContractsByOwnerIdLazyQuery();

  return useQuery(
    paymentsKeys.contracts(address as string),
    async () => {
      const { data, error } = await getContractsByOwnerId({
        variables: {
          ownerId: paymentsSellerId,
        } as ContractsByOwnerIdQueryVariables,
      });

      if (error) {
        console.error(error);
      }

      return data && data?.contract.length > 0 ? data.contract : [];
    },
    { enabled: !!paymentsSellerId && !!address },
  );
}

export function usePaymentsCheckoutsByContract(contractAddress: string) {
  const address = useAddress();
  const { paymentsSellerId } = useApiAuthToken();
  const [getCheckoutsByContractAddress] =
    useCheckoutsByContractAddressLazyQuery();

  return useQuery(
    paymentsKeys.checkouts(contractAddress, address as string),
    async () => {
      const { data, error } = await getCheckoutsByContractAddress({
        variables: {
          ownerId: paymentsSellerId,
          contractAddressQuery: contractAddress,
        } as CheckoutsByContractAddressQueryVariables,
      });

      if (error) {
        console.error(error);
      }

      const checkouts = data?.checkout || [];
      return (
        checkouts.filter(
          (checkout) => !checkout.generated_by_registered_contract,
        ) ?? []
      );
    },
    {
      enabled: !!paymentsSellerId && !!address && !!contractAddress,
    },
  );
}

enum PaymentMethod {
  NATIVE_MINT = "NATIVE_MINT",
  BUY_WITH_CARD = "BUY_WITH_CARD",
  BUY_WITH_BANK = "BUY_WITH_BANK",
  BUY_WITH_CRYPTO = "BUY_WITH_CRYPTO",
  ENQUEUED_JOB = "ENQUEUED_JOB",
  FREE_CLAIM_AND_TRANSFER = "FREE_CLAIM_AND_TRANSFER",
  BUY_WITH_IDEAL = "BUY_WITH_IDEAL",
}

const PaymentMethodToText: Record<PaymentMethod, string> = {
  [PaymentMethod.BUY_WITH_CARD]: "Card",
  [PaymentMethod.BUY_WITH_BANK]: "Bank Account",
  [PaymentMethod.BUY_WITH_CRYPTO]: "Other Crypto",
  [PaymentMethod.NATIVE_MINT]: "Native",
  [PaymentMethod.ENQUEUED_JOB]: "Free Claim",
  [PaymentMethod.FREE_CLAIM_AND_TRANSFER]: "Free claim",
  [PaymentMethod.BUY_WITH_IDEAL]: "iDEAL",
};

enum FiatCurrency {
  USD = "USD",
  EUR = "EUR",
  JPY = "JPY",
  GBP = "GBP",
  AUD = "AUD",
  CAD = "CAD",
  CHF = "CHF",
  CNH = "CNH",
  HKD = "HKD",
  NZD = "NZD",
}

const WALLET_TYPE = "wallet_type";
const PAYMENT_METHOD = "payment_method";
function parseAnalyticOverviewData(data: any[]): any[] {
  const result: { [checkout_id: string]: any } = {};

  for (const item of data) {
    const temp = result[item.checkout_id] || { revenue_cents: {} };

    temp.collection_title = item.collection_title || "";
    temp.collection_description = item.collection_description || "";
    temp.checkout_created_at = item.checkout_created_at || "";
    temp.checkout_deleted_at = item.checkout_deleted_at || "";
    temp.checkout_id = item.checkout_id || "";
    temp.image_url = item.image_url || "";

    temp.network_fees_cents =
      (temp.network_fees_cents || 0) + (item.network_fees_cents || 0);
    temp.number_sold = (temp.number_sold || 0) + (item.number_sold || 0);

    if (item.revenue_cents > 0) {
      temp.revenue_cents[
        (item.fiat_currency as FiatCurrency) || FiatCurrency.USD
      ] =
        (temp.revenue_cents[
          (item.fiat_currency as FiatCurrency) || FiatCurrency.USD
        ] || 0) + (item.revenue_cents || 0);
    }

    temp.paper_fees_cents =
      (temp.paper_fees_cents || 0) + item.paper_fees_cents;
    temp.num_transactions_made =
      (temp.num_transactions_made || 0) + (item.num_transactions_made || 0);

    if (item.wallet_type) {
      const walletTemp = temp[WALLET_TYPE] || {};
      walletTemp[item.wallet_type] =
        (walletTemp[item.wallet_type] || 0) + item.number_sold;
      temp[WALLET_TYPE] = walletTemp;
    }
    if (item.payment_method) {
      const paymentTemp = temp[PAYMENT_METHOD] || {};
      paymentTemp[PaymentMethodToText[item.payment_method as PaymentMethod]] =
        (paymentTemp[
          PaymentMethodToText[item.payment_method as PaymentMethod]
        ] || 0) + item.number_sold;
      temp[PAYMENT_METHOD] = paymentTemp;
    }

    result[item.checkout_id] = temp;
  }

  return [
    ...(Object.values(result)?.filter(
      (analytic) =>
        !analytic.checkout_deleted_at ||
        analytic.checkout_deleted_at === "infinity",
    ) ?? []),
  ];
}

export function usePaymentsDetailedAnalytics(checkoutId: string | undefined) {
  invariant(checkoutId, "checkoutId is required");
  const address = useAddress();
  const { paymentsSellerId } = useApiAuthToken();
  const [getDetailedAnalytics] = useDetailedAnalyticsLazyQuery();

  return useQuery(
    paymentsKeys.detailedAnalytics(checkoutId),
    async () => {
      const { data, error } = await getDetailedAnalytics({
        variables: {
          ownerId: paymentsSellerId,
          checkoutId,
        } as DetailedAnalyticsQueryVariables,
      });

      if (error) {
        console.error(error);
      }

      return {
        overview: data?.analytics_overview_2,
        detailed: data?.get_detailed_analytics,
        parsedOverview: parseAnalyticOverviewData(
          data?.analytics_overview_2 || [],
        )[0],
      };
    },
    { enabled: !!paymentsSellerId && !!address },
  );
}

export function usePaymentsSellerById(paymentsSellerId: string) {
  invariant(paymentsSellerId, "paymentsSellerId is required");
  const address = useAddress();
  const [getSellerById] = useSellerLazyQuery();

  return useQuery(
    paymentsKeys.settings(paymentsSellerId),
    async () => {
      const { data, error } = await getSellerById({
        variables: {
          id: paymentsSellerId,
        } as SellerQueryVariables,
      });

      if (error) {
        console.error(error);
      }

      return data?.seller_by_pk;
    },
    { enabled: !!paymentsSellerId && !!address },
  );
}

export type PaymentsWebhooksType = {
  id: string;
  sellerId: string;
  url: string;
  isProduction: boolean;
  createdAt: Date;
};

export function usePaymentsWebhooksById(paymentsSellerId: string) {
  invariant(paymentsSellerId, "paymentsSellerId is required");

  const [getWebhooksBySellerId] = useWebhooksBySellerIdLazyQuery();

  return useQuery(
    paymentsKeys.webhooks(paymentsSellerId),
    async () => {
      invariant(paymentsSellerId, "no payments seller id found");
      const { data, error } = await getWebhooksBySellerId({
        variables: {
          sellerId: paymentsSellerId,
        } as WebhooksBySellerIdQueryVariables,
      });

      if (error) {
        console.error(error);
      }

      return data && data?.webhook.length > 0
        ? (data.webhook.map((webhook) => ({
            id: webhook.id,
            sellerId: webhook.seller_id,
            url: webhook.url,
            isProduction: webhook.is_production,
            createdAt: new Date(webhook.created_at),
          })) as PaymentsWebhooksType[])
        : ([] as PaymentsWebhooksType[]);
    },
    { enabled: !!paymentsSellerId },
  );
}

export type CreateWebhookInput = {
  url: string;
  isProduction: boolean;
};

export function usePaymentsCreateWebhook(paymentsSellerId: string) {
  invariant(paymentsSellerId, "paymentsSellerId is required");
  const queryClient = useQueryClient();

  const [createWebhookBySellerId] = useInsertWebhookMutation({
    refetchQueries: [WebhooksBySellerIdDocument],
  });

  return useMutationWithInvalidate(
    async (input: CreateWebhookInput) => {
      invariant(paymentsSellerId, "No seller id found");

      return createWebhookBySellerId({
        variables: {
          object: {
            seller_id: paymentsSellerId,
            url: input.url,
            is_production: input.isProduction,
          },
        } as InsertWebhookMutationVariables,
      });
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(
          paymentsKeys.webhooks(paymentsSellerId),
        );
      },
    },
  );
}

type UpdateWebhookInput = {
  webhookId: string;
  url?: string;
  deletedAt?: Date;
};

export function usePaymentsUpdateWebhook(paymentsSellerId: string) {
  const queryClient = useQueryClient();

  const [updateWebhookBySellerId] = useUpdateWebhookMutation({
    refetchQueries: [WebhooksBySellerIdDocument],
  });

  return useMutationWithInvalidate(
    async (input: UpdateWebhookInput) => {
      invariant(paymentsSellerId, "No seller id found");

      return updateWebhookBySellerId({
        variables: {
          id: input.webhookId,
          webhookValue: {
            url: input.url,
            deleted_at: input.deletedAt,
          },
        } as UpdateWebhookMutationVariables,
      });
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(
          paymentsKeys.webhooks(paymentsSellerId),
        );
      },
    },
  );
}

export function usePaymentsWebhooksSecretKeyById(paymentsSellerId: string) {
  const { token } = useApiAuthToken();
  const fetchFromPaymentsAPI = usePaymentsApi();

  return useQuery(
    paymentsKeys.webhookSecret(paymentsSellerId),
    async () => {
      invariant(token, "No token found");
      invariant(paymentsSellerId, "No sellerId found");

      return fetchFromPaymentsAPI(
        token,
        "POST",
        "api-key/get-decrypted-key",
        {
          sellerId: paymentsSellerId,
        },
        {
          isSellerApiKey: true,
        },
      );
    },
    { enabled: !!paymentsSellerId && !!token },
  );
}

export enum WebhookEvent {
  /**
   * Emitted when the buyer's payment fails.
   */
  PAYMENT_FAILED = "payment:failed",
  /**
   * Emitted when the buyer's payment is completed.
   */
  PAYMENT_SUCCEEDED = "payment:succeeded",
  /**
   * Emitted when the buyer's payment method has a hold created.
   * They are not charged yet.
   */
  PAYMENT_HOLD_CREATED = "payment:hold_created",
  /**
   * Emitted when the buyer's payment is refunded.
   */
  PAYMENT_REFUNDED = "payment:refunded",

  /**
   * Emitted when the NFT is successfully transferred to the buyer's wallet.
   */
  TRANSFER_SUCCEEDED = "transfer:succeeded",
  /**
   * Emitted when the NFT failed to transfer to the buyer's wallet.
   */
  TRANSFER_FAILED = "transfer:failed",

  /**
   * Called when the transaction is successfully enqueue on chain
   */
  TRANSACTION_ENQUEUED = "transaction:enqueued",
}

export type PaymentsWebhooksTestInput = {
  webhookEvent: WebhookEvent;
  webhookUrl: string;
};

export function usePaymentsTestWebhook(paymentsSellerId: string) {
  invariant(paymentsSellerId, "paymentsSellerId is required");

  const { token } = useApiAuthToken();
  const fetchFromPaymentsAPI = usePaymentsApi();

  return useMutation(async (input: PaymentsWebhooksTestInput) => {
    invariant(token, "No token found");
    return fetchFromPaymentsAPI(
      token,
      "POST",
      "checkout/test-webhook-url",
      {
        event: input.webhookEvent,
        webhookUrl: input.webhookUrl,
      },
      {
        isWebhookTest: true,
      },
    );
  });
}
