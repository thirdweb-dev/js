import type { Chain } from "../src/types";
export default {
  "chainId": 262,
  "chain": "SUR",
  "name": "SUR Blockchain Network",
  "rpc": [
    "https://sur-blockchain-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sur.nilin.org"
  ],
  "slug": "sur-blockchain-network",
  "icon": {
    "url": "ipfs://QmbUcDQHCvheYQrWk9WFJRMW5fTJQmtZqkoGUed4bhCM7T",
    "width": 3000,
    "height": 3000,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Suren",
    "symbol": "SRN",
    "decimals": 18
  },
  "infoURL": "https://surnet.org",
  "shortName": "SUR",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Surnet Explorer",
      "url": "https://explorer.surnet.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;