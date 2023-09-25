import type { Chain } from "../src/types";
export default {
  "chainId": 10200,
  "chain": "GNO",
  "name": "Gnosis Chiado Testnet",
  "rpc": [
    "https://gnosis-chiado-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.chiadochain.net",
    "https://rpc.chiado.gnosis.gateway.fm",
    "wss://rpc.chiadochain.net/wss"
  ],
  "slug": "gnosis-chiado-testnet",
  "icon": {
    "url": "ipfs://bafybeidk4swpgdyqmpz6shd5onvpaujvwiwthrhypufnwr6xh3dausz2dm",
    "width": 1800,
    "height": 1800,
    "format": "png"
  },
  "faucets": [
    "https://gnosisfaucet.com"
  ],
  "nativeCurrency": {
    "name": "Chiado xDAI",
    "symbol": "XDAI",
    "decimals": 18
  },
  "infoURL": "https://docs.gnosischain.com",
  "shortName": "chi",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://gnosis-chiado.blockscout.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;