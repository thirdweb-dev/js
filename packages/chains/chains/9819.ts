import type { Chain } from "../src/types";
export default {
  "name": "IMPERIUM MAINNET",
  "chain": "IMP",
  "rpc": [
    "https://imperium.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://data-aws-mainnet.imperiumchain.com",
    "https://data-aws2-mainnet.imperiumchain.com"
  ],
  "faucets": [
    "https://faucet.imperiumchain.com/"
  ],
  "nativeCurrency": {
    "name": "IMP",
    "symbol": "IMP",
    "decimals": 18
  },
  "infoURL": "https://imperiumchain.com",
  "shortName": "IMP",
  "chainId": 9819,
  "networkId": 9819,
  "icon": {
    "url": "ipfs://QmcNGLzKyc7Gu2dgpBFF6t3KJwFuKC79D56DW8GTc5DWRw",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "explorers": [
    {
      "name": "IMPERIUM Explorer",
      "icon": {
        "url": "ipfs://QmcNGLzKyc7Gu2dgpBFF6t3KJwFuKC79D56DW8GTc5DWRw",
        "width": 200,
        "height": 200,
        "format": "png"
      },
      "url": "https://impscan.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "imperium"
} as const satisfies Chain;