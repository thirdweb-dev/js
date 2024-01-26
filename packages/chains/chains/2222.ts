import type { Chain } from "../src/types";
export default {
  "chain": "KAVA",
  "chainId": 2222,
  "explorers": [
    {
      "name": "Kava EVM Explorer",
      "url": "https://kavascan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.kava.io",
  "name": "Kava",
  "nativeCurrency": {
    "name": "Kava",
    "symbol": "KAVA",
    "decimals": 18
  },
  "networkId": 2222,
  "rpc": [
    "https://kava.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2222.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.kava.io",
    "https://kava-rpc.gateway.pokt.network",
    "wss://wevm.kava.io",
    "https://kava-evm.publicnode.com",
    "wss://kava-evm.publicnode.com"
  ],
  "shortName": "kava",
  "slug": "kava",
  "testnet": false
} as const satisfies Chain;