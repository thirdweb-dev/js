import { afterEach, beforeEach } from "node:test";
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

const CHAIN_RPC_TEST_CASES: [ChainRPCOptions, string[]][] = [
  [
    { thirdwebApiKey: "SAMPLE_KEY" },
    [
      "https://ethereum.rpc.thirdweb.com/SAMPLE_KEY",
      "https://api.mycryptoapi.com/eth",
      "https://cloudflare-eth.com",
      "https://ethereum.publicnode.com",
      "https://mainnet.gateway.tenderly.co",
    ],
  ],
  [
    { alchemyApiKey: "SAMPLE_KEY" },
    [
      "https://eth-mainnet.g.alchemy.com/v2/SAMPLE_KEY",
      "https://api.mycryptoapi.com/eth",
      "https://cloudflare-eth.com",
      "https://ethereum.publicnode.com",
      "https://mainnet.gateway.tenderly.co",
    ],
  ],
  [
    { infuraApiKey: "SAMPLE_KEY" },
    [
      "https://mainnet.infura.io/v3/SAMPLE_KEY",
      "https://api.mycryptoapi.com/eth",
      "https://cloudflare-eth.com",
      "https://ethereum.publicnode.com",
      "https://mainnet.gateway.tenderly.co",
    ],
  ],
  // infura is supported for both http and ws
  [
    { mode: "ws", infuraApiKey: "SAMPLE_KEY" },
    [
      "wss://mainnet.infura.io/ws/v3/SAMPLE_KEY",
      "wss://mainnet.gateway.tenderly.co",
    ],
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
      [
        "https://ethereum.rpc.thirdweb.com/",
        "https://api.mycryptoapi.com/eth",
        "https://cloudflare-eth.com",
        "https://ethereum.publicnode.com",
        "https://mainnet.gateway.tenderly.co",
      ],
    ],
    [
      undefined,
      "http",
      [
        "https://ethereum.rpc.thirdweb.com/",
        "https://api.mycryptoapi.com/eth",
        "https://cloudflare-eth.com",
        "https://ethereum.publicnode.com",
        "https://mainnet.gateway.tenderly.co",
      ],
    ],
    [
      "SAMPLE_CLIENT_KEY",
      undefined,
      [
        "https://ethereum.rpc.thirdweb.com/SAMPLE_CLIENT_KEY",
        "https://api.mycryptoapi.com/eth",
        "https://cloudflare-eth.com",
        "https://ethereum.publicnode.com",
        "https://mainnet.gateway.tenderly.co",
      ],
    ],
    [
      "SAMPLE_CLIENT_KEY",
      "http",
      [
        "https://ethereum.rpc.thirdweb.com/SAMPLE_CLIENT_KEY",
        "https://api.mycryptoapi.com/eth",
        "https://cloudflare-eth.com",
        "https://ethereum.publicnode.com",
        "https://mainnet.gateway.tenderly.co",
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
      rpc: ["https://ethereum.rpc.thirdweb.com/${THIRDWEB_API_KEY}"],
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
        rpc: [
          "https://ethereum.rpc.thirdweb.com/",
          "https://api.mycryptoapi.com/eth",
          "https://cloudflare-eth.com",
          "https://ethereum.publicnode.com",
          "https://mainnet.gateway.tenderly.co",
        ],
      },
    ],
    [
      Ethereum,
      "SAMPLE_CLIENT_KEY",
      {
        ...Ethereum,
        rpc: [
          "https://ethereum.rpc.thirdweb.com/SAMPLE_CLIENT_KEY",
          "https://api.mycryptoapi.com/eth",
          "https://cloudflare-eth.com",
          "https://ethereum.publicnode.com",
          "https://mainnet.gateway.tenderly.co",
        ],
      },
    ],
    [{ ...Ethereum, rpc: [] }, "SAMPLE_CLIENT_KEY", { ...Ethereum, rpc: [] }],
  ])("updateChainRPCs(%p, %s) = %p", (chain, config, expected) => {
    expect(updateChainRPCs(chain, config)).toEqual(expected);
  });
});

describe("chains/utils with APP_BUNDLE_ID", () => {
  beforeAll(() => {
    globalThis.APP_BUNDLE_ID = "com.thirdweb.rpc";
  });

  test.each([
    [
      undefined,
      undefined,
      [
        "https://ethereum.rpc.thirdweb.com/",
        "https://api.mycryptoapi.com/eth",
        "https://cloudflare-eth.com",
        "https://ethereum.publicnode.com",
        "https://mainnet.gateway.tenderly.co",
      ],
    ],
    [
      undefined,
      "http",
      [
        "https://ethereum.rpc.thirdweb.com/",
        "https://api.mycryptoapi.com/eth",
        "https://cloudflare-eth.com",
        "https://ethereum.publicnode.com",
        "https://mainnet.gateway.tenderly.co",
      ],
    ],
    [
      "SAMPLE_CLIENT_KEY",
      undefined,
      [
        "https://ethereum.rpc.thirdweb.com/SAMPLE_CLIENT_KEY/?bundleId=com.thirdweb.rpc",
        "https://api.mycryptoapi.com/eth",
        "https://cloudflare-eth.com",
        "https://ethereum.publicnode.com",
        "https://mainnet.gateway.tenderly.co",
      ],
    ],
    [
      "SAMPLE_CLIENT_KEY",
      "http",
      [
        "https://ethereum.rpc.thirdweb.com/SAMPLE_CLIENT_KEY/?bundleId=com.thirdweb.rpc",
        "https://api.mycryptoapi.com/eth",
        "https://cloudflare-eth.com",
        "https://ethereum.publicnode.com",
        "https://mainnet.gateway.tenderly.co",
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
        rpc: [
          "https://ethereum.rpc.thirdweb.com/",
          "https://api.mycryptoapi.com/eth",
          "https://cloudflare-eth.com",
          "https://ethereum.publicnode.com",
          "https://mainnet.gateway.tenderly.co",
        ],
      },
    ],
    [
      Ethereum,
      "SAMPLE_CLIENT_KEY",
      {
        ...Ethereum,
        rpc: [
          "https://ethereum.rpc.thirdweb.com/SAMPLE_CLIENT_KEY/?bundleId=com.thirdweb.rpc",
          "https://api.mycryptoapi.com/eth",
          "https://cloudflare-eth.com",
          "https://ethereum.publicnode.com",
          "https://mainnet.gateway.tenderly.co",
        ],
      },
    ],
    [{ ...Ethereum, rpc: [] }, "SAMPLE_CLIENT_KEY", { ...Ethereum, rpc: [] }],
  ])("updateChainRPCs(%p, %s) = %p", (chain, config, expected) => {
    expect(updateChainRPCs(chain, config)).toEqual(expected);
  });
});
