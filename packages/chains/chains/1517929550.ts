import type { Chain } from "../src/types";
export default {
  "chain": "staging-aware-chief-gianfar",
  "chainId": 1517929550,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://staging-aware-chief-gianfar.explorer.staging-v3.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://sfuel.dirtroad.dev/staging"
  ],
  "icon": {
    "url": "ipfs://bafkreiagrt5dhgltg2kmw7hf24kslstr5h42e745luuxwp2wbg24gm6zza",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "name": "Deprecated SKALE Titan Hub Testnet",
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "networkId": 1517929550,
  "rpc": [
    "https://1517929550.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://staging-v3.skalenodes.com/v1/staging-aware-chief-gianfar",
    "wss://staging-v3.skalenodes.com/v1/ws/staging-aware-chief-gianfar"
  ],
  "shortName": "deprecated-titan-testnet",
  "slip44": 1,
  "slug": "deprecated-skale-titan-hub-testnet",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;