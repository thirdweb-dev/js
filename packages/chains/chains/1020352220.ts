import type { Chain } from "../src/types";
export default {
  "chain": "aware-fake-trim-testnet",
  "chainId": 1020352220,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://aware-fake-trim-testnet.explorer.testnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://www.sfuelstation.com/"
  ],
  "icon": {
    "url": "ipfs://bafkreiagrt5dhgltg2kmw7hf24kslstr5h42e745luuxwp2wbg24gm6zza",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "name": "SKALE Titan Hub Testnet",
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "networkId": 1020352220,
  "rpc": [
    "https://1020352220.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.skalenodes.com/v1/aware-fake-trim-testnet",
    "wss://testnet.skalenodes.com/v1/ws/aware-fake-trim-testnet"
  ],
  "shortName": "titan-testnet",
  "slip44": 1,
  "slug": "skale-titan-hub-testnet",
  "testnet": true,
  "title": "SKALE Titan Hub Testnet"
} as const satisfies Chain;