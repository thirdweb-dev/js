import type { Chain } from "../src/types";
export default {
  "chainId": 197710212031,
  "chain": "Ntity",
  "name": "Haradev Testnet",
  "rpc": [
    "https://haradev-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://blockchain.haradev.com"
  ],
  "slug": "haradev-testnet",
  "icon": {
    "url": "ipfs://QmSW2YhCvMpnwtPGTJAuEK2QgyWfFjmnwcrapUg6kqFsPf",
    "width": 711,
    "height": 715,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ntity Haradev",
    "symbol": "NTTH",
    "decimals": 18
  },
  "infoURL": "https://ntity.io",
  "shortName": "ntt-haradev",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Ntity Haradev Blockscout",
      "url": "https://blockscout.haradev.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;