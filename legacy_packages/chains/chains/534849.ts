import type { Chain } from "../src/types";
export default {
  "chain": "Shinarium",
  "chainId": 534849,
  "explorers": [
    {
      "name": "shinascan",
      "url": "https://shinascan.shinarium.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.shinarium.org"
  ],
  "icon": {
    "url": "ipfs://bafybeiadbavrwcial76vs5ovhyykyaobteltuhliqcthdairbja4klwzhu",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://shinarium.org",
  "name": "Shinarium Beta",
  "nativeCurrency": {
    "name": "Shina Inu",
    "symbol": "SHI",
    "decimals": 18
  },
  "networkId": 534849,
  "rpc": [
    "https://534849.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.shinarium.org"
  ],
  "shortName": "shi",
  "slug": "shinarium-beta",
  "testnet": false
} as const satisfies Chain;