import type { Chain } from "../src/types";
export default {
  "name": "Optimism on Gnosis",
  "chain": "OGC",
  "rpc": [
    "https://optimism-on-gnosis.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://optimism.gnosischain.com",
    "wss://optimism.gnosischain.com/wss"
  ],
  "faucets": [
    "https://faucet.gimlu.com/gnosis"
  ],
  "nativeCurrency": {
    "name": "xDAI",
    "symbol": "xDAI",
    "decimals": 18
  },
  "infoURL": "https://www.xdaichain.com/for-developers/optimism-optimistic-rollups-on-gc",
  "shortName": "ogc",
  "chainId": 300,
  "networkId": 300,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.com/xdai/optimism",
      "icon": {
        "url": "ipfs://bafybeifu5tpui7dk5cjoo54kde7pmuthvnl7sdykobuarsxgu7t2izurnq",
        "width": 512,
        "height": 512,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "optimism-on-gnosis"
} as const satisfies Chain;