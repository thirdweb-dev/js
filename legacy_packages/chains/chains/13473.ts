import type { Chain } from "../src/types";
export default {
  "chain": "Immutable zkEVM",
  "chainId": 13473,
  "explorers": [
    {
      "name": "Immutable Testnet explorer",
      "url": "https://explorer.testnet.immutable.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://docs.immutable.com/docs/zkEVM/guides/faucet"
  ],
  "infoURL": "https://www.immutable.com",
  "name": "Immutable zkEVM Testnet",
  "nativeCurrency": {
    "name": "Test IMX",
    "symbol": "tIMX",
    "decimals": 18
  },
  "networkId": 13473,
  "rpc": [
    "https://13473.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.immutable.com",
    "https://immutable-zkevm-testnet.drpc.org",
    "wss://immutable-zkevm-testnet.drpc.org"
  ],
  "shortName": "imx-testnet",
  "slip44": 1,
  "slug": "immutable-zkevm-testnet",
  "testnet": true
} as const satisfies Chain;