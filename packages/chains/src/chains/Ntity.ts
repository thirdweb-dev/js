import type { Chain } from "../types";
export default {
  "chain": "Ntity",
  "chainId": 197710212030,
  "explorers": [
    {
      "name": "Ntity Blockscout",
      "url": "https://blockscout.ntity.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmSW2YhCvMpnwtPGTJAuEK2QgyWfFjmnwcrapUg6kqFsPf",
        "width": 711,
        "height": 715,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmSW2YhCvMpnwtPGTJAuEK2QgyWfFjmnwcrapUg6kqFsPf",
    "width": 711,
    "height": 715,
    "format": "svg"
  },
  "infoURL": "https://ntity.io",
  "name": "Ntity Mainnet",
  "nativeCurrency": {
    "name": "Ntity",
    "symbol": "NTT",
    "decimals": 18
  },
  "networkId": 197710212030,
  "rpc": [
    "https://ntity.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://197710212030.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ntity.io"
  ],
  "shortName": "ntt",
  "slug": "ntity",
  "testnet": false
} as const satisfies Chain;