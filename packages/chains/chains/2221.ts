import type { Chain } from "../src/types";
export default {
  "name": "Kava Testnet",
  "chain": "KAVA",
  "rpc": [
    "https://kava-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.testnet.kava.io",
    "https://kava-evm-testnet.rpc.thirdweb.com",
    "wss://wevm.testnet.kava.io"
  ],
  "faucets": [
    "https://faucet.kava.io"
  ],
  "nativeCurrency": {
    "name": "TKava",
    "symbol": "TKAVA",
    "decimals": 18
  },
  "infoURL": "https://www.kava.io",
  "shortName": "tkava",
  "chainId": 2221,
  "networkId": 2221,
  "icon": {
    "url": "ipfs://QmdpRTk6oL1HRW9xC6cAc4Rnf9gs6zgdAcr4Z3HcLztusm",
    "width": 1186,
    "height": 360,
    "format": "svg"
  },
  "explorers": [
    {
      "name": "Kava Testnet Explorer",
      "url": "http://testnet.kavascan.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmdpRTk6oL1HRW9xC6cAc4Rnf9gs6zgdAcr4Z3HcLztusm",
        "width": 1186,
        "height": 360,
        "format": "svg"
      }
    }
  ],
  "testnet": true,
  "slug": "kava-testnet"
} as const satisfies Chain;