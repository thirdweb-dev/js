import type { Chain } from "../src/types";
export default {
  "chain": "PlatON",
  "chainId": 2203181,
  "explorers": [
    {
      "name": "PlatON explorer",
      "url": "https://devnetscan.platon.network",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://devnet2faucet.platon.network/faucet"
  ],
  "infoURL": "https://www.platon.network",
  "name": "PlatON Dev Testnet Deprecated",
  "nativeCurrency": {
    "name": "LAT",
    "symbol": "lat",
    "decimals": 18
  },
  "networkId": 1,
  "rpc": [
    "https://2203181.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnetopenapi2.platon.network/rpc",
    "wss://devnetopenapi2.platon.network/ws"
  ],
  "shortName": "platondev",
  "slip44": 1,
  "slug": "platon-dev-testnet-deprecated",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;