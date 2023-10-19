import type { Chain } from "../src/types";
export default {
  "chain": "Ntity",
  "chainId": 197710212031,
  "explorers": [
    {
      "name": "Ntity Haradev Blockscout",
      "url": "https://blockscout.haradev.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmSW2YhCvMpnwtPGTJAuEK2QgyWfFjmnwcrapUg6kqFsPf",
    "width": 711,
    "height": 715,
    "format": "svg"
  },
  "infoURL": "https://ntity.io",
  "name": "Haradev Testnet",
  "nativeCurrency": {
    "name": "Ntity Haradev",
    "symbol": "NTTH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://haradev-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://blockchain.haradev.com"
  ],
  "shortName": "ntt-haradev",
  "slug": "haradev-testnet",
  "testnet": true
} as const satisfies Chain;