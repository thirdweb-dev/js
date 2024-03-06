import type { Chain } from "../src/types";
export default {
  "chain": "Shinarium",
  "chainId": 214,
  "explorers": [
    {
      "name": "shinascan",
      "url": "https://shinascan.shinarium.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafybeiadbavrwcial76vs5ovhyykyaobteltuhliqcthdairbja4klwzhu",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://shinarium.org",
  "name": "Shinarium Mainnet",
  "nativeCurrency": {
    "name": "Shina Inu",
    "symbol": "SHI",
    "decimals": 18
  },
  "networkId": 214,
  "rpc": [
    "https://214.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.shinarium.org"
  ],
  "shortName": "shinarium",
  "slug": "shinarium",
  "testnet": false
} as const satisfies Chain;