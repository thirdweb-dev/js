import type { Chain } from "../src/types";
export default {
  "chainId": 23118,
  "chain": "Opside",
  "name": "Opside Testnet",
  "rpc": [
    "https://opside-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testrpc.opside.network"
  ],
  "slug": "opside-testnet",
  "icon": {
    "url": "ipfs://QmeCyZeibUoHNoYGzy1GkzH2uhxyRHKvH51PdaUMer4VTo",
    "width": 591,
    "height": 591,
    "format": "png"
  },
  "faucets": [
    "https://faucet.opside.network"
  ],
  "nativeCurrency": {
    "name": "IDE",
    "symbol": "IDE",
    "decimals": 18
  },
  "infoURL": "https://opside.network",
  "shortName": "opside",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "opsideInfo",
      "url": "https://opside.info",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;