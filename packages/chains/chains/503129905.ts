import type { Chain } from "../src/types";
export default {
  "chain": "staging-faint-slimy-achird",
  "chainId": 503129905,
  "explorers": [
    {
      "name": "nebula",
      "url": "https://staging-faint-slimy-achird.explorer.staging-v3.skalenodes.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmfQkfmQuoUUUKwF1yCcrPEzFcWLaqNyiSv5YMcSj6zs74",
        "width": 500,
        "height": 500,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "infoURL": "https://nebulachain.io/",
  "name": "Nebula Staging",
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "networkId": 503129905,
  "rpc": [
    "https://nebula-staging.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://503129905.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://staging-v3.skalenodes.com/v1/staging-faint-slimy-achird",
    "wss://staging-v3.skalenodes.com/v1/ws/staging-faint-slimy-achird"
  ],
  "shortName": "nebula-staging",
  "slug": "nebula-staging",
  "testnet": false
} as const satisfies Chain;