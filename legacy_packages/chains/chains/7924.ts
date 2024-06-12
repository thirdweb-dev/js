import type { Chain } from "../src/types";
export default {
  "chain": "MO",
  "chainId": 7924,
  "explorers": [
    {
      "name": "MO Explorer",
      "url": "https://moscan.app",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.mochain.app/"
  ],
  "icon": {
    "url": "ipfs://QmfJYJiR7L8xMG3KAWroVA9CQEfRGcbprC4JmVsiVk1E4e",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://mochain.app",
  "name": "MO Mainnet",
  "nativeCurrency": {
    "name": "MO",
    "symbol": "MO",
    "decimals": 18
  },
  "networkId": 7924,
  "rpc": [
    "https://7924.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.mochain.app/"
  ],
  "shortName": "MO",
  "slug": "mo",
  "testnet": false
} as const satisfies Chain;