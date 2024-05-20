import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 810182,
  "explorers": [
    {
      "name": "zkLink Nova Block Explorer",
      "url": "https://goerli.explorer.zklink.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://zklink.io",
  "name": "zkLink Nova Goerli Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 810182,
  "parent": {
    "type": "L2",
    "chain": "eip155-59140",
    "bridges": [
      {
        "url": "https://goerli.portal.zklink.io"
      }
    ]
  },
  "rpc": [
    "https://810182.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://goerli.rpc.zklink.io",
    "wss://goerli.rpc.zklink.io"
  ],
  "shortName": "zklink-nova-goerli",
  "slip44": 1,
  "slug": "zklink-nova-goerli-testnet",
  "testnet": true
} as const satisfies Chain;