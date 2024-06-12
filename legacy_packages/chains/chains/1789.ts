import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 1789,
  "explorers": [
    {
      "name": "ZKbase Block Explorer",
      "url": "https://sepolia-explorer.zkbase.app",
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
  "name": "ZKBase Sepolia Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1789,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://portral.zkbase.app/"
      }
    ]
  },
  "redFlags": [
    "reusedChainId"
  ],
  "rpc": [
    "https://1789.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia-rpc.zkbase.app"
  ],
  "shortName": "zkbase-sepolia",
  "slip44": 1,
  "slug": "zkbase-sepolia-testnet",
  "testnet": true
} as const satisfies Chain;