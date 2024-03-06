import type { Chain } from "../src/types";
export default {
  "chain": "GNO",
  "chainId": 10200,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://gnosis-chiado.blockscout.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://gnosisfaucet.com"
  ],
  "icon": {
    "url": "ipfs://bafybeidk4swpgdyqmpz6shd5onvpaujvwiwthrhypufnwr6xh3dausz2dm",
    "width": 1800,
    "height": 1800,
    "format": "png"
  },
  "infoURL": "https://docs.gnosischain.com",
  "name": "Gnosis Chiado Testnet",
  "nativeCurrency": {
    "name": "Chiado xDAI",
    "symbol": "XDAI",
    "decimals": 18
  },
  "networkId": 10200,
  "rpc": [
    "https://10200.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.chiadochain.net",
    "https://rpc.chiado.gnosis.gateway.fm",
    "wss://rpc.chiadochain.net/wss",
    "https://gnosis-chiado-rpc.publicnode.com",
    "wss://gnosis-chiado-rpc.publicnode.com"
  ],
  "shortName": "chi",
  "slip44": 1,
  "slug": "gnosis-chiado-testnet",
  "testnet": true
} as const satisfies Chain;