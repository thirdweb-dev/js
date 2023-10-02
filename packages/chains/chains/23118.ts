import type { Chain } from "../src/types";
export default {
  "chain": "Opside",
  "chainId": 23118,
  "explorers": [
    {
      "name": "opsideInfo",
      "url": "https://opside.info",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.opside.network"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmeCyZeibUoHNoYGzy1GkzH2uhxyRHKvH51PdaUMer4VTo",
    "width": 591,
    "height": 591,
    "format": "png"
  },
  "infoURL": "https://opside.network",
  "name": "Opside Testnet",
  "nativeCurrency": {
    "name": "IDE",
    "symbol": "IDE",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://opside-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testrpc.opside.network"
  ],
  "shortName": "opside",
  "slug": "opside-testnet",
  "testnet": true
} as const satisfies Chain;