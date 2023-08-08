import type { Chain } from "../src/types";
export default {
  "name": "Scroll",
  "chain": "ETH",
  "status": "incubating",
  "rpc": [
    "https://scroll.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.scroll.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://scroll.io",
  "shortName": "scr",
  "chainId": 534352,
  "networkId": 534352,
  "explorers": [
    {
      "name": "Scroll Mainnet Block Explorer",
      "url": "https://blockscout.scroll.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://scroll.io/bridge"
      }
    ]
  },
  "testnet": false,
  "slug": "scroll"
} as const satisfies Chain;