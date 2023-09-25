import type { Chain } from "../src/types";
export default {
  "chainId": 9819,
  "chain": "IMP",
  "name": "IMPERIUM MAINNET",
  "rpc": [
    "https://imperium.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://data-aws-mainnet.imperiumchain.com",
    "https://data-aws2-mainnet.imperiumchain.com"
  ],
  "slug": "imperium",
  "icon": {
    "url": "ipfs://QmcNGLzKyc7Gu2dgpBFF6t3KJwFuKC79D56DW8GTc5DWRw",
    "width": 200,
    "height": 200,
    "format": "png"
  },
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
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "IMPERIUM Explorer",
      "url": "https://impscan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;