import type { Chain } from "../src/types";
export default {
  "chain": "Open Campus Codex",
  "chainId": 656476,
  "explorers": [
    {
      "name": "Open Campus Codex",
      "url": "https://opencampus-codex.blockscout.com",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmXbz7VEYvf6NVHezuBy5HpJTCiagEThBxxdDdfVXNQ8Bt",
        "width": 30,
        "height": 30,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmXbz7VEYvf6NVHezuBy5HpJTCiagEThBxxdDdfVXNQ8Bt",
    "width": 30,
    "height": 30,
    "format": "png"
  },
  "infoURL": "https://raas.gelato.network/rollups/details/public/open-campus-codex",
  "name": "Open Campus Codex",
  "nativeCurrency": {
    "name": "EDU",
    "symbol": "EDU",
    "decimals": 18
  },
  "networkId": 656476,
  "rpc": [
    "https://656476.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.open-campus-codex.gelato.digital"
  ],
  "shortName": "open-campus-codex",
  "slug": "open-campus-codex",
  "testnet": false
} as const satisfies Chain;