import type { Chain } from "../src/types";
export default {
  "chain": "KAVA",
  "chainId": 2222,
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
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmdpRTk6oL1HRW9xC6cAc4Rnf9gs6zgdAcr4Z3HcLztusm",
    "width": 1186,
    "height": 360,
    "format": "svg"
  },
  "infoURL": "https://www.kava.io",
  "name": "Kava",
  "nativeCurrency": {
    "name": "Kava",
    "symbol": "KAVA",
    "decimals": 18
  },
  "networkId": 2222,
  "redFlags": [],
  "rpc": [
    "https://2222.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://kava-evm-rpc.publicnode.com",
    "wss://kava-evm-rpc.publicnode.com",
    "https://evm.kava.io",
    "wss://wevm.kava.io",
    "https://kava-rpc.gateway.pokt.network",
    "https://evm.kava-rpc.com",
    "wss://wevm.kava-rpc.com",
    "https://rpc.ankr.com/kava_evm"
  ],
  "shortName": "kava",
  "slug": "kava",
  "testnet": false
} as const satisfies Chain;