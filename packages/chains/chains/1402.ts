import type { Chain } from "../src/types";
export default {
  "chain": "Polygon",
  "chainId": 1402,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.public.zkevm-test.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://polygon.technology/solutions/polygon-zkevm/",
  "name": "Polygon zkEVM Testnet old",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1402,
  "rpc": [],
  "shortName": "zkevmtest",
  "slug": "polygon-zkevm-testnet-old",
  "status": "deprecated",
  "testnet": true,
  "title": "Polygon zkEVM Testnet"
} as const satisfies Chain;