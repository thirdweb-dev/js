import type { Chain } from "../src/types";
export default {
  "chain": "Immutable zkEVM",
  "chainId": 13371,
  "explorers": [
    {
      "name": "Immutable explorer",
      "url": "https://explorer.immutable.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://docs.immutable.com/docs/zkEVM/guides/faucet"
  ],
  "infoURL": "https://www.immutable.com",
  "name": "Immutable zkEVM",
  "nativeCurrency": {
    "name": "IMX",
    "symbol": "IMX",
    "decimals": 18
  },
  "networkId": 13371,
  "rpc": [
    "https://13371.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.immutable.com",
    "https://immutable-zkevm.drpc.org",
    "wss://immutable-zkevm.drpc.org"
  ],
  "shortName": "imx",
  "slug": "immutable-zkevm",
  "testnet": false
} as const satisfies Chain;