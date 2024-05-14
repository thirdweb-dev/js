import type { Chain } from "../src/types";
export default {
  "chain": "HDX",
  "chainId": 222222,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.evm.hydration.cloud",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://hydradx.io",
  "name": "HydraDX",
  "nativeCurrency": {
    "name": "Wrapped ETH",
    "symbol": "WETH",
    "decimals": 18
  },
  "networkId": 222222,
  "rpc": [
    "https://222222.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.hydradx.cloud",
    "wss://rpc.hydradx.cloud"
  ],
  "shortName": "hdx",
  "slug": "hydradx",
  "testnet": false
} as const satisfies Chain;