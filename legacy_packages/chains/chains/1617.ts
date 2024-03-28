import type { Chain } from "../src/types";
export default {
  "chain": "ETINS",
  "chainId": 1617,
  "explorers": [
    {
      "name": "Ethereum Inscription Explorer",
      "url": "https://explorer.etins.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://www.etins.org",
  "name": "Ethereum Inscription Mainnet",
  "nativeCurrency": {
    "name": "Ethereum Inscription",
    "symbol": "ETINS",
    "decimals": 18
  },
  "networkId": 1617,
  "rpc": [
    "https://1617.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.etins.org"
  ],
  "shortName": "etins",
  "slug": "ethereum-inscription",
  "testnet": false
} as const satisfies Chain;