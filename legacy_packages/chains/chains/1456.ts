import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 1456,
  "explorers": [
    {
      "name": "ZKbase Block Explorer",
      "url": "https://explorer.zkbase.app",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmRLtNvkVhC7rRDiLMHLckWbesaSU6sNYhQZgsAM1phTZx",
        "width": 400,
        "height": 400,
        "format": "jpg"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmRLtNvkVhC7rRDiLMHLckWbesaSU6sNYhQZgsAM1phTZx",
    "width": 400,
    "height": 400,
    "format": "jpg"
  },
  "infoURL": "https://zkbase.org/",
  "name": "ZKBase Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1456,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://portal.zkbase.app/"
      }
    ]
  },
  "redFlags": [
    "reusedChainId"
  ],
  "rpc": [
    "https://1456.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.zkbase.app"
  ],
  "shortName": "zkbase",
  "slip44": 1,
  "slug": "zkbase",
  "testnet": false
} as const satisfies Chain;