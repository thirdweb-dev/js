import type { Chain } from "../src/types";
export default {
  "name": "Gnosis Chiado Testnet",
  "chain": "GNO",
  "icon": {
    "url": "ipfs://bafybeidk4swpgdyqmpz6shd5onvpaujvwiwthrhypufnwr6xh3dausz2dm",
    "width": 1800,
    "height": 1800,
    "format": "png"
  },
  "rpc": [
    "https://gnosis-chiado-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.chiadochain.net",
    "https://rpc.chiado.gnosis.gateway.fm",
    "wss://rpc.chiadochain.net/wss",
    "https://gnosis-chiado.publicnode.com",
    "wss://gnosis-chiado.publicnode.com"
  ],
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
  "chainId": 10200,
  "networkId": 10200,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://gnosis-chiado.blockscout.com",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "gnosis-chiado-testnet"
} as const satisfies Chain;