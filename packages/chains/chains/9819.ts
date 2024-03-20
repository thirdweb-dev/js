import type { Chain } from "../src/types";
export default {
  "chain": "IMP",
  "chainId": 9819,
  "explorers": [
    {
      "name": "IMPERIUM Explorer",
      "url": "https://impscan.com",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmcNGLzKyc7Gu2dgpBFF6t3KJwFuKC79D56DW8GTc5DWRw",
        "width": 200,
        "height": 200,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.imperiumchain.com/"
  ],
  "icon": {
    "url": "ipfs://QmcNGLzKyc7Gu2dgpBFF6t3KJwFuKC79D56DW8GTc5DWRw",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "infoURL": "https://imperiumchain.com",
  "name": "IMPERIUM MAINNET",
  "nativeCurrency": {
    "name": "IMP",
    "symbol": "IMP",
    "decimals": 18
  },
  "networkId": 9819,
  "rpc": [
    "https://9819.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://data-aws-mainnet.imperiumchain.com",
    "https://data-aws2-mainnet.imperiumchain.com"
  ],
  "shortName": "IMP",
  "slug": "imperium",
  "testnet": false
} as const satisfies Chain;