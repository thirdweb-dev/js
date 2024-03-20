import type { Chain } from "../src/types";
export default {
  "chain": "SUR",
  "chainId": 262,
  "explorers": [
    {
      "name": "Surnet Explorer",
      "url": "https://explorer.surnet.org",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmbUcDQHCvheYQrWk9WFJRMW5fTJQmtZqkoGUed4bhCM7T",
        "width": 3000,
        "height": 3000,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmbUcDQHCvheYQrWk9WFJRMW5fTJQmtZqkoGUed4bhCM7T",
    "width": 3000,
    "height": 3000,
    "format": "png"
  },
  "infoURL": "https://surnet.org",
  "name": "SUR Blockchain Network",
  "nativeCurrency": {
    "name": "Suren",
    "symbol": "SRN",
    "decimals": 18
  },
  "networkId": 1,
  "rpc": [
    "https://262.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sur.nilin.org"
  ],
  "shortName": "SUR",
  "slug": "sur-blockchain-network",
  "testnet": false
} as const satisfies Chain;