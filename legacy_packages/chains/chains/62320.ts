import type { Chain } from "../src/types";
export default {
  "chain": "CELO",
  "chainId": 62320,
  "explorers": [],
  "faucets": [
    "https://docs.google.com/forms/d/e/1FAIpQLSdfr1BwUTYepVmmvfVUDRCwALejZ-TUva2YujNpvrEmPAX2pg/viewform",
    "https://cauldron.pretoriaresearchlab.io/baklava-faucet"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmZcLzM1nMeU2oxhLFBUGJyujQ4gKuWAdXBDGHVtDmzZxf",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://docs.celo.org/",
  "name": "Celo Baklava Testnet",
  "nativeCurrency": {
    "name": "CELO",
    "symbol": "CELO",
    "decimals": 18
  },
  "networkId": 62320,
  "redFlags": [],
  "rpc": [
    "https://62320.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://baklava-forno.celo-testnet.org"
  ],
  "shortName": "BKLV",
  "slip44": 1,
  "slug": "celo-baklava-testnet",
  "testnet": true
} as const satisfies Chain;