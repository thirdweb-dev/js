import type { Chain } from "../src/types";
export default {
  "name": "Kava",
  "chain": "KAVA",
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
  "faucets": [],
  "nativeCurrency": {
    "name": "Kava",
    "symbol": "KAVA",
    "decimals": 18
  },
  "infoURL": "https://www.kava.io",
  "shortName": "kava",
  "chainId": 2222,
  "networkId": 2222,
  "icon": {
    "url": "ipfs://QmdpRTk6oL1HRW9xC6cAc4Rnf9gs6zgdAcr4Z3HcLztusm",
    "width": 1186,
    "height": 360,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "Kava EVM Explorer",
      "url": "https://kavascan.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmdpRTk6oL1HRW9xC6cAc4Rnf9gs6zgdAcr4Z3HcLztusm",
        "width": 1186,
        "height": 360,
        "format": "svg"
      }
    }
  ],
  "testnet": false,
  "slug": "kava"
} as const satisfies Chain;