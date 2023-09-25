import type { Chain } from "../src/types";
export default {
  "chainId": 2222,
  "chain": "KAVA",
  "name": "Kava",
  "rpc": [
    "https://kava.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.kava.io",
    "https://evm2.kava.io",
    "https://kava-rpc.gateway.pokt.network",
    "https://kava-evm.rpc.thirdweb.com",
    "wss://wevm.kava.io",
    "wss://wevm2.kava.io",
    "https://kava-evm.publicnode.com",
    "wss://kava-evm.publicnode.com"
  ],
  "slug": "kava",
  "icon": {
    "url": "ipfs://QmdpRTk6oL1HRW9xC6cAc4Rnf9gs6zgdAcr4Z3HcLztusm",
    "width": 1186,
    "height": 360,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Kava",
    "symbol": "KAVA",
    "decimals": 18
  },
  "infoURL": "https://www.kava.io",
  "shortName": "kava",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Kava EVM Explorer",
      "url": "https://kavascan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;