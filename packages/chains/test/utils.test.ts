import { Ethereum } from "../src";
import {
  type ChainRPCOptions,
  getChainRPC,
  getChainRPCs,
  minimizeChain,
  configureChain,
  updateChainRPCs,
  getValidChainRPCs,
} from "../src/utils";

const MAINNET_FALLBACK_HTTP_RPCS = [
  "https://api.mycryptoapi.com/eth",
  "https://cloudflare-eth.com",
  "https://ethereum-rpc.publicnode.com",
  "https://mainnet.gateway.tenderly.co",
  "https://rpc.blocknative.com/boost",
  "https://rpc.flashbots.net/fast",
  "https://rpc.mevblocker.io/fullprivacy",
];

const MAINNET_FALLBACK_WS_RPCS = [
  "wss://ethereum-rpc.publicnode.com",
  "wss://mainnet.gateway.tenderly.co",
];

const CHAIN_RPC_TEST_CASES: [ChainRPCOptions, string[]][] = [
  [
    { thirdwebApiKey: "SAMPLE_KEY" },
    ["https://1.rpc.thirdweb.com/SAMPLE_KEY", ...MAINNET_FALLBACK_HTTP_RPCS],
  ],
  [
    { alchemyApiKey: "SAMPLE_KEY" },
    [
      "https://eth-mainnet.g.alchemy.com/v2/SAMPLE_KEY",
      ...MAINNET_FALLBACK_HTTP_RPCS,
    ],
  ],
  [
    { infuraApiKey: "SAMPLE_KEY" },
    ["https://mainnet.infura.io/v3/SAMPLE_KEY", ...MAINNET_FALLBACK_HTTP_RPCS],
  ],
  // infura is supported for both http and ws
  [
    { mode: "ws", infuraApiKey: "SAMPLE_KEY" },
    ["wss://mainnet.infura.io/ws/v3/SAMPLE_KEY", ...MAINNET_FALLBACK_WS_RPCS],
  ],
];

describe("chains/utils", () => {
  test.each(CHAIN_RPC_TEST_CASES)(
    "getChainRPCs(%p) = %p",
    (options, expected) => {
      expect(getChainRPCs(Ethereum, options)).toEqual(expected);
    },
  );

  test.each([
    [
      undefined,
      undefined,
      ["https://1.rpc.thirdweb.com/", ...MAINNET_FALLBACK_HTTP_RPCS],
    ],
    [
      undefined,
      "http",
      ["https://1.rpc.thirdweb.com/", ...MAINNET_FALLBACK_HTTP_RPCS],
    ],
    [
      "SAMPLE_CLIENT_KEY",
      undefined,
      [
        "https://1.rpc.thirdweb.com/SAMPLE_CLIENT_KEY",
        ...MAINNET_FALLBACK_HTTP_RPCS,
      ],
    ],
    [
      "SAMPLE_CLIENT_KEY",
      "http",
      [
        "https://1.rpc.thirdweb.com/SAMPLE_CLIENT_KEY",
        ...MAINNET_FALLBACK_HTTP_RPCS,
      ],
    ],
  ])("getValidChainRPCs(Ethereum, %s, %s) = %p", (clientId, mode, expected) => {
    expect(getValidChainRPCs(Ethereum, clientId, mode)).toEqual(expected);
  });

  test.each(CHAIN_RPC_TEST_CASES)(
    "getChainRPC(%p) = %p",
    (options, expected) => {
      expect(getChainRPC(Ethereum, options)).toEqual(expected[0]);
    },
  );

  test("minimizeChain", () => {
    expect(minimizeChain(Ethereum)).toEqual({
      name: "Ethereum Mainnet",
      chain: "ETH",
      icon: {
        url: "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
        height: 512,
        width: 512,
        format: "png",
      },
      rpc: ["https://1.rpc.thirdweb.com/${THIRDWEB_API_KEY}"],
      nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
      },
      shortName: "eth",
      chainId: 1,
      testnet: false,
      slug: "ethereum",
    });
  });

  test.each([
    [{}, Ethereum],
    [
      { rpc: "https://example.com" },
      { ...Ethereum, rpc: ["https://example.com", ...Ethereum.rpc] },
    ],
    [
      { rpc: ["https://example.com", "https://httpbin.org"] },
      {
        ...Ethereum,
        rpc: ["https://example.com", "https://httpbin.org", ...Ethereum.rpc],
      },
    ],
  ])("configureChain(Ethereum, %p) = %p", (config, expected) => {
    expect(configureChain(Ethereum, config)).toEqual(expected);
  });

  test.each([
    [
      Ethereum,
      undefined,
      {
        ...Ethereum,
        rpc: ["https://1.rpc.thirdweb.com/", ...MAINNET_FALLBACK_HTTP_RPCS],
      },
    ],
    [
      Ethereum,
      "SAMPLE_CLIENT_KEY",
      {
        ...Ethereum,
        rpc: [
          "https://1.rpc.thirdweb.com/SAMPLE_CLIENT_KEY",
          ...MAINNET_FALLBACK_HTTP_RPCS,
        ],
      },
    ],
    [{ ...Ethereum, rpc: [] }, "SAMPLE_CLIENT_KEY", { ...Ethereum, rpc: [] }],
  ])("updateChainRPCs(%p, %s) = %p", (chain, config, expected) => {
    expect(updateChainRPCs(chain, config)).toEqual(expected);
  });
});

describe("chains/utils with APP_BUNDLE_ID", () => {
  beforeEach(() => {
    globalThis.APP_BUNDLE_ID = "com.thirdweb.rpc";
  });

  test.each([
    [
      undefined,
      undefined,
      ["https://1.rpc.thirdweb.com/", ...MAINNET_FALLBACK_HTTP_RPCS],
    ],
    [
      undefined,
      "http",
      ["https://1.rpc.thirdweb.com/", ...MAINNET_FALLBACK_HTTP_RPCS],
    ],
    [
      "SAMPLE_CLIENT_KEY",
      undefined,
      [
        "https://1.rpc.thirdweb.com/SAMPLE_CLIENT_KEY/?bundleId=com.thirdweb.rpc",
        ...MAINNET_FALLBACK_HTTP_RPCS,
      ],
    ],
    [
      "SAMPLE_CLIENT_KEY",
      "http",
      [
        "https://1.rpc.thirdweb.com/SAMPLE_CLIENT_KEY/?bundleId=com.thirdweb.rpc",
        ...MAINNET_FALLBACK_HTTP_RPCS,
      ],
    ],
  ])("getValidChainRPCs(Ethereum, %s, %s) = %p", (clientId, mode, expected) => {
    expect(getValidChainRPCs(Ethereum, clientId, mode)).toEqual(expected);
  });

  test.each([
    [
      Ethereum,
      undefined,
      {
        ...Ethereum,
        rpc: ["https://1.rpc.thirdweb.com/", ...MAINNET_FALLBACK_HTTP_RPCS],
      },
    ],
    [
      Ethereum,
      "SAMPLE_CLIENT_KEY",
      {
        ...Ethereum,
        rpc: [
          "https://1.rpc.thirdweb.com/SAMPLE_CLIENT_KEY/?bundleId=com.thirdweb.rpc",
          ...MAINNET_FALLBACK_HTTP_RPCS,
        ],
      },
    ],
    [{ ...Ethereum, rpc: [] }, "SAMPLE_CLIENT_KEY", { ...Ethereum, rpc: [] }],
  ])("updateChainRPCs(%p, %s) = %p", (chain, config, expected) => {
    expect(updateChainRPCs(chain, config)).toEqual(expected);
  });
});
