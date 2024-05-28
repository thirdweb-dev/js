import type { Chain } from "../src/types";
export default {
  "chain": "VANAR",
  "chainId": 78600,
  "explorers": [
    {
      "name": "Vanguard Explorer",
      "url": "https://explorer-vanguard.vanarchain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.vanarchain.com"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://vanarchain.com",
  "name": "Vanguard",
  "nativeCurrency": {
    "name": "Vanguard Vanry",
    "symbol": "VANRY",
    "decimals": 18
  },
  "networkId": 78600,
  "rpc": [
    "https://78600.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-vanguard.vanarchain.com",
    "wss://ws-vanguard.vanarchain.com"
  ],
  "shortName": "vanguard",
  "slug": "vanguard",
  "testnet": true,
  "title": "Vanar Testnet Vanguard"
} as const satisfies Chain;