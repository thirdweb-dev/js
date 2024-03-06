import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 534353,
  "explorers": [
    {
      "name": "Scroll Alpha Testnet Block Explorer",
      "url": "https://alpha-blockscout.scroll.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://scroll.io",
  "name": "Scroll Alpha Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 534353,
  "parent": {
    "type": "L2",
    "chain": "eip155-5",
    "bridges": []
  },
  "rpc": [
    "https://534353.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://alpha-rpc.scroll.io/l2"
  ],
  "shortName": "scr-alpha",
  "slip44": 1,
  "slug": "scroll-alpha-testnet",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;