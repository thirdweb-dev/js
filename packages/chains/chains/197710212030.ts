import type { Chain } from "../src/types";
export default {
  "chainId": 197710212030,
  "chain": "Ntity",
  "name": "Ntity Mainnet",
  "rpc": [
    "https://ntity.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ntity.io"
  ],
  "slug": "ntity",
  "icon": {
    "url": "ipfs://QmSW2YhCvMpnwtPGTJAuEK2QgyWfFjmnwcrapUg6kqFsPf",
    "width": 711,
    "height": 715,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ntity",
    "symbol": "NTT",
    "decimals": 18
  },
  "infoURL": "https://ntity.io",
  "shortName": "ntt",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Ntity Blockscout",
      "url": "https://blockscout.ntity.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;