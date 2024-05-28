import type { Chain } from "../src/types";
export default {
  "chain": "ambnet",
  "chainId": 16718,
  "explorers": [
    {
      "name": "AirDAO Network Explorer",
      "url": "https://airdao.io/explorer",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://airdao.io",
  "name": "AirDAO Mainnet",
  "nativeCurrency": {
    "name": "Amber",
    "symbol": "AMB",
    "decimals": 18
  },
  "networkId": 16718,
  "rpc": [
    "https://16718.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://network.ambrosus.io"
  ],
  "shortName": "airdao",
  "slug": "airdao",
  "testnet": false
} as const satisfies Chain;