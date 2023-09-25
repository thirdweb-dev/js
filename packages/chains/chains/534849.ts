import type { Chain } from "../src/types";
export default {
  "chainId": 534849,
  "chain": "Shinarium",
  "name": "Shinarium Beta",
  "rpc": [
    "https://shinarium-beta.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.shinarium.org"
  ],
  "slug": "shinarium-beta",
  "icon": {
    "url": "ipfs://bafybeiadbavrwcial76vs5ovhyykyaobteltuhliqcthdairbja4klwzhu",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "faucets": [
    "https://faucet.shinarium.org"
  ],
  "nativeCurrency": {
    "name": "Shina Inu",
    "symbol": "SHI",
    "decimals": 18
  },
  "infoURL": "https://shinarium.org",
  "shortName": "shi",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "shinascan",
      "url": "https://shinascan.shinarium.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;